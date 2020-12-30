from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.db import IntegrityError
from .models import User, Bed, MedicalRecord, Patient, Call, Task

# Create your views here.
@login_required
def index(request):
    return render(request, 'index.html')

def load(request):
    beds = Bed.objects.filter(ocuped=True)
    patients = Patient.objects.all()
    tasks = Task.objects.filter(state=True)
    calls = Call.objects.filter(state=True)
    beds_list =[]
    if beds:
        for bed in beds:
            bed_id = bed.id_bed
            patient = bed.bed_patient.name
            image = bed.bed_patient.image.name
            ocuped = bed.ocuped
            diagnosis = bed.bed_patient.short_diagnosis
            bed_dict = {
                'bed_id': bed_id,
                'patient': patient,
                'image': image,
                'ocuped': ocuped,
                'diagnosis': diagnosis
            }
            beds_list.append(bed_dict)
    if patients:
        serialized_patients = [patient.serialize() for patient in patients]
    else:
        serialized_patients = []
    if tasks:
        serialized_tasks = [task.serialize() for task in tasks]
    else:
        serialized_tasks = []
    if calls:
        serialized_calls = [call.serialize() for call in calls]
    else:
        serialized_calls = []
    rooms_state ={
        'beds': beds_list,
        'patients': serialized_patients,
        'calls': serialized_calls,
        'tasks': serialized_tasks
        }
    return JsonResponse(rooms_state, safe=False)


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
