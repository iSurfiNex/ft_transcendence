from django.contrib import admin
from .models import BlogPost


class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "pub_date")
    list_filter = ("pub_date",)
    search_fields = ("title",)


admin.site.register(BlogPost)


from .models import Game, Player


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ("id", "num_players", "difficulty")
    list_filter = ("num_players", "difficulty")
    search_fields = ("id",)


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ("id", "games_played")
    list_filter = ("games_played",)
    search_fields = ("id",)
    filter_horizontal = ("blocked_players", "games_list")
