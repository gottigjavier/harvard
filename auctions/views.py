from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from decimal import Decimal
from .models import User, Auction, Bid, Comment


def commoncategories(auctions):
    auctions = auctions
    categories = []
    for auction in auctions:
        if auction.category in categories:
            continue
        else:
            categories.append(auction.category)
    categories.sort()
    return categories

def commonbids(auctions):
    auctions = auctions
    bids = Bid.objects.all()
    auctions_bids = {}
    for auction in auctions:
        bids_for_auction = []
        for bid in bids:
            if bid.for_auction_id == auction.id:
                bids_for_auction.append(bid)
        if bids_for_auction:
            auctions_bids.update({auction.id : bids_for_auction[len(bids_for_auction) - 1]})
    return auctions_bids

def actualbid(auction):
    bids = Bid.objects.filter(for_auction=auction.id)
    if bids:
        bid = bids[len(bids) - 1].bid
        who_bid = bids[len(bids) - 1].who_bid
    else:
        bid = 0
        who_bid = 'none__$&$&$&$@@&&never--$$$$$$$4nobody__ever$$$$$$@@@@@@@@@@&&&&&&&&&'
    return bid, who_bid

def index(request):
    auctions = Auction.objects.filter(is_open='True')
    categories = commoncategories(auctions)
    auctions_bids = commonbids(auctions)
    message = 'Active Listings'
    message1 = 'No active Listings'
    return render(request, "auctions/index.html", {
        "auctions": auctions,
        "auctions_bids": auctions_bids,
        "categories": categories,
        "message": message,
        "message1": message1
        })

@login_required(login_url = "http://localhost:8000/login")
def listall(request):
    auctions = Auction.objects.all()
    categories = commoncategories(auctions)
    auctions_bids = commonbids(auctions)
    message = 'All Listings'
    return render(request, "auctions/index.html", {
        "auctions": auctions,
        "auctions_bids": auctions_bids,
        "categories": categories,
        "message": message
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
def allcategories(request):
    auctions = Auction.objects.all()
    categories = commoncategories(auctions)
    return render(request, "auctions/allcategories.html", {
        "categories": categories
        })


#@login_required(login_url = "http://localhost:8000/login")
def categories(request, category):
    active_auctions = Auction.objects.filter(is_open=True)
    categories = commoncategories(active_auctions)
    auctions = Auction.objects.filter(category=category, is_open=True)
    auctions_bids = commonbids(auctions)
    message1 = 'No Active Listings for this Category'
    return render(request, "auctions/index.html", {
        'message': category.capitalize(),
        "auctions": auctions,
        "auctions_bids": auctions_bids,
        "categories": categories,
        "message1": message1
        })


@login_required(login_url = "http://localhost:8000/login")
def following(request):
    all_auctions = Auction.objects.all()
    categories = commoncategories(all_auctions)
    follower = request.user
    auctions = Auction.objects.filter(follower=follower.id)
    auctions_bids = commonbids(auctions)
    message = 'Watchlist'
    message1 = 'No Listings for this Watchlist'
    return render(request, "auctions/index.html", {
        "auctions": auctions,
        "auctions_bids": auctions_bids,
        "categories": categories,
        "message": message,
        "message1": message1
        })


@login_required(login_url = "http://localhost:8000/login")
def closedauctions(request):
    auctions = Auction.objects.all()
    closauctions = Auction.objects.filter(is_open=False)
    categories = commoncategories(auctions)
    auctions_bids = commonbids(closauctions)
    if closauctions:
        message = "Closed Listings"
        return render(request, "auctions/index.html", {
            "auctions": closauctions,
            "auctions_bids": auctions_bids,
            "categories": categories,
            'message': message
            })
    else:
        message1 = "No Listing Closed"
        return render(request, "auctions/error.html", {
            'message1': message1
            })

def auction(request, id):
    eauction = Auction.objects.filter(id=id).exists()
    if eauction:
        auction = Auction.objects.get(id=id)
        followers = auction.follower.all()
        follow = False
        message = ''
        for follower in followers:
            if follower == request.user:
                follow = True
        if request.method == "POST":
            bids = Bid.objects.filter(for_auction=id)
            nbid = Bid()
            new = request.POST['nbid']
            try:
                nbid.bid = Decimal(new)
            except:
                nbid.bid = 0
            if nbid.bid < auction.init_bid and not bids:
                message = 'Your bid must equal or greater than base bid'
            else:
                if bids and nbid.bid <= bids[len(bids) - 1].bid:
                    message = 'Your bid must greater than last bid'
                else:
                    nbid.who_bid = request.user
                    nbid.for_auction = auction
                    nbid.save()
                    auction.follower.add(request.user)   
                    follow = True     
        bid, who_bid = actualbid(auction)                    
        comments = Comment.objects.filter(for_auction=id)
        return render(request, 'auctions/auction.html', {
            'auction': auction,
            'who_bid': who_bid,
            'bid': bid,
            'message': message,
            'follow': follow,
            'comments': comments
        })
    else:
        message1 = 'The listing does not exist'
        return render(request, 'auctions/error.html', {
            'message1': message1
        })


def error(request):
    return render(request, 'auctions/error.html')


@login_required(login_url = "http://localhost:8000/login")
def followadd(request):
    follower = request.user
    f_id = request.GET['followes']
    auction = Auction.objects.get(id=f_id)
    auction.follower.add(follower)
    return HttpResponseRedirect(reverse("auction", args=[f_id]))

@login_required(login_url = "http://localhost:8000/login")
def followremove(request):
    follower = request.user
    f_id = request.GET['followrem']
    auction = Auction.objects.get(id=f_id)
    auction.follower.remove(follower)
    return HttpResponseRedirect(reverse("auction", args=[f_id]))


@login_required(login_url = "http://localhost:8000/login")
def close(request):
    status_id = request.GET['close']
    auction = Auction.objects.get(id=status_id)
    auction.is_open = False
    auction.save()
    return HttpResponseRedirect(reverse("auction", args=[status_id]))


@login_required(login_url = "http://localhost:8000/login")
def delivered(request):
    status_id = request.GET['delivered']
    auction = Auction.objects.get(id=status_id)
    auction.delivered = True
    auction.save()
    return HttpResponseRedirect(reverse("auction", args=[status_id]))


@login_required(login_url = "http://localhost:8000/login")
def deleted(request):
    status_id = request.GET['del']
    auction = Auction.objects.get(id=status_id)
    auction.delete()
    message1 = 'The listing was successfully deleted'
    return render(request, 'auctions/error.html', {
        'message1': message1
    })


@login_required(login_url = "http://localhost:8000/login")
def newcomment(request):
    if request.method == "POST":
        n_id = request.POST['new']
        comm = Comment()
        auction = Auction.objects.get(id=n_id)
        print(auction.id)
        comm.comment = request.POST['newcommen']
        if comm.comment != '':
            comm.for_auction = auction
            comm.who_comment = request.user
            comm.save()
        else:
            pass
        return HttpResponseRedirect(reverse("auction", args=[n_id]))


@login_required(login_url = "http://localhost:8000/login")
def newauction(request):
    if request.method == "POST":
        auction = Auction()
        auction.name = request.POST["name"]
        auction.category = (request.POST["category"]).lower()
        if auction.category == '':
            auction.category = 'uncategorized'
        auction.description = request.POST["description"]
        auction.init_bid = Decimal(request.POST["init_bid"])
        auction.image = request.FILES["image"]
        auction.offerer = request.user
        auction.save()
        auction.follower.add(request.user)
    return render(request, "auctions/newauction.html")
