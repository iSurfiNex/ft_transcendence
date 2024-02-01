from django import forms
from .models import Player, Tournament, Game
from django.core.exceptions import ValidationError


class PlayerForm(forms.ModelForm):
    def clean_name(self):
        name = self.cleaned_data["name"]
        if Player.objects.filter(name=name).exists():
            raise ValidationError("already_exists")
        return name

    class Meta:
        model = Player
        fields = ["name", "avatar"]


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
            "power_ups",
        ]


class TournamentForm(forms.ModelForm):
    class Meta:
        model = Tournament
        fields = [
            "state",
            "games",
            "created_by",
            "required_player_number",
            "players",
            "power_ups",
        ]
