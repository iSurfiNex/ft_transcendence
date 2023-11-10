from django import forms
from .models import Player, Tournament


class PlayerForm(forms.ModelForm):
    class Meta:
        model = Player
        fields = ["name"]


class TournamentForm(forms.ModelForm):
    class Meta:
        model = Tournament
        fields = [
            "pools",
            "created_by",
            "required_player_number",
            "joined_players",
        ]
