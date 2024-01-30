from django.db import models
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
)
from .validators import even_value_validator
from datetime import datetime


class Player(models.Model):
    username = models.CharField(max_length=32, unique=True, blank=False, null=False, default='Guest')
    name = models.CharField(max_length=32, blank=True, default='Guest')
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
    goal_objective = models.PositiveIntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(15)]
    )
    ia = models.BooleanField(default=False)
    power_ups = models.BooleanField(default=False)
    players = models.ManyToManyField(
        "Player",
        through="GameStat",
        related_name="games_played",
    )
    created_by = models.ForeignKey(Player, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(default=datetime.now)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    winner = models.ForeignKey(
        "Player",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="games_won",
    )


    def serialize(self):
        return {
            "id": self.id,
            "state": self.state,
            "goal_objective": self.goal_objective,
            "ia": self.ia,
            "power_ups": self.power_ups,
            "players": [player.serialize_summary() for player in self.players.all()],
            "created_by": self.created_by.serialize_summary(),
            "created_at": self.created_at,
            "started_at": self.started_at,
            "ended_at": self.ended_at,
            "winner": self.winner.serialize_summary() if self.winner else None,
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
    power_ups = models.BooleanField(default=False)
    players = models.ManyToManyField(Player, blank=True)
    games = models.ManyToManyField(Game, blank=True)
    created_by = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="created_tournaments")
    created_at = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "state": self.state,
            "power_ups": self.power_ups,
            "players": [player.serialize_summary() for player in self.players.all()],
            "games": [game.serialize() for game in self.games.all()],
            "created_by": self.created_by.serialize_summary(),
            "created_at": self.created_at,
        }

    def serialize_summary(self):
        return {
            "id": self.id,
        }
