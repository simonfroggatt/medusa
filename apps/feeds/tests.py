from decimal import Decimal
from types import SimpleNamespace
from unittest import mock

from django.test import SimpleTestCase, override_settings

from apps.feeds import merchant_api, merchant_sync
from apps.feeds.merchant_api import to_product_input
from apps.feeds.merchant_feed import price_band, product_link, rank_variants, store_base_url, truncate


def variant(id, price, material, blocked=False):
    return {'id': id, 'price': Decimal(price), 'material_id': material, 'ads_blocked': blocked}


def offer(**overrides):
    base = {
        'offer_id': '1412', 'product_id': 379, 'item_group_id': '379',
        'title': 'Fire door keep clear sign - 90mm x 90mm - 1mm Rigid',
        'description': 'A sign.', 'link': 'https://www.safetysignsandnotices.co.uk/fire-door?variantid=1412',
        'image_link': 'https://cdn.example/ms354.gif', 'additional_image_links': [],
        'availability': 'in_stock', 'price': Decimal('1.13'), 'brand': 'Safety Signs and Notices',
        'mpn': 'MS 354 L', 'google_product_category': '5892', 'product_type': 'Mandatory Signs > Fire Access Signs',
        'size': '90mm x 90mm', 'material': '1mm Rigid', 'product_highlights': [],
        'shipping_price': Decimal('4.74'), 'min_handling_days': 0, 'max_handling_days': 2,
        'show_in_ads': True,
        'custom_labels': ['cheapest_variant', '1mm Rigid', 'in_house', 'under_5', ''],
    }
    base.update(overrides)
    return base


class RankVariantsTests(SimpleTestCase):
    def test_one_cheapest_per_material_even_when_materials_interleave(self):
        # Sorted by price the materials alternate: vinyl, rigid, vinyl, rigid, vinyl
        labels, ad = rank_variants([
            variant(1, '1.13', 'vinyl'), variant(2, '3.00', 'rigid'), variant(3, '4.12', 'vinyl'),
            variant(4, '6.59', 'rigid'), variant(5, '11.23', 'vinyl'), variant(6, '12.62', 'foamex'),
        ])
        self.assertEqual(labels, {1: 'cheapest_variant', 2: 'cheapest_material', 3: 'other',
                                  4: 'other', 5: 'other', 6: 'cheapest_material'})
        self.assertEqual(ad, 1)

    def test_ad_variant_skips_blocked_variants(self):
        _, ad = rank_variants([variant(1, '1', 'a', blocked=True), variant(2, '2', 'a')])
        self.assertEqual(ad, 2)

    def test_no_ad_variant_when_all_blocked(self):
        _, ad = rank_variants([variant(1, '1', 'a', blocked=True)])
        self.assertIsNone(ad)

    def test_sales_rule_prefers_cheapest_that_sold(self):
        variants = [variant(1, '1', 'a'), variant(2, '2', 'a'), variant(3, '3', 'b')]
        self.assertEqual(rank_variants(variants, sold_ids={3, 2})[1], 2)
        self.assertEqual(rank_variants(variants, sold_ids=set())[1], 1)


class FeedHelperTests(SimpleTestCase):
    def test_price_bands(self):
        self.assertEqual(price_band(Decimal('4.99')), 'under_5')
        self.assertEqual(price_band(Decimal('5.00')), '5_to_15')
        self.assertEqual(price_band(Decimal('39.99')), '15_to_40')
        self.assertEqual(price_band(Decimal('40.00')), 'over_40')

    def test_store_base_url_prefers_ssl(self):
        store = SimpleNamespace(ssl='https://www.imosigns.co.uk', url='http://www.imosigns.co.uk/')
        self.assertEqual(store_base_url(store), 'https://www.imosigns.co.uk/')
        store = SimpleNamespace(ssl='', url='http://www.imosigns.co.uk/')
        self.assertEqual(store_base_url(store), 'http://www.imosigns.co.uk/')

    def test_product_link(self):
        base = 'https://www.safetysignsandnotices.co.uk/'
        self.assertEqual(product_link(base, 'no-smoking', 1, 5), f'{base}no-smoking?variantid=5')
        self.assertEqual(product_link(base, '', 1, 5),
                         f'{base}index.php?route=product/product&product_id=1&variantid=5')

    def test_truncate(self):
        self.assertEqual(truncate('short', 150), 'short')
        long = truncate('x' * 200, 150)
        self.assertEqual(len(long), 150)
        self.assertTrue(long.endswith('…'))


