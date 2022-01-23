from django.urls import path
from apps.symbols import views
from rest_framework import routers
from django.conf.urls import url, include

router = routers.SimpleRouter()
router.register(r'symbols', views.Symbols)


urlpatterns = [
    url('^api/', include(router.urls)),
    path('', views.all_symbols, name='allsymbols'),
    path('<int:pk>', views.SymbolsUpdateView.as_view(), name='symboldetails')
    ]

