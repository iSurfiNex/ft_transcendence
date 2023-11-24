import pygame
import sys
from copy import deepcopy
from time import time

from pong.engine import PongEngine
from pong.entities import Ball, Pad, Player
from pong.ai import PongAI
from pong.types import DrawDebug, Vec, Pos, Line

from pong.test.draw import draw_contours, draw_arrow, draw_obstacles, draw_text

W, H = 800, 800
WHITE = (255, 255, 255)
GREY = (150, 150, 150)
CYAN = (35, 150, 150)
BALL_RADIUS = 25
PAD_W, PAD_H = 20, 140
FPS = 60
PAD_SHIFT = 50

RED = (255, 50, 50)

# Set initial speed
ball_vec = Vec(2.0, 2.0)

ball_reset_pos = Vec(W / 2 - BALL_RADIUS, H / 2 - BALL_RADIUS)
d = Vec(6, 5).normalized
ball = Ball(pos=ball_reset_pos, speed=100, radius=25, direction=d)


# wall_contours = [
#    (PAD_SHIFT + BALL_RADIUS + 100 + PAD_W / 2, BALL_RADIUS),
#    (W - PAD_SHIFT - BALL_RADIUS - PAD_W / 2 - 20, BALL_RADIUS),
#    (W - PAD_SHIFT - BALL_RADIUS - PAD_W / 2, H - 70 - BALL_RADIUS),
#    (PAD_SHIFT + BALL_RADIUS + PAD_W / 2, H - BALL_RADIUS),
# ]
wall_contours = [
    (PAD_SHIFT / 2 + BALL_RADIUS + PAD_W / 2, BALL_RADIUS),
    (W - PAD_SHIFT / 2 - BALL_RADIUS - PAD_W / 2, BALL_RADIUS),
    (W - PAD_SHIFT / 2 - BALL_RADIUS - PAD_W / 2, H - BALL_RADIUS),
    (PAD_SHIFT / 2 + BALL_RADIUS + PAD_W / 2, H - BALL_RADIUS),
]


# pad_left_path = "pad_left.png"
# pad_right_path = "pad_right.png"
# ball_path = "ball.png"
# pad_left_image = pygame.image.load(pad_left_path)
# pad_right_image = pygame.image.load(pad_right_path)
# ball_image = pygame.image.load(ball_path)


def contour_to_lines(contour: list[Pos]) -> list[Line]:
    lines = []

    pt_count = len(contour)
    for i, _ in enumerate(contour):
        p1 = contour[i]
        p2 = contour[(i + 1) % pt_count]
        lines.append((p1, p2))
    return lines


