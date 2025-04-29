from django.urls import path, re_path
from apps.paperwork import views
from django.conf import settings

from django.conf.urls.static import static


urlpatterns = [
    path('all/<int:order_id>', views.gen_merged_paperwork, name='order_paperwork_pdf'),
    path('webstore_pdf/<int:order_id>/<str:order_hash>', views.gen_invoice_for_webstore_download, name='website_invoice_pdf'),
    path('webstore_pdf_view/<int:order_id>/<str:order_hash>', views.gen_invoice_for_webstore, name='website_invoice_pdf_view'),
    path('proforma/<int:order_id>', views.gen_proforma_paperwork, name='proforma_paperwork_pdf'),
    #re_path(r'^proforma/([-\w]+)-(?P<order_id>\d+)$', views.gen_proforma_paperwork, name='proforma_paperwork_pdf'),

    re_path(r'^order/([-\w]+)-(?P<order_id>\d+)$', views.gen_merged_paperwork, name='order_paperwork_pdf2'),
     path('quote/<int:quote_id>', views.gen_quote_paperwork, name='quote_paperwork_pdf'),
    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
              + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


