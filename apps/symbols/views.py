from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from apps.products.models import OcTsgSymbols
from .serializers import SymbolSerializer, SymbolShortSerializer
from .forms import SymbolsForm
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView
from django.conf import settings


class Symbols(viewsets.ModelViewSet):
    queryset = OcTsgSymbols.objects.all()
    serializer_class = SymbolShortSerializer


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


class SymbolsUpdateView(UpdateView):
    model = OcTsgSymbols
    form_class = SymbolsForm
    template_name = 'symbols/symbols-edit.html'
    success_url = reverse_lazy('allsymbols')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        obj = super().get_object()
        context['pageview'] = 'Symbols'
        context['pageview_url'] = reverse_lazy('allsymbols')
        context['symbol_image_path'] = f"{settings.MEDIA_URL}{obj.image_path}"
        return context


    def get_symbol_image_path(self):
        return 'fred';

