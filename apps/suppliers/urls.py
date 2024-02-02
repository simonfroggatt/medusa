from django.urls import path
from django.conf import settings
from rest_framework import routers
from django.urls import include
from apps.suppliers import views
from django.conf.urls.static import static

router = routers.SimpleRouter()
router.register(r'suppliers', views.Suppliers)

urlpatterns = [
    path('api/', include(router.urls)),
    path('<int:pk>', views.supplier_details, name='supplier_details'),
    path('<int:pk>/update', views.supplier_update, name='supplier_update'),
    path('new', views.supplier_create, name='supplier_create'),
    
    path('document/upload', views.supplier_document_upload, name='supplier_document-upload'),
    path('<int:supplier_id>/document/fetch', views.supplier_document_fetch, name='fetch_supplier_documents'),
    path('document/<pk>/download', views.supplier_document_download, name='supplier_document-download'),
    path('document/<pk>/delete', views.supplier_document_delete, name='supplier_document-delete'),
    
    
   # path('<int:pk>/delete', views.SiteDelete.as_view(), name='supplier_delete'),
    path('', views.all_suppliers, name='allsuppliers')
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
