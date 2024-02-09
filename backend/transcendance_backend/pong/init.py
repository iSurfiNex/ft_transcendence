from channels.layers import get_channel_layer

# from asgiref.sync import async_to_sync
import asyncio

import threading


async def run_pong_async(id):
    channel_layer = get_channel_layer()
    message = {"type": "broadcast.message", "message": "Hello World! from game thread"}
    print(f"----------------- GAME {id} : starting---------------")
    i = 0
    while i < 50:
        i += 1
        print(f"--------------- GAME {id} : game ping {i}/50 -----------------")
        await channel_layer.group_send(f"game_{id}", message)
        await asyncio.sleep(5)

    print(f"--------------- GAME {id} : finishing -----------------")


def run_pong(id):
    # Create an event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    # Run the async function in the event loop
    loop.run_until_complete(run_pong_async(id))


def run_pong_thread(id):
    # Create a new thread and start the async function
    thread = threading.Thread(target=run_pong, args=(id,))
    thread.start()
