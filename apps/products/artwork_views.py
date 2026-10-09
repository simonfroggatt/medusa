"""
The product's Artwork tab: the print-ready PDFs its pictures are made from.

A product has a few artworks (one per shape: landscape, portrait, photoluminescent ...) and each of
its variants picks one on the variant form. The one flagged main is the product's own picture and
what every variant with no artwork of its own shows.
"""
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.db.models import Count
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.http import require_POST

from apps.products import artwork_service
from apps.products.artwork import ArtworkError
from apps.products.models import OcProduct, OcTsgProductArtwork


def _ticked(request, name):
    return request.POST.get(name, '').lower() in ('on', '1', 'true', 'yes')


def artwork_list(request, product_id):
    """The tab's contents (HTML, loaded into the tab when it is opened)."""
    product = get_object_or_404(OcProduct, pk=product_id)
    artworks = list(product.artworks.annotate(used_by=Count('variants')))
    for art in artworks:
        art.matching = len(artwork_service.variants_for_artwork(art)) if art.image_feed else 0
    return render(request, 'products/sub_layout/product_artwork.html', {
        'product_id': product_id,
        'artworks': artworks,
        'variants_total': product.corevariants.count(),
    })


@login_required
@require_POST
def artwork_save(request, product_id):
    """Add an artwork from a PDF, or (with artwork_id) change an existing one, optionally with a new PDF."""
    product = get_object_or_404(OcProduct, pk=product_id)
    art = None
    if request.POST.get('artwork_id'):
        art = get_object_or_404(OcTsgProductArtwork, pk=request.POST['artwork_id'], product=product)
    upload = request.FILES.get('pdf')
    label = (request.POST.get('label') or '').strip()[:100]
    if not label:
        return JsonResponse({'ok': False, 'error': 'Give the artwork a label, for example "Landscape".'}, status=400)
    if not art and not upload:
        return JsonResponse({'ok': False, 'error': 'Choose the print-ready PDF.'}, status=400)

    keep = _ticked(request, 'keep_colours')
    prepared = None
    if upload:
        try:
            prepared = artwork_service.prepare(upload.read(), filename=upload.name, keep_colours=keep)
        except ArtworkError as exc:
            return JsonResponse({'ok': False, 'error': str(exc)}, status=400)

    with transaction.atomic():
        first = not product.artworks.exists()
        if not art:
            art = OcTsgProductArtwork(product=product)
        art.label = label
        art.keep_colours = keep
        art.is_main = _ticked(request, 'is_main') or (first and not art.pk)
        art.save()
        if art.is_main:
            product.artworks.exclude(pk=art.pk).update(is_main=False)
        if prepared:
            title = getattr(getattr(product, 'productdescbase', None), 'title', '') or 'product'
            artwork_service.save_prepared(art, prepared, f'{title} {label}', str(product.pk))
        artwork_service.sync_artwork(art)   # write-through into oc_product.image / variant_image
    return JsonResponse({'ok': True, 'problems': prepared.problems if prepared else []})


@login_required
@require_POST
def artwork_set_main(request, pk):
    art = get_object_or_404(OcTsgProductArtwork, pk=pk)
    with transaction.atomic():
        OcTsgProductArtwork.objects.filter(product_id=art.product_id).update(is_main=False)
        OcTsgProductArtwork.objects.filter(pk=art.pk).update(is_main=True)
        artwork_service.sync_product(art.product_id)
    return JsonResponse({'ok': True})


@login_required
@require_POST
def artwork_assign(request, pk):
    """Point this product's variants of the same shape (that have no artwork yet) at this artwork."""
    art = get_object_or_404(OcTsgProductArtwork, pk=pk)
    return JsonResponse({'ok': True, 'changed': artwork_service.assign_to_matching_variants(art)})


@login_required
@require_POST
def artwork_delete(request, pk):
    """Remove the artwork row. The image files stay in storage; variants using it go back to their old image, or the main artwork."""
    art = get_object_or_404(OcTsgProductArtwork, pk=pk)
    product_id = art.product_id
    core_ids = list(art.variants.values_list('pk', flat=True))
    with transaction.atomic():
        art.delete()   # the variants using it go back to no artwork (foreign key SET NULL)
        artwork_service.sync_variants(core_ids)   # ... and get their old image back
        artwork_service.sync_product(product_id)
    return JsonResponse({'ok': True})
