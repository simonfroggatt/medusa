from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from rest_framework import routers
from django.urls import include
from apps.purchases import views

router = routers.SimpleRouter()
router.register(r'purchases', views.Purchases)

urlpatterns = [
    path('api/', include(router.urls)),

    #base
    path('', views.open_purchases, name='open_purchases'),
    path('', views.sent_purchases, name='sent_purchases'),

    ]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
              + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)