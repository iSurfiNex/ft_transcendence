import sys
from time import time

from .engine import PongEngine
from .entities import Ball, Pad, Player
from .ai import PongAI
from .types import DrawDebug, Vec, Pos, Line

import json

# from pong.test.draw import draw_contours, draw_arrow, draw_obstacles, draw_text

W, H = 800, 800
WHITE = (255, 255, 255)
GREY = (150, 150, 150)
CYAN = (35, 150, 150)
BALL_RADIUS = 25
PAD_W, PAD_H = 20, 140
FPS = 5
PAD_SHIFT = 50

RED = (255, 50, 50)

# Set initial speed
ball_vec = Vec(2.0, 2.0)

ball_reset_pos = Vec(0, 0)
d = Vec(6, 5).normalized
ball = Ball(
    reset_pos=ball_reset_pos, pos=ball_reset_pos, speed=100, radius=25, direction=d
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
    def __init__(self):
        self.pause = False

        player1_camp_line = Line(
            Vec(W / 2 - PAD_SHIFT, -H / 2), Vec(W / 2 - PAD_SHIFT, H / 2)
        )
        player2_camp_line = Line(
            Vec(PAD_SHIFT - W / 2, -H / 2), Vec(PAD_SHIFT - W / 2, H / 2)
        )

        topLine = Line(wall_contours[0], wall_contours[1])
        bottomLine = Line(wall_contours[2], wall_contours[3])

        lines_obstacles = [[player1_pad_line, player2_pad_line, topLine, bottomLine]]
        # ai_collision_lines = [
        #    [player1_camp_line, player2_camp_line, topLine, bottomLine]
        # ]

        padPlayer1 = Pad(
            # pos=Vec(PAD_SHIFT, H / 2 + 30),
            pos=Vec(PAD_SHIFT, 0),
            dim=Vec(PAD_W, PAD_H),
            clamp_line=player1_camp_line,
            pad_line=player1_pad_line,
            speed=100,
        )
        padPlayer2 = Pad(
            # pos=Vec(W - PAD_SHIFT, H / 2),
            pos=Vec(W - PAD_SHIFT, 0),
            dim=Vec(PAD_W, PAD_H),
            clamp_line=player2_camp_line,
            pad_line=player2_pad_line,
            speed=100,
        )
        player1 = Player(pad=padPlayer1, camp_line=player1_camp_line)
        player2 = Player(pad=padPlayer2, camp_line=player2_camp_line)
        # self.ai = PongAI(
        #    speed=ball.s,
        #    player=player2,
        #    opponent=player1,
        #    collision_lines=ai_collision_lines,
        # )

        self.engine = PongEngine(
            lines_obstacles=lines_obstacles,
            ball=ball,
            players=[player1, player2],
            dim=Vec(W, H),
            # ai=[self.ai],
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

    # keys = pygame.key.get_pressed()
    # if keys[pygame.K_a]:
    #    self.engine.players[0].go_up()
    # if keys[pygame.K_z] and self.pad1.bottom < H:
    #    self.engine.players[0].go_down()
    #    self.engine.players[1].go_up()
    # if keys[pygame.K_DOWN] and self.pad2.bottom < H:
    #    self.engine.players[1].go_down()

    # def updateLayout(self):
    #    self.ball.center = tuple(self.engine.ball.p)
    #    self.pad1.center = tuple(self.engine.players[0].pad.p)
    #    self.pad2.center = tuple(self.engine.players[1].pad.p)

    def sendData(self):
        pass

    # def handle_quit(self):
    #    for event in pygame.event.get():
    #        if event.type == pygame.QUIT or (
    #            event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE
    #        ):
    #            self.stop_game()
    #        if event.type == pygame.KEYDOWN and event.key == pygame.K_p:
    #            self.pause = not self.pause
    def serialize_line(self, line: Line):
        return {"x1": line.a.x, "y1": line.a.y, "x2": line.b.x, "y2": line.b.y}

    def getFormattedData(self):
        p1 = self.engine.players[0]
        p2 = self.engine.players[1]
        ppp1 = p1.pad.p  # player pad pos
        ppp2 = p2.pad.p  # player pad pos
        camp_p1 = self.serialize_line(p1.camp_line)
        camp_p2 = self.serialize_line(p2.camp_line)
        ball = self.engine.ball.p
        obstacles = [
            self.serialize_line(line) for line in self.engine.lines_obstacles[0]
        ]
        return {
            "paddleL": {"x": ppp1.x, "y": ppp1.y, "z": 0, "up": -1, "down": -1},
            "paddleR": {"x": ppp2.x, "y": ppp2.y, "z": 0, "up": -1, "down": -1},
            "ball": {"x": ball.x, "y": ball.x, "z": 0, "w": "r", "s": 0.1},
            "obstacles": obstacles,
            "camp_p1": camp_p1,
            "camp_p2": camp_p2,
        }

    async def run(self, asend):
        print(f"----------------- PONG: starting---------------")
        current_time = time()
        delta = 1 / FPS
        ia_last_tick_ts = current_time - 1
        game_last_tick_ts = current_time - delta
        i = 0

        while True:
            if self.pause:
                continue

            current_time = time()
            game_elapsed_time = current_time - game_last_tick_ts

            if game_elapsed_time < delta:
                continue

            game_last_tick_ts = current_time

            game_data = self.getFormattedData()
            # json_game_data = json.dumps(game_data)

            await asend(game_data)
            print(f"----------------- PONG: tick {i}---------------")
            i += 1

            self.engine.update(delta)
            # ia_elapsed_time = current_time - ia_last_tick_ts

            # if ia_elapsed_time >= 1:
            #    self.ai.update_data(self.engine)
            #    ia_last_tick_ts = current_time

            self.sendData()
