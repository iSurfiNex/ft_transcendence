from django.http import JsonResponse, Http404
from django.db.utils import IntegrityError
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_POST, require_GET
from urllib.parse import urlencode
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile
from http import HTTPStatus
from django.views.generic import TemplateView
import json
import os

import requests
import random
from datetime import datetime, timedelta

from .models import Player, Tournament, Game
from .forms import PlayerForm, TournamentForm, GameForm
from .utils import stateUpdate, stateUpdateAll
from typing import Type

# from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model, logout
from django.contrib.auth.decorators import login_required

from .models import Player

import logging

import asyncio

logger = logging.getLogger(__name__)

User = get_user_model()


def getLoginResponse(user):
    return JsonResponse(
        {
            "status": "success!",
            "profile": user.player.serialize(),
            "tournaments": Tournament.serialize_all(),
            "games": Game.serialize_all(),
            "users": Player.serialize_all(),
        }
    )


@require_POST  # Ensure that the view only responds to POST requests
def login_user(request):
    form = AuthenticationForm(request, data=request.POST)
    if not form.is_valid():
        return JsonResponse({"errors": form.errors}, status=HTTPStatus.FORBIDDEN)
    else:
        user = form.get_user()
        login(request, user)
        return getLoginResponse(user)


@require_GET  # Ensure that the view only responds to POST requests
def logout_user(request):
    response = JsonResponse({"status": "OK"})
    response.delete_cookie("sessionid")
    logout(request)
    return response


@require_POST  # Ensure that the view only responds to POST requests
def register_user(request):
    # Extract user registration data from the POST request
    username = request.POST.get("username")
    password = request.POST.get("password1")
    form = UserCreationForm(request.POST)
    if not form.is_valid():
        return JsonResponse({"errors": form.errors}, status=HTTPStatus.BAD_REQUEST)

    try:
        # Create a new user using create_user method
        user = User.objects.create_user(
            username=username,
            password=password,
        )
        user.first_name = "Jean"
        user.last_name = "Michel"
        user.save()
        login(request, user)

        return getLoginResponse(user)

    except Exception as e:
        return JsonResponse(
            {"errors": {"any": str(e)}},
            status=HTTPStatus.BAD_REQUEST,  # Internal Server Error instead ?
        )


@login_required
@require_POST
def update_profile(request):
    form = PlayerForm(request.POST, instance=request.user.player)
    if not form.is_valid():
        return JsonResponse({"errors": form.errors}, status=HTTPStatus.BAD_REQUEST)

    try:
        profile = Player.objects.get(user=request.user)

        # Update pseudo if provided in the request
        nickname = request.POST.get("nickname", None)
        firstName = request.POST.get("first_name", None)
        lastName = request.POST.get("last_name", None)
        avatar = request.FILES.get("avatar", None)

        if firstName is not None:
            request.user.first_name = firstName
        if lastName is not None:
            request.user.last_name = lastName
        request.user.save()

        if nickname is not None:
            profile.nickname = nickname
        if avatar is not None:
            profile.avatar = avatar
        profile.save()

        return JsonResponse(
            {"status": "success", "profile": profile.serialize()},
            status=200,
        )
    except Exception as e:
        return JsonResponse(
            {"errors": {"any": str(e)}},
            status=HTTPStatus.BAD_REQUEST,  # Internal Server Error instead ?
        )


@login_required
@require_GET
def get_user_profile(request, id):
    user = get_object_or_404(User, id=id)
    return JsonResponse(user.player.serialize())


def get_unique_username(str):
    if not User.objects.filter(username=str).exists():
        return str
    i = 2
    while User.objects.filter(username=f"{str}{i}").exists():
        i += 1
    return f"{str}{i}"


