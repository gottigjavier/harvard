from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("rooms", views.rooms, name="rooms"),
    path("load", views.load, name="load"),
    path("edit_task", views.edit_task, name="edit_task"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
]