import asyncio

import threading

from .communication import get_asend
from .pong import Pong


async def run_pong_async(id):
    asend = get_asend(id)
    pong = Pong()
    await pong.run(asend, id)

def run_pong(id):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    print(f"----------------- game id:{id} thread: starting---------------")

    loop.run_until_complete(run_pong_async(id))

    print(f"----------------- game id:{id} thread: stopping---------------")


def run_pong_thread(id):
    thread = threading.Thread(target=run_pong, args=(id,))
    thread.start()
