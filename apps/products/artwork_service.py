"""
Saving the product images made from an uploaded print-ready PDF.

artwork.py does the picture work and touches nothing outside memory. This module is the
part that writes: the three images to the media storage (S3 in production), the PDF to the
Google Drive, and the columns on the product or variant.

Two steps so a bad PDF is turned down before anything is saved:

    prepared = prepare(pdf_bytes, keep_colours=False)      # raises ArtworkError; saves nothing
    save_prepared(artwork, prepared, label='Fire exit arrow left sign')

`artwork` is an OcTsgProductArtwork row. A product has a few of these (one per shape), and its
variants pick one: see variants_for_artwork.

Write-through: the artwork's page picture is also written into the existing image fields
(oc_product.image for the main artwork, oc_tsg_product_variant_core.variant_image for a variant's
artwork), so everything that already reads those fields (the shop, carts, orders, emails, paperwork)
shows it with no change. What the field held is remembered in previous_image / previous_variant_image
and put back when the artwork is removed. See take_over and the sync_* functions.

New files get new names and never replace an existing file (the media storage does not
overwrite), so the old image and any earlier artwork stay where they are.
"""
import datetime
import io
import logging
import mimetypes
import re
from collections import namedtuple

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.utils import timezone

from apps.products import artwork
from apps.products.artwork import ArtworkError

logger = logging.getLogger('apps')

# Python 3.8 (the live server) does not know .webp, so S3 would store the pictures as application/octet-stream
mimetypes.add_type('image/webp', '.webp')

MAX_PDF_BYTES = 30 * 1024 * 1024
FOLDER = 'stores/products/v2/'
PDF_FOLDER = 'medusa/product/artwork/'   # with the product documents, not in the public images folder
EXTENSIONS = {'feed': 'jpg', 'page': 'webp', 'tile': 'webp'}
CONTENT_TYPES = {'jpg': 'image/jpeg', 'webp': 'image/webp'}

Prepared = namedtuple('Prepared', 'pdf_bytes versions problems keep_colours ratio')


def _content(data, content_type):
    """The bytes as a file that tells the S3 storage its content type, whatever the server's Python knows."""
    content = ContentFile(data)
    content.content_type = content_type
    return content


def slugify_name(text, fallback='product'):
    slug = re.sub(r'[^a-z0-9]+', '-', (text or '').lower()).strip('-')
    return slug[:70].strip('-') or fallback


def prepare(pdf_bytes, filename='', keep_colours=False):
    """Render and check the PDF. Raises ArtworkError if it cannot be used."""
    if len(pdf_bytes) > MAX_PDF_BYTES:
        raise ArtworkError('The PDF is larger than 30 MB.')
    if not pdf_bytes.lstrip()[:5] == b'%PDF-':
        raise ArtworkError('That file is not a PDF.')
    master = artwork.render_master(pdf_bytes, keep_colours=keep_colours)
    problems = artwork.check_master(master)
    if 'photolum' in (filename or '').lower() and not keep_colours:
        problems.append('The file name says photoluminescent but "keep original colours" is off.')
    ratio = round(master.width / master.height, 4)
    return Prepared(pdf_bytes, artwork.make_versions(master), problems, keep_colours, ratio)


def upload_to_drive(name, pdf_bytes):
    """Put the print PDF on the Google Drive and return its file id, or None.

    Off until settings.ARTWORK_DRIVE_FOLDER is set. Never raises: a Drive problem must not
    stop the images being saved, it is logged and reported back as None.
    """
    folder = getattr(settings, 'ARTWORK_DRIVE_FOLDER', None)
    if not folder:
        return None
    try:
        from googleapiclient.http import MediaIoBaseUpload
        from apps.bespoke.views import _google_auth   # same service account the bespoke PDFs use

        media = MediaIoBaseUpload(io.BytesIO(pdf_bytes), mimetype='application/pdf')
        created = _google_auth().files().create(
            body={'name': name, 'parents': [folder]}, media_body=media, fields='id').execute()
        return created.get('id')
    except Exception:
        logger.exception('Artwork PDF could not be uploaded to the Drive: %s', name)
        return None


