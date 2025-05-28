from django.urls import path
from apps.quotes import views
from rest_framework import routers
from django.urls import include

router = routers.SimpleRouter()
router.register(r'quotes', views.Quotes_asJSON)
router.register(r'quote-products', views.Quote_Products_asJSON)
router.register(r'customer', views.Quotes_Customer)
router.register(r'shippingsearch', views.QuoteShippingAddressList)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/quote/delete', views.quote_delete, name='api_quotedelete'),
    path('<int:quote_id>/edit', views.quote_details_edit, name='quotedetailsedit'),
    path('<int:quote_id>', views.quote_details, name='quote_details'),
    path('<int:quote_id>/product/add/', views.quote_add_product, name='quoteproductadd'),
    path('<int:quote_id>/text/', views.quote_get_text, name='quotetext'),
    path('<int:quote_id>/product/edit/<int:quote_product_id>', views.quote_product_edit, name='quoteproductedit'),
    path('<int:quote_id>/product/delete/<int:quote_product_id>', views.quote_product_delete,
         name='quoteproductdelete'),
    path('<int:quote_id>/discountchange', views.discount_change_dlg, name='quotediscountchange'),
    path('<int:quote_id>/delete/', views.quote_delete_dlg, name='quotedeletedlg'),
    path('api/quotes/product_text', views.get_quote_product_text, name='api_quotes_product_text'),
    path('quick/', views.quick_quote, name='quotequick'),
    path('testemail', views.test_send_email),
    path('', views.quote_list, name='allquotes'),

    #address details
    path('<int:quote_id>/addresses', views.get_quote_addresses,
         name='quoteaddresses'),
    path('<int:quote_id>/address/billing/edit/', views.quote_billing_edit,
         name='quotebillingaddressedit'),
    path('<int:quote_id>/address/shipping/edit/', views.quote_shipping_edit,
         name='quoteshippingaddressedit'),
    path('<int:quote_id>/address/shipping/search/', views.quote_shipping_search,
         name='quoteshippingaddresssearch'),
    path('<int:quote_id>/address/billing/frombook', views.update_quote_billing_from_address_book,
         name='quotebillingfrombook'),
    path('<int:quote_id>/address/shipping/frombook', views.update_quote_shipping_from_address_book,
         name='quoteshippingfrombook'),
    path('<int:quote_id>/address/billing/copy', views.quote_copy_billing, name='quote_copy_billing'),

    path('api/<int:quote_id>/company/<int:company_id>/accountaddress', views.company_quote_api_account_address, name='api_quote_company_account_address'),
    path('api/<int:quote_id>/convert/<str:quote_hash>', views.convert_to_order, name='quote_convert_to_order'),
    path('api/<int:quote_id>/convert-customer/', views.convert_to_customer, name='quote_convert_to_customer'),


    ]




