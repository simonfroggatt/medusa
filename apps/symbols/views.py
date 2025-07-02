from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from apps.symbols.models import OcTsgSymbols, OcTsgSymbolStandard, OcTsgSymbolShape, OcTsgSymbolPurposes, OcTsgSymbolCategory
from apps.products.models import OcProduct
from .serializers import SymbolSerializer, SymbolShortSerializer, SymbolStandardSerializer, SymbolShapeSerializer, SymbolPurposeSerializer, SymbolCategorySerializer
from .forms import SymbolsForm, SymbolShapeForm, SymbolPurposeForm, SymbolCategoryForm, OcTsgSymbolStandardForm
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.template.loader import render_to_string
from apps.products.serializers import ProductBasicSerializer
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

class Symbols(viewsets.ModelViewSet):
    queryset = OcTsgSymbols.objects.all()
    serializer_class = SymbolSerializer
    def get_queryset(self):
        return OcTsgSymbols.objects.all()

    def post(self, request, *args, **kwargs):
        return self.list(request, *args)

#class Symbols(generics.ListAPIView):
#    queryset = OcTsgSymbols.objects.all()
#    serializer_class = SymbolShortSerializer

 #   def post(self, request, *args, **kwargs):
 #       return self.list(request, *args, **kwargs)


def all_symbols(request):
    template_name = 'symbols/symbols-list.html';
    context = {'heading': 'Symbols'}

    return render(request, template_name, context)


def symbol_details(request, pk):
    symbol_obj = get_object_or_404(OcTsgSymbols, pk=pk)

    context = {"symbol_obj": symbol_obj}
    template_name = 'symbols/symbols-edit.html'

    context['pageview'] = 'All symbols'
    context['heading'] = 'symbol details'
    return render(request, template_name, context)


def symbol_create(request):
    template_name = 'symbols/sub_layout/symbols-create.html'
    context = {}
    context['heading'] = "Symbols"
    context['pageview'] = "New Symbol"

    if request.method == 'POST':
        form = SymbolsForm(request.POST)
        if form.is_valid():
            form.save()
            success_url = reverse_lazy('allsymbols')
            return HttpResponseRedirect(success_url)

    else:
        symbol_obj = OcTsgSymbols
        symbol_iniitials = {
            'image_path': '',
            'referent': '',
            'function': '',
            'content': '',
            'hazard': '',
            'humanbehav': '',
            'svg_path': '',
            'image_width': 0,
            'image_height': 0,


        }

    form = SymbolsForm(instance=symbol_obj, initial=symbol_iniitials)
    context['form'] = form
    context['return_url'] = reverse_lazy('allsymbols')
    return render(request, template_name, context)


class SymbolsUpdateView(UpdateView):
    model = OcTsgSymbols
    form_class = SymbolsForm
    template_name = 'symbols/sub_layout/symbols-edit.html'
    success_url = reverse_lazy('allsymbols')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        pk = self.kwargs['pk']
        obj = super().get_object()
        breadcrumbs = []
        breadcrumbs.append({'name': 'Symbols', 'url': reverse_lazy('allsymbols')})
        context['breadcrumbs'] = breadcrumbs
        context['symbol_image_path'] = f"{settings.MEDIA_URL}{obj.image_path}"
        context['symbol_id'] = pk
        return context


class SymbolCreateView(CreateView):
    form_class = SymbolsForm
    model = OcTsgSymbols
    success_url = reverse_lazy('allsymbols')
    template_name = 'symbols/sub_layout/symbols-create.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['heading'] = 'New Symbol'
        context['pageview_url'] = reverse_lazy('allsymbols')
        context['pageview'] = "Symbols"
        return context

    def form_invalid(self, form):
        print("form is invalid")
        return HttpResponse("form is invalid.. this is just an HttpResponse object")


class Symboldelete(DeleteView):
    model = OcTsgSymbols
    form_class = SymbolsForm
    success_message = 'Symbol deleted'
    success_url = reverse_lazy('allsymbols')


def symbol_delete_dlg(request, symbol_id):
    data = dict()
    template_name = 'symbols/sub_layout/symbol_delete.html'
    context = {'symbol_id': symbol_id}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


class ProductWithMissingSymbols(viewsets.ModelViewSet):
    queryset =  OcProduct.objects.filter(productsymbols__isnull=True)
    serializer_class = ProductBasicSerializer


def no_symbols_list(request):
    template_name = 'symbols/product-missing-symbols.html';
    context = {'heading': 'Products without symbols'}

    return render(request, template_name, context)

def standards_list(request):
    context = {
        'heading': 'Symbol Standards',
    }
    return render(request, 'symbols/standards-list.html', context)


class SymbolShapeListAPIView(ListAPIView):
    queryset = OcTsgSymbolShape.objects.all()
    serializer_class = SymbolShapeSerializer

def symbol_shape_list(request):
    context = {'heading': 'Symbol Shapes'}
    return render(request, 'symbols/symbol_shape_list.html', context)