def save_prepared(art, prepared, label, code=''):
    """Write the images and a copy of the PDF, then record them on the OcTsgProductArtwork row.

    label: words for the file names, e.g. the product title and the artwork's label.
    code:  the product code, used in the file names and the Drive name.
    Returns the Drive file id or None. The caller has already saved `art` (it needs an id).
    """
    base = slugify_name(f'{label} {code}' if code else label)
    paths = {}
    for kind, data in prepared.versions.items():
        paths[kind] = default_storage.save(f'{FOLDER}{base}-{kind}.{EXTENSIONS[kind]}',
                                           _content(data, CONTENT_TYPES[EXTENSIONS[kind]]))

    # keep the print PDF, so it can be downloaded again to make changes (a new file each time, never replaced)
    art.pdf_path = default_storage.save(f'{PDF_FOLDER}{base}-print.pdf', _content(prepared.pdf_bytes, 'application/pdf'))

    stamp = datetime.date.today().strftime('%Y%m%d')
    drive_name = f'{(code or "").strip()} {label} website upload {stamp}.pdf'.strip()
    drive_id = upload_to_drive(drive_name, prepared.pdf_bytes)

    art.image_feed, art.image_page, art.image_tile = paths['feed'], paths['page'], paths['tile']
    art.shape_ratio = prepared.ratio
    art.keep_colours = prepared.keep_colours
    art.checks = ('; '.join(prepared.problems))[:500] or None
    fields = ['image_feed', 'image_page', 'image_tile', 'pdf_path', 'shape_ratio', 'keep_colours', 'checks',
              'date_modified']
    if drive_id:
        art.drive_id = drive_id
        art.drive_filename = drive_name[:255]
        fields += ['drive_id', 'drive_filename']
    art.save(update_fields=fields)
    return drive_id


SHAPE_TOLERANCE = 0.015   # width/height ratios within 1.5% are the same shape (150x200 = 450x600)


def same_shape_ids(ratio, keep_colours, candidates):
    """Which variants should use an artwork of this shape.

    ratio:        the artwork's width / height
    keep_colours: True for a photoluminescent artwork, which suits only photoluminescent materials;
                  a normal artwork never goes onto a photoluminescent material
    candidates:   (variant id, width, height, material name) of the variants with no artwork yet
    """
    if not ratio:
        return []
    ids = []
    for vid, w, h, material in candidates:
        if not w or not h:
            continue
        photo = 'photo' in (material or '').lower()
        if photo != bool(keep_colours):
            continue
        if abs((w / h) / float(ratio) - 1) <= SHAPE_TOLERANCE:
            ids.append(vid)
    return ids


def variants_for_artwork(art):
    """The product's variants with no artwork yet that match this artwork's shape (ids)."""
    from apps.products.models import OcTsgProductVariantCore

    rows = (OcTsgProductVariantCore.objects.filter(product_id=art.product_id, artwork__isnull=True)
            .select_related('size_material__product_size', 'size_material__product_material'))
    candidates = [(c.pk, c.size_material.product_size.size_width, c.size_material.product_size.size_height,
                   c.size_material.product_material.material_name) for c in rows]
    return same_shape_ids(art.shape_ratio, art.keep_colours, candidates)


def take_over(current, previous, new):
    """The image field's new value and its remembered previous value, as (value, previous).

    current:  the path the field holds now ('' or None when empty)
    previous: NULL (None) when no artwork has taken the field over, else what it held before ('' = empty)
    new:      the artwork's page picture, or None when no artwork should be showing
    """
    if new:
        return new, (previous if previous is not None else (current or ''))
    if previous is not None:
        return (previous or None), None
    return current, None


def sync_product(product_id):
    """Put the product's main artwork picture into oc_product.image (or restore the old one)."""
    from django.utils import timezone

    from apps.products.models import OcProduct, OcTsgProductArtwork

    product = OcProduct.objects.get(pk=product_id)
    main = (OcTsgProductArtwork.objects.filter(product_id=product_id, is_main=True)
            .exclude(image_page__isnull=True).exclude(image_page='').first())
    current = product.image.name if product.image else ''
    value, previous = take_over(current, product.previous_image, main.image_page if main else None)
    if (value or '') != (current or '') or previous != product.previous_image:
        OcProduct.objects.filter(pk=product_id).update(image=value, previous_image=previous,
                                                       date_modified=timezone.now())
        return True
    return False


def sync_variants(core_ids):
    """Put each variant's artwork picture into its variant_image (or restore the old one)."""
    from apps.products.models import OcTsgProductVariantCore

    changed = 0
    for core in OcTsgProductVariantCore.objects.filter(pk__in=list(core_ids)).select_related('artwork'):
        art = core.artwork
        new = art.image_page if art and art.image_page else None
        current = core.variant_image.name if core.variant_image else ''
        value, previous = take_over(current, core.previous_variant_image, new)
        if (value or '') != (current or '') or previous != core.previous_variant_image:
            OcTsgProductVariantCore.objects.filter(pk=core.pk).update(variant_image=value, previous_variant_image=previous)
            changed += 1
    return changed


def sync_artwork(art):
    """After an artwork's images or main flag changed: update the product image and the variants using it."""
    from apps.products.models import OcTsgProductVariantCore

    sync_product(art.product_id)
    sync_variants(OcTsgProductVariantCore.objects.filter(artwork_id=art.pk).values_list('pk', flat=True))


def assign_to_matching_variants(art):
    """Point the matching variants at this artwork. Returns how many were changed."""
    from apps.products.models import OcTsgProductVariantCore

    ids = variants_for_artwork(art)
    if not ids:
        return 0
    changed = OcTsgProductVariantCore.objects.filter(pk__in=ids).update(artwork=art)
    sync_variants(ids)
    return changed
