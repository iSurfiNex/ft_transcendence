from django.db import models
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
)
from .validators import even_value_validator


class Player(models.Model):
    username = models.CharField(max_length=32, unique=True, blank=False, null=False, default='Guest')
    name = models.CharField(max_length=32, blank=True)
    blocked_users = models.ManyToManyField("self", symmetrical=False, blank=True)
    games = models.ManyToManyField("Game", blank=True)
    tournaments = models.ManyToManyField("Tournament", blank=True)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "blocked_users": [
                user.serialize_summary() for user in self.blocked_users.all()
            ],
            "tournaments": [
                tournament.serialize_summary() for tournament in self.tournaments.all()
            ],
            "games": [game.serialize_summary() for game in self.games.all()],
        }

    def serialize_summary(self):
        return {
            "id": self.id,
            "username": self.username,
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
        "Player",
        through="GameStat",
        related_name="games_played",
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
    power_ups = models.BooleanField(default=False)
    created_by = models.ForeignKey(Player, on_delete=models.CASCADE, null=True, blank=True)

    def serialize(self):
        return {
            "id": self.id,
            "state": self.state,
            "required_player_number": self.required_player_number,
            "ended_at": self.ended_at,
            "players": [player.serialize_summary() for player in self.players.all()],
            "winner": self.winner,
            "goal_objective": self.goal_objective,
            "ia": self.ia,
            "power_ups": self.power_ups,
            "created_by": self.created_by,
        }

    def serialize_summary(self):
        return {
            "id": self.id,
        }


class Tournament(models.Model):
    GAME_STATES = (
        ("waiting", "Waiting"),
        ("running", "Running"),
        ("done", "Done"),
    )
    state = models.CharField(max_length=10, choices=GAME_STATES, default="waiting")
    games = models.ManyToManyField(Game, blank=True)
    created_by = models.ForeignKey(
        "Player", on_delete=models.CASCADE, related_name="created_tournaments"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    required_player_number = models.PositiveIntegerField(
        default=4, validators=[even_value_validator]
    )
    players = models.ManyToManyField(Player, blank=True)
    power_ups = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id": self.id,
            "state": self.state,
            "games": [game.serialize() for game in self.games.all()],
            "created_by": self.created_by.serialize_summary(),
            "created_at": self.created_at,
            "required_player_number": self.required_player_number,
            "players": [player.serialize_summary() for player in self.players.all()],
            "power_ups": self.power_ups,
        }

    def serialize_summary(self):
        return {
            "id": self.id,
        }
