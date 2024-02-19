from time import time
import math
from .collision import ai_collisions_check, update_collisions_ts
from .types import Vec, Line
from .entities import Player
from .collision import Collision


class PongAI:
    frames_data = []
    ball_path = []
    keypressed = {'yoo'}

    def serialize(self):
        return {
            "ball_path": [{"x": b.x, "y": b.y} for b in self.ball_path],
        }

    def __init__(self, speed: float, player: Player, opponent: Player, collision_lines):
        self.frames_data
        self.speed = speed
        self.pad_go_actions = []
        self.pad_rot_actions = []
        self.player = player
        self.opponent = opponent
        self.goal_pos = None
        self.target_pos = None
        self.goal_pos_proj = None
        self.collision_lines = collision_lines

    def choose_goal_pos(self) -> Vec:
        line = self.opponent.goal_line
        p = line.project(self.opponent.pad.p)
        opponent_progression_vec = p - line.a
        opponent_line_vec = line.vec

        opponent_progression_ration = (
            opponent_progression_vec.len / opponent_line_vec.len
        )
        if opponent_progression_ration > 0.5:
            goal_pos = line[0] + opponent_line_vec * 0.2
        else:
            goal_pos = line[0] + opponent_line_vec * 0.8
        return goal_pos

    #def pad_shift_for_angle(
    #    self, angle: float, bounce_angle_on_side, pad_width
    #) -> float:
    #    return angle / bounce_angle_on_side * (pad_width / 2)

    def add_pad_goto(self, target_pos: Vec, dir=None, until=None):
        if self.pad_go_actions:
            prev_dir, prev_time, prev_pos = self.pad_go_actions[-1]
        else:
            prev_time = time()
            prev_pos = self.player.pad.p
        vec = prev_pos - target_pos
        if dir == None:
            dir = self.player.goal_line.vec @ vec

        if until == None:
            duration = vec.len / self.player.pad.s
            until = prev_time + duration

        self.pad_go_actions.append((dir, until, target_pos))

    def shortest_angle_rotation(self, angle_a:float, angle_b:float)->float:
        # Calculate the difference between the angles
        angle_difference = angle_b - angle_a

        # Ensure the result is within the range of -pi to pi
        angle_difference = (angle_difference + math.pi) % (2 * math.pi) - math.pi

        return angle_difference

    def add_pad_rotateto(self, target_o: float, dir=None, until=None):
        if self.pad_rot_actions:
            prev_o, prev_time, prev_o = self.pad_rot_actions[-1]
        else:
            prev_time = time()
            prev_o = self.player.pad.orientation.toRad

        #prev_time = time()
        rot = self.shortest_angle_rotation(prev_o, target_o)

        rot_absolute = rot if rot > 0 else -rot

        if until == None:
            duration = rot_absolute / self.player.pad.rot_speed
            until = prev_time + duration

        self.pad_rot_actions.append((rot, until, target_o))

    def update_target(self, next_impact: Collision, prev_ball_coll_pos):
        next_impact_pos = next_impact.pos
        goal_pos = self.choose_goal_pos()
        goal_pos_proj = self.player.pad.line.project(goal_pos)
        c = goal_pos
        b = goal_pos_proj
        a = next_impact_pos
        ab = (b - a).len
        bc = (c - b).len
        angleACB = math.tan(ab / bc)

        next_orientation =  Vec.from_points(Line(goal_pos_proj, prev_ball_coll_pos).center, next_impact_pos).toRad + math.pi/2

        next_orientation = self.player.pad.clamp_radian_angle(next_orientation)
        #pad_shift = self.pad_shift_for_angle(
        #    angleACB,
        #    math.pi / 4,
        #    self.opponent.pad.dim.y,
        #)
        target_pos = next_impact_pos# + (0, pad_shift)
        self.pad_go_actions = []
        self.pad_rot_actions = []
        #self.add_pad_goto(target_pos, dir=0, until=next_impact.ts)
        #self.add_pad_goto(self.player.goal_line.center)
        self.add_pad_goto(next_impact_pos)
        self.add_pad_rotateto(next_orientation)
        self.player.goal_line.center
        self.goal_pos = goal_pos
        self.target_pos = target_pos
        self.goal_pos_proj = goal_pos_proj
        #print("TARGET", target_pos)

    def update(self):
        self.update_go()
        self.update_rot()

    def update_rot(self):
        now = time()
        if not self.pad_rot_actions:
            self.rotate_still()
            return
        next_pad_action = self.pad_rot_actions[0]
        dir, until, _ = next_pad_action
        if now >= until:
            self.pad_rot_actions.pop(0)
            self.update_rot()
        if dir == 0:
            self.rotate_still()
        elif dir > 0:
            self.rotate_right()
        else:
            self.rotate_left()

    def update_go(self):
        now = time()
        if not self.pad_go_actions:
            self.stay_still()
            return
        next_pad_action = self.pad_go_actions[0]
        dir, until, _ = next_pad_action
        if now >= until:
            self.pad_go_actions.pop(0)
            self.update_go()
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

    def rotate_still(self):
        if "left" in self.keypressed:
            self.keypressed.remove("left")
        if "right" in self.keypressed:
            self.keypressed.remove("right")

    def rotate_right(self):
        self.keypressed.add("right")
        if "left" in self.keypressed:
            self.keypressed.remove("left")

    def rotate_left(self):
        self.keypressed.add("left")
        if "right" in self.keypressed:
            self.keypressed.remove("right")

    def update_data(self, game):
        self.game = game
        camp = self.player.pad.clamp_line
        opponent_camp = self.opponent.pad.clamp_line
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
            self.add_pad_goto(self.player.pad.clamp_line.center)
            self.add_pad_rotateto(math.pi/2)
            self.keypressed.add("space")
            #self.update_target(Collision(Vec(0,0), [self.player.pad.line], time()), game.ball.p)
        if line == camp and collisions:
            if "space" in self.keypressed:
                self.keypressed.remove("space")
            self.update_target(collisions[-1],  game.ball.p)
        #else :
        #    self.update_target(Vec(0,0), 0)
        self.ball_path += [collision.pos for collision in collisions]
        self.frames_data.append(last_coll)
