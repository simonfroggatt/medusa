from django.urls import path, re_path
from apps.paperwork import views
from django.conf import settings

from django.conf.urls.static import static


urlpatterns = [
    path('all/<int:order_id>', views.gen_merged_paperwork, name='order_paperwork_pdf'),
    path('test/', views.test_pdf, name='test_pdf'),

    re_path(r'^order/([-\w]+)-(?P<order_id>\d+)$', views.gen_merged_paperwork, name='order_paperwork_pdf2'),
    path('quote/<int:quote_id>', views.gen_quote_paperwork, name='quote_paperwork_pdf'),
    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
              + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