class ToProductInputTests(SimpleTestCase):
    def test_core_fields(self):
        pi = to_product_input(offer())
        self.assertEqual((pi['offerId'], pi['contentLanguage'], pi['feedLabel']), ('1412', 'en', 'GB'))
        attrs = pi['productAttributes']
        self.assertEqual(attrs['price'], {'amountMicros': '1130000', 'currencyCode': 'GBP'})
        self.assertEqual(attrs['availability'], 'IN_STOCK')
        self.assertEqual(attrs['shipping'][0]['country'], 'GB')
        self.assertEqual(attrs['shipping'][0]['price']['amountMicros'], '4740000')
        self.assertEqual((attrs['minHandlingTime'], attrs['maxHandlingTime']), ('0', '2'))
        self.assertEqual(attrs['mpn'], 'MS 354 L')
        self.assertNotIn('identifierExists', attrs)
        self.assertNotIn('gtins', attrs)
        self.assertNotIn('excludedDestinations', attrs)

    def test_empty_labels_are_left_off(self):
        attrs = to_product_input(offer())['productAttributes']
        self.assertEqual(attrs['customLabel0'], 'cheapest_variant')
        self.assertNotIn('customLabel4', attrs)

    def test_not_for_ads_is_excluded_from_ads_only(self):
        attrs = to_product_input(offer(show_in_ads=False))['productAttributes']
        self.assertEqual(attrs['excludedDestinations'], ['SHOPPING_ADS', 'DISPLAY_ADS'])

    def test_no_mpn_means_no_identifier(self):
        attrs = to_product_input(offer(mpn='', availability='out_of_stock'))['productAttributes']
        self.assertIs(attrs['identifierExists'], False)
        self.assertEqual(attrs['availability'], 'OUT_OF_STOCK')


class IsEnabledTests(SimpleTestCase):
    @override_settings(MERCHANT_API_ENABLED=False)
    def test_off_without_setting_even_with_key(self):
        with mock.patch('os.path.exists', return_value=True):
            self.assertFalse(merchant_api.is_enabled())

    @override_settings(MERCHANT_API_ENABLED=True)
    def test_on_with_setting_and_key(self):
        with mock.patch('os.path.exists', return_value=True):
            self.assertTrue(merchant_api.is_enabled())


class FakeClient:
    def __init__(self, existing):
        self.existing = set(existing)
        self.inserted, self.deleted = [], []

    def data_source(self):
        return 'accounts/1/dataSources/9'

    def our_offer_ids(self):
        return set(self.existing)

    def insert(self, product_input):
        self.inserted.append(product_input['offerId'])

    def delete(self, offer_id):
        self.deleted.append(offer_id)
        return True


class SyncStoreTests(SimpleTestCase):
    store = SimpleNamespace(name='SSaN', merchant_center_id='1')

    def run_sync(self, built_ids, existing, force=False):
        client = FakeClient(existing)
        offers = [offer(offer_id=i) for i in built_ids]
        with mock.patch.object(merchant_sync, 'build_offers', return_value=(offers, {})):
            summary = merchant_sync.sync_store(self.store, client=client, force=force)
        return client, summary

    def test_pushes_all_and_deletes_stale(self):
        client, summary = self.run_sync(['1', '2', '3', '4'], existing=['1', '2', '3', '4', '9'])
        self.assertEqual(sorted(client.inserted), ['1', '2', '3', '4'])
        self.assertEqual(client.deleted, ['9'])
        self.assertEqual((summary['pushed'], summary['deleted']), (4, 1))

    def test_refuses_a_mass_delete(self):
        with self.assertRaises(merchant_sync.SyncAborted):
            self.run_sync([], existing=['1', '2', '3'])

    def test_force_allows_a_mass_delete(self):
        client, _ = self.run_sync([], existing=['1', '2'], force=True)
        self.assertEqual(sorted(client.deleted), ['1', '2'])

    def test_first_sync_with_nothing_on_google(self):
        client, summary = self.run_sync(['1'], existing=[])
        self.assertEqual((client.inserted, client.deleted), (['1'], []))
