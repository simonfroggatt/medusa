from django.urls import path, include
from apps.bespoke import views

urlpatterns = [
    path('api/convert-order/<int:pk>', views.convert_order, name='convert_order'),
    path('api/convert-order-product/<int:pk>', views.convert_order_product, name='convert_order'),
    path('api/download/<str:file_id>', views.download_google_drive_file, name='download_file'),
    path('api/download_svg/<int:pk>', views.download_svg_file, name='download_svg_file'),
    ]
