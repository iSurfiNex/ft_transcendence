from django.http import JsonResponse
from django.views import View
from .models import Player
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json


@method_decorator(csrf_exempt, name="dispatch")
class PlayerView(View):
    def get(self, request, id=None):
        try:
            if id:
                player = Player.objects.get(id=id)
                data = {
                    "id": player.id,
                    "name": player.name,
                    "xp": player.xp,
                }
                return JsonResponse(data)
            else:
                players = Player.objects.all()
                data = [
                    {"id": player.id, "name": player.name, "xp": player.xp}
                    for player in players
                ]
                return JsonResponse(data, safe=False)
        except Player.DoesNotExist:
            return JsonResponse({"error": "Player not found"}, status=404)

    def post(self, request):
        try:
            data = json.loads(request.body)
            name = data["name"]
            xp = data["xp"]
            player = Player.objects.create(name=name, xp=xp)
            return JsonResponse(
                {"id": player.id, "name": player.name, "xp": player.xp}, status=201
            )
        except KeyError:
            return JsonResponse({"error": "Invalid data"}, status=400)
        except json.JSONDecodeError as e:
            return JsonResponse({"error": str(e)}, status=400)

    def put(self, request, id):
        try:
            player = Player.objects.get(id=id)
            data = json.loads(request.body)
            if "name" in data:
                player.name = data["name"]
            if "xp" in data:
                player.xp = data["xp"]
            player.save()
            return JsonResponse({"id": player.id, "name": player.name, "xp": player.xp})
        except Player.DoesNotExist:
            return JsonResponse({"error": "Player not found"}, status=404)
        except KeyError:
            return JsonResponse({"error": "Invalid data"}, status=400)
        except json.JSONDecodeError as e:
            return JsonResponse({"error": str(e)}, status=400)

    def delete(self, request, id):
        try:
            player = Player.objects.get(id=id)
            player.delete()
            return JsonResponse({}, status=204)
        except Player.DoesNotExist:
            return JsonResponse({"error": "Player not found"}, status=404)