# thread = threading.Thread(target=ai_periodic_function, args=(game,))
# thread.start()
class PyPong:
    def __init__(self):
        self.pause = False
        self.pad1 = pygame.Rect(PAD_SHIFT, H / 2 - PAD_H / 2, PAD_W, PAD_H)
        self.pad2 = pygame.Rect(
            W - PAD_SHIFT - PAD_W / 2,
            H / 2 - PAD_H / 2,
            PAD_W,
            PAD_H,
        )
        self.ball = pygame.Rect(
            0,
            0,
            BALL_RADIUS,
            BALL_RADIUS,
        )

        player1PadLine = Line(Vec(PAD_SHIFT, 0), Vec(PAD_SHIFT, H))
        player2PadLine = Line(Vec(W - PAD_SHIFT, 0), Vec(W - PAD_SHIFT, H))
        lines_obstacles = [contour_to_lines(contour) for contour in [wall_contours]]
        padPlayer1 = Pad(
            pos=(PAD_SHIFT, H / 2 + 30),
            dim=(PAD_W, PAD_H),
            clamp_line=player1PadLine,
            speed=100,
        )
        padPlayer2 = Pad(
            pos=(W - PAD_SHIFT, H / 2),
            dim=(PAD_W, PAD_H),
            clamp_line=player2PadLine,
            speed=100,  # FIXME decide on speed / Base speed
        )
        player1 = Player(pad=padPlayer1, camp_line=player1PadLine)
        player2 = Player(pad=padPlayer2, camp_line=player2PadLine)
        self.ai = PongAI(speed=ball.s, player=player2, opponent=player1)

        self.engine = PongEngine(
            lines_obstacles=lines_obstacles,
            ball=ball,
            players=[player1, player2],
            dim=(W, H),
            ai=[self.ai],
        )

        # Initialize Pygame
        pygame.init()

        # Create the screen
        self.screen = pygame.display.set_mode((W, H))
        pygame.display.set_caption("Pong")

        # Game loop
        self.clock = pygame.time.Clock()

    def stop_game(self):
        self.running = False
        pygame.quit()
        sys.exit()

    def handle_keypress(self):
        if "up" in self.ai.keypressed:
            self.ai.player.go_up()
        elif "down" in self.ai.keypressed:
            self.ai.player.go_down()

        keys = pygame.key.get_pressed()
        if keys[pygame.K_a]:
            self.engine.players[0].go_up()
        if keys[pygame.K_z] and self.pad1.bottom < H:
            self.engine.players[0].go_down()
        if keys[pygame.K_UP] and self.pad2.top > 0:
            self.engine.players[1].go_up()
        if keys[pygame.K_DOWN] and self.pad2.bottom < H:
            self.engine.players[1].go_down()

    def updateLayout(self):
        self.ball.center = tuple(self.engine.ball.p)
        self.pad1.center = tuple(self.engine.players[0].pad.p)
        self.pad2.center = tuple(self.engine.players[1].pad.p)

    def draw_ai_debug(self):
        path = self.ai.ball_path
        for it in self.ai.ball_path:
            pygame.draw.circle(
                self.screen, RED, tuple(it), 5
            )  # Change 20 to adjust the radius
        # path = deepcopy(ball_path)
        # path.insert(0, ball.center)
        for i in range(len(path) - 1):
            draw_arrow(tuple(path[i]), tuple(path[i + 1]), self.screen)

        for class_name, instance_list in DrawDebug.saved.items():
            if class_name == "Line":
                for label, (instance, color) in instance_list.items():
                    pygame.draw.line(
                        self.screen, color, tuple(instance.a), tuple(instance.b), 2
                    )
            if class_name == "Vec":
                for label, (instance, color) in instance_list.items():
                    pygame.draw.circle(self.screen, color, tuple(instance), 4)
                    draw_text(label, instance, self.screen, color)

    def draw(self):
        self.screen.fill(WHITE)
        # self.screen.blit(pad_left_image, self.player1.topleft)
        # self.screen.blit(pad_right_image, self.player2.topleft)
        pygame.draw.rect(self.screen, GREY, self.pad1)
        pygame.draw.rect(self.screen, GREY, self.pad2)

        # self.screen.blit(ball_image, ball.topleft)
        pygame.draw.circle(self.screen, GREY, self.ball.center, BALL_RADIUS)
        # pygame.draw.circle(self.screen, RED, ball.center, 5)
        draw_obstacles(self.engine.lines_obstacles, self.screen)
        self.draw_ai_debug()

        # Update the display
        pygame.display.flip()

    def handle_quit(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT or (
                event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE
            ):
                self.stop_game()
            if event.type == pygame.KEYDOWN and event.key == pygame.K_p:
                self.pause = not self.pause

    def run(self):
        delta = 1 / FPS
        last_call_time = time() - 1
        while True:
            # self.ai.update(self.engine)
            self.handle_quit()
            self.handle_keypress()
            if self.pause:
                continue
            self.engine.update(delta)
            current_time = time()
            elapsed_time = current_time - last_call_time
            if elapsed_time >= 1:
                self.ai.update_data(self.engine)
                last_call_time = current_time
            self.updateLayout()
            self.draw()

            # Cap the frame rate
            self.clock.tick(FPS)
