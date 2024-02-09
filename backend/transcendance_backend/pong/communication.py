from channels.layers import get_channel_layer


def get_asend(id):
    channel_layer = get_channel_layer()
    group_name = f"game_{id}"

    async def async_send(msg):
        formatted_msg = {
            "type": "broadcast.message",
            "message": msg,
        }
        await channel_layer.group_send(group_name, formatted_msg)

    return async_send
