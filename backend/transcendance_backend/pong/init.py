import asyncio

import threading

from .communication import get_asend
from .pong import Pong


async def run_pong_async(game):
    id = game["id"]
    win_score = game["goal_objective"]
    use_powerups = game["type"] == "powerup"
    use_ai = game["ia"]
    start_at = game["started_at"] / 1000
    asend = get_asend(id)
    pong = Pong(win_score, use_powerups, use_ai, start_at)
    await pong.run(asend, id)

def run_pong(game):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    print(f"----------------- game id:{id} thread: starting---------------")

    loop.run_until_complete(run_pong_async(game))

    print(f"----------------- game id:{id} thread: stopping---------------")


def run_pong_thread(game):

    thread = threading.Thread(target=run_pong, args=(game,))
    thread.start()
