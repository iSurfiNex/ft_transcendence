from django.contrib import admin
from .models import Player, Game, Tournament, GameStat
from django import forms


class TournamentAdmin(admin.ModelAdmin):
    filter_horizontal = ("players",)
    list_display = ("id", "created_by")
    search_fields = (
        "id",
        "created_by",
    )


class GameAdmin(admin.ModelAdmin):
    list_display = ("id", "state", "goal_objective", "ia")
    list_filter = ("state", "ia")
    search_fields = ("id",)


class PlayerAdmin(admin.ModelAdmin):
    filter_horizontal = (
        "blocked_users",
        "tournaments",
    )
    list_display = (
        "id",
        "nickname",
    )
    search_fields = (
        "id",
        "nickname",
    )


class GameStatAdmin(admin.ModelAdmin):
    list_display = (
        "game",
        "goal_nb",
        "touch_nb",
        "miss_nb",
    )
    search_fields = ("game__id",)

# Register your models with the admin site
admin.site.register(Player, PlayerAdmin)
admin.site.register(Game, GameAdmin)
admin.site.register(Tournament, TournamentAdmin)
admin.site.register(GameStat, GameStatAdmin)
