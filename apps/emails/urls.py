from django.urls import path, include
from rest_framework import routers
from apps.emails import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('order/<int:order_id>/customer_invoice', views.customer_invoice, name='send_customer_email_invoice'),
    path('order/<int:order_id>/customer_proforma', views.customer_proforma, name='send_customer_email_proforma'),
    path('order/<int:order_id>/customer_tracking', views.customer_tracking, name='send_customer_email_tracking'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
