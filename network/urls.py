
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("all_posts", views.all_posts, name="all_posts"),
    path("all_profiles", views.all_profiles, name="all_profiles")
]
