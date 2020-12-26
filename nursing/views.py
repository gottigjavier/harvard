from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.db import IntegrityError
from .models import User, Bed, MedicalRecord, Patient, Call, ProgramedTask

# Create your views here.
@login_required
def index(request):
    return render(request, 'index.html')

def load(request):
    beds = Bed.objects.filter(ocuped=True)
    tasks = ProgramedTask.objects.filter(state=True)
    calls = Call.objects.filter(state=True)
    if beds:
        serialized_beds = [bed.serialize() for bed in beds]
        #for bed in serialized_beds:
        #    print(bed)
    if tasks:
        serialized_tasks = [task.serialize() for task in tasks]
    #print(serialized_tasks)
    if calls:
        serialized_calls = [call.serialize() for call in calls]
    #print(serialized_calls)
    rooms_state ={
        'beds': serialized_beds,
        'calls': serialized_calls,
        'tasks': serialized_tasks
        }
    print(rooms_state)
    return JsonResponse([rooms_state], safe=False)


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
            return render(request, "login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

@login_required
def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.image = request.FILES.get("image", "useravatar.png")
            user.save()
        except IntegrityError:
            return render(request, "register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("logout"))
    else:
        return render(request, "register.html")

# ----------------------------------------------------------------

# Simulates creating and deleting calls 
def rooms(request):
    return render(request, 'rooms.html')
