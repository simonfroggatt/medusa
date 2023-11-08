from django.urls import path
from apps.orders import views
from rest_framework import routers
from django.conf.urls import url, include

router = routers.SimpleRouter()
router.register(r'orders', views.Orders_asJSON)
#router.register(r'orders', views.Orders2)
router.register(r'order-products', views.Orders_Products_asJSON)
router.register(r'company', views.Orders_Company)
router.register(r'customer', views.Orders_Customer)
router.register(r'previous-products', views.Previous_Products_asJSON)
router.register(r'flags', views.Order_Flags_asJSON)
router.register(r'ordertotal', views.OrderTotalsViewSet)
router.register(r'order-list-company', views.Orders_Company)
router.register(r'shippingsearch', views.OrderShippingAddressList)



urlpatterns = [
    url('^api/', include(router.urls)),
    url('^api/orders-list', views.OrderListView.as_view(), name='orders_post_list'),

    path('api/orders/delete', views.order_delete, name='api_ordersdelete'),
    path('api/orders/duplicate', views.order_duplicate, name='api_ordersduplicate'),
    path('api/orders/product_text', views.get_order_product_text, name='api_orders_product_text'),

    path('<int:order_id>', views.order_details, name='order_details'),
    path('<int:order_id>/delete/', views.order_delete_dlg, name='orderdeletedlg'),
    path('<int:order_id>/duplicate/', views.order_duplicate_dlg, name='orderduplicatedlg'),
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
    path('<int:order_id>/taxchange', views.tax_change_dlg, name='ordertaxchange'),
    path('<int:order_id>/discountchange', views.discount_change_dlg, name='orderdiscountchange'),
    path('<int:order_id>/details', views.get_order_details,
         name='orderdetails'),
    path('<int:order_id>/address/billing/edit/', views.order_billing_edit,
         name='orderbillingaddressedit'),
    path('<int:order_id>/address/shipping/edit/', views.order_shipping_edit,
         name='ordershippingaddressedit'),
    path('<int:order_id>/address/shipping/search/', views.order_shipping_search,
         name='ordershippingaddresssearch'),
    path('<int:order_id>/address/billing/frombook', views.update_order_billing_from_address_book,
         name='orderbillingfrombook'),
    path('<int:order_id>/address/shipping/frombook', views.update_order_shipping_from_address_book,
         name='ordershippingfrombook'),
    path('api/<int:order_id>/updateshipping/', views.order_shipping_change, name='ordershippingchange'),
    path('api/<int:order_id>/shipit/', views.order_ship_it, name='ordershipit'),
    path('api/<int:order_id>/shippingaddressbook', views.get_order_shipping_addresses, name='orders_shipping_address'),
    path('<int:order_id>/test/', views.order_test),
    path('', views.order_list, name='allorders'),
    ]
