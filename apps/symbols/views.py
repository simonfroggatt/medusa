from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from apps.symbols.models import OcTsgSymbols
from .serializers import SymbolSerializer, SymbolShortSerializer
from .forms import SymbolsForm
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.template.loader import render_to_string


class Symbols(generics.ListAPIView):
    queryset = OcTsgSymbols.objects.all()
    serializer_class = SymbolShortSerializer

    def post(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


def all_symbols(request):
    template_name = 'symbols/symbols-list.html';
    context = {'pageview': 'Symbols'}

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
            'refenceno': '',
            'referent': '',
            'function': '',
            'content': '',
            'hazard': '',
            'humanbehav': '',
            'svg_path': '',
            'title': '',
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
        obj = super().get_object()
        context['pageview'] = 'Symbols'
        context['pageview_url'] = reverse_lazy('allsymbols')
        context['symbol_image_path'] = f"{settings.MEDIA_URL}{obj.image_path}"
        return context


class SymbolCreateView(CreateView):
    form_class = SymbolsForm
    success_url = reverse_lazy('allsymbols')
    template_name = 'symbols/sub_layout/symbols-create.html'


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
