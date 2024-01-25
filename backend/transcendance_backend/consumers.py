from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            logger.debug("=================WS CONNECT START============")
            if self.scope["user"].is_authenticated:
                await self.accept()
                logger.debug("=================WS CONNECTED============")

                # Extract user name from the path or from headers (adjust as needed)
                self.user_name = self.scope["user"].username

                # Add the user to a group named after their username
                await self.channel_layer.group_add(
                    f"user_{self.user_name}", self.channel_name
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
        if self.user_name is not None:
            # Remove the user from the group when the WebSocket connection is closed
            await self.channel_layer.group_discard(self.user_name, self.channel_name)

    async def send_message_to_user(self, to, text):
        # Get the WebSocket channel name for the specified user
        to_user_channel = f"user_{to}"

        # Send the message to the specified user's WebSocket channel
        await self.channel_layer.group_send(
            to_user_channel,
            {
                "type": "chat.message",
                "text": text,
                "sender": self.user_name,
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

        await self.send_message_to_user(to, text)


class StateUpdateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            logger.debug("=================WS CONNECT START============")
            await self.accept()
            logger.debug("=================WS CONNECTED============")
            self.user = self.scope["user"]
            logger.debug(self.user)
        except Exception as e:
            logger.error(f"Error: {e}")

    async def disconnect(self, close_code):
        logger.debug("=================WS DISCONNECT============")

    async def receive(self, text_data):
        logger.debug("=================WS RECEIVE============")
        logger.debug(text_data)
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        str_resp = json.dumps({"message": message})
        # TODO change this, I just send back the received msg
        await self.send(text_data=str_resp)
