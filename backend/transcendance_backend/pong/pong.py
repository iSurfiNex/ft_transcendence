from time import time, sleep
import random

from .engine import PongEngine
from .entities import Ball, Pad, Player
from .ai import PongAI
from .types import DrawDebug, Vec, Pos, Line

from .communication import get_game_stopped, get_user_inputs
from transcendance_backend.manager import set_game_done

W, H = 1000, 900
BALL_RADIUS = 25
PAD_W, PAD_H = 20, 150
FPS = 20
PAD_SHIFT = 50

BALL_SPEED = 150
PADDLE_SPEED = 250

ball_reset_pos = Vec(0, 0)

ball = Ball(
    reset_pos=ball_reset_pos,
    pos=ball_reset_pos,
    speed=BALL_SPEED,
    radius=25,
    direction=Ball.get_random_starting_direction(),
)


def add_line_bumbs(line_list: list[Line], amplitude: float, iter: int = 1):
    def divide_line(line):
        bump_y = random.uniform(0, line.len * 0.3) * amplitude
        bump_x = random.uniform(0, line.len * 0.3)
        center = line.center
        center += (bump_x, bump_y)
        center = center.y_clamped(-H / 2, H / 2)
        return [Line(line.a, center), Line(center, line.b)]

    nested_list = map(divide_line, line_list)
    flattened_list = [item for sublist in nested_list for item in sublist]
    if iter > 0:
        return add_line_bumbs(flattened_list, amplitude * -1, iter - 1)
    return flattened_list

player1_pad_line = Line()
player2_pad_line = Line()


