import sys
from copy import deepcopy
from time import time

from pong.engine import Ball, Pad, Player, PongEngine
from pong.ai import PongAI
from pong.types import Vec

from pong.test.draw import draw_contours, draw_arrow, draw_obstacles

W, H = 1000, 900
WHITE = (255, 255, 255)
GREY = (150, 150, 150)
BALL_RADIUS = 20
PAD_W, PAD_H = 20, 120
FPS = 60
PAD_SHIFT = 50

RED = (255, 50, 50)



ball_reset_pos = Vec(0, 0)
d = Vec(6, 5).normalized
ball = Ball(pos=ball_reset_pos, speed=100, radius=10, direction=d)


class PongBackend:
	def __init__(self):
		self.pause = False

		padPlayer1 = Pad(
			pos=(PAD_SHIFT, 0), dim=(PAD_W, PAD_H), clamp_y=(-H/2, H/2), speed=0
		)
		padPlayer2 = Pad(
			pos=(W - PAD_SHIFT, 0), dim=(PAD_W, PAD_H), clamp_y=(-H/2, H/2), speed=0
		)
		player1 = Player(pad=padPlayer1)
		player2 = Player(pad=padPlayer2)

		self.engine = PongEngine(
			obstacles_contours=[wall_contours],
			ball=ball,
			players=[player1, player2],
			dim=(W, H),
		)

	def handle_keypress(self):
		pass


	def update(self):
		FPS=60
		delta = 1 / FPS
		self.engine.update(delta)


wall_contours = [
	(PAD_SHIFT + BALL_RADIUS  + PAD_W / 2 - W / 2, -BALL_RADIUS + H / 2),
	(- PAD_SHIFT - BALL_RADIUS - PAD_W / 2  + W / 2, -BALL_RADIUS + H / 2),
	(- PAD_SHIFT - BALL_RADIUS - PAD_W / 2 +W / 2, BALL_RADIUS - H / 2),
	(PAD_SHIFT + BALL_RADIUS + PAD_W / 2- W / 2, BALL_RADIUS - H / 2),
]