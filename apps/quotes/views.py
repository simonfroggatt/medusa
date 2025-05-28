from django.shortcuts import render, get_object_or_404
from apps.quotes.models import OcTsgQuote, OcTsgQuoteProduct
from apps.quotes.serializers import QuoteListSerializer, QuoteProductListSerializer
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.template.loader import render_to_string
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from apps.quotes.forms import QuoteDetailsEditForm, ProductAddForm, ProductEditForm, QuoteBillingForm, QuoteShippingForm
from apps.products.models import OcTsgBulkdiscountGroups
from apps.pricing.models import OcTsgProductMaterial
from django.urls import reverse_lazy
from apps.products import services as prod_services
from django.db.models import Sum, F
from decimal import Decimal, ROUND_HALF_UP
from .services import create_quote_prices_text
from django.core.mail import send_mail
from apps.customer.models import OcCustomer
from apps.customer.views import get_default_address
from apps.shipping.models import OcTsgShippingMethod
from apps.templating.services import get_template_data
from apps.templating.views import OcTsgTemplates
import hashlib
import uuid
from apps.customer.models import OcCustomer, OcAddress, OcTsgCompany
from apps.customer.serializers import AddressSerializer
from apps.orders.models import OcOrder, OcOrderProduct
from apps.orders.views import calc_order_totals
from nameparser import HumanName


class Quotes_asJSON(viewsets.ModelViewSet):
    queryset = OcTsgQuote.objects.all()
    serializer_class = QuoteListSerializer

    def retrieve(self, request, pk=None):
        quotes_obj = OcTsgQuote.objects.all()
        serializer = self.get_serializer(quotes_obj, many=True)
        return Response(serializer.data)


class Quotes_Customer(viewsets.ModelViewSet):
    queryset = OcTsgQuote.objects.all()
    serializer_class = QuoteListSerializer

    def retrieve(self, request, pk=None):
        quote_object = OcTsgQuote.objects.filter(customer_id=pk).order_by('-quote_id')
        serializer = self.get_serializer(quote_object, many=True)
        return Response(serializer.data)

def quote_list(request):
    template_name = 'quotes/quote_list.html'
    context = {'pageview': 'All Quotes'}
    return render(request, template_name, context)

def quote_details(request, quote_id):
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
    if not quote_obj.quote_hash:
        unique_id = uuid.uuid4().hex  # Generates a random UUID and gets the hex representation
        # Hash the unique identifier with MD5
        quote_hash = hashlib.md5(unique_id.encode()).hexdigest()
        quote_obj.quote_hash = quote_hash
        quote_obj.save()

    context = {"quote_obj": quote_obj}
    if quote_obj.customer_id:
        context["addressItem"] = quote_obj.customer.address_customer.all().order_by('postcode')
    else:
        context["addressItem"] = []

    template_name = 'quotes/quote_layout.html'
    context['pageview'] = 'All Quotes'

    quote_products_obj = OcTsgQuoteProduct.objects.filter(quote_id=quote_id)
    quote_lines = quote_products_obj.count()
    product_count = quote_products_obj.aggregate(Sum('quantity'))
    context['quote_lines'] = quote_lines
    context['quote_product_count'] = product_count['quantity__sum']
    context['quote_total'] = get_quote_totals(quote_id, quote_obj.tax_rate.rate)

    return render(request, template_name, context)


def quote_details_edit(request, quote_id):
    data = dict()


    initial_data = {
        'language_id': 1,
        'currency' : 1,
        'store': 1
    }

    quote_details_obj = get_object_or_404(OcTsgQuote, pk=quote_id)

    if request.method == 'POST':
        form = QuoteDetailsEditForm(request.POST, instance=quote_details_obj)
        if form.is_valid():
            data['form_is_valid'] = True
            data['redirect_url'] = reverse_lazy('quote_details', kwargs={'quote_id': quote_id})
            quote_details_obj.save()
        else:
            data['form_is_valid'] = False

    else:
        form = QuoteDetailsEditForm(instance=quote_details_obj)

    shipping_obj = OcTsgShippingMethod.objects.filter(store_id=quote_details_obj.store_id)
    shipping_rates = []
    for shipping_data in shipping_obj:
        shipping_rate_vals = {'shipping_id': shipping_data.shipping_method_id,
                              'rate': float(shipping_data.price)}
        shipping_rates.append(shipping_rate_vals)

    template_name = 'quotes/dialog/edit_quote_details.html'

    context = {'quote_id': quote_id,
               'form': form,
               'initials': initial_data,
               'shipping_rates': shipping_rates}

    data['html_form'] = render_to_string(template_name, context, request= request)

    return JsonResponse(data)

