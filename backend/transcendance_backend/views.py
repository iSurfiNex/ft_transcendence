from django.http import JsonResponse
from django.db.utils import IntegrityError
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_POST
from urllib.parse import urlencode
from django.contrib.auth import authenticate, login
import json

import requests

from .models import Player, Tournament, Game
from .forms import PlayerForm, TournamentForm, GameForm
from typing import Type

from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm


@csrf_exempt  # Use csrf_exempt for simplicity in this example. In a real-world scenario, handle CSRF properly.
@require_POST  # Ensure that the view only responds to POST requests
def login_user(request):
    # Extract user registration data from the POST request
    username = request.POST.get("username")
    password = request.POST.get("password")
    user = authenticate(request, username=username, password=password)
    if user is not None:
        # Log in the authenticated user
        login(request, user)
        return JsonResponse({"status": "success"})
    else:
        return JsonResponse({"status": "error", "message": "invalidLoginCredentials"})


@csrf_exempt  # Use csrf_exempt for simplicity in this example. In a real-world scenario, handle CSRF properly.
@require_POST  # Ensure that the view only responds to POST requests
def register_user(request):
    # Extract user registration data from the POST request
    username = request.POST.get("username")
    password = request.POST.get("password")
    email = request.POST.get("email")
    form = UserCreationForm(request.POST)
    if not form.is_valid():
        return JsonResponse({"errors": form.errors})

    try:
        # Create a new user using create_user method
        user = User.objects.create_user(
            username=username, password=password, email=email
        )
        return JsonResponse({"status": "success"})
    except IntegrityError as e:
        # Check if the error message indicates a duplicate username violation
        if (
            'duplicate key value violates unique constraint "auth_user_username_key"'
            in str(e)
        ):
            return JsonResponse({"status": "error", "message": "usernameAlreadyExist"})
        else:
            # Handle other IntegrityError cases if needed
            return JsonResponse({"status": "error", "message": str(e)})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})


class RequestLogin(View):
    def get(self, request):
        url = "https://api.intra.42.fr/oauth/token"
        data = {
            "grant_type": "authorization_code",
            "client_id": "u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080",
            "client_secret": "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",
            "code": request.GET["code"],
            "redirect_uri": "https://localhost:8000/login/",
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
                    return JsonResponse(response, status=200)
                else:
                    players = model.objects.all()
                    response = [player.serialize() for player in players]
                    return JsonResponse(response, safe=False, status=200)
            except model.DoesNotExist:
                return JsonResponse({"errors": f"{name} not found"}, status=404)

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
                return JsonResponse({"errors": "Invalid data"}, status=400)
            except IntegrityError as e:
                return JsonResponse({"errors": str(e)}, status=400)
            except json.JSONDecodeError as e:
                return JsonResponse({"errors": str(e)}, status=400)

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
                        return JsonResponse(response, status=200)
                except model.DoesNotExist:
                    return JsonResponse({"errors": f"{name} not found"}, status=404)
                except IntegrityError as e:
                    return JsonResponse({"errors": str(e)}, status=400)
                except KeyError:
                    return JsonResponse({"errors": "Invalid data"}, status=400)
                except json.JSONDecodeError as e:
                    return JsonResponse({"errors": str(e)}, status=400)

                def delete(self, request, id):
                    try:
                        player = model.objects.get(id=id)
                        player.delete()
                        return JsonResponse({}, status=204)
                    except model.DoesNotExist:
                        return JsonResponse({"errors": f"{name} not found"}, status=404)

    return EndpointView


PlayerView = create_rest_api_endpoint(Player, PlayerForm, "Player")
TournamentView = create_rest_api_endpoint(Tournament, TournamentForm, "Tournament")
GameView = create_rest_api_endpoint(Game, GameForm, "Game")

# import threading
# import time
# import asyncio
# import websockets
#
#
# async def echo(websocket, path):
#    async for message in websocket:
#        print(f"Received message: {message}")
#        await websocket.send(f"Echo: {message}")
#
#
## Start the WebSocket server
# start_server = websockets.serve(echo, "localhost", 8765)
#
## Run the server indefinitely
# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()
#
# users = set()
#
#
# def game_thread_fn():
#    for _ in range(5):
#        print("Thread is running...")
#        time.sleep(1)

import logging

logger = logging.getLogger(__name__)

from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.user = self.scope["user"]

        print(
            "=================WS CONNECT============",
            "USER: ",
            self.channel_name,
            self.user.username,
        )
        self.accept()

    def disconnect(self, close_code):
        print("=================WS DISCONNECT============")
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        # if not message.to or not message.content:
        #    print("==> Chat websocket: Malformed message received")

        print("=================WS RECEIVE============", message)
        # self.send(text_data=json.dumps({"message": message}))


def start_game(arg):
    logger.debug("Debug message")
    print("=================starting============")
    return JsonResponse({"hello": "world"}, status=200)
    # class StartGame(View):
    #    def get(self, id=None):
    #        print("=================starting============")
    #        return JsonResponse({"hello": "world"}, status=200)

    # return StartGame

    # game_thread = threading.Thread(target=game_thread_fn)
    # game_thread.start()
