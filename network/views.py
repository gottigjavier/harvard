from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
import datetime

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
            post['section'] = postsbox

    # list of posts by authors i'm following
    elif postsbox == 'follow-posts':
        if Posts.objects.filter(author__followers=request.user).exists():
            follow_posts = Posts.objects.filter(author__followers=request.user)
            follow_posts = follow_posts.order_by("-created").all()
            posts = ([follow_post.serialize() for follow_post in follow_posts])
            follow_users = User.objects.filter(followers=request.user)
            follow_usr = ([follow_user.serialize() for follow_user in follow_users])
            for post in posts:
                for user in follow_usr:
                    if post['author'] == user['username']:
                        post['author'] = user
                post['section'] = postsbox
        else:
            post = Posts(id=0, text='', created=datetime.datetime.now(), author=request.user)
            posts = post.serialize()
            print(posts)

    # list of posts by a particular author
    else:
        author_posts = Posts.objects.filter(author__username=postsbox)
        author_posts = author_posts.order_by("-created").all()
        posts = [post.serialize() for post in author_posts]

        post_user = User.objects.get(username=postsbox)
        usr = (post_user.serialize())
        
        for post in posts:
            post['author'] = usr
            post['section'] = usr['username']

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
        posts = Posts.objects.filter(author__username=profilebox)
        posts = ([post.serialize() for post in posts])
        profile['posts'] = posts
        return JsonResponse([profile], safe=False)

@csrf_exempt
@login_required
def new_post(request):
    if request.method == "POST":
        user = User.objects.get(username=request.user)
        data = json.loads(request.body)
        text_data = data['body']
        new_post = Posts(
            author=user,
            text=text_data)
        new_post.save()    
        last_post = Posts.objects.last()
        last_post_id = last_post.id
        serial_user = user.serialize()
        serial_user['myposts'].append(last_post_id)
        user.myposts.set(serial_user['myposts'])
        return JsonResponse({"message": "Post sent successfully."}, status=201)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

@csrf_exempt
@login_required
def edit_post(request):
    if request.method == "PUT":
        current_user = User.objects.get(username=request.user)
        data = json.loads(request.body)
        post_text = data['upBody']
        post_id = data['postid']
        post = Posts.objects.get(id=post_id)
        if current_user.username == post.author.username:
            post.text = post_text
            post.save()
            return JsonResponse({"message": "Post updated successfully."}, status=201)
        else:
            return JsonResponse({"error": "Invalid user try modify a post."}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)


@csrf_exempt
@login_required
def delete_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        data_id = data['post_id']
        post = Posts.objects.get(pk=data_id)
        post.delete()
        return JsonResponse({"message": "Post deleted successfully."}, status=201)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)




@csrf_exempt
@login_required
def like_post(request):
    if request.method == "PUT":
        user_id = request.user.id
        data = json.loads(request.body)
        post_id = data['post_id']
        post = Posts.objects.get(id=post_id)

        post_serial = post.serialize()
        post_likes = post_serial['likes']
        if user_id not in post_likes:
            post_likes.append(user_id)
            post.likes.set(post_likes)
        else:
            post_likes.remove(user_id)
            post.likes.set(post_likes)
    return JsonResponse({"message": "Like proceced."}, status=201)


@csrf_exempt
@login_required
def follow_author(request):
    if request.method == "PUT":
        user_id = request.user.id
        data = json.loads(request.body)
        author_id = data['author_id']
        author_follow = User.objects.get(id=author_id)

        author_serial = author_follow.serialize()
        author_serial_followers = author_serial['followers']
        print(author_serial_followers)
        if user_id not in author_serial_followers:
            author_serial_followers.append(user_id)
            author_follow.followers.set(author_serial_followers)
        else:
            author_serial_followers.remove(user_id)
            author_follow.followers.set(author_serial_followers)
        print(author_serial_followers)
    return JsonResponse({"message": "Follow proceced."}, status=201)



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