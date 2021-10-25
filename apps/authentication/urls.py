from django.urls import path
from .views import (
    do_login
)

urlpatterns = [
    path('login', do_login),
]