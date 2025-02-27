from django.urls import path, include
from rest_framework import routers
from . import views
from django.conf.urls.static import static
from django.conf import settings

app_name = 'feeds'


urlpatterns = [
    #path('', ),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
