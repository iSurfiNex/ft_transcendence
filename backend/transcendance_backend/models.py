from django.db import models


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    pub_date = models.DateTimeField(auto_now_add=True)


class Game(models.Model):
    NUM_PLAYERS_CHOICES = [
        (2, "2 Players"),
        (4, "4 Players"),
        (6, "6 Players"),
        (8, "8 Players"),
    ]
    DIFFICULTY_CHOICES = [("simple", "Simple"), ("evil", "Evil")]

    num_players = models.PositiveSmallIntegerField(choices=NUM_PLAYERS_CHOICES)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)

    def __str__(self):
        return f"Game ({self.num_players} Players, {self.difficulty})"


class Player(models.Model):
    blocked_players = models.ManyToManyField(
        "self", blank=True, symmetrical=False, related_name="blocked_by"
    )
    games_played = models.PositiveIntegerField(default=0)
    games_list = models.ManyToManyField(Game, related_name="players")

    def __str__(self):
        return f"Player (ID: {self.id})"
