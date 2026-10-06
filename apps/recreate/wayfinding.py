"""Stock wayfinding signs, recreated as wayfinding-configurator settings.

A recreation of kind "wayfinding" is not drawn in the sign designer: it is the
handful of settings that make the wayfinding configurator on the shop draw the
same sign -- floor 2, stair A, flats 1-4 to the left. Approved, its design is
{"role": "wayfinding", "kind": ..., "spec": {...}}, and the shop's "make it
bespoke" link opens the configurator with those settings
(tsg_store catalog/controller/product/product.php).

The spec is the configurator's own query (wayfinding src/Web/SignRequest.php):
the configurator checks it properly when it opens; this only keeps it to the
shapes it understands.
"""
import logging
import re

import requests

from apps.orders.wayfinding import query_string
from apps.products.models import OcProduct
from apps.recreate import services
from apps.sites.models import OcStore

# Which shop product sells each kind of sign: the product pointing at that template.
KIND_TEMPLATES = {
    'floor': 'bespoke/wayfinding_floor',
    'stair': 'bespoke/wayfinding_floor',
    'flats': 'bespoke/wayfinding_flats',
    'combined': 'bespoke/wayfinding_combined',
}
ARROWS = ('none', 'left', 'right', 'up')
PREVIEW_TIMEOUT = 8
_SVG = re.compile(r'<svg\b.*?</svg>', re.S)

logger = logging.getLogger(__name__)
MAX_ROWS = 4
MIN_LEVEL, MAX_LEVEL = -20, 200

_FLATS = re.compile(r'flats?\s*(\d{1,4})(?:\s*(?:-|–|—|to)\s*(\d{1,4}))?(?:\s*(?:arrow\s*)?(left|right|up|←|→|↑))?', re.I)
_ARROW_WORDS = {'←': 'left', '→': 'right', '↑': 'up'}


def kind_of(spec):
    mode = spec.get('mode')
    if mode == 'single':
        return 'stair' if spec.get('type') == 'stair' else 'floor'
    return mode if mode in ('flats', 'combined') else 'floor'


def _naming(level_text):
    """Level and the floor-naming choices behind wording like "Ground Floor"."""
    text = level_text.strip().lower().replace('−', '-')
    if 'lower ground' in text:
        return {'level': '-1', 'ground': 'number', 'below': 'number', 'lower_ground': '1'}
    if 'ground' in text:
        return {'level': '0', 'ground': 'words', 'below': 'number', 'lower_ground': '0'}
    basement = re.search(r'basement\s*(\d+)?', text)
    if basement:
        return {'level': str(-int(basement.group(1) or 1)), 'ground': 'number', 'below': 'basement', 'lower_ground': '0'}
    number = re.search(r'(?:floor|level)\s*(-?\d+)', text)
    if number:
        return {'level': number.group(1), 'ground': 'number', 'below': 'number', 'lower_ground': '0'}
    return None


def spec_from_wording(wording):
    """Best guess at the configurator settings for a stock sign's wording:
    "Floor 2", "Ground Floor", "Stairway A", "Flats 1 - 4 Arrow Left",
    "Floor 3 Flats 1-4 Left Flats 5-8 Right". The reviewer checks it."""
    text = re.sub(r'\bway\s*-?finding\b|\bsigns?\b', ' ', wording or '', flags=re.I)
    text = ' '.join(text.split())

    stair = re.fullmatch(r'stair(?:way|well)?\s*([A-Za-z0-9]{1,2})', text, re.I)
    if stair:
        return {'mode': 'single', 'type': 'stair', 'stair': stair.group(1).upper()}

    rows = [{'from': m.group(1), 'to': m.group(2) or m.group(1),
             'dir': _ARROW_WORDS.get(m.group(3), (m.group(3) or 'none').lower())}
            for m in _FLATS.finditer(text)][:MAX_ROWS]
    floor_part = _FLATS.split(text)[0] if rows else text
    naming = _naming(floor_part)

    if rows and naming:
        return {'mode': 'combined', **naming, 'arrow_side': 'auto', 'flats': rows}
    if rows:
        return {'mode': 'flats', 'arrow_side': 'auto', 'flats': rows}
    return {'mode': 'single', 'type': 'floor', **(naming or {'level': '1', 'ground': 'number',
                                                              'below': 'number', 'lower_ground': '0'})}


