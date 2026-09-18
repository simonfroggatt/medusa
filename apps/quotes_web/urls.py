from django.urls import path

from . import views

urlpatterns = [
    # tsg_store -> Medusa (shared secret in the X-TSG-Key header)
    path('api/create/', views.api_create, name='quotes_web_api_create'),

    # staff (sales / superuser)
    path('', views.quote_list, name='quotes_web_list'),
    path('<int:quote_id>/', views.quote_detail, name='quotes_web_detail'),
    path('<int:quote_id>/status/', views.quote_change_status, name='quotes_web_change_status'),
    path('<int:quote_id>/edit/', views.quote_edit_header, name='quotes_web_edit_header'),
    path('<int:quote_id>/details/', views.quote_details_panel, name='quotes_web_details_panel'),
    path('<int:quote_id>/product/add/', views.quote_add_product, name='quotes_web_add_product'),
    path('<int:quote_id>/item/<int:item_id>/', views.quote_item_edit, name='quotes_web_item_edit'),
    path('<int:quote_id>/item/<int:item_id>/delete/', views.quote_item_delete,
         name='quotes_web_item_delete'),

    # customer portal: the HTML fragment tsg_store wraps in the store's own page, plus the
    # two things a customer can do. The token is the only credential.
    path('api/portal/<str:token>/accept/', views.portal_accept, name='quotes_web_portal_accept'),
    path('api/portal/<str:token>/request-changes/', views.portal_request_changes,
         name='quotes_web_portal_request_changes'),
    path('api/portal/<str:token>/', views.portal_fragment, name='quotes_web_portal_fragment'),
]
