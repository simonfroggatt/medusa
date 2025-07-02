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
    path('<int:symbol_id>/standards', views.symbol_standards_list.as_view(), name='symbolstandardslist'),
    path('nosymbols', views.no_symbols_list, name='nosymbols'),
    path('', views.all_symbols, name='allsymbols'),

    path('standards/', views.standards_list, name='standards-list'),
    path('<int:symbol_id>/standards/add/', views.symbol_standards_list_add, name='symbol-standards-add'),
    path('<int:pk>/standards/edit/', views.symbol_standards_list_edit, name='symbol-standards-edit'),
    path('<int:pk>/standards/delete/', views.symbol_standards_list_delete, name='symbol-standards-delete'),


    path('shapes/', views.symbol_shape_list, name='shape-list'),
    path('symbol-shapes/add/', views.SymbolShapeCreateView.as_view(), name='symbol-shape-add'),
    path('symbol-shapes/<int:pk>/edit/', views.SymbolShapeUpdateView.as_view(), name='symbol-shape-edit'),
    path('symbol-shapes/<int:pk>/delete/', views.SymbolShapeDeleteView.as_view(), name='symbol-shape-delete'),

    path('purpose/', views.symbol_purpose_list, name='purpose-list'),
    path('purpose/add/', views.SymbolPurposeCreateView.as_view(), name='symbol-purpose-add'),
    path('purpose/<int:pk>/edit/', views.SymbolPurposeUpdateView.as_view(), name='symbol-purpose-edit'),
    path('purpose/<int:pk>/delete/', views.SymbolPurposeDeleteView.as_view(),name='symbol-purpose-delete'),

    path('category/', views.symbol_category_list, name='category-list'),
    path('category/add/', views.SymbolCategoryCreateView.as_view(), name='symbol-category-add'),
    path('category/<int:pk>/edit/', views.SymbolCategoryUpdateView.as_view(), name='symbol-category-edit'),
    path('category/<int:pk>/delete/', views.SymbolCategoryDeleteView.as_view(), name='symbol-category-delete'),

    path('api/symbol-shapes/', views.SymbolShapeListAPIView.as_view(), name='symbol-shape-list-api'),
    path('api/standards/', views.SymbolStandardListAPIView.as_view(), name='standards-list-api'),
    path('api/purpose/', views.SymbolPurposeListAPIView.as_view(), name='symbol-purpose-list-api'),
    path('api/category/', views.SymbolCategoryListAPIView.as_view(), name='symbol-category-list-api'),


    ]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
              + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

