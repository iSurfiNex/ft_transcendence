import math

# def as_vec(func: callable):
#    return lambda *args, **kwargs: Vec(func(*args, **kwargs))

Pos = tuple[float, float]
Line = tuple[Pos, Pos]
Contour = list[Pos]
Obstacle = list[Line]


class Vec:
    _t: tuple

    def __init__(self, *args):
        if len(args) == 1:
            self._t = tuple(args[0])
        else:
            self._t = tuple(args)

    # def __iter__(self):
    #    return iter(self._t)

    @staticmethod
    def fromPoints(p1, p2):
        return Vec(p2[0] - p1[0], p2[1] - p1[1])

    @property
    def x(self):
        return self._t[0]

    @x.setter
    def x(self, value):
        self._t = (value, self.y)

    @property
    def y(self):
        return self._t[1]

    @y.setter
    def y(self, value):
        self = (self.x, value)

    def __getitem__(self, index):
        return self._t[index]

    def __add__(self, other):
        if isinstance(other, (int, float)):
            return Vec(x + other for x in self._t)
        return Vec(x + y for x, y in zip(self._t, other))

    def __radd__(self, other):
        if isinstance(other, (int, float)):
            return Vec(x + other for x in self._t)
        return Vec(x + y for x, y in zip(self._t, other))

    def __sub__(self, other):
        if isinstance(other, (int, float)):
            return Vec(x - other for x in self._t)
        return Vec(x - y for x, y in zip(self._t, other))

    def __rsub__(self, other):
        if isinstance(other, (int, float)):
            return Vec(x - other for x in self._t)
        return Vec(x - y for x, y in zip(self._t, other))

    def __mul__(self, other):
        if isinstance(other, (int, float)):
            return Vec(x * other for x in self._t)
        return Vec(x * y for x, y in zip(self._t, other))

    def __rmul__(self, other):
        if isinstance(other, (int, float)):
            return Vec(x * other for x in self._t)
        return Vec(x * y for x, y in zip(self._t, other))

    # Dot product
    def __matmul__(self, other):
        return sum(x * y for x, y in zip(self._t, other))

    # Dot product
    def __rmatmul__(self, other):
        return sum(x * y for x, y in zip(self._t, other))

    def __truediv__(self, other):
        if isinstance(other, (int, float)):
            return Vec(x / other for x in self._t)
        return Vec(x / y for x, y in zip(self._t, other))

    def __rtruediv__(self, other):
        if isinstance(other, (int, float)):
            return Vec(x / other for x in self._t)
        return Vec(x / y for x, y in zip(self._t, other))

    # other mus be iterable
    def __pow__(self, rhs):
        return rhs.y * self.x - rhs.x * self.y

    def __rpow__(self, lhs):
        return lhs.y * self.x - lhs.x * self.y

    @property
    def len2(self) -> float:
        return self.x**2 + self.y**2

    @property
    def len(self) -> float:
        return math.sqrt(self.len2)

    @property
    def normalized(self) -> "Vec":
        return self / self.len

    @property
    def normal(self):
        return Vec(-self.y, self.x).normalized

    # Assums the normal is normalized
    def reflect(self, normal_dir) -> "Vec":
        normalized = self.normalized
        normal_dir = Vec(normal_dir)
        dot_product = normalized @ normal_dir
        reflect_dir = normalized - 2 * dot_product * normal_dir
        return reflect_dir

    def __str__(self) -> str:
        return str(self._t)

    def __repr__(self):
        return f"Vec({self._t})"


def get_distance(p1: Vec, p2: Vec):
    return Vec(p2 - p1).len


def compute_line_normal(p1: Vec, p2: Vec):
    v = p2 - p1
    return v.normal


# Project point p on line
def projection(line: Line, p: Vec):
    a, b = line
    a = Vec(a)
    b = Vec(b)  # FIXME cleanup
    ab = b - a
    ap = p - a
    aq = ((ap @ ab) / ab.len2) * ab
    q = a + aq
    return q


def clamp_projection(line: Line, p: Vec):
    a, b = line
    a = Vec(a)
    b = Vec(b)  # FIXME cleanup
    q = projection(line, p)
    aq = Vec.fromPoints(a, q)
    bq = Vec.fromPoints(b, q)
    ab = Vec.fromPoints(a, b)  # TODO line method
    aq_len = aq.len
    bq_len = bq.len
    ab_len = ab.len
    if aq_len > ab_len or bq_len > ab_len:
        if aq_len > bq_len:
            return b
        return a
    return q
