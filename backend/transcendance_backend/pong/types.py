import math
import random

Pos = tuple[float, float]
Contour = list[Pos]


class Vec():
    _t: tuple

    def __init__(self, *args):
        if len(args) == 1:
            self._t = tuple(args[0])
        else:
            self._t = tuple(args)

    @staticmethod
    def fromPoints(p1: "Vec", p2: "Vec") -> "Vec":
        return Vec(p2[0] - p1[0], p2[1] - p1[1])

    @property
    def x(self) -> float:
        return self._t[0]

    @x.setter
    def x(self, value: float) -> None:
        self._t = (value, self.y)

    @property
    def y(self) -> float:
        return self._t[1]

    @y.setter
    def y(self, value: float) -> None:
        self = (self.x, value)

    def __getitem__(self, index: int) -> float:
        return self._t[index]

    def __iter__(self):
        return iter(self._t)

    def __add__(self, other: "float | Vec | tuple") -> "Vec":
        if isinstance(other, (int, float)):
            return Vec(x + other for x in self._t)
        return Vec(x + y for x, y in zip(self._t, other))

    def __radd__(self, other: "float | Vec | tuple") -> "Vec":
        if isinstance(other, (int, float)):
            return Vec(x + other for x in self._t)
        return Vec(x + y for x, y in zip(self._t, other))

    def __sub__(self, other: "float | Vec | tuple") -> "Vec":
        if isinstance(other, (int, float)):
            return Vec(x - other for x in self._t)
        return Vec(x - y for x, y in zip(self._t, other))

    def __rsub__(self, other: "float | Vec | tuple") -> "Vec":
        if isinstance(other, (int, float)):
            return Vec(x - other for x in self._t)
        return Vec(x - y for x, y in zip(self._t, other))

    def __mul__(self, other: "float | Vec | tuple") -> "Vec":
        if isinstance(other, (int, float)):
            return Vec(x * other for x in self._t)
        return Vec(x * y for x, y in zip(self._t, other))

    def __rmul__(self, other: "float | Vec | tuple") -> "Vec":
        if isinstance(other, (int, float)):
            return Vec(x * other for x in self._t)
        return Vec(x * y for x, y in zip(self._t, other))

    # Dot product
    def __matmul__(self, other: "Vec" or tuple) -> float:
        return sum(x * y for x, y in zip(self._t, other))

    # Dot product
    def __rmatmul__(self, other: "Vec" or tuple) -> float:
        return sum(x * y for x, y in zip(self._t, other))

    def __truediv__(self, other: "float | Vec | tuple") -> "Vec":
        if isinstance(other, (int, float)):
            return Vec(x / other for x in self._t)
        return Vec(x / y for x, y in zip(self._t, other))

    def __rtruediv__(self, other: "float | Vec | tuple") -> "Vec":
        if isinstance(other, (int, float)):
            return Vec(x / other for x in self._t)
        return Vec(x / y for x, y in zip(self._t, other))

    # other mus be iterable
    def __pow__(self, rhs: "Vec" or tuple) -> float:
        return rhs[1] * self.x - rhs[0] * self.y

    def __rpow__(self, lhs: "Vec" or tuple) -> float:
        return lhs[1] * self.x - lhs[0] * self.y

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
    def normal(self) -> "Vec":
        return Vec(-self.y, self.x).normalized

    @property
    def toRad(self) -> float:
        normed = self.normalized
        angle_radians = math.atan2(normed.y, normed.x)
        return angle_radians

    # Assums the normal is normalized
    def reflect(self, normal_dir: "Vec") -> "Vec":
        normalized = self.normalized
        normal_dir = Vec(normal_dir)
        dot_product = normalized @ normal_dir
        reflect_dir = normalized - 2 * dot_product * normal_dir
        return reflect_dir

    def y_clamped(self, a, b):
        return Vec(self.x, max(a, min(self.y, b)))

    def __str__(self) -> str:
        return str(self._t)

    def __repr__(self) -> str:
        return f"Vec({self._t})"

    @classmethod
    def random_normalized(self, rad_bound_a:float, rad_bound_b:float)->"Vec":
        random_angle = random.uniform(-math.pi / 4, math.pi / 4)
        return Vec.angle_to_vector(random_angle)


    @classmethod
    def angle_to_vector(self, angle_rad:float) -> "Vec":
        # Calculate x and y components of the vector
        x = math.cos(angle_rad)
        y = math.sin(angle_rad)

        return Vec(x,y).normalized


class Line():
    a: Vec
    b: Vec = Vec(0, 0)

    def __repr__(self) -> str:
        return f"Line({self.a}, {self.b})"

    def __init__(self, a: Vec or tuple = Vec(0, 0), b: Vec or tuple = Vec(0, 0)):
        self.a = a if isinstance(a, Vec) else Vec(a)
        self.b = b if isinstance(b, Vec) else Vec(b)

    def __getitem__(self, index: int) -> Vec:
        if index == 0:
            return self.a
        if index == 1:
            return self.b
        raise IndexError("Index out of array bounds.")

    @property
    def vec(self) -> Vec:
        return self.b - self.a

    @property
    def len(self):
        return self.vec.len

    # Project point p on line
    def project(self, p: Vec):
        vec = self.vec
        ap = p - self.a
        aq = ((ap @ vec) / vec.len2) * vec
        q = self.a + aq
        return q

    def project_clamped(self, p: Vec):
        q = self.project(p)
        aq_len = Vec.fromPoints(self.a, q).len
        bq_len = Vec.fromPoints(self.b, q).len
        ab_len = self.len
        if aq_len > ab_len or bq_len > ab_len:
            if aq_len > bq_len:
                return self.b
            return self.a
        return q

    @property
    def normal(self) -> Vec:
        return self.vec.normal

    def intersect(self, line: "Line"):
        v1 = self.vec
        v2 = line.vec
        v3 = self.a - line.a
        det = v1**v2
        if det == 0:
            return None
        uA = v2**v3 / det
        uB = v1**v3 / det
        if uA >= 0 and uA <= 1 and uB >= 0 and uB <= 1:
            return self.a + uA * v1
        return None

    @property
    def center(self) -> Vec:
        return (self.a + self.b) / 2


Obstacle = list[Line]
