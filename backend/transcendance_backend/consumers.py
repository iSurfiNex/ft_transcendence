from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            logger.debug("=================WS CONNECT START============")
            await self.accept()
            logger.debug("=================WS CONNECTED============")

            self.user = self.scope["user"]
            print("CHAT WS USER: ", self.user)
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


class StateUpdateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            logger.debug("=================WS CONNECT START============")
            await self.accept()
            logger.debug("=================WS CONNECTED============")
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