def quote_add_product(request, quote_id):
    data = dict()
    if request.method == 'POST':
        form = ProductAddForm(request.POST)
        if form.is_valid():
            quote_product = form.save(commit=False)
            quote_product.reward = 0
            quote_product.save()
           #calc_quote_totals(quote_id)
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

    form = ProductAddForm()

    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)

    customer_discount = 0
    if quote_obj.customer:
        if quote_obj.customer.parent_company:
            customer_discount = quote_obj.customer.parent_company.discount
        else:
            customer_discount = 0

   # bespoke_addon_options = get_bespoke_product_options()
    #quote_data = OcTsgQuote.objects.filter(quote_id=quote_id).values('tax_rate__rate', 'customer_id', 'store_id').first()
    context = {
        "quote_id": quote_id,
        "tax_rate": quote_obj.tax_rate.rate,
        "customer_id": quote_obj.customer_id,
        "store_id": quote_obj.store_id,
       # "tax_rate": quote_data['tax_rate__rate'],
       # "customer_id": quote_data['customer_id'],
        "form_post_url" : reverse_lazy('quoteproductadd', kwargs={'quote_id': quote_id}),
        "price_for": "Q", #
        'customer_discount': customer_discount,
        "form" : form,
        #"store_id": quote_data['store_id']
    }
    template_name = 'orders/dialogs/add_product_layout_dlg.html'

    qs_bulk = OcTsgBulkdiscountGroups.objects.filter(is_active=1)
    default_bulk = 1

    bulk_details = prod_services.create_bulk_arrays(qs_bulk)
    context['bulk_info'] = bulk_details

    context['material_obj'] = OcTsgProductMaterial.objects.all()

    # return render(request, template_name, context)
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


class Quote_Products_asJSON(viewsets.ModelViewSet):
    queryset = OcTsgQuoteProduct.objects.all()
    serializer_class = QuoteProductListSerializer

    def retrieve(self, request, pk=None):
        quote_products = OcTsgQuoteProduct.objects.filter(quote_id=pk)
        serializer = self.get_serializer(quote_products, many=True)
        return Response(serializer.data)


def get_quote_product_text(request):
    data = dict()
    quote_id = request.GET.get('quote_id')
    quote_products_obj = OcTsgQuoteProduct.objects.filter(quote_id=quote_id)
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)

    quote_lines = quote_products_obj.count()
    product_count = quote_products_obj.aggregate(Sum('quantity'))
    data['quote_lines'] = quote_lines
    data['quote_product_count'] = product_count['quantity__sum']
    data['quote_total'] = get_quote_totals(quote_id, quote_obj.tax_rate.rate)
    return JsonResponse(data)


