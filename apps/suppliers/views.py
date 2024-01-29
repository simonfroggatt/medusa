from django.shortcuts import render
from rest_framework import viewsets
from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from django.template.loader import render_to_string
from .models import OcSupplier
from .serializers import SupplierListSerializer
from .forms import SuppliersEditForm
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from bootstrap_modal_forms.generic import BSModalCreateView, BSModalUpdateView

class Suppliers(viewsets.ModelViewSet):
    queryset = OcSupplier.objects.all()
    serializer_class = SupplierListSerializer

def all_suppliers(request):
    template_name = 'suppliers/suppliers-list.html'
    context = {'pageview': 'All suppliers'}
    return render(request, template_name, context)


class SupplierCreate(CreateView):
    model = OcSupplier
    form_class = SuppliersEditForm
    template_name = 'suppliers/supplier_details.html'
    success_url = reverse_lazy('allsuppliers')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['testit'] = 'this is a test'
        return context


class SupplierUpdate(UpdateView):
    model = OcSupplier
    form_class = SuppliersEditForm
    template_name = 'suppliers/supplier_details.html'
    success_url = reverse_lazy('allsuppliers')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['heading'] = "Edit Supplier"
        context['pageview'] = "Supplier"
        context['pageview_url'] = reverse_lazy('allsuppliers')
        return context




def supplier_details(request, pk):
    template_name = 'suppliers/supplier_layout.html'
    supplier_obj = get_object_or_404(OcSupplier, pk=pk)
    context = {"supplier_obj": supplier_obj}

    context['pageview'] = 'Suppliers'
    context['pageview_url'] = reverse_lazy('allsuppliers')
    context['heading'] = supplier_obj.company

    return render(request, template_name, context)