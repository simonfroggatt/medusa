from django.urls import path, re_path
from apps.paperwork import views
urlpatterns = [
    path('all/<int:order_id>', views.gen_merged_paperwork, name='order_paperwork_pdf'),
    re_path(r'^order/([-\w]+)-(?P<order_id>\d+)$', views.gen_merged_paperwork, name='order_paperwork_pdf2'),
    path('quote/<int:quote_id>', views.gen_quote_paperwork, name='quote_paperwork_pdf'),
    ]
