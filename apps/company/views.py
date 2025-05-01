from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from apps.company.models import OcTsgCompany, OcTsgCompanyDocuments
from apps.company.serializers import CompanyListSerializer
from apps.company.forms import CompanyEditForm, CompanyDocumentForm
from django.urls import reverse_lazy
from django.template.loader import render_to_string
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, FileResponse
from django.core import serializers
from apps.customer.forms import CustomerForm, AddressForm
from apps.customer.models import OcCustomer
from apps.orders.models import OcOrder
from medusa import services
from django.conf import settings
import os
from cryptography.fernet import Fernet
from django.core.files.storage import default_storage as storage
from django.db.models import Sum
from apps.xero_api import views as xero


# Create your views here.
def company_list(request):
    template_name = 'company/company_list.html'
    content = {'heading': 'Companies'}
    return render(request, template_name, content)


class company_list_asJSON(viewsets.ModelViewSet):
    queryset = OcTsgCompany.objects.all()
    serializer_class = CompanyListSerializer

    def retrieve(self, request):
        company_list = OcTsgCompany.objects.all()
        serializer = self.get_serializer(company_list, many=True)
        return Response(serializer.data)

class company_list_bystore(viewsets.ModelViewSet):
    queryset = OcTsgCompany.objects.all()
    serializer_class = CompanyListSerializer

    def retrieve(self, request, pk):
        company_list = OcTsgCompany.objects.filter(store_id=pk)
        serializer = self.get_serializer(company_list, many=True)
        return Response(serializer.data)


def company_details(request, company_id):
    company_obj = get_object_or_404(OcTsgCompany.objects.select_related(), pk=company_id)

    context = {"company_obj": company_obj}

    template_name = 'company/company_layout.html'

    breadcrumbs = []
    breadcrumbs.append({'name': 'Companies', 'url': reverse_lazy('allcompanies')})
    context['breadcrumbs'] = breadcrumbs
    context['heading'] = company_obj.company_name

    company_docs_obj = OcTsgCompanyDocuments.objects.filter(company_id=company_id)
    context['company_docs_obj'] = company_docs_obj
    docform_initials = {'company': company_obj}
    docform = CompanyDocumentForm(initial=docform_initials)
    context['docform'] = docform
    context['thumbnail_cache'] = settings.THUMBNAIL_CACHE

    #get all the address for the contacts in the conpany
    contacts_obj = OcCustomer.objects.filter(parent_company_id=company_id)
    address_book = []
    for contact in contacts_obj:
        address_book.append(contact.address_customer.all().order_by('postcode'))
    context['address_book_list'] = address_book

    context['total_orders'] = OcOrder.objects.filter(customer__parent_company=company_id).successful().count()
    context['total_order_value'] = context['total_order_value'] = (
    OcOrder.objects
    .filter(customer__parent_company=company_id)
    .successful()
    .aggregate(total=Sum('total'))['total'] or 0
)
    context['current_symbol'] = '£'  #todo - get correct symbol in here

    #f = Fernet(settings.XERO_TOKEN_FERNET)
    #encrypted = f.encrypt(str(company_id).encode()).decode()
    #account_details = xero.xero_company_account(company_id, encrypted)
    #context['account_balance'] = account_details

    return render(request, template_name, context)


def company_create(request):

    template_name = 'company/dialogs/create_company.html'

    iniitial_data = {
        'payment_days': 0,
        'credit_limit': 0,
        'discount': 0,
        'tax_rate': 86,
        'account_type': 1,
        'company_type': 2,
        'payment_terms': 1,
        'store': 1,
        'status': 1,
        'country': 826,
    }
    form = CompanyEditForm(initial=iniitial_data)


    content = {'form': form}

    html_form = render_to_string(template_name, content, request=request)
    return JsonResponse({'html_form': html_form})

