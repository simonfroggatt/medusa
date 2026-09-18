"""
Export the approved stock designs for the test site (thewhitelabel.co).

    python manage.py export_approved
    python manage.py export_approved --out /path/to/bespoke-sign-engine/data/approved.json

The file lists each approved product with its image, size and design. Symbol
artwork is left out (the page puts it back from the symbol library by code), so
the file stays small. Rebuild the test site afterwards:

    npm run editor:build
"""
import json
import os

from django.core.management.base import BaseCommand

from apps.recreate import services
from apps.recreate.models import OcTsgBespokeRecreations as Recreation

DEFAULT_OUT = os.path.expanduser('~/Sites/bespoke-sign-engine/data/approved.json')


def without_artwork(design):
    """The design without each symbol's SVG body (codes stay)."""
    for section in design.get('root', {}).get('sections', []):
        frame = section.get('symbol_frame') or {}
        for symbol in frame.get('symbols', []):
            symbol.pop('source', None)
    return design


class Command(BaseCommand):
    help = 'Write the approved stock designs to a JSON file for the test site.'

    def add_arguments(self, parser):
        parser.add_argument('--out', default=DEFAULT_OUT, help=f'Where to write (default {DEFAULT_OUT})')

    def handle(self, *args, **opts):
        rows = Recreation.objects.filter(status=Recreation.STATUS_APPROVED).order_by('product_id')
        products = {p['product_id']: p for p in services.live_products([r.product_id for r in rows])} if rows else {}
        items = []
        for row in rows:
            if not row.design:
                continue
            product = products.get(row.product_id, {})
            items.append({
                'product_id': row.product_id,
                'name': product.get('name') or f'Product {row.product_id}',
                'sign_reads': (row.sign_reads or '').strip(),
                'image': services.image_url(row.source_image) if row.source_image else '',
                'size': services.size_by_id(row.size_id) if row.size_id else None,
                'design': without_artwork(json.loads(row.design)),
            })

        out = opts['out']
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, 'w', encoding='utf-8') as f:
            json.dump(items, f, ensure_ascii=False, indent=1)
            f.write('\n')
        size_kb = os.path.getsize(out) / 1024
        self.stdout.write(self.style.SUCCESS(f'{len(items)} approved design(s) → {out} ({size_kb:.0f} kB)'))
        self.stdout.write('Now rebuild the test site: npm run editor:build')
