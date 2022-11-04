from django.shortcuts import render, get_object_or_404, redirect
from django.core import serializers
from .models import OcCustomer, OcAddress
from .serializers import CustomerListSerializer
from .forms import AddressForm
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from rest_framework import viewsets
from rest_framework.response import Response
from django.template.loader import render_to_string
from apps.orders.models import OcOrder, OcTsgPaymentMethod
from bootstrap_modal_forms.generic import BSModalCreateView, BSModalUpdateView
from django.urls import reverse_lazy
import json


def customers_list(request):
    template_name = 'customer/list_customers.html'
    content = {'pageview': 'Customers'}
    content['heading'] = ""
    return render(request, template_name, content)


class customer_list_asJSON_s(viewsets.ModelViewSet):
    queryset = OcCustomer.objects.all()
    serializer_class = CustomerListSerializer

    def retrieve(self, request, pk=None):
        customer_list = OcCustomer.objects.filter(parent_company_id=pk)
        serializer = self.get_serializer(customer_list, many=True)
        return Response(serializer.data)

class customer_list_bycompany(viewsets.ModelViewSet):
    queryset = OcCustomer.objects.all()
    serializer_class = CustomerListSerializer

    def retrieve(self, request, pk=None):
        customer_list = OcCustomer.objects.filter(parent_company_id=pk)
        serializer = self.get_serializer(customer_list, many=True)
        return Response(serializer.data)


def customers_details(request, customer_id):
    template_name = 'customer/customer_layout.html'

    customer_obj = get_object_or_404(OcCustomer, pk=customer_id)

    content = {"customer_obj": customer_obj}

    addresses = get_default_address(customer_obj)

    address_book = customer_obj.ocaddress_set.all().order_by('postcode')
    content['customer_address'] = addresses
    content['address_book'] = address_book
    content['heading'] = customer_obj.fullname
    content['pageview'] = "Customers"

    return render(request, template_name, content)


def customer_address_book(request, customer_id, view_type):
    template_name = 'customer/customer_addressbook.html'
    address_obj = OcAddress.objects.filter(customer=customer_id)

    content = {'addresses': address_obj,
               'viewtype': view_type}

    return render(request, template_name, content)


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
    address = get_object_or_404(OcAddress, pk=address_id)
    if request.method == 'POST':
        form = AddressForm(request.POST, instance=address)
        if form.is_valid():
            data['form_is_valid'] = True
            address.save()
            customer_update_detault_address(address)
        else:
            data['form_is_valid'] = False

    else:
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
    address_book = customer_obj.ocaddress_set.all().order_by('postcode');

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
    address_cnt = customer_obj.ocaddress_set.count()
    addresses = {}
    if address_cnt == 1:
        addresses['billing'] = customer_obj.ocaddress_set.first()
        addresses['shipping'] = customer_obj.ocaddress_set.first()
    elif address_cnt > 1:
        def_billing = customer_obj.ocaddress_set.filter(default_billing=1).order_by('address_id').first()
        if def_billing is None:
            addresses['billing'] = customer_obj.ocaddress_set.first()
            addresses['billing_auto'] = True
        else:
            addresses['billing'] = def_billing
            addresses['billing_auto'] = False

        def_shipping = customer_obj.ocaddress_set.filter(default_shipping=1).order_by('address_id').first()
        if def_shipping is None:
            addresses['shipping'] = customer_obj.ocaddress_set.first()
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
        new_order_obj.payment_method = ''
        new_order_obj.order_status_id = 10
        new_order_obj.payment_status_id = 1
        new_order_obj.payment_type_id = 4
        new_order_obj.payment_method_rel_id = 8
        new_order_obj.invoice_no = 0
        new_order_obj.invoice_prefix = 'SSAN'
        new_order_obj.store_id = customer_obj.store_id
        new_order_obj.customer_group_id = customer_obj.customer_group_id
        new_order_obj.total = 0.00
        new_order_obj.language_id = 1
        new_order_obj.currency_id = 1
        new_order_obj.currency_value = 1
        new_order_obj.tax_rate_id = 86

        address_book = get_default_address(customer_obj)

        new_order_obj.payment_fullname = address_book['billing'].fullname
        new_order_obj.payment_company = address_book['billing'].company
        new_order_obj.payment_email = address_book['billing'].email
        new_order_obj.payment_telephone = address_book['billing'].telephone
        new_order_obj.payment_address_1 = address_book['billing'].address_1
        new_order_obj.payment_city = address_book['billing'].city
        new_order_obj.payment_area = address_book['billing'].area
        new_order_obj.payment_postcode = address_book['billing'].postcode
        new_order_obj.payment_country_id = address_book['billing'].country_id
        new_order_obj.payment_country = address_book['billing'].country


        new_order_obj.shipping_fullname = address_book['shipping'].fullname
        new_order_obj.shipping_company = address_book['shipping'].company
        new_order_obj.shipping_email = address_book['shipping'].email
        new_order_obj.shipping_telephone = address_book['shipping'].telephone
        new_order_obj.shipping_address_1 = address_book['shipping'].address_1
        new_order_obj.shipping_city = address_book['shipping'].city
        new_order_obj.shipping_area = address_book['shipping'].area
        new_order_obj.shipping_postcode = address_book['shipping'].postcode
        new_order_obj.shipping_country_id = address_book['shipping'].country_id
        new_order_obj.shipping_country = address_book['shipping'].country

        new_order_obj.save()

        new_order_obj.ocordertotal_set.create(code='sub_total', sort_order=1, title='Sub-Total', value=0)
        new_order_obj.ocordertotal_set.create(code='shipping', sort_order=3, title='Shipping', value=0)
        new_order_obj.ocordertotal_set.create(code='tax', sort_order=5, title='tax', value=0)
        new_order_obj.ocordertotal_set.create(code='total', sort_order=9, title='Total', value=0)

        data['form_is_valid'] = True
        data['order_id'] = new_order_obj.order_id


    context = {"customer_id": customer_id}

    template_name = 'customer/dialogs/customer_add_order.html'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)
