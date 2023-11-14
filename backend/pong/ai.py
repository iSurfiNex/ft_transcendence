import time
from pong.collision import collisions_check
from pong.types import Vec, get_distance


def ai_periodic_function(game):
    while game["running"]:
        game.ai.update(game)
        time.sleep(1)


class PongAI:
    frames_data = []
    ball_path = []

    def __init__(self, on_up: callable, on_down: callable, speed: float):
        self.up = on_up
        self.down = on_down
        self.frames_data
        self.speed = speed

    def update_data(self, game):
        self.ball_path.clear()
        self.ball_path.append(game.ball.p)
        if not self.frames_data:
            self.frames_data.append(game.ball.p)
            return

        prev_ball_pos = self.frames_data[-1]
        self.frames_data.append(game.ball.p)

        # if not self.speed:
        #    self.speed = get_distance(prev_ball_pos, game.ball.p)

        remaining_dist = self.speed

        v = Vec.fromPoints(prev_ball_pos, game.ball.p).normalized
        v = v * remaining_dist
        # self.intersections.append(tuple(game.ball.p))

        collisions, next_pos, _ = collisions_check(game.ball.p, v, game.lines_obstacles)
        self.ball_path += [collision.pos for collision in collisions]
        if collisions:
            self.frames_data.append(collisions[-1].pos)
        self.ball_path.append(next_pos)
