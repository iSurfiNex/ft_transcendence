from django.core.asgi import get_asgi_application
from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)


def stateUpdate(dataToSend, action, dataType):
    theData = dataToSend.serialize()
    theData['action'] = action
    theData['data_type'] = dataType
    data = {
        'type': 'send.update',
        'data': theData,
    }
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)("state-update", data)

#def stateUpdateAll(dataTosend, dataType)
#{
#    serializedObj = [obj.serialize() for obj in dataToSend]
#    theData = {
#        'objects': serializedObj,
#        'data_type': dataType,
#    }
#    data = {
#        'type': 'send.update',
#        'data': theData,
#    }
#    channel_layer = get_channel_layer()
#    async_to_sync(channel_layer.group_send)("state-update", data)
#}   