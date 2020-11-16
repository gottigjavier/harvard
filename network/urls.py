
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("posts_box/<str:postsbox>", views.posts_box, name="posts_box"),
    path("profile_box/<str:profilebox>", views.profile_box, name="profile_box"),
    path("new_post", views.new_post, name="new_post"),
    path("edit_post", views.edit_post, name="edit_post"),
    path("like_post", views.like_post, name="like_post"),
    path("follow_author", views.follow_author, name="follow_author")
]
