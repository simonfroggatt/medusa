"""
Loqate Address Verify API integration.
API docs: https://docs.loqate.com/api-reference/address-verify/quickstart
Endpoint: POST https://api.addressy.com/Cleansing/International/Batch/v1.20/json6.ws

Sends a structured address to Loqate and returns:
  - Verified/cleansed address fields
  - AVC code (Address Verification Code) — e.g. "V44-I44-P6-100"
  - AQI code (Address Quality Indicator)
  - Matchscore (0-100) — how much the input changed during verification

AVC breakdown (e.g. V44-I44-P6-100):
  Position 1: Verification Status  (V=Verified, P=Partial, A=Ambiguous, R=Reverted, U=Unverified)
  Position 2: Post-processed match level (0-5, where 5=DeliveryPoint, 4=Premise, 3=Thoroughfare)
  Position 3: Pre-processed match level (0-5)
  Position 4: Parsing status (I=Identified, U=Unable)
  Position 5: Lexicon match level (0-5)
  Position 6: Context match level (0-5)
  Position 7-8: Postcode status (P0-P8)
  Position 9-11: Matchscore (0-100)

Settings required:
  LOQATE_KEY — your Loqate API key (format: "AA11-AA11-AA11-AA11")
"""
from __future__ import annotations

import hashlib
import json
import logging
import urllib.error
import urllib.request
from decimal import Decimal

from django.conf import settings

logger = logging.getLogger(__name__)

_VERIFY_URL = 'https://api.addressy.com/Cleansing/International/Batch/v1.20/json6.ws'


def _get_loqate_key() -> str:
    """Lazy lookup so the key is always read from current settings."""
    return getattr(settings, 'LOQATE_KEY', '')


def _build_input_hash(
    line1: str, line2: str, city: str, area: str, postcode: str, country_code: str,
) -> str:
    """Deterministic hash of the input address for deduplication."""
    raw = '|'.join([
        (line1 or '').strip().lower(),
        (line2 or '').strip().lower(),
        (city or '').strip().lower(),
        (area or '').strip().lower(),
        (postcode or '').strip().lower(),
        (country_code or '').strip().upper(),
    ])
    return hashlib.sha256(raw.encode()).hexdigest()


def _parse_avc(avc: str) -> dict:
    """
    Parse an AVC string like "V44-I44-P6-100" into a structured dict.
    Returns verification_status, match_level, matchscore, postcode_status, etc.
    """
    result = {
        'raw': avc,
        'verification_status': None,
        'post_match_level': None,
        'pre_match_level': None,
        'parsing_status': None,
        'postcode_status': None,
        'matchscore': None,
    }
    if not avc:
        return result

    parts = avc.split('-')

    # Part 1: e.g. "V44" → V=status, 4=post-match, 4=pre-match
    if len(parts) >= 1 and len(parts[0]) >= 3:
        result['verification_status'] = parts[0][0]   # V, P, A, R, U
        result['post_match_level'] = int(parts[0][1])  # 0-5
        result['pre_match_level'] = int(parts[0][2])   # 0-5

    # Part 2: e.g. "I44" → I=parsing, 4=lexicon, 4=context
    if len(parts) >= 2 and len(parts[1]) >= 1:
        result['parsing_status'] = parts[1][0]  # I or U

    # Part 3: e.g. "P6" → postcode status
    if len(parts) >= 3:
        result['postcode_status'] = parts[2]

    # Part 4: e.g. "100" → matchscore
    if len(parts) >= 4:
        try:
            result['matchscore'] = int(parts[3])
        except ValueError:
            pass

    return result


def _compute_confidence(avc_parsed: dict) -> Decimal:
    """
    Compute a 0-100 confidence score from the parsed AVC.

    Weighting:
      - Verification status (V=40, P=25, A=10, R/U=0)     max 40
      - Post-processed match level (0-5 scaled to 0-30)    max 30
      - Matchscore (0-100 scaled to 0-30)                  max 30
    """
    status_scores = {'V': 40, 'P': 25, 'A': 10, 'R': 0, 'U': 0}
    status_val = status_scores.get(avc_parsed.get('verification_status', ''), 0)

    match_level = avc_parsed.get('post_match_level') or 0
    level_val = (match_level / 5) * 30

    matchscore = avc_parsed.get('matchscore') or 0
    ms_val = (matchscore / 100) * 30

    return Decimal(str(round(status_val + level_val + ms_val, 2)))


