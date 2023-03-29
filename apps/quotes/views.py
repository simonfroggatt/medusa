from django.shortcuts import render, get_object_or_404
from apps.quotes.models import OcTsgQuote, OcTsgQuoteProduct
from apps.quotes.serializers import QuoteListSerializer, QuoteProductListSerializer
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.template.loader import render_to_string
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from apps.quotes.forms import QuoteDetailsEditForm, ProductAddForm, ProductEditForm
from apps.products.models import OcTsgBulkdiscountGroups, OcTsgProductMaterial, OcTsgProductToBulkDiscounts
from django.urls import reverse_lazy
from apps.products import services as prod_services
from django.db.models import Sum, F
from decimal import Decimal, ROUND_HALF_UP
from .services import create_quote_prices_text
from django.core.mail import send_mail
from apps.customer.models import OcCustomer
from apps.customer.views import get_default_address
from medusa.models import OcTsgShippingMethod
from apps.templating.services import get_template_data


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

    context = {"quote_obj": quote_obj}
    if quote_obj.customer_id:
        context["addressItem"] = quote_obj.customer.ocaddress_set.all().order_by('postcode')
    else:
        context["addressItem"] = []

    template_name = 'quotes/quote_layout.html'
    context['pageview'] = 'All Quotes'

    quote_products_obj = OcTsgQuoteProduct.objects.filter(quote_id=quote_id)
    order_lines = quote_products_obj.count()
    product_count = quote_products_obj.aggregate(Sum('quantity'))
    context['quote_lines'] = order_lines
    context['quote_product_count'] = product_count['quantity__sum']
    context['quote_total'] = get_quote_totals(quote_id, quote_obj.tax_rate.rate)

    return render(request, template_name, context)


def quote_details_edit(request, quote_id):
    data = dict()
    quote_details_obj = get_object_or_404(OcTsgQuote, pk=quote_id)

    initial_data = {
        'language_id': 1,
        'currency' : 1,
        'store': 1
    }

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
            order_product = form.save(commit=False)
            order_product.reward = 0
            order_product.save()
           #calc_order_totals(order_id)
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

    form = ProductAddForm()
    order_data = OcTsgQuote.objects.filter(quote_id=quote_id).values('tax_rate__rate', 'customer_id').first()
    context = {
        "quote_id": quote_id,
        "tax_rate": order_data['tax_rate__rate'],
        "customer_id": order_data['customer_id'],
        "form_post_url" : reverse_lazy('quoteproductadd', kwargs={'quote_id': quote_id}),
        "price_for": "Q", #
        "form" : form}
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
    order_products_obj = OcTsgQuoteProduct.objects.filter(quote_id=quote_id)
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)

    order_lines = order_products_obj.count()
    product_count = order_products_obj.aggregate(Sum('quantity'))
    data['order_lines'] = order_lines
    data['order_product_count'] = product_count['quantity__sum']
    data['quote_total'] = get_quote_totals(quote_id, quote_obj.tax_rate.rate)
    return JsonResponse(data)


def get_quote_totals(quote_id, tax_rate):
    data = dict()
    order_products_obj = OcTsgQuoteProduct.objects.filter(quote_id=quote_id)
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
    if order_products_obj:
        subtotal = order_products_obj.aggregate(sum=Sum(F('price') * F('quantity')))['sum']
        discount = quote_obj.discount
        data['subtotal'] = Decimal(subtotal.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
        data['discount'] = discount
        subtotal_net = subtotal - discount + quote_obj.shipping_rate
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

    if quote_product.product_id > 0:
        qs_product_bulk = OcTsgProductToBulkDiscounts.objects.get(product__product_id=quote_product.product_id, store_id=store_id)
        default_bulk = qs_product_bulk.bulk_discount_group.bulk_group_id
        qs_bulk = OcTsgBulkdiscountGroups.objects.filter(bulk_group_id=qs_product_bulk.bulk_discount_group.bulk_group_id)
    else:
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
    template_obj = get_template_data('quote_text', store_id)['main']
    pricing_template = get_template_data('quote_prices', store_id)['main']
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
        'currency': 1,
        'tax_rate': 86,
        'days_valid': 30,
        'shipping_type': 1,
        'shipping_rate': 0,
        'sent': False,
        'store': 1
    }

    if request.method == 'POST':
        form = QuoteDetailsEditForm(request.POST)
        if form.is_valid():
            form_instance = form.instance
            form_instance.total = 0.00
            form_instance.discount = 0.00
            form_instance.language_id = 1
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

        address_book = get_default_address(customer_obj)

        if address_book:
            new_quote_obj.fullname = address_book['billing'].fullname
            new_quote_obj.company = address_book['billing'].company
            new_quote_obj.email = address_book['billing'].email
            new_quote_obj.telephone = address_book['billing'].telephone
            new_quote_obj.quote_address = address_book['billing'].address_1
            new_quote_obj.quote_city = address_book['billing'].city
            new_quote_obj.quote_area = address_book['billing'].area
            new_quote_obj.quote_postcode = address_book['billing'].postcode
            new_quote_obj.quote_country_id = address_book['billing'].country_id
            new_quote_obj.quote_country = address_book['billing'].country

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
