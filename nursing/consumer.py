from channels.generic.websocket import AsyncWebsocketConsumer
import json

class callConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        #print(self.scope)
        self.groupname = 'callsboard'
        await self.channel_layer.group_add(
            self.groupname,
            self.channel_name,
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.groupname,
            self.channel_name,
        )
        pass
        #await self.disconnect()

    async def receive(self, text_data):
        data = json.loads(text_data)
        state = data['state']
        source = data['source']
        await self.channel_layer.group_send(
            self.groupname,
            {
                'type': 'deprocessing',
                'state': state,
                'source': source
            }
        )

    async def deprocessing(self, event):
        source = event['source']
        state = event['state']
        await self.send(text_data=json.dumps({'source': source, 'state': state}))


class taskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        #print(self.scope)
        self.groupname = 'tasksboard'
        await self.channel_layer.group_add(
            self.groupname,
            self.channel_name,
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.groupname,
            self.channel_name,
        )
        pass
        #await self.disconnect()

    async def receive(self, text_data):
        data = json.loads(text_data)
        state = data['state']
        source = data['source']
        await self.channel_layer.group_send(
            self.groupname,
            {
                'type': 'deprocessing',
                'state': state,
                'source': source
            }
        )

    async def deprocessing(self, event):
        source = event['source']
        state = event['state']
        await self.send(text_data=json.dumps({'source': source, 'state': state}))