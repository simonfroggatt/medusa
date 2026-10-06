"""What a wayfinding sign says, for the order page and the paperwork.

A wayfinding line (oc_tsg_order_bespoke_image.version 4) carries the
configurator's record in svg_json and the sign's wording in svg_texts. The
order page, picklists, dispatch notes and invoices list a line's options as
"Name : value"; these are the same pairs for a wayfinding sign -- what kind of
sign it is, what it reads, and the building it was ordered with -- worked out
from the line's own artwork row rather than stored again, so editing the line
in Medusa (which rewrites its option rows) cannot lose them.
"""
import json
from urllib.parse import quote

from apps.orders.models import OcTsgOrderBespokeImage

WAYFINDING_VERSION = OcTsgOrderBespokeImage.WAYFINDING_VERSION

KIND_LABELS = {
    'floor': 'Floor sign',
    'stair': 'Stair sign',
    'flats': 'Flat sign',
    'combined': 'Floor + flats sign',
}

# The paperwork is drawn with the PDF base fonts, which have no arrows and no
# true minus sign, so the wording is written out in plain text.
ARROWS = {'←': 'arrow left', '→': 'arrow right', '↑': 'arrow up', '↓': 'arrow down'}


def _decoded(value, times=2):
    """JSON the cart stored, however many times it was encoded on the way."""
    for _ in range(times):
        if not isinstance(value, str):
            break
        try:
            value = json.loads(value)
        except ValueError:
            return value
    return value


def query_string(spec, prefix=''):
    """A configurator spec as the PHP query string the shop reads back, so
    nested flat rows come out as flats[0][from]=1 rather than Python's own idea."""
    pairs = []
    items = spec.items() if isinstance(spec, dict) else enumerate(spec)
    for key, value in items:
        name = f'{prefix}[{key}]' if prefix else str(key)
        if isinstance(value, (dict, list)):
            pairs.append(query_string(value, name))
        else:
            pairs.append(f'{quote(name, safe="[]")}={quote(str(value), safe="")}')
    return '&'.join(p for p in pairs if p)


def record(row):
    """The configurator's record on a line: kind, spec, size, building. None
    if the line was drawn by anything else."""
    value = _decoded(row.svg_json) if row.svg_json else None
    return value if isinstance(value, dict) and value.get('role') == 'wayfinding' else None


def plain(text):
    """'Flats 1–4 ←' -> 'Flats 1–4, arrow left'; 'Floor −1' -> 'Floor -1'."""
    text = str(text).replace('−', '-').strip()
    for arrow, words in ARROWS.items():
        if arrow in text:
            text = f"{text.replace(arrow, '').strip()}, {words}"
    return ' '.join(text.split())


def option_lines(row):
    """(name, value) pairs describing a wayfinding sign; [] for any other line."""
    found = record(row)
    if not found:
        return []
    kind = found.get('kind') or ''
    texts = _decoded(row.svg_texts) if row.svg_texts else []
    texts = [plain(t) for t in texts] if isinstance(texts, list) else []
    if not texts and found.get('title'):
        texts = [plain(found['title'])]

    lines = [('Sign', KIND_LABELS.get(kind, 'Wayfinding sign'))]
    if kind in ('flats', 'combined'):
        if kind == 'combined' and texts:
            lines.append(('Floor', texts[0]))
            texts = texts[1:]
        for number, text in enumerate(texts, 1):
            lines.append((f'Flats row {number}' if len(texts) > 1 else 'Flats', text))
    elif texts:
        lines.append(('Reads', ' '.join(texts)))

    label = ((found.get('group') or {}).get('label') or '').strip()
    if label:
        lines.append(('Building', plain(label.removeprefix('Building:').strip())))
    return lines


def line_option_lines(order_product_id):
    """option_lines() for an order line, by its id; [] if it is not a wayfinding sign."""
    row = OcTsgOrderBespokeImage.objects.filter(
        order_product_id=order_product_id, version=WAYFINDING_VERSION).first()
    return option_lines(row) if row else []


def order_has_wayfinding(order_id):
    return OcTsgOrderBespokeImage.objects.filter(
        order_product__order_id=order_id, version=WAYFINDING_VERSION).exists()
