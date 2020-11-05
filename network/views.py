from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
import json

from .models import User, Posts


def index(request):
    return render(request, "network/index.html")

def posts_box(request, postsbox):
    # List all posts
    if postsbox == 'all-posts':
        all_posts = Posts.objects.all()
        all_posts = all_posts.order_by("-created").all()
        posts = [post.serialize() for post in all_posts]

        all_users = User.objects.all()
        users = ([user.serialize() for user in all_users])

        for post in posts:
            for user in users:
                if post['author'] == user['username']:
                    post['author'] = user
            post['all_authors'] = True

    # list of posts by authors i'm following
    elif postsbox == 'follow-posts':
        follow_posts = Posts.objects.filter(author__followers=request.user)
        follow_posts = follow_posts.order_by("-created").all()
        posts = ([follow_post.serialize() for follow_post in follow_posts])
        follow_users = User.objects.filter(followers=request.user)
        follow_usr = ([follow_user.serialize() for follow_user in follow_users])
        for post in posts:
            for user in follow_usr:
                if post['author'] == user['username']:
                    post['author'] = user
            post['all_authors'] = True

    # list of posts by a particular author
    else:
        author_posts = Posts.objects.filter(author__username=postsbox)
        author_posts = author_posts.order_by("-created").all()
        posts = [post.serialize() for post in author_posts]

        post_user = User.objects.get(username=postsbox)
        usr = (post_user.serialize())
        
        for post in posts:
            post['author'] = usr
            post['all_authors'] = False

    return JsonResponse( posts ,safe=False)


def profile_box(request, profilebox):
    if profilebox == 'all-profiles':
        profiles = User.objects.all()
        profiles = profiles.order_by("username").all()
        return JsonResponse([profile.serialize() for profile in profiles], safe=False)
    else:
        profile = User.objects.get(username=profilebox)
        profile = profile.serialize()
        myposts = profile['myposts']
        posts = Posts.objects.filter(pk__in=myposts)
        posts = ([post.serialize() for post in posts])
        profile['posts'] = posts
        return JsonResponse([profile], safe=False)

    

# User Manager ----------------------------------------------------
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

# ----------------------------------------------------------------