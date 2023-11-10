from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from .validators import even_value_validator


class Player(models.Model):
    name = models.CharField(max_length=32, unique=True)
    blocked_users = models.ManyToManyField("self", symmetrical=False)
    games = models.ManyToManyField("Game", blank=True)
    tournaments = models.ManyToManyField("Tournament", blank=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "blocked_users": [
                user.serialize_summary() for user in self.blocked_users.all()
            ],
        }

    def serialize_summary(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class GameStat(models.Model):
    goal_nb = models.PositiveIntegerField(default=0)
    touch_nb = models.PositiveIntegerField(default=0)
    miss_nb = models.PositiveIntegerField(default=0)
    game = models.ForeignKey("Game", on_delete=models.CASCADE)
    game = models.ForeignKey("Game", on_delete=models.CASCADE)
    player = models.ForeignKey("Player", on_delete=models.CASCADE)


class Game(models.Model):
    GAME_STATES = (
        ("waiting", "Waiting"),
        ("running", "Running"),
        ("done", "Done"),
    )
    state = models.CharField(max_length=10, choices=GAME_STATES, default="waiting")
    required_player_number = models.PositiveIntegerField(default=2)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    players = models.ManyToManyField(
        "Player", through="GameStat", related_name="games_played"
    )
    winner = models.ForeignKey(
        "Player",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="games_won",
    )
    goal_objective = models.PositiveIntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(15)]
    )
    ia = models.BooleanField(default=False)


class Pool(models.Model):
    tournament = models.ForeignKey(
        "Tournament", on_delete=models.CASCADE, related_name="tournaments"
    )
    games = models.ManyToManyField(Game)


class Tournament(models.Model):
    pools = models.ManyToManyField(Pool, related_name="tournaments")
    created_by = models.ForeignKey(
        "Player", on_delete=models.CASCADE, related_name="created_tournaments"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    required_player_number = models.PositiveIntegerField(
        default=2, validators=[even_value_validator]
    )
    joined_players = models.ManyToManyField(Player)
