from channels.generic.websocket import AsyncWebsocketConsumer
import json

class dashConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(self.scope)
        self.groupname = 'dashboard'
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
        call = data['call']
        val = data['value']
        await self.channel_layer.group_send(
            self.groupname,
            {
                'type': 'deprocessing',
                'call': call,
                'value': val
            }
        )
        print(type(text_data))
        print('>>',text_data)
        print(type(data))
        print('>>>>>', data)
        #pass
    async def deprocessing(self, event):
        valOther = event['value']
        call = event['call']
        await self.send(text_data=json.dumps({'value': valOther, 'call': call}))