from django.db import router
from django.urls import path, include
from imgs import views

urlpatterns = [
    path('imgs',views.ImageSimilariView.as_view()),
]