def company_create_save(request):
    data = dict()
    company_id = 0
    if request.method == 'POST':
        form = CompanyEditForm(request.POST)
        if form.is_valid():
            form.save()
            form_instance = form.instance
            company_id = form_instance.company_id
            if request.POST.get('chk_create_contact'): #create a contact too
                new_contact = OcCustomer()
                new_contact.company = form_instance.company_name
                new_contact.firstname = form_instance.accounts_contact_firstname
                new_contact.lastname = form_instance.accounts_contact_lastname
                new_contact.fullname = form_instance.accounts_contact_fullname  # ✅ use . not ['']
                new_contact.telephone = form_instance.accounts_telephone
                new_contact.email = form_instance.accounts_email
                new_contact.account_type = form_instance.account_type
                new_contact.store = form_instance.store
                new_contact.customer_group_id = 1
                new_contact.language_id = 1
                new_contact.ip = '0.0.0.0'
                new_contact.status = 1
                new_contact.safe = 1
                new_contact.parent_company_id = form_instance.company_id
                new_contact.save()

                new_address = new_contact.address_customer.create()
                new_address.company = form_instance.company_name
                new_address.firstname = form_instance.accounts_contact_firstname
                new_address.lastname = form_instance.accounts_contact_lastname
                new_address.fullname = form_instance.accounts_contact_fullname
                new_address.address_1 = form_instance.accounts_address
                new_address.telephone = form_instance.accounts_telephone
                new_address.email = form_instance.accounts_email
                new_address.city = form_instance.accounts_city
                new_address.area = form_instance.accounts_area
                new_address.postcode = form_instance.accounts_postcode
                new_address.country = form_instance.accounts_country  # this is a ForeignKey object, safer from the model
                new_address.default_billing = 0
                new_address.default_shipping = 1
                new_address.save()
            data['form_is_valid'] = True

        else:
            data['form_is_valid'] = False

    context = {'form': form}
    data['html_form'] = render_to_string('company/dialogs/create_company.html',
                                         context,
                                         request=request
                                         )

    data['redirect_url'] = reverse_lazy('company_details', kwargs={'company_id': company_id})

    return JsonResponse(data)


def company_details_edit(request, company_id):
    data = dict()
    company_details_obj = get_object_or_404(OcTsgCompany, pk=company_id)

    if request.method == 'POST':
        form = CompanyEditForm(request.POST, instance=company_details_obj)
        if form.is_valid():
            if 'account_type' in form.changed_data:
                new_account_type = form.cleaned_data['account_type']
                company_contact_change_account_type(company_id, new_account_type)
            data['form_is_valid'] = True
            company_details_obj.save()
            #not lets check to see if we need to do anything extra

        else:
            data['form_is_valid'] = False

    else:
        form = CompanyEditForm(instance=company_details_obj)

    template_name = 'company/dialogs/edit_company.html'

    context = {'order_id': company_id,
               'form': form}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    data['redirect_url'] = reverse_lazy('company_details', kwargs={'company_id': company_id})

    return JsonResponse(data)


def company_contacts(request, company_id):
    data = dict()

    return JsonResponse(data)


def company_addressbook(request, company_id):
    data = dict()
    return JsonResponse(data)


def company_create_contact(request, company_id):

    template_name = 'company/dialogs/create_company_contact.html'
    company_obj = get_object_or_404(OcTsgCompany.objects.select_related(), pk=company_id)


    iniitial_data = {
        'parent_company': company_id,
        'company' : company_obj.company_name,
        'store': company_obj.store_id,
        'language_id': 1,
        'ip': '0.0.0.0',
        'status': 1,
        'safe': 1,
        'customer_group': 1,
        'account_type': company_obj.account_type,
        'telephone': company_obj.accounts_telephone,
        'email': company_obj.accounts_email[company_obj.accounts_email.index('@')  : ]
    }

    company_address = {
        'address_1': company_obj.accounts_address,
        'city': company_obj.accounts_city,
        'postcode': company_obj.accounts_postcode,
        'area': company_obj.accounts_area,
        'country': company_obj.accounts_country,
        'country_id': company_obj.accounts_country_id
    }

    form = CustomerForm(initial=iniitial_data)
    form_address = AddressForm(initial=company_address)

    company_address_json = company_address.copy()
    company_address_json.pop('country', None)  # Safe delete if it exists

    content = {'form': form, 'form_address': form_address, 'company_id': company_id, 'initials': iniitial_data, 'company_address': company_address_json}

    html_form = render_to_string(template_name, content, request=request)
    return JsonResponse({'html_form': html_form})


