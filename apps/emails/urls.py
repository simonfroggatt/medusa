from django.urls import path, include
from rest_framework import routers
from apps.emails import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    #orders
    path('order/<int:order_id>/customer_invoice', views.customer_invoice, name='send_customer_email_invoice'),
    path('order/<int:order_id>/customer_proforma', views.customer_proforma, name='send_customer_email_proforma'),
    path('order/<int:order_id>/customer_tracking', views.customer_tracking, name='send_customer_email_tracking'),
    path('order/<int:order_id>/customer_failed', views.customer_failed_payment, name='send_customer_email_failed'),

    #quotes
    path('quote/<int:quote_id>/customer_quote', views.customer_quote, name='show_customer_email_quote'),

    path('send_customer_email/quote', views.send_customer_email_quote, name='send_customer_email_quote'),

    #suppliers
    path('order/<int:order_id>/supplier/<int:supplier_id>', views.supplier_send_order, name='send_supplier_email'),

    path('send_customer_email', views.send_customer_email, name='send_customer_email'),



] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
