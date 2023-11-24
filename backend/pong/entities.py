from pong.types import Line, Vec


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
        self,
        pos,
        dim,
        clamp_line: Line,
        speed=100,
        direction=(0, 1),
    ):
        super().__init__(pos, speed, direction)
        self._dim = Vec(dim)
        self.clamp_line = clamp_line
        self.line = self._get_pad_line()

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
        tip_shift = self.d * half_height
        top = self.p + tip_shift
        bottom = self.p - tip_shift
        return Line(top, bottom)

    # This method should be called every time the height, direction or posiiton of the pad changes
    def update_pad_line(self):
        self.line = self._get_pad_line()

    # Update the pad center position line constraint which accounts for pad height
    def update_clamp_line_constrained(self):
        a, b = self._clamp_line
        v = Vec.fromPoints(a, b)
        shift = v.normalized * self.dim.y / 2
        new_a = a + shift
        new_b = b - shift
        self._clamp_line_constrained = Line(new_a, new_b)

    def get_next_pos(self, delta: float):
        pos = super().get_next_pos(delta)
        pos = self._clamp_line_constrained.project_clamped(pos)
        return pos

    def update_pos(self, delta):
        # print(self.p)
        self.p = self.get_next_pos(delta)


class Player:
    def __init__(self, pad: Pad, camp_line: Line):
        self.pad = pad
        self.score = 0
        self.camp_line = camp_line

    def go_down(self):
        self.pad.d = Vec(0, 1)

    def go_up(self):
        self.pad.d = Vec(0, -1)

    def stay_still(self):
        self.pad.d = Vec(0, 0)
