from django import forms
from .models import Player, Tournament, Game


class PlayerForm(forms.ModelForm):
    class Meta:
        model = Player
        fields = ["name"]


class GameForm(forms.ModelForm):
    class Meta:
        model = Game
        fields = [
            "state",
            "required_player_number",
            "started_at",
            "ended_at",
            "players",
            "winner",
            "goal_objective",
            "ia",
            #"power-ups",
            #"private",
        ]


class TournamentForm(forms.ModelForm):
    class Meta:
        model = Tournament
        fields = [
            "pools",
            "created_by",
            "required_player_number",
            "players",
        ]