class Pong:
    def __init__(self, win_score, use_powerups, use_ai, start_at):
        self.use_ai = use_ai
        self.pause = False
        self.start_at = start_at

        top_lines = [Line(
            Vec(BALL_RADIUS - W / 2, -BALL_RADIUS + H / 2),
            Vec(-BALL_RADIUS + W / 2, -BALL_RADIUS + H / 2),
        )]

        bottom_lines = [Line(
            Vec(-BALL_RADIUS + W / 2, BALL_RADIUS - H / 2),
            Vec(BALL_RADIUS - W / 2, BALL_RADIUS - H / 2),
        )]

        if use_powerups:
            top_lines = add_line_bumbs(top_lines, -1, 2)
            bottom_lines = add_line_bumbs(bottom_lines, 1, 2)

        wall_lines = top_lines + bottom_lines

        player1_goal_line = Line(
            Vec(PAD_SHIFT - W / 2, -H / 2), Vec(PAD_SHIFT - W / 2, H / 2)
        )
        player2_goal_line = Line(
            Vec(W / 2 - PAD_SHIFT, -H / 2), Vec(W / 2 - PAD_SHIFT, H / 2)
        )

        player1_clamp_line = Line(
            Vec(PAD_SHIFT + 100 - W / 2, -H / 2), Vec(PAD_SHIFT + 100 - W / 2, H / 2)
        )
        player2_clamp_line = Line(
            Vec(W / 2 - 100 - PAD_SHIFT, -H / 2), Vec(W / 2 - PAD_SHIFT - 100, H / 2)
        )

        ai_collision_lines = [[player1_goal_line, player2_goal_line] + wall_lines]

        padPlayer1 = Pad(
            # pos=Vec(PAD_SHIFT, H / 2 + 30),
            pos=Vec(PAD_SHIFT, 0),
            dim=Vec(PAD_W, PAD_H),
            clamp_line=player1_clamp_line,
            pad_line=player1_pad_line,
            speed=PADDLE_SPEED,
        )
        padPlayer2 = Pad(
            pos=Vec(W - PAD_SHIFT, 0),
            dim=Vec(PAD_W, PAD_H),
            clamp_line=player2_clamp_line,
            pad_line=player2_pad_line,
            speed=PADDLE_SPEED,
        )

        player1 = Player(pad=padPlayer1, goal_line=player1_goal_line)
        player2 = Player(pad=padPlayer2, goal_line=player2_goal_line)
        lines_obstacles = [[player1.pad.line, player2.pad.line] + wall_lines]
        self.ai_list = []
        if use_ai:
            self.ai_list.append(
                PongAI(
                    speed=ball.s,
                    player=player2,
                    opponent=player1,
                    collision_lines=ai_collision_lines,
                )
            )

        self.engine = PongEngine(
            lines_obstacles=lines_obstacles,
            ball=ball,
            players=[player1, player2],
            dim=Vec(W, H),
            win_score=win_score,
            use_powerups=use_powerups,
            ai=self.ai_list,
        )

    def sendData(self):
        pass

    def serialize_line(self, line: Line):
        return {"x1": line.a.x, "y1": line.a.y, "x2": line.b.x, "y2": line.b.y}

    def serialize(self):
        p1 = self.engine.players[0]
        p2 = self.engine.players[1]
        ppp1 = p1.pad.p  # player pad pos
        ppp2 = p2.pad.p  # player pad pos
        goal_p1 = self.serialize_line(p1.goal_line)
        goal_p2 = self.serialize_line(p2.goal_line)
        clamp_p1 = self.serialize_line(p1.pad.clamp_line)
        clamp_p2 = self.serialize_line(p2.pad.clamp_line)
        ball = self.engine.ball.p
        obstacles = [
            self.serialize_line(line) for line in self.engine.lines_obstacles[0]
        ]

        return {
            "pL": {
                "paddle": {"x": ppp1.x, "y": ppp1.y, "h": p1.pad.dim.y},
                "goal": goal_p1,
                "clamp": clamp_p1,
                "score": p1.score,
            },
            "pR": {
                "paddle": {"x": ppp2.x, "y": ppp2.y, "h": p2.pad.dim.y},
                "goal": goal_p2,
                "clamp": clamp_p2,
                "score": p2.score,
            },
            "ball": {"x": ball.x, "y": ball.y},
            "obstacles": obstacles,
            "bonus": {"y": 0},
            "gameOver": self.engine.game_over,
            "ai": [ai.serialize() for ai in self.ai_list],
        }

    def handle_player_inputs(self, id, idx):
        inputs = get_user_inputs(id, idx)
        player = self.engine.players[idx]
        if inputs is not None:
            if inputs["up"] == inputs["down"]:
                player.stay_still()
            elif inputs["up"]:
                player.go_up()
            elif inputs["down"]:
                player.go_down()

    def handle_ai_inputs(self, ai):
        if "down" in ai.keypressed:
            ai.player.go_up()
        elif "up" in ai.keypressed:
            ai.player.go_down()
        else:
            ai.player.stay_still()

    async def run(self, asend, id):
        current_time = time()
        delta = 1 / FPS
        ia_last_tick_ts = current_time - 1
        game_last_tick_ts = current_time - delta
        start_in = self.start_at - current_time

        if start_in > 0:
            sleep(start_in)

        while True:
            if self.pause:
                continue

            current_time = time()
            game_elapsed_time = current_time - game_last_tick_ts

            if game_elapsed_time < delta:
                continue

            game_last_tick_ts = current_time

            self.handle_player_inputs(id, 0)
            if not self.use_ai:
                self.handle_player_inputs(id, 1)  # TODO handle not for IA
            [self.handle_ai_inputs(ai) for ai in self.ai_list]

            self.engine.update(delta)

            game_data = self.serialize()
            await asend(game_data)

            ia_elapsed_time = current_time - ia_last_tick_ts

            if ia_elapsed_time >= 1:
                [ai.update_data(self.engine) for ai in self.ai_list]
                ia_last_tick_ts = current_time

            if get_game_stopped(id):
                self.engine.game_over = True
            if self.engine.game_over:
                break

        game_data = self.serialize()
        await asend(game_data)
        await set_game_done(id)
        print(
            f"Game stop, final score P1:{self.engine.players[0].score} P2:{self.engine.players[1].score}"
        )
