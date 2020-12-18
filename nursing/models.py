from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime
from django.utils import timezone

class User(AbstractUser):
    image = models.ImageField(null=True, blank=True)
    
    def __str__(self):
        return self.username

    def serialize(self):
        if (self.image):
            return {
                "id": self.id,
                "username": self.username,
                "image": self.image.url,
                "date_joined": self.date_joined.strftime("%b %-d %Y, %-I:%M %p"),
                } 
        else:
            return {
                "id": self.id,
                "username": self.username,
                "date_joined": self.date_joined.strftime("%b %-d %Y, %-I:%M %p"),
                }         

