from django.http import JsonResponse
from django.db.utils import IntegrityError
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from urllib.parse import urlencode
from django.shortcuts import get_object_or_404
import json

import requests
import random

from .models import Player, Tournament, Game
from .forms import PlayerForm, TournamentForm, GameForm
from typing import Type

class RequestLogin(View):
    def get(self, request):
        url = 'https://api.intra.42.fr/oauth/token'
        data = {
            'grant_type': 'authorization_code',
            'client_id': 'u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080',
            'client_secret': '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',
            'code': request.GET["code"],
            'redirect_uri': 'https://localhost:8000/login/'
        }
        response = requests.post(url, json=data, headers={'Content-Type': 'application/json'})
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


#@method_decorator(csrf_exempt, name="dispatch")
class CreateTournamentView(View):
    def get(self, request):
        print("I WAS HERE")
        return JsonResponse({"message": "GET request received"})

    def post(self, request):    
        try:
            print("I WAS HERE")
            #data = json.loads(request.body)

            #game1 = Game.objects.create(state='waiting')
            #game2 = Game.objects.create(state='waiting')
            #player = get_object_or_404(Player, name=data['created_by'])

            #tournament = Tournament.objects.create(created_by=data['created_by']) 
            #tournament.games.add(game1, game2)
            #tournament.players.add(player)
            #response = tournament.serialize_summary()
            #return JsonResponse(response, status=200)
            return JsonResponse({"message": "POST request received"})


        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=404)
        except Http404:
            return JsonResponse({"errors": "Invalid data"}, status=404)
    
    #def put(self, request, id):
    #    try:
    #        data = json.loads(request.body)
    #        tournament = get_object_or_404(Tournament, id=id)
    #        
    #        if (data["use"] == "start-tournament"):
    #            players = list(tournament.players.all())
    #            random.shuffle(players)
    #            #METTRE A JOUR LES DEUX GAME AVEC LE TIRAGE AU SORT DJA EFFECTUER
#
    #        elif (data["use"] == "add-player"):
    #            new_player = get_object_or_404(Player, name=data['name'])
    #            tournament.players.add(new_player)
    #            
    #        response = tournament.serialize()
    #        return response
#
    #    except KeyError:
    #        return JsonResponse({"errors": "Invalid data"}, status=404)
    #    except Http404:
    #        return JsonResponse({"errors": "Invalid data"}, status=404)
#
    #def delete(self, request, id):
    #    try:
    #        data = json.loads(request.body)
    #        tournament = get_object_or_404(Tournament, id=id)
    #        gone_player = get_object_or_404(Player, name=data['name'])
    #        
    #        tournament.players.remove(gone_player)
    #        response = tournament.serialize()
    #        return response 
    #    
    #    except KeyError:
    #        return JsonResponse({"errors": "Invalid data"}, status=404)
    #    except Http404:
    #        return JsonResponse({"errors": "Invalid data"}, status=404)


PlayerView = create_rest_api_endpoint(Player, PlayerForm, "Player")
TournamentView = create_rest_api_endpoint(Tournament, TournamentForm, "Tournament")
GameView = create_rest_api_endpoint(Game, GameForm, "Game")