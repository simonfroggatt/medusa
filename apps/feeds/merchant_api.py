"""
Google Merchant API (v1) client for pushing a store's offers.

Signs in with the service account in settings.MERCHANT_SERVICE_ACCOUNT_FILE
(default <BASE_DIR>/merchant.json, never committed). Nothing is sent unless
settings.MERCHANT_API_ENABLED is True, which only the live settings should set. Products go into an API
data source of our own, found or created by DATA_SOURCE_NAME, so the old
hand-uploaded file feed is never touched.
"""
import logging
import os
import time

import requests
from django.conf import settings
from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account

logger = logging.getLogger('apps')

API_ROOT = 'https://merchantapi.googleapis.com'
SCOPES = ['https://www.googleapis.com/auth/content']
DATA_SOURCE_NAME = 'Medusa API'
CONTENT_LANGUAGE = 'en'
FEED_LABEL = 'GB'
TARGET_COUNTRY = 'GB'
CURRENCY = 'GBP'
SHIPPING_SERVICE = 'Standard'
# Where a variant that isn't meant for ads is kept out of. Free listings and
# dynamic remarketing (Display ads) keep every variant, so remarketing can show
# the exact size and material someone looked at.
ADS_DESTINATIONS = ['SHOPPING_ADS']

# Google's temporary faults and rate limits are retried with growing pauses.
RETRY_STATUSES = {429, 500, 502, 503, 504}
RETRY_DELAYS = [2, 4, 8, 16]  # seconds


class MerchantApiError(Exception):
    def __init__(self, status, body):
        super().__init__(f"Merchant API {status}: {body[:500]}")
        self.status = status
        self.body = body


def credentials_file():
    return getattr(settings, 'MERCHANT_SERVICE_ACCOUNT_FILE',
                   os.path.join(settings.BASE_DIR, 'merchant.json'))


def is_enabled():
    """
    Only true where settings.MERCHANT_API_ENABLED is set and the key exists.
    Off by default so a local copy of the database never pushes to live Google.
    """
    return bool(getattr(settings, 'MERCHANT_API_ENABLED', False)) and os.path.exists(credentials_file())


def _price(amount):
    return {'amountMicros': str(int(amount * 1000000)), 'currencyCode': CURRENCY}


def to_product_input(offer):
    """Map an offer from merchant_feed.build_offers to a Merchant API ProductInput."""
    attrs = {
        'title': offer['title'],
        'description': offer['description'],
        'link': offer['link'],
        'imageLink': offer['image_link'],
        'availability': 'IN_STOCK' if offer['availability'] == 'in_stock' else 'OUT_OF_STOCK',
        'condition': 'NEW',
        'price': _price(offer['price']),
        'brand': offer['brand'],
        'itemGroupId': offer['item_group_id'],
        'size': offer['size'],
        'material': offer['material'],
        'shipping': [{
            'country': TARGET_COUNTRY,
            'service': SHIPPING_SERVICE,
            'price': _price(offer['shipping_price']),
        }],
        'minHandlingTime': str(offer['min_handling_days']),
        'maxHandlingTime': str(offer['max_handling_days']),
    }
    if offer['additional_image_links']:
        attrs['additionalImageLinks'] = offer['additional_image_links']
    # GTIN deliberately not sent
    if offer['mpn']:
        attrs['mpn'] = offer['mpn']
    else:
        attrs['identifierExists'] = False
    if offer['google_product_category']:
        attrs['googleProductCategory'] = offer['google_product_category']
    if offer['product_type']:
        attrs['productTypes'] = [offer['product_type']]
    if offer['product_highlights']:
        attrs['productHighlights'] = offer['product_highlights']
    for index, value in enumerate(offer['custom_labels']):
        if value:
            attrs[f'customLabel{index}'] = value
    if not offer['show_in_ads']:
        attrs['excludedDestinations'] = ADS_DESTINATIONS

    return {
        'offerId': offer['offer_id'],
        'contentLanguage': CONTENT_LANGUAGE,
        'feedLabel': FEED_LABEL,
        'productAttributes': attrs,
    }


class MerchantClient:
    def __init__(self, account_id, session=None):
        self.account_id = str(account_id)
        if session is None:
            creds = service_account.Credentials.from_service_account_file(credentials_file(), scopes=SCOPES)
            session = AuthorizedSession(creds)
        self.session = session
        self._data_source = None

    def _call(self, method, path, **kwargs):
        # Every call we make is safe to repeat: an insert overwrites, a delete of
        # something already gone comes back 404.
        for delay in RETRY_DELAYS + [None]:
            try:
                response = self.session.request(method, f"{API_ROOT}/{path}", timeout=60, **kwargs)
            except requests.RequestException:
                if delay is None:
                    raise
                time.sleep(delay)
                continue
            if response.status_code in RETRY_STATUSES and delay is not None:
                time.sleep(delay)
                continue
            if response.status_code >= 400:
                raise MerchantApiError(response.status_code, response.text)
            return response.json() if response.content else {}

    @property
    def account(self):
        return f"accounts/{self.account_id}"

    def data_source(self):
        """Resource name of our API data source, created on first use."""
        if self._data_source:
            return self._data_source
        page_token = None
        while True:
            params = {'pageSize': 1000}
            if page_token:
                params['pageToken'] = page_token
            page = self._call('GET', f"datasources/v1/{self.account}/dataSources", params=params)
            for source in page.get('dataSources', []):
                if source.get('displayName') == DATA_SOURCE_NAME and 'primaryProductDataSource' in source:
                    self._data_source = source['name']
                    return self._data_source
            page_token = page.get('nextPageToken')
            if not page_token:
                break

        created = self._call('POST', f"datasources/v1/{self.account}/dataSources", json={
            'displayName': DATA_SOURCE_NAME,
            'primaryProductDataSource': {
                'contentLanguage': CONTENT_LANGUAGE,
                'feedLabel': FEED_LABEL,
                'countries': [TARGET_COUNTRY],
            },
        })
        logger.info(f"Merchant {self.account_id}: created data source {created['name']}")
        self._data_source = created['name']
        return self._data_source

    def list_data_sources(self):
        return self._call('GET', f"datasources/v1/{self.account}/dataSources",
                          params={'pageSize': 1000}).get('dataSources', [])

    def insert(self, product_input):
        return self._call('POST', f"products/v1/{self.account}/productInputs:insert",
                          params={'dataSource': self.data_source()}, json=product_input)

    def delete(self, offer_id):
        """Remove an offer from our data source. Returns False if it wasn't there."""
        name = f"{CONTENT_LANGUAGE}~{FEED_LABEL}~{offer_id}"
        try:
            self._call('DELETE', f"products/v1/{self.account}/productInputs/{name}",
                       params={'dataSource': self.data_source()})
        except MerchantApiError as e:
            if e.status == 404:
                return False
            raise
        return True

    def our_offer_ids(self):
        """Offer ids of every processed product whose primary source is ours."""
        source = self.data_source()
        ids = set()
        page_token = None
        while True:
            params = {'pageSize': 1000}
            if page_token:
                params['pageToken'] = page_token
            page = self._call('GET', f"products/v1/{self.account}/products", params=params)
            for product in page.get('products', []):
                if product.get('dataSource') == source and product.get('feedLabel') == FEED_LABEL:
                    ids.add(product['offerId'])
            page_token = page.get('nextPageToken')
            if not page_token:
                return ids