def verify_address(
    line1: str,
    line2: str = '',
    line3: str = '',
    city: str = '',
    area: str = '',
    postcode: str = '',
    country_code: str = 'GB',
    organization: str = '',
) -> dict:
    """
    Verify a single address via Loqate.

    Returns a dict with:
      ok:               bool
      input_hash:       str (SHA-256 of normalised input)
      avc:              str (raw AVC code)
      avc_parsed:       dict (structured breakdown)
      matchscore:       int (0-100, from Loqate)
      confidence_score: Decimal (0-100, our weighted score)
      verification_level: str (e.g. "V4" = Verified to Premise)
      verified_address: dict (cleansed address fields)
      request_json:     str (raw request payload)
      response_json:    str (raw response payload)
    """
    key = _get_loqate_key()
    if not key:
        raise RuntimeError(
            "LOQATE_KEY not set. Add LOQATE_API_KEY to your .env / settings. "
            "Get your key from https://account.loqate.com/"
        )

    input_hash = _build_input_hash(line1, line2, city, area, postcode, country_code)

    payload = {
        'Key': key,
        'Addresses': [
            {
                'Address1': line1,
                'Address2': line2,
                'Address3': line3,
                'Locality': city,
                'AdministrativeArea': area,
                'PostalCode': postcode,
                'Country': country_code,
                'Organization': organization,
            }
        ],
        'Options': {
            'Process': 'Verify',
            'ServerOptions': {
                'OutputCasing': 'Title',
            },
        },
    }

    request_json = json.dumps(payload)
    data = request_json.encode()
    url = f'{_VERIFY_URL}?Key={key}'
    req = urllib.request.Request(url, data=data, headers={
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }, method='POST')

    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            response_body = r.read().decode('utf-8')
            response_data = json.loads(response_body)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        logger.error(f'[Loqate] Verify failed → HTTP {exc.code}: {body[:300]}')
        raise RuntimeError(f'Loqate API error ({exc.code}): {body[:200]}') from exc

    response_json = json.dumps(response_data)

    # Response is a list of results, one per input address
    if not response_data or not isinstance(response_data, list):
        return {
            'ok': False,
            'error': 'Empty or unexpected response from Loqate',
            'input_hash': input_hash,
            'request_json': request_json,
            'response_json': response_json,
        }

    result = response_data[0]
    matches = result.get('Matches', [])

    if not matches:
        return {
            'ok': False,
            'error': 'No matches returned by Loqate',
            'input_hash': input_hash,
            'avc': '',
            'avc_parsed': _parse_avc(''),
            'matchscore': 0,
            'confidence_score': Decimal('0'),
            'verification_level': '',
            'verified_address': {},
            'request_json': request_json,
            'response_json': response_json,
        }

    # Take the best match (first one, sorted by AVC by default)
    match = matches[0]
    avc = match.get('AVC', '')
    avc_parsed = _parse_avc(avc)
    confidence = _compute_confidence(avc_parsed)

    # Build a verification level string like "V4" (Verified to Premise)
    v_status = avc_parsed.get('verification_status', '?')
    v_level = avc_parsed.get('post_match_level', 0)
    verification_level = f'{v_status}{v_level}'

    verified_address = {
        'line1': match.get('DeliveryAddress1', match.get('Address1', '')),
        'line2': match.get('DeliveryAddress2', match.get('Address2', '')),
        'line3': match.get('DeliveryAddress3', match.get('Address3', '')),
        'city': match.get('Locality', ''),
        'area': match.get('AdministrativeArea', match.get('SubAdministrativeArea', '')),
        'postcode': match.get('PostalCode', ''),
        'country_code': match.get('Country', country_code),
    }

    return {
        'ok': True,
        'input_hash': input_hash,
        'avc': avc,
        'avc_parsed': avc_parsed,
        'matchscore': avc_parsed.get('matchscore', 0),
        'confidence_score': confidence,
        'verification_level': verification_level,
        'verified_address': verified_address,
        'request_json': request_json,
        'response_json': response_json,
    }