def request_42_login(request):
    try:
        token_42 = request.GET["code"]
        type = request.GET["type"]
        logger.debug(f"======== Request 42 Login, type: {type}")

        if type != "login" and type != "profile":
            raise Exception("Invalid type")

        url = "https://api.intra.42.fr/oauth/token"
        base_uri = os.environ.get("SITE_ORIGIN", "")
        redirect_uri = f"{base_uri}/{type}/"
        data = {
            "grant_type": "authorization_code",
            "client_id": "u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080",
            "client_secret": "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",
            "code": token_42,
            "redirect_uri": redirect_uri,
        }

        logger.debug(
            f"======== 42 authorization request, code: {token_42}, redirect_uri: {redirect_uri} "
        )
        authorize_response = requests.post(
            url, json=data, headers={"Content-Type": "application/json"}
        )

        authorize_response.raise_for_status()  # Check if the request was successful

        authorize_response_data = authorize_response.json()
        access_token = authorize_response_data["access_token"]

        logger.debug("======== 42 Token received: ")
        logger.debug(token_42)

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        me_response = requests.get("https://api.intra.42.fr/v2/me", headers=headers)

        me_response.raise_for_status()  # Check if the request was successful

        logger.debug("======== 42 API reached")
        me_response_data = me_response.json()

        img_url = me_response_data["image"]["versions"]["large"]
        logger.debug("======== Downloading image at ")
        logger.debug(img_url)
        img_response = requests.get(img_url)
        img_response.raise_for_status()  # Check if the request was successful

        logger.debug("======== Image downloaded")

        img_42_profile = ContentFile(img_response.content)

        id_42 = me_response_data["id"]
        first_name = me_response_data["first_name"]
        last_name = me_response_data["last_name"]
        username = me_response_data["login"]
        username = get_unique_username(username)

        url_profile_42 = f"https://profile.intra.42.fr/users/{username}"

        player = Player.objects.filter(id_42=id_42).first()

        if player is None:
            if type == "profile":
                logger.debug("======== Linking existing user")
                user = request.user
            else:
                logger.debug("======== Creating new User")
                user = User.objects.create_user(
                    username=username,
                )
            user.first_name = first_name
            user.last_name = last_name
            user.player.id_42 = id_42
            user.player.url_profile_42 = url_profile_42
            user.player.avatar.save(
                f"{user.player.pk}_avatar.jpg",
                img_42_profile,
            )
            user.save()
            logger.debug("======== User updated with 42 data")
        else:
            if type == "profile":
                raise Exception("A 42 account is already linked for this user")

            user = player.user

        if type == "login":
            logger.debug("======== Logging existing user")
            login(request, user)
            logger.debug("======== User logged in")

        return getLoginResponse(user)

    except Exception as e:
        return JsonResponse(
            {"errors": {"global": str(e)}}, status=HTTPStatus.BAD_REQUEST
        )


def create_rest_api_endpoint(model: Type, modelForm: Type, name: str):
    class EndpointView(View):
        def get(self, request, id=None):
            try:
                if id:
                    player = model.objects.get(id=id)
                    response = player.serialize()
                    return JsonResponse(response, status=HTTPStatus.OK)
                else:
                    players = model.objects.all()
                    response = [player.serialize() for player in players]
                    return JsonResponse(response, safe=False, status=HTTPStatus.OK)
            except model.DoesNotExist:
                return JsonResponse(
                    {"errors": f"{name} not found"}, status=HTTPStatus.NOT_FOUND
                )

        def post(self, request):
            try:
                data = json.loads(request.body)
                form = modelForm(data)
                if not form.is_valid():
                    return JsonResponse({"errors": form.errors})
                new_player = model(**form.cleaned_data)
                new_player.save()
                created_player = model.objects.get(id=new_player.id)
                response = created_player.serialize()
                return JsonResponse(response, status=201)
            except KeyError:
                return JsonResponse(
                    {"errors": "Invalid data"}, status=HTTPStatus.BAD_REQUEST
                )
            except IntegrityError as e:
                return JsonResponse({"errors": str(e)}, status=HTTPStatus.BAD_REQUEST)
            except json.JSONDecodeError as e:
                return JsonResponse({"errors": str(e)}, status=HTTPStatus.BAD_REQUEST)

            def put(self, request, id):
                try:
                    player = model.objects.get(id=id)
                    put_data = json.loads(request.body)
                    # Merge the current player attribute with the put data
                    updated_player_data = player.__dict__ | put_data
                    # By giving the instance, we prevent running into "already exist" validation error
                    form = modelForm(updated_player_data, instance=player)
                    if not form.is_valid():
                        return JsonResponse({"errors": form.errors})
                    for key, value in form.cleaned_data.items():
                        setattr(player, key, value)
                        player.save()
                        updated_player = model.objects.get(id=player.id)
                        response = updated_player.serialize()
                        return JsonResponse(response, status=HTTPStatus.OK)
                except model.DoesNotExist:
                    return JsonResponse(
                        {"errors": f"{name} not found"}, status=HTTPStatus.NOT_FOUND
                    )
                except IntegrityError as e:
                    return JsonResponse(
                        {"errors": str(e)}, status=HTTPStatus.BAD_REQUEST
                    )
                except KeyError:
                    return JsonResponse(
                        {"errors": "Invalid data"}, status=HTTPStatus.BAD_REQUEST
                    )
                except json.JSONDecodeError as e:
                    return JsonResponse(
                        {"errors": str(e)}, status=HTTPStatus.BAD_REQUEST
                    )

                def delete(self, request, id):
                    try:
                        player = model.objects.get(id=id)
                        player.delete()
                        return JsonResponse({}, status=204)
                    except model.DoesNotExist:
                        return JsonResponse(
                            {"errors": f"{name} not found"}, status=HTTPStatus.NOT_FOUND
                        )

    return EndpointView


