import sys
from time import time
import asyncio
import json

from .engine import PongEngine
from .entities import Ball, Pad, Player
from .ai import PongAI
from .types import DrawDebug, Vec, Pos, Line

from .communication import get_game_stopped, get_user_inputs

# from pong.test.draw import draw_contours, draw_arrow, draw_obstacles, draw_text

W, H = 1000, 900
BALL_RADIUS = 25
PAD_W, PAD_H = 20, 150
FPS = 20
PAD_SHIFT = 50

BALL_SPEED=150
PADDLE_SPEED=250

ball_reset_pos = Vec(0, 0)
d = Vec(6, 5).normalized
ball = Ball(
    reset_pos=ball_reset_pos, pos=ball_reset_pos, speed=BALL_SPEED, radius=25, direction=d
)


wall_contours = [
    Vec(PAD_SHIFT + BALL_RADIUS + PAD_W / 2 - W / 2, -BALL_RADIUS + H / 2),
    Vec(-PAD_SHIFT - BALL_RADIUS - PAD_W / 2 + W / 2, -BALL_RADIUS + H / 2),
    Vec(-PAD_SHIFT - BALL_RADIUS - PAD_W / 2 + W / 2, BALL_RADIUS - H / 2),
    Vec(PAD_SHIFT + BALL_RADIUS + PAD_W / 2 - W / 2, BALL_RADIUS - H / 2),
]

player1_pad_line = Line()
player2_pad_line = Line()


class Pong:
    def __init__(self, win_score, use_powerups, use_ai):
        self.pause = False

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

        topLine = Line(wall_contours[0], wall_contours[1])
        bottomLine = Line(wall_contours[2], wall_contours[3])

        # ai_collision_lines = [
        #    [player1_goal_line, player2_goal_line, topLine, bottomLine]
        # ]

        padPlayer1 = Pad(
            # pos=Vec(PAD_SHIFT, H / 2 + 30),
            pos=Vec(PAD_SHIFT, 0),
            dim=Vec(PAD_W, PAD_H),
            clamp_line=player1_clamp_line,
            pad_line=player1_pad_line,
            speed=PADDLE_SPEED,
        )
        padPlayer2 = Pad(
            # pos=Vec(W - PAD_SHIFT, H / 2),
            pos=Vec(W - PAD_SHIFT, 0),
            dim=Vec(PAD_W, PAD_H),
            clamp_line=player2_clamp_line,
            pad_line=player2_pad_line,
            speed=PADDLE_SPEED,
        )

        player1 = Player(pad=padPlayer1, goal_line=player1_goal_line)
        player2 = Player(pad=padPlayer2, goal_line=player2_goal_line)
        lines_obstacles = [[player1.pad.line, player2.pad.line, topLine, bottomLine]]
        self.ai = []
        #if use_ai:
        #    self.ai.append(PongAI(
        #        speed=ball.s,
        #        player=player2,
        #        opponent=player1,
        #        collision_lines=lines_obstacles
        #    ))

        self.engine = PongEngine(
            lines_obstacles=lines_obstacles,
            ball=ball,
            players=[player1, player2],
            dim=Vec(W, H),
            win_score=win_score,
            use_powerups=use_powerups,
            ai=self.ai,
        )

    def stop_game(self):
        self.running = False
        sys.exit()

    # def handle_keypress(self):
    # if "up" in self.ai.keypressed:
    #    self.ai.player.go_up()
    # elif "down" in self.ai.keypressed:
    #    self.ai.player.go_down()
    # else:
    #    self.ai.player.stay_still()

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
                "score": p1.score
            },
            "pR": {
                "paddle": {"x": ppp2.x, "y": ppp2.y, "h": p2.pad.dim.y},
                "goal": goal_p2,
                "clamp": clamp_p2,
                "score": p2.score
            },
            "ball": {"x": ball.x, "y": ball.x},
            "obstacles": obstacles,
            "bonus": {"y": 0},
        }

    def handle_player_inputs(self, id, idx):
        inputs = get_user_inputs(id, idx)
        player = self.engine.players[idx]
        if inputs is not None:
            print(f"P{idx+1} INPUT: {inputs}")
            if inputs["up"] == inputs["down"]:
                player.stay_still()
            elif inputs["up"]:
                player.go_up()
            elif inputs["down"]:
                player.go_down()

    async def run(self, asend, id):
        current_time = time()
        delta = 1 / FPS
        # ia_last_tick_ts = current_time - 1
        game_last_tick_ts = current_time - delta

        while True:
            if self.pause:
                continue

            current_time = time()
            game_elapsed_time = current_time - game_last_tick_ts

            if game_elapsed_time < delta:
                continue

            game_last_tick_ts = current_time

            if get_game_stopped(id):
                break

            self.handle_player_inputs(id, 0)
            self.handle_player_inputs(id, 1)  # TODO handle not for IA

            game_data = self.serialize()
            # json_game_data = json.dumps(game_data)

            await asend(game_data)

            self.engine.update(delta)
            # ia_elapsed_time = current_time - ia_last_tick_ts

            # if ia_elapsed_time >= 1:
            #    self.ai.update_data(self.engine)
            #    ia_last_tick_ts = current_time

            self.sendData()
