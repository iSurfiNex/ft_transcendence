from channels.generic.websocket import WebsocketConsumer
import logging
import json

logger = logging.getLogger(__name__)

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.user = self.scope["user"]

        print(
            "=================WS CONNECT============",
            "USER: ",
        )
        self.accept()

    def disconnect(self, close_code):
        print("=================WS DISCONNECT============")
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        # if not message.to or not message.content:
        #    print("==> Chat websocket: Malformed message received")

        print("=================WS RECEIVE============", message)
        # self.send(text_data=json.dumps({"message": message}))


class StateUpdateConsumer(WebsocketConsumer):
    async def connect(self):
        try:
            await self.accept()
            logger.debug("=================WS CONNECT============")
            print("==================================")
        except Exception as e:
            logger.error(f"Error: {e}")

    def disconnect(self, close_code):
	    logger.debug("=================WS DISCONNECT============")
    
    def receive(self, json_data):
        data = json.loads(json_data)
        logger.debug("=================WS RECEIVE============\n", data)