def get_quote_totals(quote_id, tax_rate):
    data = dict()
    quote_products_obj = OcTsgQuoteProduct.objects.filter(quote_id=quote_id)
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
    if quote_products_obj:
        subtotal = quote_products_obj.aggregate(sum=Sum(F('price') * F('quantity')))['sum']
        discount = quote_obj.discount
        if not discount:
            discount = Decimal(0.00)

        data['subtotal'] = Decimal(subtotal.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
        data['discount'] = discount
        if quote_obj.shipping_rate:
            dml_shipping_rate = Decimal(quote_obj.shipping_rate.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
        else:
            dml_shipping_rate = Decimal(quote_obj.shipping_type.price.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))

        subtotal_net = subtotal - discount + dml_shipping_rate
        data['tax_value'] = Decimal((subtotal_net*(tax_rate/100)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
        data['total'] = Decimal((subtotal_net + data['tax_value']).quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
    else:
        data['subtotal'] = 0.00
        data['discount'] = 0.00
        data['tax_value'] = 0.00
        data['total'] = 0.00

    quote_obj.total = data['total']
    quote_obj.discount = data['discount']
    quote_obj.save()
    return data


def quote_product_delete(request, quote_id, quote_product_id):
    data = dict()
    quote_product = get_object_or_404(OcTsgQuoteProduct, pk=quote_product_id, quote_id=quote_id)
    if request.method == 'POST':
        data['form_is_valid'] = True
        quote_product.delete()

    template_name = 'quotes/dialog/delete_product.html'
    context = {'quote_product_id': quote_product_id,
               'quote_id': quote_id}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def quote_product_edit(request, quote_id, quote_product_id):
    data = dict()
    quote_product = get_object_or_404(OcTsgQuoteProduct, pk=quote_product_id)
    if request.method == 'POST':
        form = ProductEditForm(request.POST, instance=quote_product)
        if form.is_valid():
            data['form_is_valid'] = True
            quote_product.save()
            #calc_quote_totals(quote_id)
            # - call come othere function like reloading the tablecustomer_update_detault_address(address)
        else:
            data['form_is_valid'] = False

    else:
        form = ProductEditForm(instance=quote_product)
        form.fields['quote_id'] = quote_id

    template_name = 'orders/dialogs/order_product_edit.html'
    store_id = quote_product.quote.store_id

  #  if quote_product.product_id > 0:
        #TODO - use correct bulk
  #      qs_product_bulk = dict; #OcTsgProductToBulkDiscounts.objects.get(product__product_id=quote_product.product_id, store_id=store_id)
  #      default_bulk = qs_product_bulk.bulk_discount_group.bulk_group_id
  #      qs_bulk = OcTsgBulkdiscountGroups.objects.filter(bulk_group_id=qs_product_bulk.bulk_discount_group.bulk_group_id)
  #  else:
    qs_bulk = OcTsgBulkdiscountGroups.objects.filter(is_active=1)
    default_bulk = 1

    bulk_details = prod_services.create_bulk_arrays(qs_bulk)
    quote_data = OcTsgQuote.objects.filter(quote_id=quote_id).values('tax_rate__rate').first()

    context = {'quote_id': quote_id,
               'quote_product_id': quote_product_id,
               'form': form,
               'bulk_info': bulk_details,
               "tax_rate": quote_data['tax_rate__rate'],
               'default_bulk': default_bulk,
               "form_post_url": reverse_lazy('quoteproductedit', kwargs={'quote_id': quote_id, 'quote_product_id': quote_product_id}),
               "price_for": "Q",  #
               }

    #return render(request, template_name, context)
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def quote_get_text(request, quote_id):
    data = dict()
    store_id = OcTsgQuote.objects.filter(quote_id=quote_id).first().store_id

    template_name = 'TEMPLATE_QUOTE_TEXT'


    template_obj = get_template_data('TEMPLATE_QUOTE_TEXT', store_id)['main']
    pricing_template = get_template_data('TEMPLATE_QUOTE_PRICE', store_id)['main']
    #shipping_template = get_template_data('shipping_price', store_id)['main']
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
    firstname = quote_obj.fullname.split()[0]

    quote_products_obj = OcTsgQuoteProduct.objects.filter(quote_id=quote_id)

    quote_prices_str = ""
    line_str_dict = {
        '{{size}}': 'size_name',
        '{{material}}': 'material_name',
        '{{price}}': 'price',
        '{{qty}}': 'quantity',
    }

    for quote_row in list(quote_products_obj.values()):
        line_str = pricing_template

        if quote_row['is_bespoke']:
            line_str_dict['{{model}}'] = 'name'
        else:
            line_str_dict['{{model}}'] = 'model'

        for i, j in line_str_dict.items():
            tmpval = quote_row[j]
            if isinstance(tmpval, Decimal):
                tmpval = "{0:.2f}".format(tmpval)
            else:
                tmpval = str(tmpval)
            line_str = line_str.replace(i, tmpval)

        #quote_prices_str += " - " + quote_row['size_name'] + " " + quote_row.material_name + " @ "+ \
                   #         quote_obj.currency.symbol_left + ("{0:.2f}".format(quote_row.price)) +" each for " + str(quote_row.quantity) + " off" + "\r\n"
        line_str = line_str.replace('{{currency}}', quote_obj.currency.symbol_left)
        quote_prices_str += line_str + '\r'

    text_shipping = quote_obj.shipping_type.title + " @ " + quote_obj.currency.symbol_left + ("{0:.2f}".format(quote_obj.shipping_rate))
    template_str = template_obj.replace('{{firstname}}', firstname)
    template_str = template_str.replace('{{quote_prices}}', quote_prices_str)
    template_str = template_str.replace('{{shipping_price}}', text_shipping)
    template_name = 'quotes/dialog/quote_text.html'

    context = {'quote_id': quote_id, 'quote_text_str': template_str}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request)
    return JsonResponse(data)


def quote_delete(request):
    data = dict()
    data['form_is_valid'] = False

    if request.method == 'POST':
        quote_id = request.POST.get('quote_id')
        qutoe_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
        qutoe_obj.delete()
        data['redirect_url'] = reverse_lazy('allquotes')
        data['form_is_valid'] = True

    return JsonResponse(data)


def quote_delete_dlg(request, quote_id):
    data = dict()

    template_name = 'quotes/dialog/delete_quote.html'
    context = {'quote_id': quote_id}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def quick_quote(request):
    data = dict()
    template_name = 'quotes/dialog/quick_quote.html'
    initial_data = {
        'language_id': 1,
        'status': 1,
        'currency_id': 1,
        'tax_rate': 86,
        'days_valid': 30,
        'shipping_type': 1,
        'shipping_rate': 0,
        'sent': False,
        'store': 1
    }

    if request.method == 'POST':
        form = QuoteDetailsEditForm(request.POST, initial=initial_data)
        if form.is_valid():
            form_instance = form.instance
            form_instance.total = 0.00
            form_instance.discount = 0.00
            form_instance.language_id = 1
            form_instance.currency_id = 1

            unique_id = uuid.uuid4().hex  # Generates a random UUID and gets the hex representation
            # Hash the unique identifier with MD5
            quote_hash = hashlib.md5(unique_id.encode()).hexdigest()
            form_instance.quote_hash = quote_hash

            form.save()
            data['form_is_valid'] = True
            quote_id = form_instance.quote_id
            data['redirect_url'] = reverse_lazy('quote_details', kwargs={'quote_id': quote_id})
        else:
            data['form_is_valid'] = False

    form = QuoteDetailsEditForm(initial=initial_data)
    context = {'form': form, 'data': data, 'initials': initial_data}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def create_quote_customer(request, customer_id):
    data = dict()
    if request.method == 'POST':
        #ignore the incoming customerid
        post_customer_id = request.POST.get('customer_id')
        new_quote_obj = OcTsgQuote()
        customer_obj = get_object_or_404(OcCustomer, pk=customer_id)

        new_quote_obj.customer_id = customer_id
        new_quote_obj.store_id = customer_obj.store_id
        new_quote_obj.total = 0.00
        new_quote_obj.language_id = 1
        new_quote_obj.currency_id = 1
        new_quote_obj.currency_value = 1
        new_quote_obj.tax_rate_id = 86
        new_quote_obj.days_valid = 30
        new_quote_obj.sent = False
        new_quote_obj.shipping_type_id = 1

        obj_shipping = get_object_or_404(OcTsgShippingMethod, pk=1)
        new_quote_obj.shipping_rate = obj_shipping.price

        new_quote_obj.fullname = customer_obj.fullname
        new_quote_obj.firstname = customer_obj.firstname
        new_quote_obj.lastname = customer_obj.lastname
        new_quote_obj.email = customer_obj.email
        new_quote_obj.telephone = customer_obj.telephone

        if customer_obj.parent_company:
            if customer_obj.company:
                new_quote_obj.company = customer_obj.company
            else:
                new_quote_obj.company = customer_obj.parent_company.company_name
        else:
            new_quote_obj.company = customer_obj.company


        address_book = get_default_address(customer_obj)

        if customer_obj.parent_company:
            new_quote_obj.payment_fullname = customer_obj.parent_company.accounts_contact_fullname
            new_quote_obj.payment_company = customer_obj.parent_company.company_name
            new_quote_obj.payment_email = customer_obj.parent_company.accounts_email
            new_quote_obj.payment_telephone = customer_obj.parent_company.accounts_telephone
            new_quote_obj.payment_address = customer_obj.parent_company.accounts_address
            new_quote_obj.payment_city = customer_obj.parent_company.accounts_city
            new_quote_obj.payment_area = customer_obj.parent_company.accounts_area
            new_quote_obj.payment_postcode = customer_obj.parent_company.accounts_postcode
            new_quote_obj.billing_country_name_id = customer_obj.parent_company.accounts_country_id
            new_quote_obj.payment_country = customer_obj.parent_company.accounts_country
        else:
            billing_address = address_book['billing']
            new_quote_obj.payment_fullname = billing_address.fullname
            new_quote_obj.payment_company = billing_address.company
            new_quote_obj.payment_email = billing_address.email
            new_quote_obj.payment_telephone = billing_address.telephone
            new_quote_obj.payment_address = billing_address.address_1
            new_quote_obj.payment_city = billing_address.city
            new_quote_obj.payment_area = billing_address.area
            new_quote_obj.payment_postcode = billing_address.postcode
            new_quote_obj.billing_country_name_id = billing_address.country_id
            new_quote_obj.payment_country = billing_address.country

        new_quote_obj.shipping_fullname = address_book['shipping'].fullname
        new_quote_obj.shipping_company = address_book['shipping'].company
        new_quote_obj.shipping_email = address_book['shipping'].email
        new_quote_obj.shipping_telephone = address_book['shipping'].telephone
        new_quote_obj.shipping_address = address_book['shipping'].address_1
        new_quote_obj.shipping_city = address_book['shipping'].city
        new_quote_obj.shipping_area = address_book['shipping'].area
        new_quote_obj.shipping_postcode = address_book['shipping'].postcode
        new_quote_obj.shipping_country_name_id = address_book['shipping'].country_id
        new_quote_obj.shipping_country = address_book['shipping'].country

        unique_id = uuid.uuid4().hex  # Generates a random UUID and gets the hex representation
        # Hash the unique identifier with MD5
        quote_hash = hashlib.md5(unique_id.encode()).hexdigest()
        new_quote_obj.quote_hash = quote_hash

        new_quote_obj.save()
        data['redirect_url'] = reverse_lazy('quote_details', kwargs={'quote_id': new_quote_obj.quote_id})


        data['form_is_valid'] = True
        data['quote_id'] = new_quote_obj.quote_id

    context = {"customer_id": customer_id}

    template_name = 'customer/dialogs/customer_add_quote.html'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)

def test_send_email(request):
    send_mail(
        'Subject here',
        'Here is the message.',
        'sales@safetysignsandnotices.co.uk',
        ['simonfroggatt76@gail.com'],
        fail_silently=False,
    )



def find_best_yield(large_width, large_height, small_width, small_height):
    max_yield = 0
    for i in range(large_height // small_height + 1):
        for j in range(large_width // small_width + 1):
            yield_ = i * j
            if yield_ > max_yield and small_width * j <= large_width and small_height * i <= large_height:
                max_yield = yield_
    return max_yield


def discount_change_dlg(request, quote_id):
    data = dict()
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)

    quote_totals = get_quote_totals(quote_id, quote_obj.tax_rate.rate)

    data['tax_value'] = quote_totals['tax_value']
    data['total'] = quote_totals['total']

    if request.method == 'POST':
        discount_value = request.POST.get('by_value')
        quote_obj.discount = discount_value
        quote_obj.save()
        data['form_is_valid'] = True

    template_name = 'quotes/dialog/quote_discount_change.html'


    context = {'quote_id': quote_id,
               'subtotal': quote_totals['subtotal'],
               'discount_value': quote_totals['discount']}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    data['redirect_url'] = reverse_lazy('quote_details', kwargs={'quote_id': quote_id})

    return JsonResponse(data)


def quote_billing_edit(request, quote_id):
    data = dict()
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
    if request.method == 'POST':
        form = QuoteBillingForm(request.POST, instance=quote_obj)
        if form.is_valid():
            data['form_is_valid'] = True
            add_address = form.data['add_address']
            if int(add_address) == 1:
                address_data = dict()
                address_data['customer_id'] = form.data['quote_customer_id']
                address_data['fullname'] = form.data['payment_fullname']
                address_data['company'] = form.data['payment_company']
                address_data['email'] = form.data['payment_email']
                address_data['telephone'] = form.data['payment_telephone']
                address_data['address_1'] = form.data['payment_address']
                address_data['city'] = form.data['payment_city']
                address_data['area'] = form.data['payment_area']
                address_data['postcode'] = form.data['payment_postcode']
                paymentcountry = form.data['payment_country']
                address_data['country_id'] = form.data['payment_country']
                #address_data['country'] = form.data['payment_country']
                add_customer_address(address_data)

            quote_obj.save()
        else:
            data['form_is_valid'] = False

    else:
        form = QuoteBillingForm(instance=quote_obj)
        form.fields['quote_id'] = quote_id


    template_name = 'quotes/dialog/quote_billing_edit.html'
    context = {'quote_id': quote_id,
               'form': form}

    if quote_obj.customer:
        context['quote_customer_id'] = quote_obj.customer_id
    else:
        context['quote_customer_id'] = 0;

    # return render(request, template_name, context)
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def quote_shipping_edit(request, quote_id):
    data = dict()
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
    if request.method == 'POST':
        form = QuoteShippingForm(request.POST, instance=quote_obj)
        if form.is_valid():
            data['form_is_valid'] = True
            add_address = form.data['add_address']
            if int(add_address) == 1:
                address_data = dict()
                address_data['customer_id'] = form.data['quote_customer_id']
                address_data['fullname'] = form.data['shipping_fullname']
                address_data['company'] = form.data['shipping_company']
                address_data['email'] = form.data['shipping_email']
                address_data['telephone'] = form.data['shipping_telephone']
                address_data['address_1'] = form.data['shipping_address']
                address_data['city'] = form.data['shipping_city']
                address_data['area'] = form.data['shipping_area']
                address_data['postcode'] = form.data['shipping_postcode']
                address_data['country_id'] = form.data['shipping_country']
                #address_data['country'] = form.data['shipping_country']
                add_customer_address(address_data)

            quote_obj.save()
        else:
            data['form_is_valid'] = False

    else:
        form = QuoteShippingForm(instance=quote_obj)
        form.fields['quote_id'] = quote_id

    template_name = 'quotes/dialog/quote_shipping_edit.html'
    context = {'quote_id': quote_id,
               'form': form}

    if quote_obj.customer:
        context['quote_customer_id'] = quote_obj.customer_id
    else:
        context['quote_customer_id'] = 0;

    # return render(request, template_name, context)
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)

def quote_shipping_search(request, quote_id):
    data = dict()
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
    context = {'quote_id': quote_id}

    if quote_obj.customer:
        if quote_obj.customer.parent_company:
            context['quote_company_id'] = quote_obj.customer.parent_company.company_id
        else:
            context['quote_company_id'] = 0
            context['quote_customer_id'] = quote_obj.customer_id
    else:
        context['quote_company_id'] = 0
        context['quote_customer_id'] = 0;


    template_name = 'quotes/dialog/quote_shipping_search.html'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)

def add_customer_address(address_data):
    customer_id = address_data['customer_id']
    address_obj = OcAddress()
    address_obj.customer_id = address_data['customer_id']
    address_obj.fullname = address_data['fullname']
    address_obj.company = address_data['company']
    address_obj.email = address_data['email']
    address_obj.telephone = address_data['telephone']
    address_obj.address_1 = address_data['address_1']
    address_obj.city = address_data['city']
    address_obj.area = address_data['area']
    address_obj.postcode = address_data['postcode']
    address_obj.country_id = address_data['country_id']
    is_valid = address_obj.save()
    return is_valid


def update_quote_billing_from_address_book(request, quote_id):
    data = dict()
    if request.method == 'POST':
        address_book_id = int(request.POST.get('address_book_id_billing', 0))
        if address_book_id > 0:
            quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
            address_obj = get_object_or_404(OcAddress, pk=address_book_id)
            quote_obj.payment_fullname = address_obj.fullname
            quote_obj.payment_company = address_obj.company
            quote_obj.payment_email = address_obj.email
            quote_obj.payment_telephone = address_obj.telephone
            quote_obj.payment_address = address_obj.address_1
            quote_obj.payment_city = address_obj.city
            quote_obj.payment_area = address_obj.area
            quote_obj.payment_postcode = address_obj.postcode
            quote_obj.payment_country_id = address_obj.country_id
            quote_obj.save()


    data['is_valid'] = True
    return JsonResponse(data)


def update_quote_shipping_from_address_book(request, quote_id):
    data = dict()
    if request.method == 'POST':
        address_book_id = int(request.POST.get('address_book_id_shipping', 0))
        if address_book_id > 0:
            quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
            address_obj = get_object_or_404(OcAddress, pk=address_book_id)
            quote_obj.shipping_fullname = address_obj.fullname
            quote_obj.shipping_company = address_obj.company
            quote_obj.shipping_email = address_obj.email
            quote_obj.shipping_telephone = address_obj.telephone
            quote_obj.shipping_address = address_obj.address_1
            quote_obj.shipping_city = address_obj.city
            quote_obj.shipping_area = address_obj.area
            quote_obj.shipping_postcode = address_obj.postcode
            quote_obj.shipping_country_id = address_obj.country_id
            quote_obj.save()


    data['is_valid'] = True
    return JsonResponse(data)


def get_quote_addresses(request, quote_id):
    data = dict()
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)

    context = {"quote_obj": quote_obj}
    data['html_billing_address'] = render_to_string('quotes/sub_layout/billing_address_ajax.html',
                                            context,
                                            request=request
                                            )
    data['html_shipping_address'] = render_to_string('quotes/sub_layout/shipping_address_ajax.html',
                                                    context,
                                                    request=request
                                                    )
    data['quote_id'] = quote_id

    return JsonResponse(data)


