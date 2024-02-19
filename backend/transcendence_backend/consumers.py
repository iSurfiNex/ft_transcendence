import os
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from datetime import datetime
from asgiref.sync import sync_to_async
from .models import Game
from django.core.exceptions import ObjectDoesNotExist
from channels.db import database_sync_to_async

logger = logging.getLogger(__name__)
from .models import Player
from .pong.communication import player_input_setter


class ChatConsumer(AsyncWebsocketConsumer):
    user_id = None
    nickname = None
    group_name = None

    @sync_to_async
    def update_connected_state(self, new_value):
        p = self.scope["user"].player
        player = Player.objects.get(id=p.id)

        self.nickname = player.nickname

        player.is_connected = new_value
        player.save()

    async def connect(self):
        try:
            logger.debug("=================WS CONNECT START============")
            if self.scope["user"].is_authenticated:
                await self.accept()
                logger.debug("=================WS CONNECTED============")

                # Extract user name from the path or from headers (adjust as needed)
                self.user_id = self.scope["user"].id
                self.group_name = f"user_{self.user_id}"

                # Add the user to a group named after their id
                await self.channel_layer.group_add(self.group_name, self.channel_name)

                await self.channel_layer.group_add("global", self.channel_name)

                await self.update_connected_state(True)

            else:
                await self.close()
                logger.debug(
                    "=================WS CONNECTION REJECTED: NOT AUTHENTIFICATED============"
                )
                return

            self.user = self.scope["user"]
            logger.debug(self.user)
        except Exception as e:
            logger.error(f"Error: {e}")

    async def disconnect(self, close_code):
        logger.debug("=================WS DISCONNECT============")
        if self.user_id is not None:
            await self.update_connected_state(False)
            # Remove the user from the group when the WebSocket connection is closed
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

            self.user_id = None
            self.group_name = None
            self.nickname = None

    async def send_message_to_user(self, to, text):
        # Get the WebSocket channel name for the specified user
        to_user_channel = f"user_{to}"

        # Send the message to the specified user's WebSocket channel
        await self.channel_layer.group_send(
            to_user_channel,
            {
                "type": "chat.message",
                "text": text,
                "sender": self.user_id,
                "nickname": self.nickname,
                "channel": self.group_name,
                "datetime": int(
                    datetime.now().timestamp() * 1000
                ),  # NOTE *1000 to make it js timestamp compatible
            },
        )

    async def send_message_to_all_users(self, text):
        # Get the WebSocket channel name for the specified user
        to_global = f"global"

        # Send the message to all users' WebSocket channels
        await self.channel_layer.group_send(
            to_global,
            {
                "type": "chat.message",
                "text": text,
                "sender": self.user_id,
                "nickname": self.nickname,
                "channel": "global",
                "datetime": int(
                    datetime.now().timestamp() * 1000
                ),  # NOTE *1000 to make it js timestamp compatible
            },
        )

    async def chat_message(self, event):
        # Send the message back to the WebSocket client
        await self.send(
            text_data=json.dumps(
                {
                    "type": "chat.message",
                    "text": event["text"],
                    "sender": event["sender"],
                    "nickname": event["nickname"],
                    "channel": event["channel"],
                    "datetime": event["datetime"],
                }
            )
        )

    async def receive(self, text_data):
        logger.debug("=================WS RECEIVE============")
        logger.debug(text_data)

        data = json.loads(text_data)
        text = data["text"]
        to = data["to"]

        if to == "global":
            await self.send_message_to_all_users(text)
        else:
            await self.send_message_to_user(to, text)


class StateUpdateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            await self.channel_layer.group_add("state-update", self.channel_name)
            await self.accept()
        except Exception as e:
            logger.error(f"Error: {e}")

    async def disconnect(self, close_code):
        pass

    async def send_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))


class GameRunningConsumer(AsyncWebsocketConsumer):
    group_name = None
    game_id = -1
    player_idx = -1
    set_user_input = None

    @database_sync_to_async
    def get_player_idx_in_game(self, game):
        # Convert game.players to a list and find the index of my_player
        players_list = list(game.players.all())
        my_player = self.scope["user"].player
        return players_list.index(my_player) if my_player in players_list else -1

    async def connect(self):
        try:
            if not self.scope["user"].is_authenticated:
                raise Exception(f"Authentification required.")
            self.game_id = self.scope["url_route"]["kwargs"]["id"]

            try:
                game = await Game.objects.aget(id=self.game_id)
            except ObjectDoesNotExist:
                raise Exception(f"Game with id={self.game_id} not found.")

            if not game.state in [
                "waiting",
                "running",
            ]:
                raise Exception(f"The game state must be 'waiting' or 'running' to join. Current state is {game.state}")

            self.player_idx = await self.get_player_idx_in_game(game)

            if self.player_idx < 0:
                raise Exception(f"You must be part of the game to join.")

            self.group_name = f"game_{self.game_id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)

            self.set_user_input = player_input_setter(self.game_id, self.player_idx)

            await self.accept()

            logger.debug("======WS GAME: USER ACCEPTED======")

        except Exception as e:
            await self.close()
            logger.debug("======WS GAME: USER REJECTED, reason below ======")
            logger.debug(str(e))

    async def disconnect(
        self, close_code
    ):
        if self.group_name:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        logger.debug("======WS GAME: USER DISCONNECTED======")

    async def receive(self, text_data):
        message = json.loads(text_data)
        self.set_user_input(message)

    async def broadcast_message(self, event):
        if event["message"].get("disconnect") == os.environ.get("DJANGO_SECRET_KEY"):
            await self.close()
            return
        await self.send(text_data=json.dumps({"message": event["message"]}))
