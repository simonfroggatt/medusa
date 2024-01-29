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
    path('<int:pk>/update', views.SupplierUpdate.as_view(), name='supplier_update'),
    path('new', views.SupplierCreate.as_view(), name='supplier_create'),
   # path('<int:pk>/delete', views.SiteDelete.as_view(), name='supplier_delete'),
    path('', views.all_suppliers, name='allsuppliers')
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
