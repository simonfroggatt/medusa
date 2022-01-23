from django.urls import path
from apps.category import views
from rest_framework import routers
from django.conf.urls import url, include

router = routers.SimpleRouter()
router.register(r'category', views.Categories)


urlpatterns = [
    url('^api/', include(router.urls)),
    path('', views.all_cats, name='allcategories'),
  #  path('<int:pk>', views.SymbolsUpdateView.as_view(), name='symboldetails')
    ]