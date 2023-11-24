from time import time
import math
from pong.collision import ai_collisions_check
from pong.types import Vec, Line
from pong.entities import Player

# def ai_periodic_function(game):
#    while game["running"]:
#        game.ai.update(game)
#        sleep(1)


class PongAI:
    frames_data = []
    ball_path = []
    keypressed = {"yoo"}

    def __init__(
        self,
        speed: float,
        player: Player,
        opponent: Player,
    ):
        self.frames_data
        self.speed = speed
        self.pad_actions = []
        self.player = player
        self.opponent = opponent
        self.goal_pos = None
        self.target_pos = None
        self.goal_pos_proj = None

    def choose_goal_pos(self) -> Vec:
        line = self.opponent.camp_line
        p = line.project(self.opponent.pad.p)
        opponent_progression_vec = p - line.a
        opponent_line_vec = line.vec

        opponent_progression_ration = (
            opponent_progression_vec.len / opponent_line_vec.len
        )
        if opponent_progression_ration > 0.5:
            goal_pos = line[0] + opponent_line_vec * 0.1
        else:
            goal_pos = line[0] + opponent_line_vec * 0.9
        return goal_pos

    def pad_shift_for_angle(
        self, angle: float, bounce_angle_on_side, pad_width
    ) -> float:
        return angle / bounce_angle_on_side * (pad_width / 2)

    def update_target(self, next_impact: Vec):
        next_impact.draw("impact")
        goal_pos = self.choose_goal_pos()
        goal_pos_proj = self.player.pad.line.project(goal_pos)
        c = goal_pos
        b = goal_pos_proj
        a = next_impact
        ab = (b - a).len
        bc = (c - b).len
        angleACB = math.tan(ab / bc)
        pad_shift = self.pad_shift_for_angle(
            angleACB,
            math.pi / 4,
            self.opponent.pad.dim.y,
        )
        target_pos = next_impact + (0, pad_shift)
        pos = self.opponent.pad.p
        vec = pos - target_pos
        dir = self.player.camp_line.vec @ vec  # TODO Line class or Segment
        duration = vec.len / self.opponent.pad.s
        self.pad_actions = [(dir, time() + duration)]
        self.goal_pos = goal_pos
        self.target_pos = target_pos
        self.goal_pos_proj = goal_pos_proj
        goal_pos.draw("goal")
        self.target_pos.draw("target")

    def update(self):
        now = time()
        if not self.pad_actions:
            return
        next_pad_action = self.pad_actions[0]  # TODO class
        dir, until = next_pad_action
        if until > now:
            del self.pad_actions[0]
            self.update()  # TODO loop instead
        if dir > 0:
            self.go_up()
        else:
            self.go_down()

    def go_up(self):
        self.keypressed.add("up")
        if "down" in self.keypressed:
            self.keypressed.remove("down")

    def go_down(self):
        self.keypressed.add("down")
        if "up" in self.keypressed:
            self.keypressed.remove("up")

    def update_data(self, game):
        self.game = game
        camp = game.lines_obstacles[0][1]
        opponent_camp = game.lines_obstacles[0][3]
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
            until_coll_with=[camp, opponent_camp],
        )
        if line == opponent_camp and collisions:
            return
        if line == camp and collisions:
            self.update_target(collisions[-1].pos)
        # if not last_coll:
        #    return
        self.ball_path += [collision.pos for collision in collisions]
        self.frames_data.append(last_coll)
        # last_coll = Vec(last_coll)  # FIXME
        # if line == camp:
        #    self.update_target(last_coll)
        # elif line == opponent_camp:
        #    pass
        # self.ball_path.append(next_pos)
