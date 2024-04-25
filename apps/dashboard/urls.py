from django.urls import path
from rest_framework import routers
from django.urls import include
from apps.dashboard import views

router = routers.SimpleRouter()

urlpatterns = [
    path('api/', include(router.urls)),
    path('', views.dashboard, name='dashboard')
    ]
