from time import time
import math
from pong.collision import ai_collisions_check, update_collisions_ts
from pong.types import Vec, Line
from pong.entities import Player
from pong.collision import Collision


class PongAI:
    frames_data = []
    ball_path = []
    keypressed = {"yoo"}

    def __init__(self, speed: float, player: Player, opponent: Player, collision_lines):
        self.frames_data
        self.speed = speed
        self.pad_actions = []
        self.player = player
        self.opponent = opponent
        self.goal_pos = None
        self.target_pos = None
        self.goal_pos_proj = None
        self.collision_lines = collision_lines

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

    def add_pad_goto(self, target_pos: Vec, dir=None, until=None):
        if self.pad_actions:
            prev_dir, prev_time, prev_pos = self.pad_actions[-1]
        else:
            prev_time = time()
            prev_pos = self.player.pad.p
        vec = prev_pos - target_pos
        if dir == None:
            dir = self.player.camp_line.vec @ vec

        if until == None:
            duration = vec.len / self.player.pad.s
            until = prev_time + duration

        self.pad_actions.append((dir, until, target_pos))

    def update_target(self, next_impact: Collision):
        next_impact_pos = next_impact.pos
        next_impact_pos.draw("impact")
        goal_pos = self.choose_goal_pos()
        goal_pos_proj = self.player.pad.line.project(goal_pos)
        c = goal_pos
        b = goal_pos_proj
        a = next_impact_pos
        ab = (b - a).len
        bc = (c - b).len
        angleACB = math.tan(ab / bc)
        pad_shift = self.pad_shift_for_angle(
            angleACB,
            math.pi / 4,
            self.opponent.pad.dim.y,
        )
        target_pos = next_impact_pos + (0, pad_shift)
        self.pad_actions = []
        self.add_pad_goto(next_impact_pos)
        self.add_pad_goto(target_pos, dir=0, until=next_impact.ts)
        self.add_pad_goto(self.player.camp_line.center)
        self.player.camp_line.center
        self.goal_pos = goal_pos
        self.target_pos = target_pos
        self.goal_pos_proj = goal_pos_proj
        goal_pos.draw("goal")
        self.target_pos.draw("target")

    def update(self):
        now = time()
        if not self.pad_actions:
            self.stay_still()
            return
        next_pad_action = self.pad_actions[0]
        dir, until, target_pos = next_pad_action
        if now > until:
            del self.pad_actions[0]
            self.update()
        if dir == 0:
            self.stay_still()
        elif dir > 0:
            self.go_up()
        else:
            self.go_down()

    def stay_still(self):
        if "down" in self.keypressed:
            self.keypressed.remove("down")
        if "up" in self.keypressed:
            self.keypressed.remove("up")

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
        camp = self.player.camp_line
        opponent_camp = self.opponent.camp_line
        self.ball_path.clear()
        self.ball_path.append(game.ball.p)
        if not self.frames_data:
            self.frames_data.append(game.ball.p)
            return

        self.frames_data.append(game.ball.p)

        v = game.ball.d * self.speed

        collisions, last_coll, line = ai_collisions_check(
            game.ball.p,
            v,
            self.collision_lines,
            until_coll_with=[camp, opponent_camp],
        )

        update_collisions_ts(game.ball.p, time(), collisions, game.ball.s)
        if line == opponent_camp and collisions:
            return
        if line == camp and collisions:
            self.update_target(collisions[-1])
        self.ball_path += [collision.pos for collision in collisions]
        self.frames_data.append(last_coll)
