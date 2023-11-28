import pygame
import math
from pong.types import Obstacle, Vec

RED = (255, 50, 50)
ARROW_COLOR = (0, 150, 40)


def draw_contours(path, screen):
    i = 0
    for i in range(len(path) - 1):
        pygame.draw.line(screen, RED, path[i], path[i - 1], 1)
    pygame.draw.line(screen, RED, path[3], path[2], 1)


def draw_text(text, pos: Vec, screen, color=(0, 0, 0)):
    FONT = pygame.font.Font(None, 18)
    # Calculate the width and height of the text
    text_surface = FONT.render(text, True, color)
    text_width, text_height = text_surface.get_size()
    half_width = text_width // 2
    half_height = text_height // 2

    h, w = screen.get_size()
    desired_pos = (pos.x - half_width - 4, pos.y - half_height - 15)
    new_x = max(half_width, min(desired_pos[0], w - half_width))
    new_y = max(half_height, min(desired_pos[1], h - half_height))

    # Print the centered text
    screen.blit(text_surface, (int(new_x), int(new_y)))


def draw_arrow(p1, p2, screen):
    pygame.draw.line(screen, ARROW_COLOR, p1, p2, 5)
    # Calculate angle and length of the arrow
    angle = math.atan2(p2[1] - p1[1], p2[0] - p1[0])

    # Calculate the coordinates of the arrowhead
    arrowhead_length = 15
    arrowhead_angle = math.radians(30)  # Adjust the arrowhead angle as needed
    arrowhead_x1 = p2[0] - arrowhead_length * math.cos(angle + arrowhead_angle)
    arrowhead_y1 = p2[1] - arrowhead_length * math.sin(angle + arrowhead_angle)
    arrowhead_x2 = p2[0] - arrowhead_length * math.cos(angle - arrowhead_angle)
    arrowhead_y2 = p2[1] - arrowhead_length * math.sin(angle - arrowhead_angle)
    pygame.draw.polygon(
        screen,
        ARROW_COLOR,
        [
            (p2[0], p2[1]),
            (arrowhead_x1, arrowhead_y1),
            (arrowhead_x2, arrowhead_y2),
        ],
    )


def draw_obstacles(obstacles: list[Obstacle], screen):
    for obstacle in obstacles:
        for line in obstacle:
            pygame.draw.line(screen, ARROW_COLOR, tuple(line[0]), tuple(line[1]), 1)
