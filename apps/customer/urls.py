from django.urls import path
from apps.customer import views
from django.conf.urls import url, include
from rest_framework import routers
from apps.quotes.views import create_quote_customer


router = routers.SimpleRouter()
router.register(r'customerslist', views.customer_list_asJSON_s)
router.register(r'customerslist/company', views.customer_list_bycompany)

urlpatterns = [
    url('^api/', include(router.urls)),
    path('', views.customers_list, name='allcustomers'),
    path('details/<int:customer_id>', views.customers_details, name='customerdetails'),
    path('details/<int:customer_id>/edit', views.customers_details_edit, name='customerdetailsedit'),
   # path('details/<int:customer_id>/address/edit/<int:pk>', views.AddressEditView.as_view(), name='customeraddresseditmodal'),
    path('details/<int:customer_id>/address/create', views.customer_address_create, name='customeraddresscreate'),
    path('details/<int:customer_id>/address/save', views.customer_address_save, name='customeraddresscreatesave'),
    path('details/<int:customer_id>/address/edit/<int:address_id>', views.customers_address_edit, name='customeraddressedit'),
    path('details/<int:customer_id>/address/delete/<int:address_id>', views.customer_address_delete, name='customeraddressdelete'),
    path('details/<int:customer_id>/address/setbilling/<int:address_id>', views.customer_address_set_billing, name='customeraddresssetbilling'),
    path('details/<int:customer_id>/address/setshipping/<int:address_id>', views.customer_address_set_shipping, name='customeraddresssetshipping'),

    path('<int:customer_id>/addressbook', views.customer_address_book, name='customer_addressbook'),
    path('<int:customer_id>/contactcard', views.customer_contact_card, name='customer_contactcard'),
    path('api/customer/<int:customer_id>/order_create', views.order_customer_create, name='api_createorder'),
    path('api/customer/<int:customer_id>/quote_create', create_quote_customer, name='api_createquote'),
    path('details/<int:customer_id>/password/edit', views.customers_edit_password, name='customereditpassword'),
    path('create', views.contact_create, name='create_customer'),

    path('api/customer/<int:customer_id>/update_notes', views.customer_update_notes, name='api_customer_update_notes'),

  #  path('address/<int:pk>', views.customer_address_view),
   # path('address/edit/<int:address_id>', views.customer_address_view),
   # path('address/create/<int:customer_id>', views.customer_address_view),
   # path('address/delete/<int:customer_id>', views.customer_address_view),

]


