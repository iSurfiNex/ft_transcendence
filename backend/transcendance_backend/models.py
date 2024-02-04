from django.db import models
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
)
from .validators import even_value_validator
from django.contrib.auth.models import User
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
import json
from django.core.serializers.json import DjangoJSONEncoder
from datetime import datetime

from .utils import stateUpdate


class Player(models.Model):
    # TODO user default avatar by requesting https://thispersondoesnotexist.com/
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)

    # True while the user is connected to the chat websocket
    is_connected = models.BooleanField(default=False)

    id_42 = models.IntegerField(null=True)
    url_profile_42 = models.CharField(max_length=200, null=True)
    avatar = models.ImageField(
        upload_to="avatars", default="avatars/default.jpg", null=True
    )
    avatar_thumbnail = ImageSpecField(
        source="avatar",
        processors=[ResizeToFill(100, 100)],
        format="JPEG",
        options={"quality": 60},
    )

    name = models.CharField(max_length=32, unique=True)
    blocked_users = models.ManyToManyField(
        "self", related_name="blocked_by", symmetrical=False, blank=True
    )
    friend_users = models.ManyToManyField(
        "self", related_name="friends", symmetrical=False, blank=True
    )
    games = models.ManyToManyField("Game", blank=True)
    tournaments = models.ManyToManyField("Tournament", blank=True)

    # Get the object serialized as JS object
    @property
    def serialized(self):
        return json.dumps(self.serialize(), cls=DjangoJSONEncoder)

    def serialize(self):
        return {
            "id": self.user.id,
            "id_42": self.id_42,
            "url_profile_42": self.url_profile_42,
            "name": self.name,
            "username": self.user.username,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "avatar_url": self.avatar.url,
            "avatar_thumbnail_url": self.avatar_thumbnail.url,
            "blocked_users": [
                user.serialize_summary() for user in self.blocked_users.all()
            ],
            "friend_users": [
                user.serialize_summary() for user in self.friend_users.all()
            ],
            "tournaments": [
                tournament.serialize_summary() for tournament in self.tournaments.all()
            ],
            "games": [game.serialize_summary() for game in self.games.all()],
        }

    def serialize_summary(self):
        return {
            "id": self.user.id,
            "name": self.user.username,
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
            "created_at": int(self.created_at.timestamp() * 1000) if self.created_at else None,
            "started_at": int(self.started_at.timestamp() * 1000) if self.started_at else None,
            "ended_at": int(self.ended_at.timestamp() * 1000) if self.ended_at else None,
            "winner": self.winner.serialize_summary() if self.winner else None,
        }

    def serialize_summary(self):
        return {
            "id": self.id,
        }


class Tournament(models.Model):
    GAME_STATES = (
        ("waiting", "Waiting"),
        ("round 1", "ROUND 1"),
        ("round 2", "ROUND 2"),
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
            "created_at": int(self.created_at.timestamp() * 1000) if self.created_at else None,
        }

    def serialize_summary(self):
        return {
            "id": self.id,
        }

# === SIGNALS ===

from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver


# Automatically associate a Player when a User is created
@receiver(post_save, sender=User)
def create_player(sender, instance, created, **kwargs):
    if created:
        Player.objects.create(user=instance, name=f"{instance.username}{instance.id}")


@receiver(post_save, sender=User)
def save_player(sender, instance, **kwargs):
    instance.player.save()


# Notify other users through websocket anytime a player instance is updated
@receiver(post_save, sender=Player)
def player_saved_hook(sender, instance, created, **kwargs):
    stateUpdate(instance, "create" if created else "update", "user")
