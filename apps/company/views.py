from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from apps.company.models import OcTsgCompany
from apps.company.serializers import CompanyListSerializer
from apps.company.forms import CompanyEditForm
from django.urls import reverse_lazy
from django.template.loader import render_to_string
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core import serializers
from apps.customer.forms import CustomerForm, AddressForm
from apps.customer.models import OcCustomer



# Create your views here.
def company_list(request):
    template_name = 'company/company_list.html'
    content = {'pageview': 'Company'}
    content['heading'] = ""
    return render(request, template_name, content)


class company_list_asJSON(viewsets.ModelViewSet):
    queryset = OcTsgCompany.objects.all()
    serializer_class = CompanyListSerializer

    def retrieve(self, request):
        company_list = OcTsgCompany.objects.all()
        serializer = self.get_serializer(company_list, many=True)
        return Response(serializer.data)


def company_details(request, company_id):
    company_obj = get_object_or_404(OcTsgCompany.objects.select_related(), pk=company_id)

    context = {"company_obj": company_obj}

    template_name = 'company/company_layout.html'

    context['pageview'] = 'All companies'
    context['pageview_url'] = reverse_lazy('allcompanies')
    context['heading'] = company_obj.company_name

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
        'status': 1
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
            data['form_is_valid'] = True
            company_id = form_instance.company_id
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
            data['form_is_valid'] = True
            company_details_obj.save()
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
        'status': 1,
        'ip': '0.0.0.0',
        'status': 1,
        'safe': 1,
        'customer_group': 1
    }

    company_address = {
        'address_1': company_obj.address,
        'city': company_obj.city,
        'postcode': company_obj.postcode,
        'area': company_obj.area,
        'country': company_obj.country,
        'country_id': company_obj.country_id
    }

    form = CustomerForm(initial=iniitial_data)
    form_address = AddressForm(initial=company_address)
    del company_address['country']

    content = {'form': form, 'form_address': form_address, 'company_id': company_id, 'initials': iniitial_data, 'company_address': company_address}

    html_form = render_to_string(template_name, content, request=request)
    return JsonResponse({'html_form': html_form})


def company_contact_save(request):
    data = dict()
    if request.method == 'POST':
        form = CustomerForm(request.POST)
        if form.is_valid():
            form.save()
            form_instance = form.instance
            data['form_is_valid'] = True
            customer_id = form_instance.customer_id
            form_address = AddressForm(request.POST)
            form_address_instance = form_address.instance
            form_address_instance.customer_id = customer_id
            form_address_instance.fullname = form.fullname
            form_address_instance.company = form.company
            if form_address.is_valid():
                form_address.save()
            else:
                data['form_is_valid'] = False

        else:
            data['form_is_valid'] = False

    context = {'form': form}
    data['html_form'] = render_to_string('company/dialogs/create_company_contact.html',
                                         context,
                                         request=request
                                         )

    data['redirect_url'] = reverse_lazy('customerdetails', kwargs={'customer_id': customer_id})

    return JsonResponse(data)


