"""
DX Delivery API integration.
Docs: https://developers.dxdelivery.com/
Auth: X-API-Key header  (DX_API_KEY in settings)
Account number: DX_ACCOUNT_NUMBER

Common service codes:
  D10   = DX 10:30   (next-day by 10:30)
  D12   = DX 12:00   (next-day by noon)
  DXND  = DX Next Day
  DXSD  = DX Saturday Delivery
  PARCE = DX Parcels (standard)
"""
from __future__ import annotations

import json
import logging
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone, date

from django.conf import settings

logger = logging.getLogger(__name__)

_BASE           = getattr(settings, 'DX_API_BASE_URL', 'https://api.dxdelivery.com/api')
_API_KEY        = getattr(settings, 'DX_API_KEY', '')
_ACCOUNT_NUMBER = getattr(settings, 'DX_ACCOUNT_NUMBER', '')

# ── Service codes ─────────────────────────────────────────────────────────────
SERVICE_CODES = {
    'next_day':    {'code': 'DXND',  'label': 'DX Next Day'},
    'next_day_12': {'code': 'D12',   'label': 'DX 12:00'},
    'next_day_10': {'code': 'D10',   'label': 'DX 10:30'},
    'parcels':     {'code': 'PARCE', 'label': 'DX Parcels'},
}


def _headers() -> dict:
    if not _API_KEY:
        raise RuntimeError(
            "DX_API_KEY not set. Add it to your .env / settings. "
            "Obtain it from your DX Delivery account manager."
        )
    return {
        'X-API-Key':    _API_KEY,
        'Accept':       'application/json',
        'Content-Type': 'application/json',
    }


def _get(path: str) -> dict | list:
    url = f'{_BASE}/{path.lstrip("/")}'
    req = urllib.request.Request(url, headers=_headers())
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        logger.error(f'[DX] GET {path} → HTTP {exc.code}: {body[:300]}')
        raise RuntimeError(f'DX API error ({exc.code}): {body[:200]}') from exc


def _post(path: str, payload: dict) -> dict | list:
    url = f'{_BASE}/{path.lstrip("/")}'
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=_headers(), method='POST')
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        logger.error(f'[DX] POST {path} → HTTP {exc.code}: {body[:300]}')
        raise RuntimeError(f'DX API error ({exc.code}): {body[:200]}') from exc


# ── Address lookup ─────────────────────────────────────────────────────────────

def lookup_address(postcode: str) -> list[dict]:
    """
    Look up addresses for a UK postcode via DX or a free postcode API fallback.
    Returns a list of address dicts.
    """
    # DX doesn't have its own address lookup — use postcodes.io as a lightweight fallback
    postcode_enc = urllib.request.quote(postcode.strip().replace(' ', ''))
    url = f'https://api.postcodes.io/postcodes/{postcode_enc}'
    req = urllib.request.Request(url, headers={'Accept': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            data = json.loads(r.read())
            if data.get('status') == 200:
                result = data.get('result', {})
                return [{
                    'postcode':    result.get('postcode', ''),
                    'posttown':    result.get('admin_district', ''),
                    'addressline1': '',
                    'addressline2': '',
                    'county':      result.get('admin_county', ''),
                    'country':     result.get('country', 'England'),
                }]
    except Exception as exc:
        logger.warning(f'[DX] Postcode lookup failed for {postcode}: {exc}')
    return []


# ── Shipment creation ─────────────────────────────────────────────────────────

def create_shipment(
    recipient_name:  str,
    address_line1:   str,
    address_line2:   str,
    town:            str,
    county:          str,
    postcode:        str,
    country_code:    str,
    service_key:     str,          # key from SERVICE_CODES
    weight_kg:       float = 1.0,
    reference:       str = '',
    email:           str = '',
    phone:           str = '',
    num_items:       int = 1,
) -> dict:
    """
    Create a DX shipment and return the API response (includes consignment number).

    DX API shape (v1 typical):
    POST /shipments
    """
    svc = SERVICE_CODES.get(service_key)
    if not svc:
        raise ValueError(f"Unknown service_key '{service_key}'. Use: {list(SERVICE_CODES)}")

    if not _ACCOUNT_NUMBER:
        raise RuntimeError("DX_ACCOUNT_NUMBER not set in settings.")

    today = date.today().isoformat()

    payload = {
        'accountNumber':  _ACCOUNT_NUMBER,
        'serviceCode':    svc['code'],
        'shipmentDate':   today,
        'reference':      reference,
        'numberOfItems':  num_items,
        'totalWeight':    weight_kg,
        'consignee': {
            'name':         recipient_name,
            'addressLine1': address_line1,
            'addressLine2': address_line2,
            'town':         town,
            'county':       county,
            'postcode':     postcode,
            'countryCode':  country_code,
            'email':        email,
            'telephone':    phone,
        },
    }
    result = _post('/v1/shipments', payload)
    logger.info(f'[DX] Created shipment: {result}')
    return result


def get_label(consignment_number: str) -> bytes:
    """
    Download the PDF label for a DX consignment.
    Endpoint: GET /v1/shipments/{consignment}/label
    Returns raw PDF bytes.
    """
    if not _API_KEY:
        raise RuntimeError('DX_API_KEY not set.')
    url = f'{_BASE}/v1/shipments/{consignment_number}/label'
    req = urllib.request.Request(url, headers=_headers())
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.read()
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        raise RuntimeError(
            f'Could not download DX label for {consignment_number}: {body[:200]}'
        ) from exc
