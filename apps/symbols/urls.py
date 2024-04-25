from django.urls import path
from apps.symbols import views
from rest_framework import routers
from django.urls import include

router = routers.SimpleRouter()
router.register(r'symbols', views.Symbols)


urlpatterns = [
    path('api/', include(router.urls)),
    #path('api/symbols/', views.Symbols.as_view(), name='list_all_symbols'),
    path('<int:pk>', views.SymbolsUpdateView.as_view(), name='symboldetails'),
    #path('create/', views.symbol_create, name='symbolcreate'),
    path('create/', views.SymbolCreateView.as_view(), name='symbolcreate'),
    path('<int:pk>/delete', views.Symboldelete.as_view(), name='symboldelete'),
    path('<int:symbol_id>/deletedlg', views.symbol_delete_dlg, name='symboldelete-dlg'),
    path('', views.all_symbols, name='allsymbols'),
    ]

