from django.shortcuts import render, get_object_or_404, redirect
from django.core import serializers
from .models import OcCustomer, OcAddress, OcTsgContactDocuments
from .serializers import CustomerListSerializer
from .forms import AddressForm, CustomerForm, CustomerDocumentForm
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, FileResponse
from rest_framework import viewsets
from rest_framework.response import Response
from django.template.loader import render_to_string
from apps.orders.models import OcOrder, OcTsgPaymentMethod
from apps.company.models import OcTsgCompany, OcTsgCompanyType
from bootstrap_modal_forms.generic import BSModalCreateView, BSModalUpdateView
from django.urls import reverse_lazy
import json
import hashlib
from django.utils.crypto import get_random_string
from django.contrib import messages
from medusa import services
from django.conf import settings
import os
from cryptography.fernet import Fernet


def customers_list(request):
    template_name = 'customer/list_customers.html'
    context = {'heading': 'Customers'}
    return render(request, template_name, context)


class customer_list_asJSON_s(viewsets.ModelViewSet):
    queryset = OcCustomer.objects.filter(archived=0)
    serializer_class = CustomerListSerializer

    def retrieve(self, request, pk=None):
        customer_list = OcCustomer.objects.filter(parent_company_id=pk).filter(archived=0)
        serializer = self.get_serializer(customer_list, many=True)
        return Response(serializer.data)

class customer_list_bycompany(viewsets.ModelViewSet):
    queryset = OcCustomer.objects.filter(archived=0)
    serializer_class = CustomerListSerializer

    def retrieve(self, request, pk=None):
        customer_list = OcCustomer.objects.filter(parent_company_id=pk).filter(archived=0)
        serializer = self.get_serializer(customer_list, many=True)
        return Response(serializer.data)


def customers_details(request, customer_id):
    template_name = 'customer/customer_layout.html'

    customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
    form = CustomerForm(instance=customer_obj)

    content = {"customer_obj": customer_obj}

    addresses = get_default_address(customer_obj)

    address_book = customer_obj.address_customer.all().order_by('postcode')
    content['customer_address'] = addresses
    content['address_book'] = address_book
    content['form'] = form

    content['heading'] = customer_obj.fullname
    breadcrumbs = []
    breadcrumbs.append({'name': 'Customers', 'url': reverse_lazy('allcustomers')})
    content['breadcrumbs'] = breadcrumbs

    customer_docs_obj = OcTsgContactDocuments.objects.filter(contact_id=customer_id)
    content['customer_docs_obj'] = customer_docs_obj
    docform_initials = {'contact': customer_obj}
    docform = CustomerDocumentForm(initial=docform_initials)
    content['docform'] = docform
    content['thumbnail_cache'] = settings.THUMBNAIL_CACHE

    return render(request, template_name, content)


