from django.urls import path, include
from apps.bespoke import views

urlpatterns = [
    path('api/convert-order/<int:pk>', views.convert_order, name='convert_order'),
    path('api/convert-order-product/<int:pk>', views.convert_order_product, name='convert_order'),
    ]
