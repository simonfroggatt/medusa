"""
Royal Mail Click & Drop API integration.
API docs: https://api.parcel.royalmail.com/
Swagger:  https://api.parcel.royalmail.com/swagger/v1/swagger.json
Base URL: https://api.parcel.royalmail.com/api/v1
Auth:     Authorization: Bearer <api_key>  (from Click & Drop > Settings > Integrations)
Rate limit: 5 calls/second (HTTP 429 if exceeded)

Endpoints implemented:
  GET    /version                         — API version
  GET    /orders                          — paginated order list
  GET    /orders/{ids}                    — retrieve specific orders
  POST   /orders                          — create orders
  DELETE /orders/{ids}                    — delete/cancel orders
  PUT    /orders/status                   — update order status
  GET    /orders/{ids}/label              — download label PDF
  POST   /manifests                       — manifest orders
  GET    /manifests/{guid}                — manifest status + PDF
  POST   /manifests/{guid}/retry          — retry failed manifest

Address lookup uses the Royal Mail Address API (separate key: RM_ADDRESS_API_KEY).
  Base: https://api.royalmail.net/address/v2/addresses
"""
from __future__ import annotations

import json
import logging
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

from django.conf import settings

logger = logging.getLogger(__name__)

_BASE       = 'https://api.parcel.royalmail.com/api/v1'
_CD_KEY     = getattr(settings, 'RM_CLICK_DROP_KEY', '')
_ADDR_KEY   = getattr(settings, 'RM_ADDRESS_API_KEY', '')   # separate key for address lookup

# ── Service codes ─────────────────────────────────────────────────────────────
# From your Click & Drop account — adjust if your account has different codes.
# Append 'S' to a service code for signature-on-delivery variant (e.g. TRN24S).
SERVICE_CODES = {
    # Tracked 24
    'tracked_24_large_letter': {'code': 'TPN24', 'label': 'Tracked 24 Large Letter', 'format': 'largeLetter'},
    'tracked_24_parcel':       {'code': 'TPN24', 'label': 'Tracked 24 Parcel',        'format': 'parcel'},
    # Tracked 48
    'tracked_48_large_letter': {'code': 'TPS48', 'label': 'Tracked 48 Large Letter', 'format': 'largeLetter'},
    'tracked_48_parcel':       {'code': 'TPS48', 'label': 'Tracked 48 Parcel',        'format': 'parcel'},
}

# Package format identifiers accepted by the API
PACKAGE_FORMATS = [
    'undefined', 'letter', 'largeLetter', 'smallParcel',
    'mediumParcel', 'largeParcel', 'parcel', 'documents',
]


# ── HTTP helpers ──────────────────────────────────────────────────────────────

def _cd_headers() -> dict:
    if not _CD_KEY:
        raise RuntimeError(
            "RM_CLICK_DROP_KEY not set. Add it to your .env / settings. "
            "Generate it in Click & Drop > Settings > Integrations."
        )
    return {
        'Authorization': f'Bearer {_CD_KEY}',
        'Accept':        'application/json',
        'Content-Type':  'application/json',
    }


def _get(path: str) -> dict | list:
    url = f'{_BASE}/{path.lstrip("/")}'
    req = urllib.request.Request(url, headers=_cd_headers())
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        logger.error(f'[RM-ClickDrop] GET {path} → HTTP {exc.code}: {body[:300]}')
        raise RuntimeError(f'Click & Drop API error ({exc.code}): {body[:200]}') from exc


def _post(path: str, payload: dict) -> dict | list:
    url = f'{_BASE}/{path.lstrip("/")}'
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=_cd_headers(), method='POST')
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        logger.error(f'[RM-ClickDrop] POST {path} → HTTP {exc.code}: {body[:300]}')
        raise RuntimeError(f'Click & Drop API error ({exc.code}): {body[:200]}') from exc


def _put(path: str, payload: dict) -> dict | list:
    url = f'{_BASE}/{path.lstrip("/")}'
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=_cd_headers(), method='PUT')
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        logger.error(f'[RM-ClickDrop] PUT {path} → HTTP {exc.code}: {body[:300]}')
        raise RuntimeError(f'Click & Drop API error ({exc.code}): {body[:200]}') from exc


def _delete(path: str) -> dict | list:
    url = f'{_BASE}/{path.lstrip("/")}'
    req = urllib.request.Request(url, headers=_cd_headers(), method='DELETE')
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        logger.error(f'[RM-ClickDrop] DELETE {path} → HTTP {exc.code}: {body[:300]}')
        raise RuntimeError(f'Click & Drop API error ({exc.code}): {body[:200]}') from exc