def company_contact_save(request):
    data = dict()
    if request.method == 'POST':
        form = CustomerForm(request.POST)
        form_address = AddressForm(request.POST)
        if form.is_valid():
            form.save()
            #need to set the fullname in here
            customer_instance = form.instance
            clean_contact = form.cleaned_data
            customer_id = customer_instance.customer_id
            customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
            customer_obj.fullname = f"{clean_contact['firstname']} {clean_contact['lastname']}"
            customer_obj.save()

            #check if we need to create an address - switchAddAddress
            if request.POST.get('chk_switchAddAddress'):
                if form_address.is_valid():
                    clean_address = form_address.cleaned_data
                    new_address = customer_obj.address_customer.create()
                    new_address.company = clean_address['company']
                    new_address.firstname = clean_contact['firstname']
                    new_address.lastname = clean_contact['lastname']
                    new_address.fullname = f"{clean_contact['firstname']} {clean_contact['lastname']}"
                    new_address.address_1 = clean_address['address_1']
                    new_address.telephone = clean_address['telephone']
                    new_address.label = clean_address['label']
                    new_address.email = clean_address['email']
                    new_address.city = clean_address['city']
                    new_address.area = clean_address['area']
                    new_address.postcode = clean_address['postcode']
                    new_address.country = clean_address['country']
                    new_address.default_billing = clean_address['default_billing']
                    new_address.default_shipping = clean_address['default_shipping']
                    new_address.save()
                    data['form_is_valid'] = True
                else:
                    data['form_is_valid'] = False
            else:
                data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False


    data['redirect_url'] = reverse_lazy('customerdetails', kwargs={'customer_id': customer_id})

    return JsonResponse(data)

def company_contact_change_account_type(company_id, new_account_type):
    contacts_obj = OcCustomer.objects.filter(parent_company_id=company_id)
    for contact in contacts_obj:
        contact.account_type = new_account_type
        contact.save()


def company_document_fetch(request, company_id):
    data =  dict()
    company_docs_obj = OcTsgCompanyDocuments.objects.filter(company_id=company_id)
    template_name = 'company/sub_layout/company_documents.html'
    context = {'company_docs_obj': company_docs_obj}
    company_obj = get_object_or_404(OcTsgCompany,pk=company_id)
    docform_initials = {'company': company_obj}
    docform = CompanyDocumentForm(initial=docform_initials)
    context['docform'] = docform
    context['thumbnail_cache'] = settings.THUMBNAIL_CACHE



    data['html_content'] = render_to_string(template_name,
                                            context,
                                            request=request
                                            )

    return JsonResponse(data)



def company_document_upload(request):
    data = dict()
    if request.method == 'POST':
        form = CompanyDocumentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            form_instance = form.instance
            company_doc_obj = get_object_or_404(OcTsgCompanyDocuments, pk=form_instance.pk)
            #cached_thumb = services.createUploadThumbnail(company_doc_obj.filename.file.name)
            #company_doc_obj.cache_path = cached_thumb
            company_doc_obj.save()
            data['success_post'] = True
            data['document_ajax_url'] = reverse_lazy('fetch_company_documents', kwargs={'company_id': company_doc_obj.company_id})
            data['divUpdate'] = ['div-company_documents', 'html_content']
        else:
            data['success_post'] = False
    else:
        data['success_post'] = False

    return JsonResponse(data)


