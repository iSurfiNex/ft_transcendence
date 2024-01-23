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
from django.urls import path, re_path
from django.views.generic import TemplateView
from .views import (
    PlayerView,
    TournamentView,
    GameView,
    RequestLogin,
    start_game,
    ChatConsumer,
    register_user,
    login_user,
)

websocket_urlpatterns = [
    # re_path(r"ws/game/(?P<room_id>\w+)/$", ChatConsumer.as_asgi()),
    re_path(r"ws/chat/$", ChatConsumer.as_asgi()),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/register/", register_user, name="register-user"),
    path("api/login/", login_user, name="login-user"),
    path("api/start-game/", start_game, name="start-game"),
    path("api/players/", PlayerView.as_view(), name="player-list"),
    path("api/players/<int:id>/", PlayerView.as_view(), name="player-detail"),
    path("api/tournaments/", TournamentView.as_view(), name="tournament-list"),
    path(
        "api/tournaments/<int:id>/", TournamentView.as_view(), name="tournament-detail"
    ),
    path("api/requestlogin/", RequestLogin.as_view(), name="request-login"),
    path("api/games/", GameView.as_view(), name="game-list"),
    path("api/games/<int:id>/", GameView.as_view(), name="game-detail"),
    re_path(r"^.*", TemplateView.as_view(template_name="index.html")),
]
