from django.http import JsonResponse
from django.db.utils import IntegrityError
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json

from .models import Player
from .forms import PlayerForm


@method_decorator(csrf_exempt, name="dispatch")
class PlayerView(View):
    def get(self, request, id=None):
        try:
            if id:
                player = Player.objects.get(id=id)
                response = player.serialize()
                return JsonResponse(response, safe=False)
            else:
                players = Player.objects.all()
                response = [player.serialize() for player in players]
                return JsonResponse(response, safe=False)
        except Player.DoesNotExist:
            return JsonResponse({"errors": "Player not found"}, status=404)

    def post(self, request):
        try:
            data = json.loads(request.body)
            form = PlayerForm(data)
            if not form.is_valid():
                return JsonResponse({"errors": form.errors})
            new_player = Player(**form.cleaned_data)
            new_player.save()
            created_player = Player.objects.get(id=new_player.id)
            return JsonResponse(created_player.serialize(), status=201, safe=False)
        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=400)
        except IntegrityError as e:
            return JsonResponse({"errors": str(e)}, status=400)
        except json.JSONDecodeError as e:
            return JsonResponse({"errors": str(e)}, status=400)

    def put(self, request, id):
        try:
            player = Player.objects.get(id=id)
            put_data = json.loads(request.body)
            # Merge the current player attribute with the put data
            updated_player_data = player.__dict__ | put_data
            # By giving the instance, we prevent running into "already exist" validation error
            form = PlayerForm(updated_player_data, instance=player)
            if not form.is_valid():
                return JsonResponse({"errors": form.errors})
            for key, value in form.cleaned_data.items():
                setattr(player, key, value)
            player.save()
            updated_player = Player.objects.get(id=player.id)
            return JsonResponse(updated_player.serialize(), status=200)
        except Player.DoesNotExist:
            return JsonResponse({"errors": "Player not found"}, status=404)
        except IntegrityError as e:
            return JsonResponse({"errors": str(e)}, status=400)
        except KeyError:
            return JsonResponse({"errors": "Invalid data"}, status=400)
        except json.JSONDecodeError as e:
            return JsonResponse({"errors": str(e)}, status=400)

    def delete(self, request, id):
        try:
            player = Player.objects.get(id=id)
            player.delete()
            return JsonResponse({}, status=204)
        except Player.DoesNotExist:
            return JsonResponse({"errors": "Player not found"}, status=404)
