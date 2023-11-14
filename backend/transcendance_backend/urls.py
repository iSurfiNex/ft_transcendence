"""
URL configuration for myapp2 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import PlayerView, TournamentView, GameView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/players/", PlayerView.as_view(), name="player-list"),
    path("api/players/<int:id>/", PlayerView.as_view(), name="player-detail"),
    path("api/tournaments/", TournamentView.as_view(), name="tournament-list"),
    path(
        "api/tournaments/<int:id>/", TournamentView.as_view(), name="tournament-detail"
    ),
    path("api/games/", GameView.as_view(), name="game-list"),
    path("api/games/<int:id>/", GameView.as_view(), name="game-detail"),
]