def company_document_download(request, pk):
    doc_obj = get_object_or_404(OcTsgCompanyDocuments, pk=pk)
    response_headers = {
        'response-content-type': 'application/force-download',
        'response-content-disposition': 'attachment;filename="%s"' % doc_obj.filename.name
    }
    url = storage.url(doc_obj.filename.name)
    #response = FileResponse(open(url), as_attachment=True)
    return HttpResponse(
        open(doc_obj.cdn_name, 'rb'),
        content_type='text/plain',  # it's a download, mime type doesn't matter
        headers={
            'Content-Disposition': f"attachment; filename={doc_obj.filename.name}",
            'Cache-Control': 'no-cache'  # files are dynamic, prevent caching
        }
    )


def company_document_delete(request, pk):
    data = dict()
    template_name = 'company/dialogs/company_document_delete.html'
    context = dict()
    company_doc_obj = get_object_or_404(OcTsgCompanyDocuments, pk=pk)

    if request.method == 'POST':
        company_doc_obj = get_object_or_404(OcTsgCompanyDocuments, pk=pk)
        if company_doc_obj:
            company_doc_obj.delete()
            #delete the cached file
            fullpath = os.path.join(settings.MEDIA_ROOT, settings.THUMBNAIL_CACHE ,company_doc_obj.cache_path)
            if os.path.isfile(fullpath):
                os.remove(fullpath)
            data['success_post'] = True
            data['document_ajax_url'] = reverse_lazy('fetch_company_documents',
                                                     kwargs={'company_id': company_doc_obj.company_id})
            data['divUpdate'] = ['div-company_documents', 'html_content']
        else:
            data['success_post'] = False
    else:
        context['dialog_title'] = "<strong>DELETE</strong> document"
        context['action_url'] = reverse_lazy('company_document-delete', kwargs={'pk': pk})
        context['form_id'] = 'form-company_document-delete'
        context['company_id'] = company_doc_obj.company_id
        data['upload'] = False

    data['html_form'] = render_to_string(template_name,
                                                     context,
                                                     request=request
                                                     )

    return JsonResponse(data)


def company_xero_add(request, company_id):
    f = Fernet(settings.XERO_TOKEN_FERNET)
    encrypted_order_num = f.encrypt(str(company_id).encode()).decode()
    return_url = reverse_lazy('xero_company_add', kwargs={'company_id': company_id, 'encrypted': encrypted_order_num})
    return HttpResponseRedirect(return_url)

def company_xero_update(request, company_id):
    f = Fernet(settings.XERO_TOKEN_FERNET)
    encrypted_order_num = f.encrypt(str(company_id).encode()).decode()
    return_url = reverse_lazy('xero_company_update',
                              kwargs={'company_id': company_id, 'encrypted': encrypted_order_num})
    return HttpResponseRedirect(return_url)

def company_api_account_address(request, company_id):
    data = dict()
    data['address'] = None
    if request.method == 'GET':
        company_obj = get_object_or_404(OcTsgCompany, pk=company_id)
        data['address'] = {
                'accounts_contact_firstname': company_obj.accounts_contact_firstname,
                'accounts_contact_lastname': company_obj.accounts_contact_lastname,
                'accounts_email': company_obj.accounts_email,
                'accounts_telephone': company_obj.accounts_telephone,
                'accounts_address': company_obj.accounts_address,
                'accounts_city': company_obj.accounts_city,
                'accounts_area': company_obj.accounts_area,
                'accounts_postcode': company_obj.accounts_postcode,
                'accounts_country_id': company_obj.accounts_country_id,
        }
    return JsonResponse(data)

def customer_unlink_company(request, customer_id):
    data = dict()
    customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
    if request.method == 'POST':
        customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
        current_parent_id = customer_obj.parent_company_id
        customer_obj.parent_company_id = None
        customer_obj.save()
        data['form_is_valid'] = True
        data['redirect_url'] = reverse_lazy('company_details', kwargs={'company_id': parent_company_id})
    else:
        template_name = 'company/dialogs/customer_unlink_company.html'
        context = {'customer_id': customer_id}

        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)
