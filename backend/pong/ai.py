import time
from pong.collision import collisions_check, ai_collisions_check
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
        camp = game.lines_obstacles[0][3]
        opposite_camp = game.lines_obstacles[0][1]
        self.ball_path.clear()
        self.ball_path.append(game.ball.p)
        if not self.frames_data:
            self.frames_data.append(game.ball.p)
            return

        self.frames_data.append(game.ball.p)

        # prev_ball_pos = self.frames_data[-1]
        # if not self.speed:
        #    self.speed = get_distance(prev_ball_pos, game.ball.p)
        # v = Vec.fromPoints(prev_ball_pos, game.ball.p).normalized

        v = game.ball.d * self.speed

        collisions, last_coll, line = ai_collisions_check(
            game.ball.p,
            v,
            game.lines_obstacles,
            until_coll_with=camp,
        )
        if line == camp:
            pass
        elif line == opposite_camp:
            pass
        self.ball_path += [collision.pos for collision in collisions]
        if last_coll:
            self.frames_data.append(last_coll)
        # self.ball_path.append(next_pos)
