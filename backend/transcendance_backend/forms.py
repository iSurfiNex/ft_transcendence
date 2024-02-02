from django import forms
from .models import Player, Tournament, Game
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User


class PlayerForm(forms.ModelForm):
    # Fields from User model
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)

    class Meta:
        model = Player
        fields = ["name", "avatar", "first_name", "last_name"]


class GameForm(forms.ModelForm):
    class Meta:
        model = Game
        fields = [
            "state",
            "goal_objective",
            "ia",
            "power_ups",
            "players",
            "created_by",
            "started_at",
            "ended_at",
            "winner",
        ]


class TournamentForm(forms.ModelForm):
    class Meta:
        model = Tournament
        fields = [
            "state",
            "power_ups",
            "players",
            "games",
            "created_by",
        ]
