from pygame import color
from pong.types import (
    Obstacle,
    Vec,
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
    until_coll_with,
    max_coll=100,
) -> tuple[list[Collision], Vec, Vec | None, Vec | None]:
    remaining_dist: float = vec.len
    collisions: list[Collision] = []
    r_dir = None
    line = None
    while len(collisions) < max_coll:
        coll, next_dir, line = compute_collision(pos, vec, obstacles, ignore=line)

        if not coll or not next_dir:
            # or (coll.pos.x == pos.x and coll.pos.y == pos.y):
            break

        seg_dist = get_distance(pos, coll.pos)
        pos = coll.pos
        remaining_dist -= seg_dist
        vec = next_dir * remaining_dist
        collisions.append(coll)
        r_dir = next_dir
        # if line == until_coll_with:
        #    break

    pos += vec
    next_pos = pos
    next_r_dir = r_dir
    last_coll = None
    if collisions:
        last_coll = collisions[-1].pos

    remaining_dist = 10000
    if r_dir == None:
        r_dir = vec.normalized
    vec = r_dir * remaining_dist

    while len(collisions) < max_coll:
        coll, next_dir, line = compute_collision(pos, vec, obstacles, ignore=line)

        if not coll or not next_dir:
            # or (coll.pos.x == pos.x and coll.pos.y == pos.y):
            break

        seg_dist = get_distance(pos, coll.pos)
        pos = coll.pos
        remaining_dist -= seg_dist
        vec = next_dir * remaining_dist
        collisions.append(coll)
        r_dir = next_dir
        if line == until_coll_with:
            break
    return collisions, next_pos, next_r_dir, last_coll


def collisions_check(
    pos: Vec, vec: Vec, obstacles: list[Obstacle], max_coll=100
) -> tuple[list[Collision], Vec, Vec | None]:
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

    pos += vec
    return collisions, pos, r_dir
