from django.contrib import admin
from .models import Game, Player


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ("id", "num_players", "difficulty")
    list_filter = ("num_players", "difficulty")
    search_fields = ("id",)


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ("id", "xp")
    search_fields = ("id",)
