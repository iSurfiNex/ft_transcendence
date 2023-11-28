from pong.collision import collisions_check
from pong.types import Vec
from pong.ai import PongAI
from pong.entities import Player


# def obstacles_to_lines(contours: list[Contour]) -> list[Line]:
#    contours_as_lines = map(contour_to_lines, contours)
#    lines = list(chain(*contours_as_lines))  # Flatten to get an array of lines
#    return lines


class PongEngine:
    def __init__(
        self, lines_obstacles, ball, players: list[Player], dim: Vec, ai: list[PongAI]
    ):
        self.dim = Vec(dim)
        self.pause = False
        self.lines_obstacles = lines_obstacles
        self.ball = ball
        self.running = True
        self.players = players
        self.bounces = []
        self.ai = ai
        for bot in ai:
            bot.engine = self

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
        if self.ball.p.x <= 0:
            self.players[0].score += 1
        elif self.ball.p.x >= self.dim.x:
            self.players[1].score += 1
        else:
            return

        # reset ball pos to the middle of the board
        self.ball.p = self.dim / 2
        # reverse the direction of the ball on the x axis
        self.ball.d *= Vec(-1, 0)
