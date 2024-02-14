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
from django.conf.urls.static import static
from django.conf import settings
from .consumers import ChatConsumer, StateUpdateConsumer, GameRunningConsumer
from .views import (
    PlayerView,
    TournamentView,
    GameView,
    request_42_login,
    register_user,
    login_user,
    logout_user,
    update_profile,
    get_user_profile,
    ManageTournamentView,
    ManageGameView,
    CustomTemplateView,
    giveup,
    reconnectUpdate,
)

websocket_urlpatterns = [
    # re_path(r"ws/game/(?P<room_id>\w+)/$", ChatConsumer.as_asgi()),
    path("ws/state-update", StateUpdateConsumer.as_asgi()),
    path("ws/game-running/<int:id>/", GameRunningConsumer.as_asgi()),
    re_path(r"ws/chat$", ChatConsumer.as_asgi()),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/giveup/", giveup, name="giveup"),
    path("api/register/", register_user, name="register-user"),
    path("api/login/", login_user, name="login-user"),
    path("api/logout/", logout_user, name="logout-user"),
    path("api/update_profile/", update_profile, name="update_profile"),
    path("api/profile/<int:id>/", get_user_profile, name="get_user_profile"),
    path("api/players/", PlayerView.as_view(), name="player-list"),
    path("api/players/<int:id>/", PlayerView.as_view(), name="player-detail"),
    path("api/tournaments/", TournamentView.as_view(), name="tournament-list"),
    path(
        "api/tournaments/<int:id>/", TournamentView.as_view(), name="tournament-detail"
    ),
    path("api/request_42_login/", request_42_login, name="request-42-login"),
    path("api/games/", GameView.as_view(), name="game-list"),
    path("api/games/<int:id>/", GameView.as_view(), name="game-detail"),
    path(
        "api/manage-tournament/",
        ManageTournamentView.as_view(),
        name="manage-tournament",
    ),
    path(
        "api/manage-tournament/<int:id>/",
        ManageTournamentView.as_view(),
        name="tournament-detail",
    ),
    path("api/manage-game/", ManageGameView.as_view(), name="manage-game"),
    path("api/manage-game/<int:id>/", ManageGameView.as_view(), name="game-detail"),
    path("api/reconnect-update/", reconnectUpdate, name="reconnect"),
    re_path(r"^.*", CustomTemplateView.as_view(template_name="index.html")),
]
