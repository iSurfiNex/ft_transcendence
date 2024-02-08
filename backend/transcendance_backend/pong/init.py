# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync
import asyncio

import threading


async def run_pong_async():
    id = 1

    print(f"----------------- GAME {id} : starting---------------")
    i = 0
    while i < 50:
        i += 1
        await asyncio.sleep(1)
        print(f"--------------- GAME {id} : game ping {i}/10 -----------------")

    print(f"--------------- GAME {id} : finishing -----------------")

    # channel_layer = get_channel_layer()

    # message = {"type": "broadcast.message", "message": "Hello, world!"}

    # Send the message to the channel group
    # async_to_sync(channel_layer.group_send)(f"game_{id}", message)


def run_pong():
    # Create an event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    # Run the async function in the event loop
    loop.run_until_complete(run_pong_async())


def run_pong_thread():
    # Create a new thread and start the async function
    thread = threading.Thread(target=run_pong)
    thread.start()
