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
        pos: Vec, vec: Vec, obstacles: list[Obstacle], ignore, pl=None, pr=None
) -> tuple[Collision or None, Vec or None]:
    for obstacle in obstacles:
        for obstacle_line in obstacle:
            if obstacle_line == ignore:
                continue
            ball_line = Line(pos, pos + vec)
            coll_pos = ball_line.intersect(obstacle_line)
            # Add extra colliders for players pad fo not missing collision
            if obstacle_line == pl:
                if not coll_pos:
                    coll_pos = ball_line.intersect(Line(obstacle_line.a + Vec(-3,0), obstacle_line.b + Vec(-3,0)))
                if not coll_pos:
                    coll_pos = ball_line.intersect(Line(obstacle_line.a + Vec(-5,0), obstacle_line.b + Vec(-5,0)))
                if not coll_pos:
                    coll_pos = ball_line.intersect(Line(obstacle_line.a + Vec(-8,0), obstacle_line.b + Vec(-8,0)))
            if obstacle_line == pr:
                if not coll_pos:
                    coll_pos = ball_line.intersect(Line(obstacle_line.a + Vec(3,0), obstacle_line.b + Vec(3,0)))
                if not coll_pos:
                    coll_pos = ball_line.intersect(Line(obstacle_line.a + Vec(5,0), obstacle_line.b + Vec(5,0)))
                if not coll_pos:
                    coll_pos = ball_line.intersect(Line(obstacle_line.a + Vec(8,0), obstacle_line.b + Vec(8,0)))
            if coll_pos:
                n = obstacle_line.normal
                r_dir = vec.reflect(n)
                if (obstacle_line == pl and r_dir.x < 0) or (obstacle_line == pr and r_dir.x > 0):
                    return None, None, None
                # TODO improve datetime
                return (
                    Collision(pos=coll_pos, obstacle=obstacle, ts=datetime.now()),
                    r_dir,
                    obstacle_line,
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
) -> tuple[list[Collision], Vec or None, Line or None]:
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
        pl=None,
        pr=None,
) -> tuple[list[Collision], Vec, Vec or None, Line or None]:
    remaining_dist: float = vec.len
    collisions: list[Collision] = []
    r_dir = None
    line = None
    while len(collisions) < max_coll:
        coll, next_dir, line = compute_collision(pos, vec, obstacles, ignore=line, pl=pl, pr=pr)

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
