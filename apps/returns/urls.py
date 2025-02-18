from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from django.urls import include
from apps.returns import views

router = routers.SimpleRouter()
router.register(r'returns', views.Returns)
router.register(r'products', views.ReturnProducts)
router.register(r'availableproducts', views.OrderReturnAvailProducts)


urlpatterns = [
    path('api/', include(router.urls)),
    path('api/returns/<int:pk>/products/', views.ReturnProducts.as_view({'get': 'list'}), name='return_products'),
    path('api/addproduct/<int:pk>/<int:product_id>', views.return_add_product, name='return_products_add_ajax'),


    path('<int:pk>', views.return_details, name='returndetails'),
    path('<int:pk>/delete', views.delete_return, name='return_delete'),


    path('<int:pk>/edit', views.return_edit, name='return_change_status'),
    path('product/<int:pk>/delete', views.delete_report_product, name='return_delete_product'),


    path('product/<int:pk>/edit', views.edit_report_product, name='return_edit_product'),
    path('<int:pk>/product/add', views.return_show_order_products, name='return_add_product'),





    path('', views.return_list, name='allreturns'),

    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)