from django.contrib import admin
from .models import Player, Game, Tournament, GameStat, Pool
from django import forms


class EvenValueValidator:
    def __init__(self, min_value, message=None):
        self.min_value = min_value
        self.message = message

    def __call__(self, value):
        if value % 2 != 0:
            raise forms.ValidationError(self.message or "Value must be an even number.")


class TournamentAdmin(admin.ModelAdmin):
    filter_horizontal = (
        "pools",
        "joined_players",
    )


class GameAdmin(admin.ModelAdmin):
    filter_horizontal = ("players",)
    list_display = ("id", "state", "required_player_number", "goal_objective", "ia")
    list_filter = ("state", "ia")
    search_fields = ("id",)


class PlayerAdmin(admin.ModelAdmin):
    filter_horizontal = (
        "blocked_users",
        "games",
        "tournaments",
    )
    list_display = (
        "id",
        "name",
    )
    search_fields = (
        "id",
        "name",
    )


class GameStatAdmin(admin.ModelAdmin):
    list_display = (
        "game",
        "goal_nb",
        "touch_nb",
        "miss_nb",
    )
    search_fields = ("game__id",)


class PoolAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "tournament",
    )
    search_fields = (
        "id",
        "tournament__id",
    )


# Register your models with the admin site
admin.site.register(Player, PlayerAdmin)
admin.site.register(Game, GameAdmin)
admin.site.register(Tournament, TournamentAdmin)
admin.site.register(GameStat, GameStatAdmin)
admin.site.register(Pool, PoolAdmin)
