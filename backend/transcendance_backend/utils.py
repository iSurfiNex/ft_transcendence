from django.core.asgi import get_asgi_application
from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)


def stateUpdate(dataToSend, action, dataType):
    content = dataToSend.serialize()
    content['action'] = action
    content['data_type'] = dataType
    data = {
        'type': 'send.update',
        'data': content,
    }
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)("state-update", data)


def stateUpdateAll(dataTosend, dataType):
    content = {
        'objects': dataToSend.serialize_all(),
        'data_type': dataType,
    }
    data = {
        'type': 'send.update',
        'data': content,
    }
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)("state-update", data)
