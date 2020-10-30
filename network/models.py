from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime
from django.utils import timezone

class User(AbstractUser):
    following = models.ManyToManyField('self', blank=True, default='')
    followers = models.ManyToManyField('self', blank=True, default='')
    myposts = models.ManyToManyField('Posts', related_name='myposts', blank=True, default='')
    
    def __str__(self):
        return self.username

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "date_joined": self.date_joined.strftime("%b %-d %Y, %-I:%M %p"),
            "myposts": [myposts.id for myposts in self.myposts.all()],
            "following": [following.username for following in self.following.all()],
            "followers": [followers.username for followers in self.followers.all()]
        }         


class Posts(models.Model):
    text = models.TextField()
    author = models.ForeignKey(User,  related_name='authoruser', on_delete=models.CASCADE)
    created = models.DateTimeField(default=timezone.now)
    likes = models.ManyToManyField(User, related_name='likesuser', blank=True, default='')


    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "author": self.author.username,
            "created": self.created.strftime("%b %-d %Y, %-I:%M %p"),
            "likes": [likes.username for likes in self.likes.all()]
        } 
