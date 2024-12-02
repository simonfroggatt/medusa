from django.urls import path
from apps.category import views
from rest_framework import routers
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static


router = routers.SimpleRouter()
router.register(r'category', views.Categories)
router.register(r'descriptions', views.CategoryDescriptions)
router.register(r'tostores', views.CategoryToStoreDescriptions)
router.register(r'sitepaths', views.CategoryStoreToParents)
router.register(r'storecats', views.StoreCategories)


urlpatterns = [
    path('api/', include(router.urls)),
    path('', views.all_cats, name='allcategories'),
    path('<int:pk>', views.category_details, name='categorydetails'),
    path('create', views.category_create, name='categorycreate'),
    path('<int:pk>/edit', views.CategoryEdit.as_view(), name='categorybaseedit'),
    path('<int:pk>/storeeditpk', views.CategoryStoreEdit.as_view(), name='categorystoreeditpk'),
    path('<int:pk>/storeadddlg', views.category_store_add_text_dlg, name='categorystoreadd_dlg'),
    path('<int:base_category_id>/storeparent/add_gld', views.category_store_parent_add, name='categorystoreparentadd_gld'),
    path('<int:base_category_id>/storeparent/add', views.category_store_parent_add, name='categorystoreparentadd'),
    path('<int:pk>/storecatparentdlg', views.category_store_parent_edit_dlg, name='categorystoreparent_dlg'),
    path('api/storeadd', views.category_store_add_text, name='categorystoreadd'),
    path('api/storetextdelete/<int:pk>', views.category_store_text_delete_dlg, name='categorystoredelete'),
    path('api/storeparentdelete/<int:pk>', views.category_store_parent_delete_dlg, name='categorystoreparentdelete')
  #  path('<int:pk>', views.SymbolsUpdateView.as_view(), name='symboldetails')
    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)