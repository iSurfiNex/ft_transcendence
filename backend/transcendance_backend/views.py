from django.http import JsonResponse, Http404
from django.db.utils import IntegrityError
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_POST, require_GET
from urllib.parse import urlencode
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from http import HTTPStatus
import json
import os
import logging

import requests
import random

from .models import Player, Tournament, Game
from .forms import PlayerForm, TournamentForm, GameForm
from .utils import tournamentUpdate, gameUpdate
from typing import Type

# from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model, logout

User = get_user_model()
logger = logging.getLogger(__name__)

@csrf_exempt  # Use csrf_exempt for simplicity in this example. In a real-world scenario, handle CSRF properly.
@require_POST  # Ensure that the view only responds to POST requests
def login_user(request):
    form = AuthenticationForm(request, data=request.POST)
    if not form.is_valid():
        return JsonResponse({"errors": form.errors}, status=HTTPStatus.FORBIDDEN)
    else:
        user = form.get_user()
        login(request, user)
        return JsonResponse({"status": "success!", "username": user.username})


@csrf_exempt  # Use csrf_exempt for simplicity in this example. In a real-world scenario, handle CSRF properly.
@require_GET  # Ensure that the view only responds to POST requests
def logout_user(request):
    response = JsonResponse({"status": "OK"})
    response.delete_cookie("sessionid")
    logout(request)
    return response


@csrf_exempt  # Use csrf_exempt for simplicity in this example. In a real-world scenario, handle CSRF properly.
@require_POST  # Ensure that the view only responds to POST requests
def register_user(request):
    # Extract user registration data from the POST request
    username = request.POST.get("username")
    password = request.POST.get("password1")
    email = request.POST.get("email")
    form = UserCreationForm(request.POST)
    if not form.is_valid():
        return JsonResponse({"errors": form.errors}, status=HTTPStatus.BAD_REQUEST)

    try:
        # Create a new user using create_user method
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            # username=username, password=password, email=email
        )
        user.first_name = "first_name_unknown"
        user.last_name = "last_name_unknown"
        user.save()
        return JsonResponse({"status": "success"})
    except IntegrityError as e:
        # Check if the error message indicates a duplicate username violation
        if (
            'duplicate key value violates unique constraint "auth_user_username_key"'
            in str(e)
        ):
            return JsonResponse(
                {"status": "error", "message": "usernameAlreadyExist"},
                status=HTTPStatus.BAD_REQUEST,
            )
        else:
            # Handle other IntegrityError cases if needed
            return JsonResponse(
                {"status": "error", "message": str(e)}, status=HTTPStatus.BAD_REQUEST
            )
    except Exception as e:
        return JsonResponse(
            {"status": "error", "message": str(e)},
            status=HTTPStatus.BAD_REQUEST,  # Internal Server Error instead ?
        )


class RequestLogin(View):
    def get(self, request):
        url = "https://api.intra.42.fr/oauth/token"
        data = {
            "grant_type": "authorization_code",
            "client_id": "u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080",
            "client_secret": "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",
            "code": request.GET["code"],
            "redirect_uri": request.build_absolute_uri("/login/"),
        }
        response = requests.post(
            url, json=data, headers={"Content-Type": "application/json"}
        )
        return JsonResponse(response.json())


def create_rest_api_endpoint(model: Type, modelForm: Type, name: str):
    @method_decorator(csrf_exempt, name="dispatch")
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
            logger.debug("=========== POST REQUEST STARTED MF ========")
            data = json.loads(request.body)

            game1 = Game.objects.create(state="waiting", power_ups=data["power_ups"])
            game2 = Game.objects.create(state="waiting", power_ups=data["power_ups"])

            Player.objects.create(name=data["created_by"])  # a degager plus tard
            player = get_object_or_404(Player, name=data["created_by"])

            tournament = Tournament.objects.create(
                created_by=player, power_ups=data["power_ups"]
            )
            tournament.games.add(game1, game2)

            # tournamentUpdate(tournament, 'create')
            # gameUpdate(game1, 'create')
            # gameUpdate(game2, 'create')
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

            if data["action"] == "start-tournament":  # POUR COMMENCER LE TOURNOI
                player1 = Player.objects.create(name="taMere")  # A DEGAGER
                player2 = Player.objects.create(name="taSoeur")  # C'EST POUR TESTER
                player3 = Player.objects.create(name="taGrandMere")  #
                player4 = Player.objects.create(name="taCousine")  #
                players = [player1, player2, player3, player4]  #

                # players = list(tournament.players.all())
                random.shuffle(players)
                tournament.games.all()[0].players.add(players[0], players[1])
                tournament.games.all()[1].players.add(players[2], players[3])
                tournament.state = "running"
                tournament.save()

            elif (
                data["action"] == "add-player"
            ):  # A LANCER AU MOMENT OU UN JOUEUR REJOIN LE TOURNOI
                new_player = get_object_or_404(Player, name=data["name"])
                tournament.players.add(new_player)

            # A FAIRE: FONCTION POUR ENVOYER LES NOUVELLES DONNEES A TOUT LE MONDE POUR MISE A JOUR DU STATE AVEC WS
            # tournamentUpdate(tournament, 'update')
            # gameUpdate(tournament.games[0], 'update')
            # gameUpdate(tournament.games[1], 'update')
            response = tournament.serialize()
            return JsonResponse(response, status=200)

        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=404)
        except Http404:
            return JsonResponse({"errors": "Object not found"}, status=404)

    # def delete(self, request, id):code.interact(local=dict(globals(), **locals()))['name'])
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
        games = Game.objects.all()
        response = [game.serialize() for game in games]
        return JsonResponse(response, status=200)

    def post(self, request):
        try:
            data = json.loads(request.body)

            Player.objects.create(name=data["created_by"])  # a degager plus tard
            player = get_object_or_404(Player, name=data["created_by"])
            game = Game.objects.create(
                state="waiting",
                goal_objective=data["goal_objective"],
                ia=data["ia"],
                power_ups=data["power_ups"],
            )
            game.players.add(player)

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

            if data["action"] == "start-game":
                game.started_at = data["started_at"]
                game.state = "running"
                game.save()

            if data["action"] == "add-player":
                new_player = get_object_or_404(Player, name=data["name"])
                game.players.add(new_player)

                # gameUpdate(game, 'update')
                response = game.serialize()
                return JsonResponse(response, status=200)

        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=400)
        except Http404:
            return JsonResponse({"errors": "Object not found"}, status=404)
        except IntegrityError as e:
            return JsonResponse({"errors": str(e)}, status=400)


PlayerView = create_rest_api_endpoint(Player, PlayerForm, "Player")
TournamentView = create_rest_api_endpoint(Tournament, TournamentForm, "Tournament")
GameView = create_rest_api_endpoint(Game, GameForm, "Game")
