from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def createGameThread(id):
    print(">>>>>>>>>>>>>>>>>>>>>>NEW GAME THREAD", id)

    channel_layer = get_channel_layer()

    message = {"type": "broadcast.message", "message": "Hello, world!"}

    # Send the message to the channel group
    async_to_sync(channel_layer.group_send)(f"game_{id}", message)
