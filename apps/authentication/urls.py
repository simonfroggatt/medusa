from django.urls import path
from apps.authentication import views

urlpatterns = [
    path('login', views.do_login, name="medusalogin"),
    path('logout', views.do_logout, name="medusalogout"),
]