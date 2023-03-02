from django.urls import path
from apps.quotes import views
from rest_framework import routers
from django.conf.urls import url, include

router = routers.SimpleRouter()
router.register(r'quotes', views.Quotes_asJSON)
router.register(r'quote-products', views.Quote_Products_asJSON)
router.register(r'customer', views.Quotes_Customer)

urlpatterns = [
    url('^api/', include(router.urls)),
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
    ]




