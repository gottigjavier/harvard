from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("create", views.create, name="create"),
    path("edit", views.edit, name="edit"),
    path("edited", views.edited, name="edited"),
    path("error", views.error, name="error"),
    path("search", views.search, name="search"),
    path("rand", views.rand, name="rand"),
    path("<str:title>", views.entry, name="entry")
]
