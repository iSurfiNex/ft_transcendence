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
    games = models.ManyToManyField(
        "Game",
        through="GameStat",
        related_name="games_played",
    )

    nickname = models.CharField(max_length=32, unique=True)
    blocked_users = models.ManyToManyField(
        "self", related_name="blocked_by", symmetrical=False, blank=True
    )
    friend_users = models.ManyToManyField(
        "self", related_name="friends", symmetrical=False, blank=True
    )
    tournaments = models.ManyToManyField("Tournament", blank=True)

    # Get the object serialized as JS object
    @property
    def serialized(self):
        return json.dumps(self.serialize(), cls=DjangoJSONEncoder)

    @classmethod
    def all_serialized(cls):
        return json.dumps(Player.serialize_all(), cls=DjangoJSONEncoder)

    @classmethod
    def serialize_all(cls):
        users_list = Player.objects.filter(user__is_superuser=False)
        return [user.serialize() for user in users_list]

    def serialize(self):
        return {
            "id": self.user.id,
            "id_42": self.id_42,
            "current_game_id": self.games.filter(state__in=["running", "waiting"])
            .values_list("id", flat=True)
            .first()
            or -1,
            "current_tournament_id": self.tournament_set.exclude(state="done")
            .values_list("id", flat=True)
            .first()
            or -1,
            "is_connected": self.is_connected,
            "url_profile_42": self.url_profile_42,
            "nickname": self.nickname,
            "username": self.user.username,
            "fullname": self.user.first_name + " " + self.user.last_name,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "picture": self.avatar.url,
            "avatar_thumbnail_url": self.avatar_thumbnail.url,
            "blocked": [user.nickname for user in self.blocked_users.all()],
            "friends": [user.nickname for user in self.friend_users.all()],
        }

    def serialize_summary(self):
        return {
            "id": self.user.id,
            "nickname": self.nickname,
        }


class GameStat(models.Model):
    goal_nb = models.PositiveIntegerField(default=0)
    touch_nb = models.PositiveIntegerField(default=0)
    miss_nb = models.PositiveIntegerField(default=0)
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
    created_by = models.ForeignKey(
        Player, on_delete=models.CASCADE, null=True, blank=True
    )
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

    @classmethod
    def all_serialized(cls):
        return json.dumps(Game.serialize_all(), cls=DjangoJSONEncoder)

    @classmethod
    def serialize_all(cls):
        games_list = Game.objects.all()
        games = [game.serialize() for game in games_list]
        return games

    def serialize(self):
        return {
            "id": self.id,
            "status": self.state,
            "goal_objective": self.goal_objective,
            "ia": self.ia,
            "type": "powerup" if self.power_ups else "normal",
            "players": [player.nickname for player in self.players.all()],
            "creator": self.created_by.nickname,
            "date": int(self.created_at.timestamp() * 1000)
            if self.created_at
            else None,
            "started_at": int(self.started_at.timestamp() * 1000)
            if self.started_at
            else None,
            "ended_at": int(self.ended_at.timestamp() * 1000)
            if self.ended_at
            else None,
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
    created_by = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name="created_tournaments"
    )
    goal_objective = models.PositiveIntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(15)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    games = models.ManyToManyField(Game, related_name="tournaments", blank=True)

    def create_game(self):
        return Game.objects.create(
            state="waiting",
            goal_objective=self.goal_objective,
            power_ups=self.power_ups,
            created_by=self.created_by,
        )

    def create_games(self):
        # Create Game instances with player count derived from the Tournament
        self.games.add(self.create_game())
        self.games.add(self.create_game())
        self.games.add(self.create_game())

    def save(self, *args, **kwargs):
        if not self.pk:
            # If this is a new instance (not being updated)
            # Call create_games() to create Game instances
            self.create_games()
        super().save(*args, **kwargs)

    @classmethod
    def all_serialized(cls):
        return json.dumps(Tournament.serialize_all(), cls=DjangoJSONEncoder)

    @classmethod
    def serialize_all(cls):
        tournaments_list = Tournament.objects.all()
        tournaments = [tournament.serialize() for tournament in tournaments_list]
        return tournaments

    def serialize(self):
        return {
            "id": self.id,
            "type": "tournament",
            "status": self.state,
            "power_ups": self.power_ups,
            "players": [player.nickname for player in self.players.all()],
            "gamesId": [game.id for game in self.games.all()],
            "creator": self.created_by.nickname,
            "date": int(self.created_at.timestamp() * 1000)
            if self.created_at
            else None,
        }

    def serialize_summary(self):
        return {
            "id": self.id,
        }


# === SIGNALS ===

from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver


def get_unique_nickname(str):
    if not Player.objects.filter(nickname=str).exists():
        return str
    i = 2
    while Player.objects.filter(nickname=f"{str}{i}").exists():
        i += 1
    return f"{str}{i}"


# Automatically associate a Player when a User is created
@receiver(post_save, sender=User)
def create_player(sender, instance, created, **kwargs):
    if created:
        Player.objects.create(
            user=instance, nickname=get_unique_nickname(f"{instance.username}_")
        )


@receiver(post_save, sender=User)
def save_player(sender, instance, **kwargs):
    instance.player.save()


# Notify other users through websocket anytime a player instance is updated
@receiver(post_save, sender=Player)
def player_saved_hook(sender, instance, created, **kwargs):
    stateUpdate(instance, "create" if created else "update", "user")
