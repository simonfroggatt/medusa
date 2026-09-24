from django.urls import path, include
from apps.bespoke import views

urlpatterns = [
    path('api/convert-order/<int:pk>', views.convert_order, name='convert_order'),
    path('api/convert-order-product/<int:pk>', views.convert_order_product, name='convert_order_product'),
    path('api/download/<str:file_id>', views.download_google_drive_file, name='download_file'),
    path('api/download_svg/<int:pk>', views.download_svg_file, name='download_svg_file'),
    path('api/pdf/<int:pk>', views.order_product_pdf, name='orderproductbespoke-pdf'),

    # The sign drawer: designs that belong to nobody yet.
    path('designs/', views.design_list, name='design-list'),
    path('designs/new/', views.design_create, name='design-create'),
    path('designs/<int:design_id>/', views.design_edit, name='design-edit'),
    path('designs/<int:design_id>/frame/', views.design_frame, name='design-frame'),
    path('designs/<int:design_id>/save/', views.design_save, name='design-save'),
    path('designs/<int:design_id>/delete/', views.design_delete, name='design-delete'),
    path('designs/<int:design_id>/svg/', views.design_svg, name='design-svg'),
    path('designs/<int:design_id>/pdf/', views.design_pdf, name='design-pdf'),
    ]
