from django.urls import path
from apps.orders import views
from rest_framework import routers
from django.conf.urls import url, include

router = routers.SimpleRouter()
router.register(r'orders', views.Orders_asJSON)
router.register(r'order-products', views.Orders_Products_asJSON)
router.register(r'previous-products', views.Previous_Products_asJSON)
router.register(r'ordertotal', views.OrderTotalsViewSet)

urlpatterns = [
    url('^api/', include(router.urls)),
    url('^api/orders-list', views.OrderListView.as_view(), name='orders_post_list'),
    path('<int:order_id>', views.order_details, name='order_details'),
    path('<int:order_id>/details/edit/', views.order_details_edit,
         name='orderdetailsedit'),
    path('<int:order_id>/product/edit/<int:order_product_id>', views.order_product_edit,
         name='orderproductedit'),
    path('<int:order_id>/product/add/', views.order_add_product,
         name='orderproductadd'),
    path('<int:order_id>/product/delete/<int:order_product_id>', views.order_product_delete,
         name='orderproductdelete'),
    path('<int:order_id>/addresses', views.get_order_addresses,
         name='orderaddresses'),
    path('<int:order_id>/details', views.get_order_details,
         name='orderdetails'),
    path('<int:order_id>/address/billing/edit/', views.order_billing_edit,
         name='orderbillingaddressedit'),
    path('<int:order_id>/address/shipping/edit/', views.order_shipping_edit,
         name='ordershippingaddressedit'),
    path('<int:order_id>/address/billing/frombook', views.update_order_billing_from_address_book,
         name='orderbillingfrombook'),
    path('<int:order_id>/address/shipping/frombook', views.update_order_shipping_from_address_book,
         name='ordershippingfrombook'),
    path('<int:order_id>/test/', views.order_test),
    path('', views.order_list, name='allorders'),


    ]
