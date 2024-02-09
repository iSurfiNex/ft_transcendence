# from asgiref.sync import async_to_sync
import asyncio

import threading

from .communication import get_asend
from .pong import Pong


async def run_pong_async(id):
    asend = get_asend(id)
    pong = Pong()
    await pong.run(asend)


# async def test_broadcast_async(id):
#    message = {"type": "broadcast.message", "message": "Hello World! from game thread"}
#    asend = get_asend(id)
#    print(f"----------------- GAME {id} : starting---------------")
#    i = 0
#    while i < 50:
#        i += 1
#        print(f"--------------- GAME {id} : game ping {i}/50 -----------------")
#        await asend(message)
#        await asyncio.sleep(5)
#
#    print(f"--------------- GAME {id} : finishing -----------------")


def run_pong(id):
    # Create an event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    # Run the async function in the event loop
    loop.run_until_complete(run_pong_async(id))
    # loop.run_until_complete(test_broadcast_async(id))


def run_pong_thread(id):
    thread = threading.Thread(target=run_pong, args=(id,))
    thread.start()
