from django.contrib import admin

# Register your models here.

from .models import User, Auction, Bid, Comment

admin.site.register(User)
admin.site.register(Auction)
admin.site.register(Bid)
admin.site.register(Comment)
