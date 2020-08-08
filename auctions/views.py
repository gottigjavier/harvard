from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from decimal import Decimal
from .models import User, Auction, Bid, Comment



def index(request):
    auctions = Auction.objects.all()
    return render(request, "auctions/index.html", {
        "auctions": auctions
        })


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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

#@login_required(login_url = "http://localhost:8000/login")
def newlisting(request):
    if request.method == "POST":
        auction = Auction()
        auction.name = request.POST["name"]
        auction.category = (request.POST["category"]).lower()
        auction.description = request.POST["description"]
        auction.init_bid = Decimal(request.POST["init_bid"])
        auction.image = request.FILES["image"]
        auction.offerer = request.user
        auction.save()
    return render(request, "auctions/newlisting.html")