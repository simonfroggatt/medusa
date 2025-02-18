from django.urls import path
from apps.symbols import views
from rest_framework import routers
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static

router = routers.SimpleRouter()
router.register(r'symbols', views.Symbols)
router.register(r'productnosymbol', views.ProductWithMissingSymbols)

urlpatterns = [
    path('api/', include(router.urls)),
    #path('api/symbols/', views.Symbols.as_view(), name='list_all_symbols'),
    path('<int:pk>', views.SymbolsUpdateView.as_view(), name='symboldetails'),
    #path('create/', views.symbol_create, name='symbolcreate'),
    path('create/', views.SymbolCreateView.as_view(), name='symbolcreate'),
    path('<int:pk>/delete', views.Symboldelete.as_view(), name='symboldelete'),
    path('<int:symbol_id>/deletedlg', views.symbol_delete_dlg, name='symboldelete-dlg'),
    path('nosymbols', views.no_symbols_list, name='nosymbols'),
    path('', views.all_symbols, name='allsymbols'),
    ]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
              + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