class SymbolShapeCreateView(CreateView):
    model = OcTsgSymbolShape
    form_class = SymbolShapeForm
    template_name = 'symbols/sub_layout/symbol_shape_form.html'
    success_url = reverse_lazy('shape-list')

class SymbolShapeUpdateView(UpdateView):
    model = OcTsgSymbolShape
    form_class = SymbolShapeForm
    template_name = 'symbols/sub_layout/symbol_shape_form.html'
    success_url = reverse_lazy('shape-list')

class SymbolShapeDeleteView(DeleteView):
    model = OcTsgSymbolShape
    template_name = 'symbols/sub_layout/symbol_shape_delete.html'
    success_url = reverse_lazy('shape-list')


class SymbolPurposeListAPIView(ListAPIView):
    queryset = OcTsgSymbolPurposes.objects.all()
    serializer_class = SymbolPurposeSerializer

def symbol_purpose_list(request):
    context = {'heading': 'Purpose'}
    return render(request, 'symbols/symbol_purpose_list.html', context)

class SymbolPurposeCreateView(CreateView):
    model = OcTsgSymbolPurposes
    form_class = SymbolPurposeForm
    template_name = 'symbols/sub_layout/symbol_purpose_form.html'
    success_url = reverse_lazy('purpose-list')

class SymbolPurposeUpdateView(UpdateView):
    model = OcTsgSymbolPurposes
    form_class = SymbolPurposeForm
    template_name = 'symbols/sub_layout/symbol_purpose_form.html'
    success_url = reverse_lazy('purpose-list')

class SymbolPurposeDeleteView(DeleteView):
    model = OcTsgSymbolPurposes
    template_name = 'symbols/sub_layout/symbol_purpose_delete.html'
    success_url = reverse_lazy('purpose-list')


class SymbolCategoryListAPIView(ListAPIView):
    queryset = OcTsgSymbolCategory.objects.all()
    serializer_class = SymbolCategorySerializer

def symbol_category_list(request):
    context = {'heading': 'Category'}
    return render(request, 'symbols/symbol_category_list.html', context)

class SymbolCategoryCreateView(CreateView):
    model = OcTsgSymbolCategory
    form_class = SymbolCategoryForm
    template_name = 'symbols/sub_layout/symbol_category_form.html'
    success_url = reverse_lazy('category-list')

class SymbolCategoryUpdateView(UpdateView):
    model = OcTsgSymbolCategory
    form_class = SymbolCategoryForm
    template_name = 'symbols/sub_layout/symbol_category_form.html'
    success_url = reverse_lazy('category-list')

class SymbolCategoryDeleteView(DeleteView):
    model = OcTsgSymbolCategory
    template_name = 'symbols/sub_layout/symbol_category_delete.html'
    success_url = reverse_lazy('category-list')

class symbol_standards_list(ListAPIView):
    serializer_class = SymbolStandardSerializer
    def get_queryset(self):
        symbol_id = self.kwargs['symbol_id']
        return OcTsgSymbolStandard.objects.filter(symbol_id=symbol_id)


class SymbolStandardListAPIView(ListAPIView):
    queryset = OcTsgSymbolStandard.objects.all()
    serializer_class = SymbolStandardSerializer


def symbol_standards_list_add(request, symbol_id):
    template_name = 'symbols/dialogs/symbol_standards_form.html'
    context = {}
    data = dict()
    context['symbol_id'] = symbol_id
    if request.method == 'POST':
        form = OcTsgSymbolStandardForm(request.POST)
        if form.is_valid():
            form.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
            data['errors'] = form.errors
    else:
        # set symbol_id to the initilial value of the form
        symbol = get_object_or_404(OcTsgSymbols, pk=symbol_id)
        initial_data = {
            'symbol': symbol,
        }
        form = OcTsgSymbolStandardForm(initial=initial_data)

    context['form'] = form
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def symbol_standards_list_edit(request, pk):
    template_name = 'symbols/dialogs/symbol_standards_form_edit.html'
    context = {}
    data = dict()
    if request.method == 'POST':
        symbol_standard_obj = get_object_or_404(OcTsgSymbolStandard, pk=pk)
        form = OcTsgSymbolStandardForm(request.POST, instance=symbol_standard_obj)
        if form.is_valid():
            form.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
            data['errors'] = form.errors
    else:
        # set symbol_id to the initilial value of the form
        symbol_standard_obj = get_object_or_404(OcTsgSymbolStandard, pk=pk)
        form = OcTsgSymbolStandardForm(instance=symbol_standard_obj)

    context['form'] = form
    context['pk'] = pk
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)

def symbol_standards_list_delete(request, pk):
    template_name = 'symbols/dialogs/symbol_standards_delete.html'
    context = {}
    context['pk'] = pk
    data = dict()
    if request.method == 'POST':
        symbol_standard_obj = get_object_or_404(OcTsgSymbolStandard, pk=pk)
        symbol_standard_obj.delete()
        data['form_is_valid'] = True
    else:
        symbol_standard_obj = get_object_or_404(OcTsgSymbolStandard, pk=pk)
        context['symbol_standard'] = symbol_standard_obj

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)