def company_quote_api_account_address(request, quote_id, company_id):
    data = dict()
    data['address'] = None
    if request.method == 'GET':
        company_obj = get_object_or_404(OcTsgCompany, pk=company_id)
        quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
        quote_obj.payment_fullname = f"{company_obj.accounts_contact_firstname} {company_obj.accounts_contact_lastname}"
        quote_obj.payment_firstname = company_obj.accounts_contact_firstname
        quote_obj.payment_lastname = company_obj.accounts_contact_lastname
        quote_obj.payment_company = company_obj.company_name
        quote_obj.payment_email = company_obj.accounts_email
        quote_obj.payment_telephone = company_obj.accounts_telephone
        quote_obj.payment_address = company_obj.accounts_address
        quote_obj.payment_city = company_obj.accounts_city
        quote_obj.payment_area = company_obj.accounts_area
        quote_obj.payment_postcode = company_obj.accounts_postcode
        quote_obj.payment_country_name = company_obj.accounts_country

        quote_obj.save()
        data['form_is_valid'] = True
        data['quote_id'] = quote_id
    else:
        data['form_is_valid'] = False

    return JsonResponse(data)

class QuoteShippingAddressList(viewsets.ModelViewSet):
    #queryset = OcAddress.objects.filter(customer_id=2)
    queryset = OcAddress.objects.all()
    serializer_class = AddressSerializer


    def retrieve(self, request, pk=None):
        quote_obj = get_object_or_404(OcTsgQuote, pk=pk)
        customer_id = quote_obj.customer_id
        if quote_obj.customer.parent_company:
            company_id = quote_obj.customer.parent_company.company_id
            queryset = OcAddress.objects.filter(customer__parent_company=company_id).order_by('postcode')
        else:
            queryset = OcAddress.objects.filter(customer_id=customer_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


def convert_to_order(request, quote_id, quote_hash):
    data = dict()
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
    if request.method == 'POST':
        if quote_hash != quote_obj.quote_hash:
            data['form_is_valid'] = False
        if quote_obj:
            new_order_id = convert_quote_to_order(quote_id)
            data['form_is_valid'] = new_order_id > 0
            #now go to the order details
            data['redirect_url'] = reverse_lazy('order_details', kwargs={'order_id': new_order_id})
        else:
            data['form_is_valid'] = False
    else:
        data['form_is_valid'] = False

    template_name = 'quotes/dialog/convert_to_order.html'
    context = {'quote_id': quote_id, 'quote_hash': quote_obj.quote_hash}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)