def _get_raw(url: str) -> bytes:
    """GET that returns raw bytes (for PDF labels / manifest docs)."""
    req = urllib.request.Request(url, headers=_cd_headers())
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.read()
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'Click & Drop download error ({exc.code}): {body[:200]}') from exc


# ── Address lookup ─────────────────────────────────────────────────────────────

def lookup_address(postcode: str) -> list[dict]:
    """
    Look up addresses for a given postcode using the Royal Mail Address API.
    Returns a list of address dicts, or an empty list if the key is not set.

    Each dict has keys: addressline1, addressline2, addressline3, posttown, postcode
    """
    if not _ADDR_KEY:
        return []
    postcode_enc = urllib.request.quote(postcode.strip().upper())
    url = f'https://api.royalmail.net/address/v2/addresses?postcode={postcode_enc}'
    req = urllib.request.Request(url, headers={
        'X-IBM-Client-Id': _ADDR_KEY,
        'Accept': 'application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
            # API returns { addresses: [...] }
            return data.get('addresses', data if isinstance(data, list) else [])
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        logger.warning(f'[RM-Address] lookup {postcode} → HTTP {exc.code}: {body[:200]}')
        return []
    except Exception as exc:
        logger.warning(f'[RM-Address] lookup failed: {exc}')
        return []


# ── Version ───────────────────────────────────────────────────────────────────

def get_version() -> dict:
    """GET /version — returns commit, build, release, releaseDate."""
    return _get('/version')


def get_services() -> dict:
    """GET /services — returns service codes supported by your account."""
    return _get('/services')


# ── Orders — list / retrieve ──────────────────────────────────────────────────

def get_orders(
    page_size: int = 25,
    start_datetime: str | None = None,
    end_datetime: str | None = None,
    continuation_token: str | None = None,
) -> dict:
    """
    GET /orders — paginated order list.
    Returns { orders: [...], continuationToken: str|null }.
    """
    params = [f'pageSize={page_size}']
    if start_datetime:
        params.append(f'startDateTime={urllib.parse.quote(start_datetime)}')
    if end_datetime:
        params.append(f'endDateTime={urllib.parse.quote(end_datetime)}')
    if continuation_token:
        params.append(f'continuationToken={urllib.parse.quote(continuation_token)}')
    qs = '&'.join(params)
    return _get(f'/orders?{qs}')


def get_specific_orders(order_identifiers: list[int | str]) -> list[dict]:
    """
    GET /orders/{orderIdentifiers} — retrieve specific orders.
    Identifiers are semicolon-separated. Integers are order IDs,
    strings (quoted) are order references.
    """
    parts = []
    for oid in order_identifiers:
        if isinstance(oid, int):
            parts.append(str(oid))
        else:
            parts.append(f'"{urllib.parse.quote(str(oid))}"')
    ids_str = ';'.join(parts)
    return _get(f'/orders/{ids_str}')


# ── Orders — create ──────────────────────────────────────────────────────────

def create_order(
    recipient_name:   str,
    address_line1:    str,
    city:             str,
    postcode:         str,
    country_code:     str,
    weight_grams:     int,
    service_key:      str,           # key from SERVICE_CODES
    package_format:   str = 'parcel',
    reference:        str = '',
    email:            str = '',
    phone:            str = '',
    company_name:     str = '',
    address_line2:    str = '',
    address_line3:    str = '',
    county:           str = '',
    subtotal:         float = 0,
    shipping_cost:    float = 0,
    total:            float = 0,
    include_label:    bool = False,
    include_cn:       bool = False,
    include_returns:  bool = False,
) -> dict:
    """
    POST /orders — create a new Click & Drop order.

    Payload matches the official API schema:
      CreateOrdersRequest → items[] → CreateOrderRequest

    Returns CreateOrdersResponse:
      { successCount, errorsCount, createdOrders: [...], failedOrders: [...] }

    Each createdOrder has: orderIdentifier, orderReference, createdOn,
    trackingNumber, packages, label (base64 if requested).
    """
    svc = SERVICE_CODES.get(service_key)
    if not svc:
        raise ValueError(f"Unknown service_key '{service_key}'. Use: {list(SERVICE_CODES)}")

    order_item = {
        'orderReference':     reference,
        'recipient': {
            'address': {
                'fullName':     recipient_name,
                'companyName':  company_name,
                'addressLine1': address_line1,
                'addressLine2': address_line2,
                'addressLine3': address_line3,
                'city':         city,
                'county':       county,
                'postcode':     postcode,
                'countryCode':  country_code,
            },
            'phoneNumber':    phone,
            'emailAddress':   email,
        },
        'packages': [
            {
                'weightInGrams':          weight_grams,
                'packageFormatIdentifier': svc.get('format', package_format),
            }
        ],
        'postageDetails': {
            'serviceCode': svc['code'],
        },
        'orderDate':          datetime.now(timezone.utc).isoformat(),
        'subtotal':           subtotal,
        'shippingCostCharged': shipping_cost,
        'total':              total,
    }

    if include_label:
        order_item['label'] = {
            'includeLabelInResponse': True,
            'includeCN':              include_cn,
            'includeReturnsLabel':    include_returns,
        }

    payload = {'items': [order_item]}
    # TODO: TEMP DEBUG — remove after testing
    logger.warning('[RM-DEBUG] Service: %s, Code: %s, Format: %s', service_key, svc['code'], svc.get('format', 'N/A'))
    logger.info(f'[RM-ClickDrop] POST payload to create_order: {json.dumps(payload, default=str)}')
    result = _post('/orders', payload)
    logger.info(f'[RM-ClickDrop] Created order: {result}')
    return result


# ── Orders — delete ───────────────────────────────────────────────────────────

def delete_orders(order_identifiers: list[int | str]) -> dict:
    """
    DELETE /orders/{orderIdentifiers} — cancel/delete orders.
    Labels generated for deleted orders are no longer valid.
    Returns { deletedOrders: [...], errors: [...] }.
    """
    parts = []
    for oid in order_identifiers:
        if isinstance(oid, int):
            parts.append(str(oid))
        else:
            parts.append(f'"{urllib.parse.quote(str(oid))}"')
    ids_str = ';'.join(parts)
    return _delete(f'/orders/{ids_str}')


# ── Orders — update status ───────────────────────────────────────────────────

def update_order_status(
    order_identifier: int | None = None,
    order_reference: str | None = None,
    status: str = 'despatched',
    tracking_number: str | None = None,
    despatch_date: str | None = None,
    shipping_carrier: str | None = None,
    shipping_service: str | None = None,
) -> dict:
    """
    PUT /orders/status — set order status.

    status enum: 'new', 'despatched', 'despatchedByOtherCourier'

    When status='despatchedByOtherCourier' and trackingNumber is provided,
    despatchDate, shippingCarrier and shippingService are also required.
    """
    item: dict = {'status': status}
    if order_identifier is not None:
        item['orderIdentifier'] = order_identifier
    if order_reference is not None:
        item['orderReference'] = order_reference
    if tracking_number:
        item['trackingNumber'] = tracking_number
    if despatch_date:
        item['despatchDate'] = despatch_date
    if shipping_carrier:
        item['shippingCarrier'] = shipping_carrier
    if shipping_service:
        item['shippingService'] = shipping_service

    payload = {'items': [item]}
    return _put('/orders/status', payload)


# ── Labels ────────────────────────────────────────────────────────────────────

def get_label(
    order_id: int | str,
    document_type: str = 'postageLabel',
    include_returns: bool = False,
    include_cn: bool = False,
) -> bytes:
    """
    GET /orders/{id}/label — download label as PDF bytes.

    document_type enum: 'postageLabel', 'despatchNote', 'CN22', 'CN23'
    include_returns / include_cn only apply when document_type='postageLabel'.
    """
    params = [f'documentType={document_type}']
    if document_type == 'postageLabel':
        params.append(f'includeReturnsLabel={str(include_returns).lower()}')
        if include_cn:
            params.append('includeCN=true')
    qs = '&'.join(params)
    url = f'{_BASE}/orders/{order_id}/label?{qs}'
    return _get_raw(url)


# ── Manifests ─────────────────────────────────────────────────────────────────

def create_manifest(
    order_identifiers: list[int] | None = None,
    order_references: list[str] | None = None,
    start_datetime: str | None = None,
    end_datetime: str | None = None,
    all_orders: bool = False,
) -> dict:
    """
    POST /manifests — manifest orders for collection.
    Returns { manifests: [guid, ...] }.
    HTTP 202 = accepted and processing.
    """
    payload: dict = {}
    if order_identifiers:
        payload['orderIdentifiers'] = order_identifiers
    if order_references:
        payload['orderReferences'] = order_references
    if start_datetime:
        payload['startDateTime'] = start_datetime
    if end_datetime:
        payload['endDateTime'] = end_datetime
    if all_orders:
        payload['allOrders'] = True
    return _post('/manifests', payload)


def get_manifest(manifest_guid: str) -> dict:
    """
    GET /manifests/{guid} — manifest status + PDF (base64).
    Returns { manifestStatus, documentStatus, orders, pdf }.
    manifestStatus enum: 'InProgress', 'Completed', 'Failed'
    """
    return _get(f'/manifests/{manifest_guid}')


def retry_manifest(manifest_guid: str) -> dict:
    """
    POST /manifests/{guid}/retry — retry a failed manifest.
    Will 400 if called within 30 mins of a previous attempt.
    """
    return _post(f'/manifests/{manifest_guid}/retry', {})
