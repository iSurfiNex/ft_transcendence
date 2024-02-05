from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from datetime import datetime
from asgiref.sync import sync_to_async
from .utils import stateUpdate

logger = logging.getLogger(__name__)
from .models import Player


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

        logger.debug(f"CONNECTION STATE {self.scope['user'].player.is_connected}")

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

                await sync_to_async(stateUpdate)(
                    self.scope["user"].player, "update", "user"
                )

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
            await sync_to_async(stateUpdate)(
                self.scope["user"].player, "update", "user"
            )

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
        # TODO protect key error if the keys does not exist
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
        # await self.channel_layer.group_discard("state-update", self.channel_name)
        pass

    # async def receive(self, text_data):
    #    text_data_json = json.loads(text_data)
    #    message = text_data_json["message"]
    #    str_resp = json.dumps({"message": message})
    #    # TODO change this, I just send back the received msg
    #    #await self.send(text_data=str_resp)

    async def send_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))


class GameRunningConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope["url_route"]["kwargs"]["id"]
        self.game_group_name = f"game_{self.id}"

        await self.channel_layer.group_add(self.game_group_name, self.channel_name)
        await self.accept()

    async def disconnect(
        self, close_code
    ):  # PAS OUBLIER DE DECONNECTER LES JOUEURS DU WS A LA FIN DE LA GAME
        await self.channel_layer.group_discard(self.game_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.send_game_update(data)

    async def send_game_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))