class ManageTournamentView(View):
    def get(self, request, id=None):
        try:
            if id is None:
                tournaments = Tournament.objects.all()
                response = [tournament.serialize() for tournament in tournaments]
            else:
                tournament = get_object_or_404(Tournament, id=id)
                response = tournament.serialize()

            return JsonResponse(response, status=200)

        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=404)
        except Http404:
            return JsonResponse({"errors": "Object not found"}, status=404)

    def post(self, request):
        try:
            data = json.loads(request.body)

            creator = request.user.player

            tournament = Tournament.objects.create(
                state="waiting",
                power_ups=data["power_ups"],
                goal_objective=data["goal_objective"],
                created_by=creator,
            )
            tournament.players.add(creator)
            tournament.save()

            Update(game="all", tournament=tournament, tournament_action="create", user=creator)
            response = tournament.serialize()
            return JsonResponse(response, status=200)

        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=404)
        except Http404:
            return JsonResponse({"errors": "Object not found"}, status=404)

    def put(self, request, id):
        try:
            data = json.loads(request.body)
            tournament = get_object_or_404(Tournament, id=id)
            my_player = request.user.player

            def start_game(i, p1, p2):
                game = tournament.game_set.all()[i]
                game.players.add(p1, p2)
                game.started_at = datetime.now() + timedelta(seconds=5)
                game.state = "running"
                game.save()
                
            if data['action'] == "start-round":
                if tournament.state == "waiting":
                    players = list(tournament.players.all())
                    random.shuffle(players)
                    start_game(0, players[0], players[1])
                    start_game(1, players[2], players[3])
                    tournament.state = "round 1"
                    #tournament.players.clear()
                
                elif tournament.state == "round 1":
                    players = list(tournament.players_r2.all())
                    start_game(3, players[0], players[1])
                    tournament.state = "round 2"
            
            elif data['action'] == "end-round":
                tournament_games = tournament.game_set.all()
                for game in tournament_games:
                    if my_player in game.players and game.state != "done":
                        game.p1_score = data["p1_score"]
                        game.p2_score = data["p2_score"]
                        game.winner = data["winner"]
                        game.state = "done"
                        game.save()
                        
                        if tournament.state == "round 1":
                            tournament.players_r2.add(get_object_or_404(Player, nickname=data["winner"]))
                            tournament.losers.add(get_object_or_404(Player, nickname=data["loser"]))

                        elif tournament.state == "round 2":
                            tournament.winner = get_object_or_404(Player, nickname=data["winner"])
                            tournament.losers.add(get_object_or_404(Player, nickname=data["loser"]))
                            tournament.state = "done"

            elif (data["action"] == "join"):        
                tournament.players.add(my_player)

            elif data["action"] == "leave":
                if my_player == tournament.created_by:
                    if tournament.players.count() > 1:
                        tournament.players.remove(my_player)
                        newCreator = tournament.players.first()
                        tournament.created_by = newCreator
                        for game in tournament.game_set.all():
                            game.created_by = newCreator
                            game.save()
                    else:
                        for i in range(3):
                            tournament.game_set.all()[0].delete()
                        tournament.delete()
                        Update(game="all", tournament="all", user=my_player)
                        return JsonResponse({}, status=200)
                else:
                    tournament.players.remove(my_player)

            tournament.save()
            Update(game="all", tournament=tournament, tournament_action="update", user=my_player)
            response = tournament.serialize()
            return JsonResponse(response, status=200)

        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=404)
        except Http404:
            return JsonResponse({"errors": "Object not found"}, status=404)


