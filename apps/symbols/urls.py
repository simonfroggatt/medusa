from django.urls import path
from apps.symbols import views
from rest_framework import routers
from django.conf.urls import url, include

router = routers.SimpleRouter()
router.register(r'symbols', views.Symbols)


urlpatterns = [
    url('^api/', include(router.urls)),
    path('<int:pk>', views.SymbolsUpdateView.as_view(), name='symboldetails'),
    path('create/', views.symbol_create, name='symbolcreate'),
    path('<int:pk>/delete', views.Symboldelete.as_view(), name='symboldelete'),
    path('<int:symbol_id>/deletedlg', views.symbol_delete_dlg, name='symboldelete-dlg'),
    path('', views.all_symbols, name='allsymbols'),
    ]