def customers_details_edit(request, customer_id):
    data = dict()
    customer = get_object_or_404(OcCustomer, pk=customer_id)
    if request.method == 'POST':
        form = CustomerForm(request.POST)
        if form.is_valid():
            forminstance = form.instance
            forminstance.customer_id = request.POST.get('customer_id')
            form.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
    else:
        form = CustomerForm(instance=customer)
        form.fields['customer'] = customer_id

    context = {'customer_id': customer_id,
               'form': form}
    data['html_form'] = render_to_string('customer/dialogs/customer_details.html',
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def customer_address_book(request, customer_id, view_type):
    template_name = 'customer/customer_addressbook.html'
    address_obj = OcAddress.objects.filter(customer=customer_id)

    content = {'addresses': address_obj,
               'viewtype': view_type}

    return render(request, template_name, content)


def customer_contact_card(request, customer_id):
    data = dict()
    template_name = 'customer/sub_layouts/customer_details_sub.html'
    customer_obj = get_object_or_404(OcCustomer,pk=customer_id)

    context = {'customer_obj': customer_obj}
    data['html_contact_card'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def customer_address_save(request, customer_id):
    data = dict()
    if request.method == 'POST':
        form = AddressForm(request.POST)
        if form.is_valid():
            address_model = form.save(commit=False)
            address_model.customer_id = customer_id
            address_model.save()
            customer_update_detault_address(address_model)
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

    context = {'customer_id': customer_id,
               'form': form}
    data['html_form'] = render_to_string('customer/dialogs/address_create.html',
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def customer_address_create(request, customer_id):
    form = AddressForm()

    template_name = 'customer/dialogs/address_create.html'
    content = {'customer_id': customer_id,
               'form': form}

    html_form = render_to_string(template_name, content, request=request)
    return JsonResponse({'html_form': html_form})


def customers_address_edit(request, customer_id, address_id):
    data = dict()

    if request.method == 'POST':
        form = AddressForm(request.POST)
        if form.is_valid():
            form_instance = form.instance
            form_instance.customer_id = customer_id
            add_address = int(request.POST.get('add_address'))
            if add_address == 0:
                form_instance.address_id = address_id
            form_instance.save()
            data['form_is_valid'] = True
            customer_update_detault_address(form_instance)
        else:
            data['form_is_valid'] = False

    else:
        address = get_object_or_404(OcAddress, pk=address_id)
        form = AddressForm(instance=address)
        form.fields['customer'] = customer_id

    template_name = 'customer/address_edit.html'
    context = {'customer_id': customer_id,
               'address_id': address_id,
               'form': form}

    data['html_form'] = render_to_string('customer/dialogs/address_edit.html',
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def customer_address_delete(request, customer_id, address_id):
    data = dict()
    address = get_object_or_404(OcAddress, pk=address_id)
    if request.method == 'POST':
        data['form_is_valid'] = True
        address.delete()

    template_name = 'customer/address_delete.html'
    context = {'customer_id': customer_id,
               'address_id': address_id,
               }

    data['html_form'] = render_to_string('customer/dialogs/address_delete.html',
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def customer_update_detault_address(address_obj):
    address_id = address_obj.pk
    customer_id = address_obj.customer_id

    if address_obj.default_billing == 1:
        OcAddress.objects.filter(customer=customer_id).update(default_billing=0)
        OcAddress.objects.filter(pk=address_id).update(default_billing=1)

    if address_obj.default_shipping == 1:
        OcAddress.objects.filter(customer=customer_id).update(default_shipping=0)
        OcAddress.objects.filter(pk=address_id).update(default_shipping=1)


def customer_address_book(request, customer_id):
    data = dict()
    customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
    address_book = customer_obj.address_customer.all().order_by('postcode');

    context = {"customer_obj": customer_obj,
               "address_book": address_book}

    data['html_grid'] = render_to_string('customer/customer_addressbook.html',
                                         context,
                                         request=request
                                         )

    addresses = get_default_address(customer_obj)

    context['customer_address'] = addresses
    data['html_address'] = render_to_string('customer/customer_address_details.html',
                                            context,
                                            request=request
                                            )
    return JsonResponse(data)


def get_default_address(customer_obj):
    address_cnt = customer_obj.address_customer.count()
    addresses = {}
    if address_cnt == 1:
        addresses['billing'] = customer_obj.address_customer.first()
        addresses['shipping'] = customer_obj.address_customer.first()
    elif address_cnt > 1:
        def_billing = customer_obj.address_customer.filter(default_billing=1).order_by('address_id').first()
        if def_billing is None:
            addresses['billing'] = customer_obj.address_customer.first()
            addresses['billing_auto'] = True
        else:
            addresses['billing'] = def_billing
            addresses['billing_auto'] = False

        def_shipping = customer_obj.address_customer.filter(default_shipping=1).order_by('address_id').first()
        if def_shipping is None:
            addresses['shipping'] = customer_obj.address_customer.first()
            addresses['shipping_auto'] = True
        else:
            addresses['shipping'] = def_shipping
            addresses['shipping_auto'] = False

    return addresses


def order_customer_create(request, customer_id):
    data = dict()
    if request.method == 'POST':
        #ignore the incoming customerid
        post_customer_id = request.POST.get('customer_id')


        new_order_obj = OcOrder()
        customer_obj = get_object_or_404(OcCustomer, pk=customer_id)

        new_order_obj.customer_id = customer_id
        new_order_obj.store_id = customer_obj.store_id
        new_order_obj.customer_group_id = customer_obj.customer_group_id
        new_order_obj.invoice_prefix = customer_obj.store.prefix
        new_order_obj.currency_id = customer_obj.store.currency_id
        new_order_obj.currency_code = customer_obj.store.currency.code
        new_order_obj.currency_value = customer_obj.store.currency.value
        new_order_obj.language_id = customer_obj.language_id
        new_order_obj.fullname = customer_obj.fullname
        new_order_obj.email = customer_obj.email
        new_order_obj.telephone = customer_obj.telephone
        if customer_obj.parent_company:
            if customer_obj.company:
                new_order_obj.company = customer_obj.company
            else:
                new_order_obj.company = customer_obj.parent_company.company_name
        else:
            new_order_obj.company = customer_obj.company

        new_order_obj.payment_method_name = ''
        new_order_obj.order_status_id = 1
        new_order_obj.payment_status_id = 1
        new_order_obj.order_type_id = 1
        new_order_obj.invoice_no = 0
        new_order_obj.total = 0
        new_order_obj.tax_rate_id = 86
        new_order_obj.payment_method_id = 8
        # TODO - this needs to be from the website country

        address_book = get_default_address(customer_obj)

        new_order_obj.payment_fullname = address_book['billing'].fullname
        new_order_obj.payment_company = address_book['billing'].company
        new_order_obj.payment_email = address_book['billing'].email
        new_order_obj.payment_telephone = address_book['billing'].telephone
        new_order_obj.payment_address_1 = address_book['billing'].address_1
        new_order_obj.payment_city = address_book['billing'].city
        new_order_obj.payment_area = address_book['billing'].area
        new_order_obj.payment_postcode = address_book['billing'].postcode
        new_order_obj.payment_country_name_id = address_book['billing'].country_id
        new_order_obj.payment_country = address_book['billing'].country


        new_order_obj.shipping_fullname = address_book['shipping'].fullname
        new_order_obj.shipping_company = address_book['shipping'].company
        new_order_obj.shipping_email = address_book['shipping'].email
        new_order_obj.shipping_telephone = address_book['shipping'].telephone
        new_order_obj.shipping_address_1 = address_book['shipping'].address_1
        new_order_obj.shipping_city = address_book['shipping'].city
        new_order_obj.shipping_area = address_book['shipping'].area
        new_order_obj.shipping_postcode = address_book['shipping'].postcode
        new_order_obj.shipping_country_name_id = address_book['shipping'].country_id
        new_order_obj.shipping_country = address_book['shipping'].country

        new_order_obj.save()

        new_order_obj.order_totals.create(code='sub_total', sort_order=1, title='Sub-Total', value=0)
        new_order_obj.order_totals.create(code='discount', sort_order=2, title='Discount', value=0)

        new_order_obj.order_totals.create(code='shipping', sort_order=3, title='Shipping', value=0)
        new_order_obj.order_totals.create(code='tax', sort_order=5, title=new_order_obj.tax_rate.name, value=0)
        new_order_obj.order_totals.create(code='total', sort_order=9, title='Total', value=0)

        data['form_is_valid'] = True
        data['order_id'] = new_order_obj.order_id


    context = {"customer_id": customer_id}

    template_name = 'customer/dialogs/customer_add_order.html'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def customers_edit_password(request, customer_id):
    data = dict()
    customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
    data['form_is_valid'] = False
    if request.method == 'POST':
        newpassword = request.POST.get('newpassword')
        customer_id_edit = request.POST.get('customer_id')
        customer_obj_edit = get_object_or_404(OcCustomer, pk=customer_id_edit)
        if request.POST.get('checksend'):
            send_email = True
        else:
            send_email = False

            #SHA1(CONCAT( salt, SHA1(CONCAT(salt, SHA1('test1234')))))

        salt_clear = get_random_string(length=9)
        #salt_clear = 'EVxQ3XENy'
        salt = salt_clear.encode('utf-8')
        #9bc34549d565d9505b287de0cd20ac77be1d3f2c
        p1 =  hashlib.sha1(newpassword.encode('utf-8')).hexdigest()
        p1_2 = salt + p1.encode('utf-8')
        p2 = hashlib.sha1(p1_2).hexdigest()
        p2_3 = salt + p2.encode('utf-8')
        p3 = hashlib.sha1(p2_3).hexdigest()
        customer_obj_edit.password = p3
        customer_obj_edit.salt = salt_clear
        customer_obj_edit.save()
        data['form_is_valid'] = True
        data['send_email'] = send_email
        data['password'] = newpassword
        data['email'] = customer_obj_edit.email
        data['contact'] = customer_obj_edit.fullname

        #bd2a1e59280c0e829d55c2e28dbcb5cdf9bac30b




    context = {'customer_id': customer_id}

    template_name = 'customer/dialogs/customer_create_password.html'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def contact_create(request):
    data = dict()
    template_name = 'customer/dialogs/create_contact.html'

    initial_data = {
        'language_id': 1,
        'status': 1,
        'ip': '0.0.0.0',
        'account_type': 1,
        'safe': 1,
        'customer_group': 1,
        'store': 1,
        'country': 826,
    }

    if request.method == 'POST':
        form = CustomerForm(request.POST)
        form_address = AddressForm(request.POST)
        if form.is_valid():
            form.save()
            customer_instance = form.instance
            customer_id = customer_instance.customer_id
            customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
            if form_address.is_valid():
                clean_address = form_address.cleaned_data
                new_address = customer_obj.address_customer.create()
                new_address.fullname = clean_address['company']
                new_address.fullname = clean_address['fullname']
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

            # form_instance = form.instance
            # data['form_is_valid'] = True
            # customer_id = form_instance.customer_id
            #
            # form_address_instance = form_address.instance
            # form_address_instance.customer = customer_obj
            # form_address_instance.fullname = form_instance.fullname
            # form_address_instance.company = form_instance.company
            # form_address_instance.default_shipping = 1
            # form_address_instance.default_billing = 1
            # form_address_instance.save()
            data['redirect_url'] = reverse_lazy('customerdetails', kwargs={'customer_id': customer_id})
        else:
            data['form_is_valid'] = False
    else:
        form = CustomerForm(initial=initial_data)
        form_address = AddressForm(initial=initial_data)

    context = {'form': form, 'form_address': form_address, 'initials': initial_data}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def customer_update_notes(request, customer_id):

    data = dict()
    if request.method == 'POST':
        post_customer_id = request.POST.get('customer_id');
        post_note = request.POST.get('notes');
        customer_obj = get_object_or_404(OcCustomer, pk=post_customer_id)
        customer_obj.notes = post_note
        customer_obj.save()
        data['is_saved'] = True
        messages.info(request, 'Three credits remain in your account.')

    return JsonResponse(data)


def customer_address_set_billing(request, customer_id, address_id):
    data = dict()
    customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
    address_obj = get_object_or_404(OcAddress, pk=address_id)
    if address_obj.customer_id == customer_obj.customer_id:  #simple check to see if this is valid
        address_obj.default_billing = 1
        address_obj.save()
        customer_update_detault_address(address_obj)
        data['is_saved'] = True

    return JsonResponse(data)


def customer_address_set_shipping(request, customer_id, address_id):
    data = dict()
    customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
    address_obj = get_object_or_404(OcAddress, pk=address_id)
    if address_obj.customer_id == customer_obj.customer_id:  # simple check to see if this is valid
        address_obj.default_shipping = 1
        address_obj.save()
        customer_update_detault_address(address_obj)
        data['is_saved'] = True

    return JsonResponse(data)


def customer_delete(request, customer_id):
    #need to check if that are anyorders....if so, we can't delete the customer, just archieve it.
    data = dict()
    customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
    if request.method == 'POST':
        if customer_obj.customer_orders.exists():
    #then archive it
            customer_obj.archived = True
            customer_obj.save()
        else:
            customer_obj.delete()



        success_url = reverse_lazy('allcustomers')
        return HttpResponseRedirect(success_url)
    else:
        template_name = 'customer/dialogs/customer_delete.html'
        context = {'customer_id': customer_id}

        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )

        return JsonResponse(data)


def customer_assign_company(request, customer_id):
    # need to check if that are anyorders....if so, we can't delete the customer, just archieve it.
    data = dict()
    customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
    if request.method == 'POST':
        parent_company_id = request.POST.get('parent_company_id')
        customer_obj.parent_company_id = parent_company_id
        customer_obj.save()
        data['form_is_valid'] = True
    else:
        template_name = 'customer/dialogs/assign_company.html'
        context = {'customer_id': customer_id, 'store_id': customer_obj.store_id}

        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )

    return JsonResponse(data)

def customer_convert_to_company(request, customer_id):
    data = dict()
    customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
    if request.method == 'POST':
        new_company_type = request.POST.get('company_type')
        new_company_obj = OcTsgCompany()
        default_address = get_default_address(customer_obj)
        billing_address = default_address['billing']
        #copyt from customer
        new_company_obj.company_name = billing_address.company
        new_company_obj.fullname = customer_obj.fullname
        new_company_obj.email = billing_address.email
        new_company_obj.telephone = billing_address.telephone
        new_company_obj.address = billing_address.address_1
        if billing_address.address_2:
            new_company_obj.address += ' ' + billing_address.address_2
        new_company_obj.city = billing_address.city
        new_company_obj.area = billing_address.area
        new_company_obj.postcode = billing_address.postcode
        new_company_obj.country_id = billing_address.country_id
        new_company_obj.xero_id = customer_obj.xero_id

        #set defaults
        new_company_obj.payment_days = 0
        new_company_obj.credit_limit = 0
        new_company_obj.discount = 0
        new_company_obj.tax_rate_id = 86
        new_company_obj.company_type_id = new_company_type
        new_company_obj.payment_terms_id = 1
        new_company_obj.store_id = customer_obj.store_id
        new_company_obj.status_id = 1
        new_company_obj.country_id = 826

        new_company_obj.save()
        customer_obj.parent_company = new_company_obj
        customer_obj.account_type_id = 1
        if customer_obj.company is None:
            customer_obj.company = billing_address.company

        customer_obj.save()
        data['form_is_valid'] = True
        refresh_url = reverse_lazy('company_details', kwargs={'company_id': new_company_obj.pk})
        return HttpResponseRedirect(refresh_url)

    else:
        template_name = 'customer/dialogs/convert_to_company.html'
        company_type = OcTsgCompanyType.objects.all()
        context = {'customer_id': customer_id}
        context['company_type'] = company_type

        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )

    return JsonResponse(data)


def customer_document_fetch(request, customer_id):
    data =  dict()
    customer_docs_obj = OcTsgContactDocuments.objects.filter(contact_id=customer_id)
    template_name = 'customer/sub_layouts/customer_documents.html'
    context = {'customer_docs_obj': customer_docs_obj}
    customer_obj = get_object_or_404(OcCustomer,pk=customer_id)
    docform_initials = {'contact': customer_obj}
    docform = CustomerDocumentForm(initial=docform_initials)
    context['docform'] = docform
    context['thumbnail_cache'] = settings.THUMBNAIL_CACHE



    data['html_content'] = render_to_string(template_name,
                                            context,
                                            request=request
                                            )

    return JsonResponse(data)



def customer_document_upload(request):
    data = dict()
    if request.method == 'POST':
        form = CustomerDocumentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            form_instance = form.instance
            customer_doc_obj = get_object_or_404(OcTsgContactDocuments, pk=form_instance.pk)
            cached_thumb = services.createUploadThumbnail(customer_doc_obj.filename.file.name)
            customer_doc_obj.cache_path = cached_thumb
            customer_doc_obj.save()
            data['success_post'] = True
            data['document_ajax_url'] = reverse_lazy('fetch_customer_documents', kwargs={'customer_id': customer_doc_obj.contact_id})
            data['divUpdate'] = ['div-customer_documents', 'html_content']
        else:
            data['success_post'] = False
    else:
        data['success_post'] = False

    return JsonResponse(data)


def customer_document_download(request, pk):
    doc_obj = get_object_or_404(OcTsgContactDocuments, pk=pk)
    response = FileResponse(doc_obj.filename, as_attachment=True)
    return response


def customer_document_delete(request, pk):
    data = dict()
    template_name = 'customer/dialogs/customer_document_delete.html'
    context = dict()
    customer_doc_obj = get_object_or_404(OcTsgContactDocuments, pk=pk)

    if request.method == 'POST':
        customer_doc_obj = get_object_or_404(OcTsgContactDocuments, pk=pk)
        if customer_doc_obj:
            customer_doc_obj.delete()
            #delete the cached file
            fullpath = os.path.join(settings.MEDIA_ROOT, settings.THUMBNAIL_CACHE ,customer_doc_obj.cache_path)
            if os.path.isfile(fullpath):
                os.remove(fullpath)
            data['success_post'] = True
            data['document_ajax_url'] = reverse_lazy('fetch_customer_documents',
                                                     kwargs={'customer_id': customer_doc_obj.contact_id})
            data['divUpdate'] = ['div-customer_documents', 'html_content']
        else:
            data['success_post'] = False
    else:
        context['dialog_title'] = "<strong>DELETE</strong> document"
        context['action_url'] = reverse_lazy('customer_document-delete', kwargs={'pk': pk})
        context['form_id'] = 'form-customer_document-delete'
        context['customer_id'] = customer_doc_obj.contact_id
        data['upload'] = False

    data['html_form'] = render_to_string(template_name,
                                                     context,
                                                     request=request
                                                     )

    return JsonResponse(data)

def customer_xero_add(request, customer_id):
    f = Fernet(settings.XERO_TOKEN_FERNET)
    encrypted_order_num = f.encrypt(str(customer_id).encode()).decode()
    return_url = reverse_lazy('xero_customer_add', kwargs={'contact_id': customer_id, 'encrypted': encrypted_order_num})
    return HttpResponseRedirect(return_url)


def customer_xero_update(request, customer_id):
    f = Fernet(settings.XERO_TOKEN_FERNET)
    encrypted_order_num = f.encrypt(str(customer_id).encode()).decode()
    return_url = reverse_lazy('xero_customer_update', kwargs={'contact_id': customer_id, 'encrypted': encrypted_order_num})
    return HttpResponseRedirect(return_url)



