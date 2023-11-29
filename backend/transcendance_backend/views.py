from django.http import JsonResponse
from django.db.utils import IntegrityError
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json

from .models import Player, Tournament, Game
from .forms import PlayerForm, TournamentForm, GameForm
from typing import Type

class RequestLogin(View):
    def get(self, request):
        return JsonResponse({"yolo": request.GET["code"]})

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
