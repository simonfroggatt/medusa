from django.urls import path
from apps.orders import views
from rest_framework import routers
from django.urls import include
from apps.company import views

router = routers.SimpleRouter()
router.register(r'companylist', views.company_list_asJSON)
router.register(r'companylistbystore', views.company_list_bystore)


urlpatterns = [
    path('api/', include(router.urls)),
    path('create', views.company_create, name='create_company'),
    path('<int:company_id>/createcontact', views.company_create_contact, name='create_company_contact'),
    path('savecontact', views.company_contact_save, name='save_company_contact'),
    path('save', views.company_create_save, name='save_company'),
    path('<int:company_id>', views.company_details, name='company_details'),
    path('<int:company_id>/edit', views.company_details_edit, name='company_details_edit'),
    path('<int:company_id>/contacts', views.company_contacts, name='company_contacts'),
    path('<int:company_id>/addressbook', views.company_addressbook, name='company_addressbook'),
    
#documents
    path('document/upload', views.company_document_upload, name='company_document-upload'),
    path('<int:company_id>/document/fetch', views.company_document_fetch, name='fetch_company_documents'),
    path('document/<pk>/download', views.company_document_download, name='company_document-download'),
    path('document/<pk>/delete', views.company_document_delete, name='company_document-delete'),


    path('', views.company_list, name='allcompanies'),
]