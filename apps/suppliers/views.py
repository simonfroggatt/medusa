from django.shortcuts import render
from rest_framework import viewsets
from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from django.template.loader import render_to_string
from .models import OcSupplier, OcTsgSupplierDocuments
from .serializers import SupplierListSerializer
from .forms import SuppliersEditForm, SupplierDocumentForm
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, FileResponse
from medusa import services
from django.conf import settings
import os

class Suppliers(viewsets.ModelViewSet):
    queryset = OcSupplier.objects.all()
    serializer_class = SupplierListSerializer

def all_suppliers(request):
    template_name = 'suppliers/suppliers-list.html'
    context = {'pageview': 'All suppliers'}
    return render(request, template_name, context)


def supplier_create(request):
    data = dict()
    template_name = 'suppliers/dialogs/supplier_details.html'
    context = dict()
    supplier_obj = OcSupplier()

    if request.method == 'POST':
        form_obj = SuppliersEditForm(request.POST, request.FILES)
        if form_obj.is_valid():
            form_obj.save()
            form_instance = form_obj.instance
            pk = form_instance.id
            success_url = reverse_lazy('supplier_details', kwargs={'pk': pk})
            return HttpResponseRedirect(success_url)
        else:
            data['form_is_valid'] = False
    else:
        data['form_is_valid'] = False
        form_obj = SuppliersEditForm(instance=supplier_obj)

    context['form'] = form_obj
    context['action_url'] = reverse_lazy('supplier_create')
    context['action_button'] = 'Create'
    context['title'] = 'New Supplier'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)



def supplier_update(request, pk):
    data = dict()
    context = {'supplier_id': pk}
    template_name = 'suppliers/dialogs/supplier_details.html'
    supplier_obj = get_object_or_404(OcSupplier, pk=pk)

    if request.method == 'POST':
        form_obj = SuppliersEditForm(request.POST, request.FILES, instance=supplier_obj)
        if form_obj.is_valid():
            form_obj.save()
            success_url = reverse_lazy('supplier_details', kwargs={'pk': pk})
            return HttpResponseRedirect(success_url)
        else:
            data['form_is_valid'] = False
    else:
        form_obj = SuppliersEditForm(instance=supplier_obj)
        data['form_is_valid'] = False

    context['form'] = form_obj
    context['supplier_id'] = pk
    context['action_button'] = 'Update'
    context['title'] = 'Update Supplier'
    context['action_url'] = reverse_lazy('supplier_update', kwargs={'pk': pk})
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def supplier_details(request, pk):
    template_name = 'suppliers/supplier_layout.html'
    supplier_obj = get_object_or_404(OcSupplier, pk=pk)
    context = {"supplier_obj": supplier_obj}

    context['pageview'] = 'Suppliers'
    context['pageview_url'] = reverse_lazy('allsuppliers')
    context['heading'] = supplier_obj.company

    supplier_docs_obj = OcTsgSupplierDocuments.objects.filter(supplier_id=pk)
    context['supplier_docs_obj'] = supplier_docs_obj
    docform_initials = {'supplier': supplier_obj}
    docform = SupplierDocumentForm(initial=docform_initials)
    context['docform'] = docform
    context['thumbnail_cache'] = settings.THUMBNAIL_CACHE

    return render(request, template_name, context)


def supplier_document_fetch(request, supplier_id):
    data =  dict()
    supplier_docs_obj = OcTsgSupplierDocuments.objects.filter(supplier_id=supplier_id)
    template_name = 'suppliers/sub_layouts/supplier_documents.html'
    context = {'supplier_docs_obj': supplier_docs_obj}
    supplier_obj = get_object_or_404(OcSupplier,pk=supplier_id)
    docform_initials = {'supplier': supplier_obj}
    docform = SupplierDocumentForm(initial=docform_initials)
    context['docform'] = docform
    context['thumbnail_cache'] = settings.THUMBNAIL_CACHE



    data['html_content'] = render_to_string(template_name,
                                            context,
                                            request=request
                                            )

    return JsonResponse(data)



def supplier_document_upload(request):
    data = dict()
    if request.method == 'POST':
        form = SupplierDocumentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            form_instance = form.instance
            supplier_doc_obj = get_object_or_404(OcTsgSupplierDocuments, pk=form_instance.pk)
            cached_thumb = services.createUploadThumbnail(supplier_doc_obj.filename.file.name)
            supplier_doc_obj.cache_path = cached_thumb
            supplier_doc_obj.save()
            data['success_post'] = True
            data['document_ajax_url'] = reverse_lazy('fetch_supplier_documents', kwargs={'supplier_id': supplier_doc_obj.supplier_id})
            data['divUpdate'] = ['div-supplier_documents', 'html_content']
        else:
            data['success_post'] = False
    else:
        data['success_post'] = False

    return JsonResponse(data)


def supplier_document_download(request, pk):
    doc_obj = get_object_or_404(OcTsgSupplierDocuments, pk=pk)
    response = FileResponse(doc_obj.filename, as_attachment=True)
    return response


def supplier_document_delete(request, pk):
    data = dict()
    template_name = 'suppliers/dialogs/supplier_document_delete.html'
    context = dict()
    supplier_doc_obj = get_object_or_404(OcTsgSupplierDocuments, pk=pk)

    if request.method == 'POST':
        supplier_doc_obj = get_object_or_404(OcTsgSupplierDocuments, pk=pk)
        if supplier_doc_obj:
            supplier_doc_obj.delete()
            #delete the cached file
            fullpath = os.path.join(settings.MEDIA_ROOT, settings.THUMBNAIL_CACHE ,supplier_doc_obj.cache_path)
            if os.path.isfile(fullpath):
                os.remove(fullpath)
            data['success_post'] = True
            data['document_ajax_url'] = reverse_lazy('fetch_supplier_documents',
                                                     kwargs={'supplier_id': supplier_doc_obj.supplier_id})
            data['divUpdate'] = ['div-supplier_documents', 'html_content']
        else:
            data['success_post'] = False
    else:
        context['dialog_title'] = "<strong>DELETE</strong> document"
        context['action_url'] = reverse_lazy('supplier_document-delete', kwargs={'pk': pk})
        context['form_id'] = 'form-supplier_document-delete'
        context['supplier_id'] = supplier_doc_obj.supplier_id
        data['upload'] = False

    data['html_form'] = render_to_string(template_name,
                                                     context,
                                                     request=request
                                                     )

    return JsonResponse(data)