class ManageGameView(View):
    def get(self, request, id=None):
        try:
            if id is None:
                games = Game.objects.all()
                response = [game.serialize() for game in games]

            else:
                game = get_object_or_404(Game, id=id)
                response = game.serialize()

            return JsonResponse(response, status=200)

        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=404)
        except Http404:
            return JsonResponse({"errors": "Object not found"}, status=404)

    def post(self, request):
        try:
            data = json.loads(request.body)

            creator = request.user.player
            game = Game.objects.create(
                state="waiting",
                goal_objective=data["goal_objective"],
                ia=data["ia"],
                power_ups=data["power_ups"],
                created_by=creator,
            )
            game.players.add(creator)

            Update(game=game, game_action="create", user=creator)
            response = game.serialize()
            return JsonResponse(response, status=200)

        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=400)
        except Http404:
            return JsonResponse({"errors": "Object not found"}, status=404)
        except IntegrityError as e:
            return JsonResponse({"errors": str(e)}, status=400)

    def put(self, request, id):
        try:
            data = json.loads(request.body)
            game = get_object_or_404(Game, id=id)
            my_player = request.user.player

            if data["action"] == "start-game":
                game.started_at = datetime.now() + timedelta(seconds=5)
                game.state = "running"

            elif data["action"] == "end-game":
                game.state = "done"
                game.p1_score = data["p1_score"]
                game.p2_score = data["p2_score"]
                game.winner = data["winner"]

            elif data["action"] == "join":
                game.players.add(my_player)

            elif data["action"] == "leave":
                if my_player == game.created_by:
                    if game.players.count() > 1:
                        game.players.remove(my_player)
                        game.created_by = game.players.first()
                    else:
                        game.delete()
                        Update(game="all", user=my_player)
                        return JsonResponse({"status": "ok"}, status=200)
                else:
                    game.players.remove(my_player)

            game.save()
            Update(game=game, game_action="update", user=my_player)
            response = game.serialize()
            return JsonResponse(response, status=200)

        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=400)
        except Http404:
            return JsonResponse({"errors": "Object not found"}, status=404)
        except IntegrityError as e:
            return JsonResponse({"errors": str(e)}, status=400)


# Let Player giveup his running game
@require_GET
def giveup(request):
    my_player = request.user.player
    game = my_player.games.filter(state__in=["running"]).first()
    if game is None:
        return JsonResponse({"errors": {"__all__": "No game running"}}, status=400)
    game.state = "done"
    game.save()
    stateUpdate(game, "update", "game")
    stateUpdate(my_player, "update", "user")
    # TODO update users ?
    return JsonResponse({"status": "ok"}, status=200)

@require_GET
def reconnectUpdate(request):
    Update(game="all", tournament="all", user=request.user.player)
    return JsonResponse({"status": "ok"}, status=200)

def Update(game=None, game_action=None, tournament=None, tournament_action=None, user=None):
    if (game == "all"):
        stateUpdateAll(Game, "all games")
    elif (game):
        if (game_action == "update"):
            stateUpdate(game, "update", "game")
        elif (game_action == "create"):
            stateUpdate(game, "create", "game")

    if (tournament == "all"):
        stateUpdateAll(Tournament, "all tournaments")
    elif (tournament):
        if (tournament_action == "update"):
            stateUpdate(tournament, "update", "tournament")
        elif (tournament_action == "create"):
            stateUpdate(tournament, "create", "tournament")

    if (user):
        stateUpdate(user, "update", "user" )



PlayerView = create_rest_api_endpoint(Player, PlayerForm, "Player")
TournamentView = create_rest_api_endpoint(Tournament, TournamentForm, "Tournament")
GameView = create_rest_api_endpoint(Game, GameForm, "Game")


class CustomTemplateView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["tournaments"] = Tournament.all_serialized()
        context["games"] = Game.all_serialized()
        context["users"] = Player.all_serialized()
        return context