def clean_spec(raw):
    """A spec posted by the review page, kept to what the configurator reads.
    Raises ValueError with something to show the reviewer."""
    if not isinstance(raw, dict):
        raise ValueError('No settings sent')
    mode = raw.get('mode')
    naming = {
        'ground': 'words' if raw.get('ground') == 'words' else 'number',
        'below': 'basement' if raw.get('below') == 'basement' else 'number',
        'lower_ground': '1' if str(raw.get('lower_ground')) == '1' else '0',
    }

    def level():
        try:
            value = int(str(raw.get('level', '')).replace('−', '-'))
        except ValueError:
            raise ValueError('The floor must be a whole number')
        if not MIN_LEVEL <= value <= MAX_LEVEL:
            raise ValueError(f'The floor must be between {MIN_LEVEL} and {MAX_LEVEL}')
        return str(value)

    def rows():
        found = []
        for row in (raw.get('flats') or [])[:MAX_ROWS]:
            first, last = str(row.get('from', '')).strip(), str(row.get('to', '')).strip() or str(row.get('from', '')).strip()
            if not first:
                continue
            if not (first.isdigit() and last.isdigit()):
                raise ValueError('Flat numbers must be whole numbers')
            found.append({'from': first, 'to': last, 'dir': row.get('dir') if row.get('dir') in ARROWS else 'none'})
        if not found:
            raise ValueError('Give at least one row of flat numbers')
        return found

    if mode == 'single' and raw.get('type') == 'stair':
        stair = str(raw.get('stair', '')).strip().upper()
        if not re.fullmatch(r'[A-Z0-9]{1,2}', stair):
            raise ValueError('The stair reference is one or two letters or digits')
        return {'mode': 'single', 'type': 'stair', 'stair': stair}
    if mode == 'single':
        return {'mode': 'single', 'type': 'floor', 'level': level(), **naming}
    if mode == 'flats':
        return {'mode': 'flats', 'arrow_side': 'auto', 'flats': rows()}
    if mode == 'combined':
        return {'mode': 'combined', 'level': level(), **naming, 'arrow_side': 'auto', 'flats': rows()}
    raise ValueError('Choose what kind of sign this is')


def design(spec):
    """What an approved wayfinding recreation stores, and the shop reads."""
    return {'role': 'wayfinding', 'kind': kind_of(spec), 'spec': spec}


def is_design(value):
    return isinstance(value, dict) and value.get('role') == 'wayfinding' and isinstance(value.get('spec'), dict)


def _shop_base():
    """The shop these signs are sold on, ending in '/'; '' if unknown."""
    store = OcStore.objects.filter(store_id=services.store_id()).values_list('url', flat=True).first()
    if not store:
        return ''
    return store if store.endswith('/') else store + '/'


def shop_url(spec):
    """The configurator on the shop, opened at these settings; '' if the shop
    has no product for this kind of sign yet."""
    # The Custom product the shop sends these signs to (tsg_store
    # model/bespoke/wayfinding.php getProductIdForKind): the bespoke product
    # on the template, like Custom Prohibition Sign. None, no link.
    product = (OcProduct.objects
               .filter(bespoke_template__path=KIND_TEMPLATES[kind_of(spec)], status=1, is_bespoke=True)
               .order_by('product_id').values_list('product_id', flat=True).first())
    base = _shop_base()
    if not product or not base:
        return ''
    return f'{base}index.php?route=product/product&product_id={product}&makebespoke=1&{query_string(spec)}'


def preview(spec):
    """The sign as the configurator draws it, asked of the shop's own preview
    route (tsg_store controller/bespoke/wayfinding.php preview()), since the
    configurator is PHP that lives there. Returns svg, width, height, whether
    it meets Approved Document B, and an error for the reviewer when it
    cannot be drawn or the shop cannot be reached."""
    base = _shop_base()
    if not base:
        return {'error': 'No shop address for this store'}
    try:
        response = requests.get(f'{base}index.php?route=bespoke/wayfinding/preview&{query_string(spec)}',
                                timeout=PREVIEW_TIMEOUT)
        response.raise_for_status()
        data = response.json()
    except (requests.RequestException, ValueError) as e:
        logger.warning('wayfinding preview from %s failed: %s', base, e)
        return {'error': 'The shop could not be reached for a preview'}
    if not data.get('ok'):
        return {'error': data.get('error') or 'The configurator could not draw this sign'}
    item = (data.get('items') or [{}])[0]
    svg = _SVG.search(data.get('html') or '')
    return {
        'svg': svg.group(0) if svg else '',
        'width': item.get('width'),
        'height': item.get('height'),
        'compliant': bool(item.get('compliant')),
    }
