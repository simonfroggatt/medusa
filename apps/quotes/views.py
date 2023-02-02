from django.shortcuts import render, get_object_or_404
from apps.quotes.models import OcTsgQuote, OcTsgQuoteProduct
from apps.quotes.serializers import QuoteListSerializer
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.template.loader import render_to_string
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from apps.quotes.forms import QuoteDetailsEditForm, ProductAddForm
from apps.products.models import OcTsgBulkdiscountGroups, OcTsgProductMaterial
from django.urls import reverse_lazy
from apps.products import services as prod_services


class Quotes_asJSON(viewsets.ModelViewSet):
    queryset = OcTsgQuote.objects.all()
    serializer_class = QuoteListSerializer

    def retrieve(self, request, pk=None):
        quotes_obj = OcTsgQuote.objects.all()
        serializer = self.get_serializer(quotes_obj, many=True)
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

    template_name = 'quotes/dialog/edit_quote_details.html'

    context = {'quote_id': quote_id,
               'form': form,
               'initials': initial_data}

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
