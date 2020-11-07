
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("posts_box/<str:postsbox>", views.posts_box, name="posts_box"),
    path("profile_box/<str:profilebox>", views.profile_box, name="profile_box"),
    path("new_post", views.new_post, name="new_post")
]
