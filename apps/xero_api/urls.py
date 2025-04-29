from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from apps.xero_api import views
from django.urls import include


urlpatterns = [
   # path('api/courier/<int:courier_id>/options/', views.CourierOptions().as_view({'get': 'list'}), name='courier_options'),
    path('login/', views.XeroFirstLogin, name='login'),
    path('passback/', views.do_refesh_token, name='passback'),
    path('test/', views.xero_tenants_check, name='test'),
    path('contact/', views.xero_contact, name='test'),
    path('refresh/', views.do_refesh_token, name='refresh'),

    path('api/customer/add/<int:contact_id>/<str:encrypted>', views.xero_customer_add, name='xero_customer_add'),
    path('api/customer/update/<int:contact_id>/<str:encrypted>', views.xero_customer_update, name='xero_customer_update'),
    path('api/customer/account/<int:contact_id>/<str:encrypted>', views.xero_customer_account, name='xero_customer_account'),

    path('api/company/add/<int:company_id>/<str:encrypted>', views.xero_company_add, name='xero_company_add'),
    path('api/company/update/<int:company_id>/<str:encrypted>', views.xero_company_update, name='xero_company_update'),
    path('api/company/account/<int:company_id>/<str:encrypted>', views.xero_company_account, name='xero_company_account'),


    path('api/order/add/<int:order_id>/<str:encrypted>', views.xero_order_add, name='xero_order_add'),
    path('api/order/update/<int:order_id>/<str:encrypted>', views.xero_order_update, name='xero_order_update'),
    path('api/order/link/<int:order_id>/<str:encrypted>', views.xero_order_link, name='xero_order_link'),
    path('api/order/customer/<int:xero_id>/<str:encrypted>', views.xero_get_order_customer, name='xero_get_order_customer'),

    path('api/webhooks', views.xero_web_hook, name='xero_web_hook'),

    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)