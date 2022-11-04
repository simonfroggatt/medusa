from django.urls import path
from apps.orders import views
from rest_framework import routers
from django.conf.urls import url, include
from apps.company import views

router = routers.SimpleRouter()
router.register(r'companylist', views.company_list_asJSON)


urlpatterns = [
    url('^api/', include(router.urls)),
    path('create', views.company_create, name='create_company'),
    path('<int:company_id>/createcontact', views.company_create_contact, name='create_company_contact'),
    path('savecontact', views.company_contact_save, name='save_company_contact'),
    path('save', views.company_create_save, name='save_company'),
    path('<int:company_id>', views.company_details, name='company_details'),
    path('<int:company_id>/edit', views.company_details_edit, name='company_details_edit'),
    path('<int:company_id>/contacts', views.company_contacts, name='company_contacts'),
    path('<int:company_id>/addressbook', views.company_addressbook, name='company_addressbook'),


    path('', views.company_list, name='allcompanies'),
]