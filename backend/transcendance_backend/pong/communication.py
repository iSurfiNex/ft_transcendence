from channels.layers import get_channel_layer

from queue import Queue, Empty

threadsafe_games_data = {}


def new_game_data():
    return {"players": [Queue(maxsize=1), Queue(maxsize=1)], "game": Queue(maxsize=1)}


def init_threadsafe_game_data(id):
    threadsafe_games_data[id] = new_game_data()


def player_input_setter(id, player_idx):
    def set_player_input(data):
        threadsafe_games_data[id]["players"][player_idx].put(data)

    return set_player_input


def get_user_inputs(id, player_idx):
    try:
        return threadsafe_games_data[id]["players"][player_idx].get(block=False)
    except Empty:
        return None


def set_game_stopped(id):
    try:
        threadsafe_games_data[id]["game"].put({"stop": True})
    except KeyError:
        # Game not found, happend if game state transition from running to something else but game thread was not started, when mannually updated from the DB
        return


def get_game_stopped(id):
    try:
        return threadsafe_games_data[id]["game"].get(block=False)
    except Empty:
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
