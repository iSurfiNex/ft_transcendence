from django import forms
from .models import Player, Tournament, Game


class PlayerForm(forms.ModelForm):
    class Meta:
        model = Player
        fields = [
            "username",
            "name",
        ]


class GameForm(forms.ModelForm):
    class Meta:
        model = Game
        fields = [
            "state",
            #"required_player_number",
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
            #"required_player_number",
            "power_ups",
            "players",
            "games",
            "created_by",
        ]
