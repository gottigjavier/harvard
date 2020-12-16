from channels.generic.websocket import AsyncWebsocketConsumer
import json

class dashConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        await self.disconnect()

    async def recive(self, text_data):
        print('>>>>>', text_data)
        pass