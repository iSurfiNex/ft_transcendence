from django.core.asgi import get_asgi_application
from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync
from .models import Player, Tournament, Game
from .forms import PlayerForm, TournamentForm, GameForm
import logging

logger = logging.getLogger(__name__)

def tournamentUpdate(tournament, action):
    logger.debug("=========== Tournament update START ==========================================================")
    data = {
        'type': 'send.update',
        'game-mode': 'tournament',
        'action': action,
        'data': tournament.serialize(),
    }
    
    channel_layer = get_channel_layer()
    #logger.debug(channel_layer)
    channel_layer.group_send("state-update", data)
    logger.debug("=========== Tournament update END ==========================================================")



async def gameUpdate(game, acton):
    data = {
        'type': 'send.update',
        'game-mode': 'game',
        'action': action,
        'data': game.serialize(),
    }

    channel_layer = get_channel_layer()
    await channel_layer.group_send("state-update", data)