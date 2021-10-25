from django.urls import path
from .views import (
    orders_list
)

urlpatterns = [
    path('list', orders_list, name='allorders'),
    path('', orders_list, name='allorders'),
]

