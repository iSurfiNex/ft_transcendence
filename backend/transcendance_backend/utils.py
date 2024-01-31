from django.core.asgi import get_asgi_application
from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync
from .models import Player, Tournament, Game
from .forms import PlayerForm, TournamentForm, GameForm
import logging

logger = logging.getLogger(__name__)


def stateUpdate(dataToSend, action, dataType):
    logger.debug("=========== State update START ==========================================================")
    #dataToSend.append({'data_type': dataType, 'action': action})
    dataTo = dataToSend.serialize()
    dataTo['action'] = action
    dataTo['data_type'] = dataType
    data = {
        'type': 'send.update',
        #'data_type': dataType,
        #'action': action,
        'data': dataTo,
    }
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)("state-update", data)
    logger.debug("=========== Stade update END ==========================================================")


#def tournamentUpdate(tournament, action):
#    logger.debug("=========== Tournament update START ==========================================================")
#    data = {
#        'type': 'send.update',
#        'data-type': 'tournament',
#        'action': action,
#        'data': tournament.serialize(),
#    }
#    
#    channel_layer = get_channel_layer()
#    #logger.debug(channel_layer)
#    async_to_sync(channel_layer.group_send("state-update", data))
#    logger.debug("=========== Tournament update END ==========================================================")



#def gameUpdate(game, action):
#    data = {
#        'type': 'send.update',
#        'data-type': 'game',
#        'action': action,
#        'data': game.serialize(),
#    }
#
#    channel_layer = get_channel_layer()
#    async_to_sync(channel_layer.group_send("state-update", data))
#
#def updateUser(user, action):
#    data = {
#        'type': 'send.update',
#        'data-type': 'user',
#        'action': action,
#        'data': user.serialize(),
#    }
#
#    channel_layer = get_channel_layer()
#    async_to_sync(channel_layer.group_send("state-update", data))
