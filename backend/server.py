# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    server.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tlarraze <tlarraze@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/11/10 14:19:36 by tlarraze          #+#    #+#              #
#    Updated: 2023/11/22 17:38:12 by tlarraze         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#http://10.11.6.6:8000/game.html

import asyncio
import websockets
import json
from threading import Thread
from queue import Queue
import time
import socket
from pong.pong_backend import PongBackend

game_phy = PongBackend()

def move_paddle_ball(jfile):

	if jfile["paddleL"]["up"] == 1:
		jfile["paddleL"]["y"] += 5
	if jfile["paddleL"]["down"] == 1:
		jfile["paddleL"]["y"] -= 5
	if jfile["paddleR"]["up"] == 1:
		jfile["paddleR"]["y"] += 5
	if jfile["paddleR"]["down"] == 1:
		jfile["paddleR"]["y"] -= 5
	return jfile


def update_jfile(jfile, jfile2):
	if 'key' in jfile2 and (jfile2['key'] == 'w'):
			jfile["paddleL"]["up"] = jfile['paddleL']["up"] * -1
	if 'key' in jfile2 and (jfile2['key'] == 's'):
			jfile["paddleL"]["down"] = jfile['paddleL']["down"] * -1
	if 'key' in jfile2 and (jfile2['key'] == 'ArrowUp'):
			jfile["paddleR"]["up"] = jfile["paddleR"]["up"] * -1
	if 'key' in jfile2 and (jfile2['key'] == 'ArrowDown'):
			jfile["paddleR"]["down"] = jfile["paddleR"]["down"] * -1
	return jfile

# Global variable to store the JSON data
jfile = {
	"paddleL": {"x": 10, "y": 0, "z": 0, "up": -1, "down": -1, "sizeX": game_phy.engine.players[0].pad.dim[0], "sizeY": game_phy.engine.players[0].pad.dim[1]},
	"paddleR": {"x": -10, "y": 0, "z": 0, "up": -1, "down": -1, "sizeX": game_phy.engine.players[0].pad.dim[0], "sizeY": game_phy.engine.players[0].pad.dim[1]},
	"ball": {"x": 0, "y": 0, "z": 0, "w": "r", "s": 0.1}
}

users = set()

async def send_pos_to_all(websocket, jfile):
	
	while True:
		# Send the jfile data to all connected clients
		jfile["ball"]["y"] = game_phy.engine.ball.p.y
		jfile["ball"]["x"] = game_phy.engine.ball.p.x
		#game_phy.update() waiting to be fixed
		jfile = move_paddle_ball(jfile)
		for client in users:
			await websocket.send(json.dumps(jfile))
		await asyncio.sleep(1/60)

async def listener(websocket, path):
	# Declare jfile as a global variable
	global jfile

	# Add the current client to the set
	users.add(websocket)
	print(f"Number of connected clients: {len(users)}")

	task = asyncio.ensure_future(send_pos_to_all(websocket, jfile))

	try:
		async for message in websocket:
			jfile2 = json.loads(message)
			jfile = update_jfile(jfile, jfile2)
			if jfile2["key"] == 't':
				break
	finally:
	# Remove the client from the set when they disconnect
		users.remove(websocket)
		task.cancel()
		print(f"Number of connected clients: {len(users)}")

if __name__ == "__main__":
	print(socket.gethostbyname(socket.gethostname()))
	start_server = websockets.serve(listener, socket.gethostbyname(socket.gethostname()), 8080)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()
