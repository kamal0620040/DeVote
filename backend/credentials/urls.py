from django.urls import path
from credentials import views

urlpatterns = [
    path('<str:pk>',views.CredentialRetrieve.as_view()),
    path('create/private',views.CredentialCreate.as_view()),
]