import sys
from copy import deepcopy
from time import time

from pong.engine import Ball, Pad, Player, PongEngine
from pong.ai import PongAI
from pong.types import Vec

from pong.test.draw import draw_contours, draw_arrow, draw_obstacles

W, H = 800, 800
WHITE = (255, 255, 255)
GREY = (150, 150, 150)
BALL_RADIUS = 25
PAD_W, PAD_H = 20, 1400
FPS = 60
PAD_SHIFT = 50

RED = (255, 50, 50)

# Set initial speed
ball_vec = Vec(2.0, 2.0)

ball_reset_pos = Vec(W / 2 - BALL_RADIUS, H / 2 - BALL_RADIUS)
d = Vec(6, 5).normalized
ball = Ball(pos=ball_reset_pos, speed=100, radius=25, direction=d)


wall_contours = [
	(PAD_SHIFT + BALL_RADIUS + 100 + PAD_W / 2, BALL_RADIUS),
	(W - PAD_SHIFT - BALL_RADIUS - PAD_W / 2 - 20, BALL_RADIUS),
	(W - PAD_SHIFT - BALL_RADIUS - PAD_W / 2, H - 70 - BALL_RADIUS),
	(PAD_SHIFT + BALL_RADIUS + PAD_W / 2, H - BALL_RADIUS),
]

class PongBackend:
	def __init__(self):
		self.pause = False

		padPlayer1 = Pad(
			pos=(PAD_SHIFT, H / 2), dim=(PAD_W, PAD_H), clamp_y=(0, H), speed=0
		)
		padPlayer2 = Pad(
			pos=(W - PAD_SHIFT, H / 2), dim=(PAD_W, PAD_H), clamp_y=(0, H), speed=0
		)
		player1 = Player(pad=padPlayer1)
		player2 = Player(pad=padPlayer2)

		self.engine = PongEngine(
			obstacles_contours=[wall_contours],
			ball=ball,
			players=[player1, player2],
			dim=(W, H),
		)

	def stop_game(self):
		self.running = False
		sys.exit()

	def handle_keypress(self):
		pass


	def run(self):
		FPS=60
		delta = 1 / FPS
		last_call_time = time() - 1
		while True:
			current_time = time()
			elapsed_time = current_time - last_call_time
			if elapsed_time >= delta:
				last_call_time = current_time
			else:
				continue
			print(self.engine.ball.p)
			self.handle_keypress()
			if self.pause:
				continue
			self.engine.update(delta)
