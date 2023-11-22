from pygame import color
from pong.types import (
    Obstacle,
    Vec,
    Line,
    compute_line_normal,
    get_distance,
)
from datetime import datetime


class Collision:
    def __init__(self, pos: Vec, obstacle: Obstacle, ts: datetime):
        self.pos = pos
        self.obstacle = obstacle
        self.ts = ts


def lineLine(
    p1: Vec,
    p2: Vec,
    p3: Vec,
    p4: Vec,
):
    v1 = p2 - p1
    v2 = p4 - p3
    v3 = p1 - p3
    det = v1**v2
    if det == 0:
        return None
    uA = v2**v3 / det
    uB = v1**v3 / det
    if uA >= 0 and uA <= 1 and uB >= 0 and uB <= 1:
        return p1 + uA * v1
    return None


def compute_collision(
    pos: Vec, vec: Vec, obstacles: list[Obstacle], ignore
) -> tuple[Collision | None, Vec | None]:
    for obstacle in obstacles:
        for line in obstacle:
            p1, p2 = line
            if line == ignore:
                continue
            p1v = Vec(p1)
            p2v = Vec(p2)
            coll_pos = lineLine(pos, pos + vec, p1v, p2v)
            if coll_pos:
                n = compute_line_normal(p1v, p2v)
                r_dir = vec.reflect(n)
                # TODO improve datetime
                return (
                    Collision(pos=coll_pos, obstacle=obstacle, ts=datetime.now()),
                    Vec(r_dir),
                    line,
                )
    return None, None, None


def ai_collisions_check(
    pos: Vec,
    vec: Vec,
    obstacles: list[Obstacle],
    until_coll_with: list[Line],
) -> tuple[list[Collision], Vec | None, Line | None]:
    collisions, pos, r_dir, line = collisions_check(
        pos, vec, obstacles, until_coll_with=until_coll_with
    )
    next_pos = collisions[-1].pos if collisions else None
    if line in until_coll_with:
        return collisions, next_pos, line
    if r_dir == None:
        r_dir = vec.normalized
    vec = r_dir * 10000

    next_collisions, _, _, line2 = collisions_check(
        pos, vec, obstacles, until_coll_with=until_coll_with
    )
    collisions += next_collisions

    # TODO simplify/cleanup
    if line2:
        line = line2

    return collisions, next_pos, line


def collisions_check(
    pos: Vec,
    vec: Vec,
    obstacles: list[Obstacle],
    max_coll=100,
    until_coll_with: list[Line] = [],
) -> tuple[list[Collision], Vec, Vec | None, Line | None]:
    remaining_dist: float = vec.len
    collisions: list[Collision] = []
    r_dir = None
    line = None
    while len(collisions) < max_coll:
        coll, next_dir, line = compute_collision(pos, vec, obstacles, ignore=line)

        if not coll or not next_dir:
            break
        seg_dist = get_distance(pos, coll.pos)
        pos = coll.pos
        remaining_dist -= seg_dist
        vec = next_dir * remaining_dist
        collisions.append(coll)
        r_dir = next_dir
        if until_coll_with and line in until_coll_with:
            break

    pos += vec
    return collisions, pos, r_dir, line


# def collisions_check_generator(
#    pos: Vec, vec: Vec, obstacles: list[Obstacle], max_coll=100, until_coll_with=None
# ) -> tuple[list[Collision], Vec, Vec | None]:
#    remaining_dist: float = vec.len
#    collisions: list[Collision] = []
#    r_dir = None
#    line = None
#    while len(collisions) < max_coll:
#        coll, next_dir, line = compute_collision(pos, vec, obstacles, ignore=line)
#
#        if not coll or not next_dir:
#            break
#        seg_dist = get_distance(pos, coll.pos)
#        pos = coll.pos
#        remaining_dist -= seg_dist
#        vec = next_dir * remaining_dist
#        collisions.append(coll)
#        r_dir = next_dir
#        yield (coll, pos, r_dir)
#        if until_coll_with and line == until_coll_with:
#            break
#
#    pos += vec
#    return collisions, pos, r_dir
