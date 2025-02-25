from django.urls import path, include
from apps.bespoke import views

urlpatterns = [
    path('api/convert-order/<int:pk>', views.convert_order, name='convert_order'),
    path('api/convert-order-product/<int:pk>', views.convert_order_product, name='convert_order'),
    path('test', views.test_google, name='convert_order'),
    path('testlist', views.test_list, name='convert_order'),
    ]
