from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from django.urls import include
from apps.shipping import views

router = routers.SimpleRouter()
router.register(r'couriers', views.Couriers)
router.register(r'couriers/options', views.CourierOptions)
router.register(r'methods', views.Methods)


urlpatterns = [
    path('api/', include(router.urls)),
   # path('api/courier/<int:courier_id>/options/', views.CourierOptions().as_view({'get': 'list'}), name='courier_options'),
    path('couriers', views.courier_list, name='allcouriers'),
    path('couriers/create/', views.CourierCreate.as_view(), name='courier_create'),
    path('couriers/update/<int:pk>', views.CourierUpdate.as_view(), name='courier_update'),
    path('couriers/delete_confirm/<int:pk>', views.courier_delete, name='courier_delete_confirm'),

    path('couriers/update/<int:pk>/option/add', views.courier_option_add, name='courier_option_add'),
    path('couriers/update/option/<int:pk>/update', views.courier_option_edit, name='courier_option_edit'),
    path('couriers/update/option/<int:pk>/delete', views.courier_option_delete, name='courier_delete_confirm'),

    path('methods', views.methods_list, name='allmethods'),
    path('methods/create/', views.MethodsCreate.as_view(), name='method_create'),
    path('methods/update/<int:pk>', views.MethodsUpdate.as_view(), name='method_update'),
    path('methods/delete_confirm/<int:pk>', views.methods_delete, name='method_delete_confirm'),

    #this is where we will put the different courier methods API calls and webhooks
    #ROYALMAIL
    path('api/royalmail/webhook/', views.royalmail_webhook, name='royalmail_webhook'),

    # Royal Mail — label page + AJAX
    path('rm/<int:order_id>/', views.rm_label_page, name='rm_label_page'),
    path('api/rm/address-lookup/', views.api_rm_address_lookup, name='api_rm_address_lookup'),
    path('api/rm/create-order/', views.api_rm_create_order, name='api_rm_create_order'),
    path('api/rm/label/<int:cd_order_id>/', views.api_rm_label, name='api_rm_label'),
    path('api/rm/ship-label/<int:order_id>/', views.rm_ship_label_dialog, name='rm_ship_label_dialog'),

    #FEDEX

    #DPD

    # DX — label page + AJAX
    path('dx/<int:order_id>/', views.dx_label_page, name='dx_label_page'),
    path('api/dx/address-lookup/', views.api_dx_address_lookup, name='api_dx_address_lookup'),
    path('api/dx/create-shipment/', views.api_dx_create_shipment, name='api_dx_create_shipment'),
    path('api/dx/label/<str:consignment_number>/', views.api_dx_label, name='api_dx_label'),

    # Loqate — address verification
    path('api/verify-address/', views.api_verify_address, name='api_verify_address'),

    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)