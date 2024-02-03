# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    server.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tlarraze <tlarraze@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/11/10 14:19:36 by tlarraze          #+#    #+#              #
#    Updated: 2023/11/16 16:02:48 by tlarraze         ###   ########.fr        #
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

def move_paddle_ball(jfile):
	tolerance = 0.001  # Adjust the tolerance based on your precision requirements

	if jfile["ball"]["w"] == "r":
		jfile["ball"]["x"] += 0.1
	elif jfile["ball"]["w"] == "l":
		jfile["ball"]["x"] -= 0.1

	# Check conditions after updating the ball's position
	if abs(float(jfile["ball"]["x"]) - float(jfile['paddleL']['x'])) < tolerance:
		jfile["ball"]["w"] = "l"

	if abs(float(jfile["ball"]["x"]) - float(jfile["paddleR"]['x'])) < tolerance:
		jfile["ball"]["w"] = "r"

	if jfile["paddleL"]["up"] == 1:
		jfile["paddleL"]["y"] += 0.1
	if jfile["paddleL"]["down"] == 1:
		jfile["paddleL"]["y"] -= 0.1
	if jfile["paddleR"]["up"] == 1:
		jfile["paddleR"]["y"] += 0.1
	if jfile["paddleR"]["down"] == 1:
		jfile["paddleR"]["y"] -= 0.1
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
	"paddleL": {"x": 10, "y": 0, "z": 0, "up": -1, "down": -1},
	"paddleR": {"x": -10, "y": 0, "z": 0, "up": -1, "down": -1},
	"ball": {"x": 0, "y": 0, "z": 0, "w": "r", "s": 0.1}
}

users = set()

async def send_pos_to_all(websocket, jfile):
	
	while True:
		# Send the jfile data to all connected clients
		
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
			print("got \"" + jfile2['key'] + "\" from " + jfile2['user'])
			print("pos x =", jfile["paddleR"]['x'])
			print("pos y =", jfile["paddleR"]['y'])
			print("pos z =", jfile["paddleR"]['z'])
	finally:
	# Remove the client from the set when they disconnect
		users.remove(websocket)
		task.cancel()
		print(f"Number of connected clients: {len(users)}")

if __name__ == "__main__":
	game_phy = Pongbackend()

	start_server = websockets.serve(listener, socket.gethostbyname(socket.gethostname()), 8080)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()
