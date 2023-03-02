from django.urls import path
from apps.paperwork import views
urlpatterns = [
    path('all/<int:order_id>', views.gen_merged_paperwork, name='order_paperwork_pdf'),
    path('quote/<int:quote_id>', views.gen_quote_paperwork, name='quote_paperwork_pdf'),
    ]
