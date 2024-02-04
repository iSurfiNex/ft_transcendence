from .types import (
    Obstacle,
    Vec,
    Line,
)
from datetime import datetime
from time import time


class Collision:
    def __init__(self, pos: Vec, obstacle: Obstacle, ts: datetime):
        self.pos = pos
        self.obstacle = obstacle
        self.ts = ts


def compute_collision(
    pos: Vec, vec: Vec, obstacles: list[Obstacle], ignore
) -> tuple[Collision | None, Vec | None]:
    for obstacle in obstacles:
        for line in obstacle:
            p1, p2 = line
            if line == ignore:
                continue
            l1 = Line(pos, pos + vec)
            l2 = Line(p1, p2)
            coll_pos = l1.intersect(l2)
            if coll_pos:
                n = l2.normal
                r_dir = vec.reflect(n)
                # TODO improve datetime
                return (
                    Collision(pos=coll_pos, obstacle=obstacle, ts=datetime.now()),
                    r_dir,
                    line,
                )
    return None, None, None


def update_collisions_ts(prev_pos, prev_ts, collisions, speed):
    for c in collisions:
        c.ts = prev_ts + Vec(c.pos - prev_pos).len * speed
        prev_ts = c.ts
        prev_pos = c.pos


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
        seg_dist = Line(pos, coll.pos).len
        pos = coll.pos
        remaining_dist -= seg_dist
        vec = next_dir * remaining_dist
        collisions.append(coll)
        r_dir = next_dir
        if until_coll_with and line in until_coll_with:
            break

    pos += vec
    return collisions, pos, r_dir, line
