from .collision import collisions_check
from .types import Vec
from .ai import PongAI
from .entities import Player

import math
import random


# def obstacles_to_lines(contours: list[Contour]) -> list[Line]:
#    contours_as_lines = map(contour_to_lines, contours)
#    lines = list(chain(*contours_as_lines))  # Flatten to get an array of lines
#    return lines


class PongEngine:
    max_score_reached = False
    def __init__(
        self,
        lines_obstacles,
        ball,
        players: list[Player],
        dim: Vec,
        win_score,
        use_powerups,
        ai: list[PongAI] = [],
    ):
        self.win_score = win_score
        self.dim = Vec(dim)
        self.pause = False
        self.lines_obstacles = lines_obstacles
        self.ball = ball
        self.running = True
        self.players = players
        self.bounces = []
        self.ai = ai
        self.use_powerups = use_powerups

    def update(self, delta):
        self.physic_update(delta)
        for ai in self.ai:
            ai.update()
        self.score_update()

    def physic_update(self, delta):
        for p in self.players:
            p.pad.update_pos(delta)
        ball_vec = self.ball.get_vec(delta)
        collisions, next_pos, next_dir, _ = collisions_check(
            self.ball.p, ball_vec, self.lines_obstacles
        )
        self.bounces += collisions
        self.ball.p = next_pos
        if next_dir:
            self.ball.d = next_dir

    def score_update(self):
        if self.ball.p.x <= -self.dim.x / 2:
            self.players[0].score += 1
        elif self.ball.p.x >= self.dim.x / 2:
            self.players[1].score += 1
        else:
            return

        if (
            self.players[0].score >= self.win_score
            or self.players[1].score >= self.win_score
        ):
            self.max_score_reached = True

        # reset ball pos to the middle of the board
        self.ball.reset()
        # reverse the direction of the ball on the x axis
        # self.ball.d *= Vec(-1, 0)
        # Generate a random angle between -pi/4 and pi/4 (45 degrees in either direction)
        # random_angle = random.uniform(-math.pi / 4, math.pi / 4)

        ## Rotate the direction vector by the random angle
        # self.ball.d = Vec(
        #    self.ball.d.x * math.cos(random_angle)
        #    - self.ball.y * math.sin(random_angle),
        #    self.ball.d.x * math.sin(random_angle)
        #    + self.ball.d.y * math.cos(random_angle),
        # )
