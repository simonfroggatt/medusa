from django.urls import path
from apps.paperwork import views
urlpatterns = [
    path('picklist/<int:order_id>', views.gen_pick_list, name='order_picklist_pdf'),
    path('shipping_address/<int:order_id>', views.gen_shipping_page, name='order_shipping_pdf'),
    path('invoice/<int:order_id>', views.gen_invoice, name='order_invoices_pdf'),
    ]
