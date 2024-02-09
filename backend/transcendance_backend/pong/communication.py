from channels.layers import get_channel_layer

from queue import Queue

game_user_input = {}


def player_input_setter(id, player_idx):
    game_user_input[id] = [Queue(maxsize=1), Queue(maxsize=1)]

    def set_player_input(data):
        game_user_input[id][player_idx].put(data)

    return set_player_input


def get_user_inputs(id, player_idx):
    try:
        return game_user_input[id][player_idx].get(block=False)
    except:
        return None


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
