from django.urls import path, include
from rest_framework import routers
from . import views

app_name = 'feeds'

router = routers.SimpleRouter()
router.register(r'google-merchant', views.GoogleMerchantViewSet, basename='google-merchant')

urlpatterns = [
    path('api/', include(router.urls)),
]
