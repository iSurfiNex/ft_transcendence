from pong.collision import collisions_check
from pong.types import Pos, Line, Vec


class Moving:
    def __init__(self, pos: Vec, speed: float, direction: Vec):
        self.p = pos
        self.s = speed
        self.d = Vec(direction)

    def get_next_pos(self, delta: float):
        return self.p + self.get_vec(delta)

    def get_vec(self, delta: float):
        return self.s * delta * self.d


class Ball(Moving):
    def __init__(self, pos, speed, radius, direction):
        super().__init__(pos, speed, direction)
        self.r = radius

    def __str__(self):
        return f"Ball(pos={self.p}, speed={self.s}, radius={self.r}, direction={self.d.__dict__})"


class Pad(Moving):
    def __init__(
        self, pos, dim, clamp_y: tuple[float, float], speed=0, direction=(0, 1)
    ):
        super().__init__(pos, speed, direction)
        self.clamp_y = clamp_y
        self.dim = dim
        

    def get_next_pos(self, delta: float):
        pos = super().get_next_pos(delta)
        clamped_y = max(self.clamp_y[0], min(pos.y, self.clamp_y[1]))
        return (pos.x, clamped_y)

    def update_pos(self, delta):
        self.pos = self.get_next_pos(delta)


class Player:
    def __init__(self, pad):
        self.pad = pad
        self.score = 0

    def go_down(self):
        self.pad.direction = Vec(0, 1)

    def go_up(self):
        self.pad.direction = Vec(0, -1)

    def stay_still(self):
        self.pad.direction = Vec(0, 0)


class Bounce:
    def __init__(self, ts, entity, pos):
        self.ts = ts
        self.entity = entity
        self.pos = pos


def contour_to_lines(contour: list[Pos]) -> list[Line]:
    lines = []

    pt_count = len(contour)
    for i, _ in enumerate(contour):
        p1 = contour[i]
        p2 = contour[(i + 1) % pt_count]
        lines.append((p1, p2))
    return lines


# def obstacles_to_lines(contours: list[Contour]) -> list[Line]:
#    contours_as_lines = map(contour_to_lines, contours)
#    lines = list(chain(*contours_as_lines))  # Flatten to get an array of lines
#    return lines


class PongEngine:
    def __init__(self, obstacles_contours, ball, players: list[Player], dim: Vec):
        self.dim = Vec(dim)
        self.pause = False
        self.obstacles_contours = obstacles_contours
        self.lines_obstacles = [
            contour_to_lines(contour) for contour in obstacles_contours
        ]
        self.ball = ball
        self.running = True
        self.players = players
        self.bounces = []

    def update(self, delta):
        self.physic_update(delta)
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
        if self.ball.p.x <= -self.dim.x/2:
            self.players[0].score += 1
        elif self.ball.p.x >= self.dim.x/2:
            self.players[1].score += 1
        else:
            return

        # reset ball pos to the middle of the board
        self.ball.p = self.dim / 2
        # reverse the direction of the ball on the x axis
        self.ball.d *= Vec(-1, 0)
