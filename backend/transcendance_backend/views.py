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
import json
import os

import requests
import random
from datetime import datetime, timedelta

from .models import Player, Tournament, Game
from .forms import PlayerForm, TournamentForm, GameForm
from .utils import stateUpdate
from typing import Type

# from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model, logout
from django.contrib.auth.decorators import login_required

from .models import Player
from .pong.init import createGameThread

import logging

logger = logging.getLogger(__name__)

User = get_user_model()


@require_POST  # Ensure that the view only responds to POST requests
def login_user(request):
    form = AuthenticationForm(request, data=request.POST)
    if not form.is_valid():
        return JsonResponse({"errors": form.errors}, status=HTTPStatus.FORBIDDEN)
    else:
        user = form.get_user()
        login(request, user)
        return JsonResponse(
            {
                "status": "success!",
                "username": user.player.name,
                "profile": user.player.serialize(),
            }
        )


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
        user.first_name = "Default"
        user.last_name = "Name"
        user.save()
        login(request, user)
        return JsonResponse(
            {
                "username": user.player.name,
                "profile": user.player.serialize(),
            }
        )
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
        name = request.POST.get("name", None)
        firstName = request.POST.get("first_name", None)
        lastName = request.POST.get("last_name", None)
        avatar = request.FILES.get("avatar", None)

        if firstName is not None:
            request.user.first_name = firstName
        if lastName is not None:
            request.user.last_name = lastName
        request.user.save()

        if name is not None:
            profile.name = name
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
            # "client_secret": "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",
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

        img_url = me_response_data["image"]["versions"]["medium"]
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

        createGameThread(id)
        return JsonResponse(
            {
                "username": user.player.name,
                "profile": user.player.serialize(),
            }
        )
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

            creator = get_object_or_404(Player, name=data['created_by'])

            game1 = Game.objects.create(state='waiting', goal_objective=data['goal_objective'], power_ups=data['power_ups'], created_by=creator)
            game2 = Game.objects.create(state='waiting', goal_objective=data['goal_objective'], power_ups=data['power_ups'], created_by=creator)

            tournament = Tournament.objects.create(state='waiting', power_ups=data['power_ups'], created_by=creator)
            tournament.players.add(creator)
            tournament.games.add(game1, game2)

            stateUpdate(tournament, 'create', 'tournament')
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

            if data["action"] == "start-1st-round":#POUR COMMENCER LE TOURNOI

                #player1 = Player.objects.create(name='taMere')#A DEGAGER
                #player2 = Player.objects.create(name='taSoeur')#C'EST POUR TESTER
                #player3 = Player.objects.create(name='taGrandMere')#
                #player4 = Player.objects.create(name='taCouz')#
                #players = [player1, player2, player3, player4]#

                players = list(tournament.players.all())
                random.shuffle(players)
                tournament.games.all()[0].players.add(players[0], players[1])
                tournament.games.all()[0].started_at = (datetime.now() + timedelta(seconds=5)).timestamp() * 1000
                tournament.games.all()[0].state = "running"
                tournament.games.all()[1].players.add(players[2], players[3])
                tournament.games.all()[1].started_at = (datetime.now() + timedelta(seconds=5)).timestamp() * 1000
                tournament.games.all()[1].state = "running"
                tournament.state = "round 1"
                stateUpdate(tournament, 'update', 'tournament')
                tournament.games.clear()
                tournament.players.clear()
                tournament.save()

            #elif data['action'] == "start-2nd-round"

            elif data["action"] == "add-player":# A LANCER AU MOMENT OU UN JOUEUR REJOIN LE TOURNOI ET LE RELANCER A LA FIN DU PREMIER ROUND POUR RAJOUTER LE WINNER AU TOURNOI
                new_player = get_object_or_404(Player, name=data['username'])
                tournament.players.add(new_player)
            
            #elif data["action"] == "rm-player":

            stateUpdate(tournament, 'update', 'tournament')
            response = tournament.serialize()
            return JsonResponse(response, status=200)

        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=404)
        except Http404:
            return JsonResponse({"errors": "Object not found"}, status=404)

    #def delete(self, request, id):
    #
    #        tournament.players.remove(gone_player)
    #        response = tournament.serialize()
    #        return response
    #
    #    except KeyError:
    #        return JsonResponse({"errors": "Invalid data"}, status=404)
    #    except Http404:
    #        return JsonResponse({"errors": "Object not found"}, status=404)


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
            
            creator = get_object_or_404(Player, name=data['created_by'])
            game = Game.objects.create(state='waiting', goal_objective=data['goal_objective'], ia=data['ia'], power_ups=data['power_ups'], created_by=creator)
            game.players.add(creator)

            stateUpdate(game, 'create', 'game')
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

            if data['action'] == "start-game":
                game.started_at = (datetime.now().timestamp() + timedelta(seconds=5)) * 1000
                game.state = "running"
                createGameThread(id)

            elif data['action'] == "add-player":
                new_player = get_object_or_404(Player, name=data['username'])
                game.players.add(new_player)

            elif data["action"] == "rm-player":
                playerToRm = get_object_or_404(Player, name=data['username'])
                if playerToRm == game.created_by:
                    if game.players.count() == 2:
                        game.players.remove(playerToRm)
                        game.created_by = game.players.first()
                    else:
                        game.delete()
                        #stateUpdate(Game.objects.all(), "update", "all games")
                        return JsonResponse({}, status=204)
                else:
                    game.players.remove(playerToRm)

            game.save()
            stateUpdate(game, 'update', 'game')
            response = game.serialize()
            return JsonResponse(response, status=200)

        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=400)
        except Http404:
            return JsonResponse({"errors": "Object not found"}, status=404)
        except IntegrityError as e:
            return JsonResponse({"errors": str(e)}, status=400)


def BuildState(request):

    #player = Player.objects.create(username='taMere')#A DEGAGER
    #Player.objects.create(username='taSoeur')#C'EST POUR TESTER
    #Player.objects.create(username='taGrandMere')#
    #Player.objects.create(username='taCousine')#
    #game1 = Game.objects.create(state='waiting', power_ups=False)#
    #game2 = Game.objects.create(state='waiting', power_ups=False)#
    #tour = Tournament.objects.create(created_by=player , power_ups=False)#
    #tour.games.add(game1, game2)#
    #tour.players.add(player)#

    users_list = Player.objects.filter(user__is_superuser=False)
    games_list = Game.objects.all()
    tournaments_list = Tournament.objects.all()

    users = [user.serialize() for user in users_list]
    games = [game.serialize() for game in games_list]
    tournaments = [tournament.serialize() for tournament in tournaments_list]

    data = {
        'users': users,
        'games': games,
        'tournaments': tournaments,
    }

    return JsonResponse(data)

PlayerView = create_rest_api_endpoint(Player, PlayerForm, "Player")
TournamentView = create_rest_api_endpoint(Tournament, TournamentForm, "Tournament")
GameView = create_rest_api_endpoint(Game, GameForm, "Game")
