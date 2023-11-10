# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    server.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tlarraze <tlarraze@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/11/10 14:19:36 by tlarraze          #+#    #+#              #
#    Updated: 2023/11/10 15:02:55 by tlarraze         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import asyncio
import websockets
import json

async def listener(websocket, path):
	async for message in websocket:
	# When a message is received, echo it back to the client
			jfile = json.loads(message)
			print("got \"" + jfile['msg'] + "\" from " + jfile['user'])
			await websocket.send(message)

if __name__ == "__main__":
	start_server = websockets.serve(listener, "localhost", 8000)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()
