import random
import math

from .types import Line, Vec


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
    def __init__(self, reset_pos, pos, speed, radius, direction):
        super().__init__(reset_pos, speed, direction)
        self.reset_pos = reset_pos
        self.r = radius

    def reset(self):
        self.p = self.reset_pos

    def __str__(self):
        return f"Ball(pos={self.p}, speed={self.s}, radius={self.r}, direction={self.d.__dict__})"

    @staticmethod
    def get_random_starting_direction():
        return Vec.random_normalized(-math.pi / 5, math.pi / 5)*(random.choice([1, -1]), 1)



class Pad(Moving):
    def __init__(
        self,
        pos,
        dim,
        clamp_line: Line,
        pad_line: Line,
        clamp_rot,
        speed=100,
        direction=(0, 0),
        orientation=Vec(0, 1),
        rotation=0,
        rot_speed=math.pi/4
    ):
        self.rot_speed = rot_speed
        self.clamp_rot = clamp_rot
        self.r = rotation
        self.orientation = orientation
        super().__init__(pos, speed, direction)
        self._dim = Vec(dim)
        self.clamp_line = clamp_line
        self.line = pad_line
        self.update_pad_line()

    @property
    def dim(self):
        return self._dim

    @dim.setter
    def dim(self, dim: Vec):
        self._dim = dim
        self.update_clamp_line_constrained()

    @property
    def clamp_line(self):
        return self._clamp_line

    @clamp_line.setter
    def clamp_line(self, line: Line):
        self._clamp_line = line
        self.update_clamp_line_constrained()

    def _get_pad_line(self):
        half_height = self.dim.y / 2
        tip_shift = self.orientation * half_height
        top = self.p + tip_shift
        bottom = self.p - tip_shift
        return Line(top, bottom)

    # This method should be called every time the height, direction or posiiton of the pad changes
    def update_pad_line(self):
        a, b = self._get_pad_line()
        # self.line.a.x = a.x
        # self.line.a.y = a.y
        # self.line.b.x = b.x
        # self.line.b.y = b.y
        self.line.a = a
        self.line.b = b

    # Update the pad center position line constraint which accounts for pad height
    def update_clamp_line_constrained(self):
        shift = self._clamp_line.vec.normalized * self.dim.y / 2
        new_a = self._clamp_line.a + shift
        new_b = self._clamp_line.b - shift
        self._clamp_line_constrained = Line(new_a, new_b)

    def clamp_radian_angle(self, angle):
        if angle < self.clamp_rot[0]:
            return self.clamp_rot[0]
        elif angle > self.clamp_rot[1]:
            return self.clamp_rot[1]
        else:
            return angle


    def get_next_orientation(self, delta):
        (x, y) = self.orientation
        rotation = self.r*delta
        new_x = x * math.cos(rotation) - y * math.sin(rotation)
        new_y = x * math.sin(rotation) + y * math.cos(rotation)
        angle = Vec(new_x, new_y).toRad
        angle_clamped = self.clamp_radian_angle(angle)
        return Vec.angle_to_vector(angle_clamped)


    def get_next_pos(self, delta: float):
        pos = super().get_next_pos(delta)
        pos = self._clamp_line_constrained.project_clamped(pos)
        return pos

    def update(self, delta):
        self.p = self.get_next_pos(delta)
        self.orientation = self.get_next_orientation(delta)
        self.update_pad_line()


class Player:
    def __init__(self, pad: Pad, goal_line: Line):
        self.pad = pad
        self.score = 0
        self.goal_line = goal_line
        self.score = 0
        self.has_powerup = False
        self.powerup_activated = False

    def go_down(self):
        self.pad.d = Vec(0, -1)

    def go_up(self):
        self.pad.d = Vec(0, 1)

    def stay_still(self):
        self.pad.d = Vec(0, 0)

    def rotate_left(self):
        self.pad.r = self.pad.rot_speed

    def rotate_right(self):
        self.pad.r = -self.pad.rot_speed

    def rotate_still(self):
        self.pad.r = 0
