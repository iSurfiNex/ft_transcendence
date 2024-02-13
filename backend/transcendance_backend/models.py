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
from django.db.models import Sum


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
    lastGameId = models.IntegerField(null=True, default=-1)
    # Get the object serialized as JS object
    @property
    def serialized(self):
        return json.dumps(self.serialize(), cls=DjangoJSONEncoder)

    @classmethod
    def all_serialized(cls):
        return json.dumps(Player.serialize_all(), cls=DjangoJSONEncoder)

    @classmethod
    def empty_summary(cls):
        return {
            "id": -1,
            "nickname": "Unknown",
            "picture": "/media/avatars/default.jpg",
            "avatar_thumbnail_url": "/media/avatars/default.jpg",
        }

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
            "lastGameId": self.lastGameId,
            "games": list(self.games.filter(state="done", players=self).all()),
            "tournaments": list(self.tournaments.filter(state="done", players=self).all()),
            "win": self.games.filter(state="done", winner=self).count() or 0,
            "lose": self.games.filter(state="done").exclude(winner=self).count() or 0,
            "total": self.games.filter(state="done", players=self).count() or 0,
            "tournament_win": self.tournaments.filter(state="done", winner=self).count() or 0,
            "paddle_hits": self.games.filter(state="done", players=self).aggregate(Sum('paddle_hits'))['paddle_hits__sum'] or 0,
            "wall_hits": self.games.filter(state="done", players=self).aggregate(Sum('wall_hits'))['wall_hits__sum'] or 0,
        }

    def serialize_summary(self):
        return {
            "id": self.user.id,
            "nickname": self.nickname,
            "picture": self.avatar.url,
            "avatar_thumbnail_url": self.avatar_thumbnail.url,
            "lastGameId": self.lastGameId,
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
        default=3, validators=[MinValueValidator(1), MaxValueValidator(15)]
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
    tournament = models.ForeignKey(
        "Tournament", on_delete=models.SET_NULL, blank=True, null=True
    )
    p1_score = models.IntegerField(default=None, null=True, blank=True)
    p2_score = models.IntegerField(default=None, null=True, blank=True)
    paddle_hits = models.IntegerField(default=-1, null=True, blank=True)
    wall_hits = models.IntegerField(default=-1, null=True, blank=True)

    @classmethod
    def all_serialized(cls):
        return json.dumps(Game.serialize_all(), cls=DjangoJSONEncoder)

    @classmethod
    def serialize_all(cls):
        games_list = Game.objects.all()
        games = [game.serialize() for game in games_list]
        return games

    def serialize(self):
        players = self.players.all()
        player_count = len(players)
        p1 = (
            players[0].serialize_summary()
            if player_count > 0
            else Player.empty_summary()
        )
        p2 = (
            players[1].serialize_summary()
            if player_count > 1
            else Player.empty_summary()
        )
        p1["is_creator"] = p1["id"] == self.created_by.id
        p2["is_creator"] = p2["id"] == self.created_by.id

        return {
            "id": self.id,
            "status": self.state,
            "goal_objective": self.goal_objective,
            "ia": self.ia,
            "type": "powerup" if self.power_ups else "normal",
            "players": [player.nickname for player in self.players.all()],
            "p1": p1,
            "p2": p2,
            "p1_score": self.p1_score if self.p1_score else None,
            "p2_score": self.p2_score if self.p2_score else None,
            "creator": self.created_by.nickname,
            "creator_id": self.created_by.id,
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
            "paddle_hits": self.paddle_hits,
            "wall_hits": self.wall_hits,
            "tournament_id": self.tournament_id or -1,
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
    players_r2 = models.ManyToManyField(Player, blank=True, related_name="tournament_r2")
    losers = models.ManyToManyField(Player, blank=True, related_name="tournament_losers")
    created_by = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name="created_tournaments"
    )
    goal_objective = models.PositiveIntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(15)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    winner = models.ForeignKey(
        Player,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="tournaments_won",
    )

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
            "players_r2": [player.nickname for player in self.players_r2.all()],
            "losers": [bigLoser.serialize_summary() for bigLoser in self.losers.all()],
            "gamesId": [game.id for game in self.game_set.all()],
            "creator": self.created_by.nickname,
            "winner": self.winner.serialize_summary() if self.winner else None,
            "date": int(self.created_at.timestamp() * 1000)
            if self.created_at
            else None,
        }

    def serialize_summary(self):
        return {
            "id": self.id,
        }