def convert_quote_to_order(quote_id):
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
    new_order = OcOrder()


    #set the order details first
    new_order.store_id = quote_obj.store_id
    new_order.invoice_prefix = quote_obj.store.prefix
    new_order.store_name = quote_obj.store.name
    new_order.store_url = quote_obj.store.url

    new_order.customer_id = quote_obj.customer_id
    new_order.company = quote_obj.company
    new_order.fullname = quote_obj.fullname
    new_order.firstname = quote_obj.firstname
    new_order.lastname = quote_obj.lastname
    new_order.email = quote_obj.email
    new_order.telephone = quote_obj.telephone

    new_order.payment_fullname = quote_obj.payment_fullname
    payment_customer_names = HumanName(quote_obj.payment_fullname)
    new_order.payment_firstname = payment_customer_names.first
    new_order.payment_lastname = payment_customer_names.surnames
    new_order.payment_email = quote_obj.payment_email
    new_order.payment_telephone = quote_obj.payment_telephone
    new_order.payment_company = quote_obj.payment_company
    new_order.payment_address_1 = quote_obj.payment_address
    new_order.payment_city = quote_obj.payment_city
    new_order.payment_area = quote_obj.payment_area
    new_order.payment_postcode = quote_obj.payment_postcode
    new_order.payment_country_name = quote_obj.payment_country
    new_order.payment_country = quote_obj.payment_country.name

    new_order.shipping_fullname = quote_obj.shipping_fullname
    shipping_customer_names = HumanName(quote_obj.payment_fullname)
    new_order.shipping_firstname = shipping_customer_names.first
    new_order.shipping_lastname = shipping_customer_names.surnames
    new_order.shipping_email = quote_obj.shipping_email
    new_order.shipping_telephone = quote_obj.shipping_telephone
    new_order.shipping_company = quote_obj.shipping_company
    new_order.shipping_address_1 = quote_obj.shipping_address
    new_order.shipping_city = quote_obj.shipping_city
    new_order.shipping_area = quote_obj.shipping_area
    new_order.shipping_postcode = quote_obj.shipping_postcode
    new_order.shipping_country_name = quote_obj.shipping_country
    new_order.shipping_country = quote_obj.shipping_country.name

    new_order.comment = quote_obj.comment
    new_order.total = quote_obj.total
    new_order.language_id = quote_obj.language_id
    new_order.currency_id = quote_obj.currency.currency_id
    new_order.currency_code = quote_obj.currency.code
    new_order.currency_value = 1

    new_order.order_status_id = 1 #waiting
    new_order.order_type_id = 2 #set to email
    new_order.payment_method_id = 7 # proforma
    new_order.payment_status_id = 3  # waiting

    new_order.tax_rate = quote_obj.tax_rate
    new_order.printed = False
    new_order.is_legacy = False

    unique_id = uuid.uuid4().hex  # Generates a random UUID and gets the hex representation
    # Hash the unique identifier with MD5
    order_hash = hashlib.md5(unique_id.encode()).hexdigest()
    new_order.order_hash = order_hash

    new_order.save()
    new_order_id = new_order.pk
    if new_order_id > 0:
        quote_products = quote_obj.product_quote.all()
        for quote_product in quote_products:
            new_product_obj = OcOrderProduct()
            new_product_obj.order_id = new_order_id
            new_product_obj.product_id = quote_product.product_id
            new_product_obj.name = quote_product.name
            new_product_obj.model = quote_product.model
            new_product_obj.supplier_code = quote_product.supplier_code
            new_product_obj.quantity = quote_product.quantity
            new_product_obj.price = quote_product.price
            new_product_obj.discount = quote_product.discount
            new_product_obj.discount_type = quote_product.discount_type
            new_product_obj.total = quote_product.total
            new_product_obj.tax = quote_product.tax
            new_product_obj.tax_rate_desc = quote_product.tax_rate_desc
            new_product_obj.size_name = quote_product.size_name
            new_product_obj.width = quote_product.width
            new_product_obj.height = quote_product.height
            new_product_obj.orientation_name = quote_product.orientation_name
            new_product_obj.material_name = quote_product.material_name
            new_product_obj.product_variant = quote_product.product_variant
            new_product_obj.is_bespoke = quote_product.is_bespoke
            new_product_obj.line_discount = quote_product.line_discount
            new_product_obj.exclude_discount = quote_product.exclude_discount
            new_product_obj.bulk_discount = quote_product.bulk_discount
            new_product_obj.bulk_used = quote_product.bulk_used
            new_product_obj.single_unit_price = quote_product.single_unit_price
            new_product_obj.base_unit_price = quote_product.base_unit_price
            new_product_obj.status_id = 1
            new_product_obj.save()

        #add in totals
        new_order.order_totals.create(code='sub_total', sort_order=1, title='Sub-Total', value=0)
        new_order.order_totals.create(code='discount', sort_order=2, title='Discount', value=0)

        new_order.order_totals.create(code='shipping', sort_order=3, title='Shipping', value=0)
        new_order.order_totals.create(code='tax', sort_order=5, title=new_order.tax_rate.name, value=0)
        new_order.order_totals.create(code='total', sort_order=9, title='Total', value=0)

        calc_order_totals(new_order_id)

        return new_order_id
    else:
        return 0

def convert_to_customer(request, quote_id):
    data = dict()
    template_name = 'quotes/dialog/convert_to_customer.html'
    context = {'quote_id': quote_id}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)

def quote_copy_billing(requst, quote_id):
    data = dict()
    data['form_is_valid'] = False

    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
    if quote_obj:
        quote_obj.shipping_fullname = quote_obj.payment_fullname
        shipping_customer_names = HumanName(quote_obj.payment_fullname)
        quote_obj.shipping_firstname = shipping_customer_names.first
        quote_obj.shipping_lastname = shipping_customer_names.surnames
        quote_obj.shipping_email = quote_obj.payment_email
        quote_obj.shipping_telephone = quote_obj.payment_telephone
        quote_obj.shipping_company = quote_obj.payment_company
        quote_obj.shipping_address = quote_obj.payment_address
        quote_obj.shipping_city = quote_obj.payment_city
        quote_obj.shipping_area = quote_obj.payment_area
        quote_obj.shipping_postcode = quote_obj.payment_postcode
        quote_obj.shipping_country = quote_obj.payment_country
        quote_obj.save()
        data['form_is_valid'] = True

    return JsonResponse(data)