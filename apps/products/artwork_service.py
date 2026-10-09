"""
Saving the product images made from an uploaded print-ready PDF.

artwork.py does the picture work and touches nothing outside memory. This module is the
part that writes: the three images to the media storage (S3 in production), the PDF to the
Google Drive, and the columns on the product or variant.

Two steps so a bad PDF is turned down before anything is saved:

    prepared = prepare(pdf_bytes, keep_colours=False)      # raises ArtworkError; saves nothing
    save_prepared(instance, prepared, label='Fire exit arrow left sign')

New files get new names and never replace an existing file (the media storage does not
overwrite), so the old image and any earlier artwork stay where they are.
"""
import datetime
import io
import logging
import re
from collections import namedtuple

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.utils import timezone

from apps.products import artwork
from apps.products.artwork import ArtworkError

logger = logging.getLogger('apps')

MAX_PDF_BYTES = 30 * 1024 * 1024
FOLDER = 'stores/products/v2/'
EXTENSIONS = {'feed': 'jpg', 'page': 'webp', 'tile': 'webp'}

Prepared = namedtuple('Prepared', 'pdf_bytes versions problems keep_colours')


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
    return Prepared(pdf_bytes, artwork.make_versions(master), problems, keep_colours)


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


def save_prepared(instance, prepared, label, code=''):
    """Write the images and the PDF, then record them on the product or variant.

    instance: an OcProduct or OcTsgProductVariantCore (both have the same artwork columns).
    label:    words for the file names, e.g. the product title.
    code:     the product or variant code, used in the file names and the Drive name.
    Returns the Drive file id or None.
    """
    base = slugify_name(f'{label} {code}' if code else label)
    paths = {}
    for kind, data in prepared.versions.items():
        paths[kind] = default_storage.save(f'{FOLDER}{base}-{kind}.{EXTENSIONS[kind]}', ContentFile(data))

    stamp = datetime.date.today().strftime('%Y%m%d')
    drive_name = f'{(code or "").strip()} {label} website upload {stamp}.pdf'.strip()
    drive_id = upload_to_drive(drive_name, prepared.pdf_bytes)

    instance.image_feed, instance.image_page, instance.image_tile = paths['feed'], paths['page'], paths['tile']
    instance.artwork_checks = ('; '.join(prepared.problems))[:500] or None
    instance.artwork_date = timezone.now()
    fields = ['image_feed', 'image_page', 'image_tile', 'artwork_checks', 'artwork_date']
    if drive_id:
        instance.artwork_drive_id = drive_id
        instance.artwork_filename = drive_name[:255]
        fields += ['artwork_drive_id', 'artwork_filename']
    instance.save(update_fields=fields)
    return drive_id
