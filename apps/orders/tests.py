import json
from types import SimpleNamespace
from unittest import mock

from django.test import RequestFactory, SimpleTestCase

from apps.orders import context_processors, services, views, wayfinding
from apps.orders.models import OcOrderProduct, OcTsgOrderBespokeImage


class AdminOrderCountsTests(SimpleTestCase):
    def request_for(self, authenticated=True, superuser=True):
        user = mock.Mock(is_authenticated=authenticated)
        user.groups.filter.return_value.exists.return_value = superuser
        return mock.Mock(user=user)

    def test_not_worked_out_for_non_superusers(self):
        with mock.patch.object(context_processors.OcOrder, 'objects') as objects:
            self.assertEqual(context_processors._admin_order_counts(self.request_for(superuser=False)), {})
            self.assertEqual(context_processors._admin_order_counts(self.request_for(authenticated=False)), {})
        objects.awaiting_artwork.assert_not_called()

    def test_superuser_gets_admin_list_counts(self):
        with mock.patch.object(context_processors.OcOrder, 'objects') as objects:
            objects.awaiting_artwork.return_value.count.return_value = 2
            objects.supplier_items.return_value.count.return_value = 5
            objects.ready_to_collect.return_value.count.return_value = 1
            counts = context_processors._admin_order_counts(self.request_for())

        self.assertEqual(counts, {'awaiting_artwork_count': 2, 'supplier_items_count': 5, 'ready_to_collect_count': 1})


class OrderProductStatusBulkTests(SimpleTestCase):
    def test_saves_each_line_so_status_history_is_written(self):
        lines = [OcOrderProduct(order_product_id=1, status_id=7), OcOrderProduct(order_product_id=2, status_id=1)]
        request = RequestFactory().post('/orders/97266/product-status-change/',
                                        {'order_product_ids': '1,2', 'new_status': '12'})

        with mock.patch.object(views, 'get_object_or_404'), \
                mock.patch.object(views.OcOrderProduct.objects, 'filter', return_value=lines) as filter_mock, \
                mock.patch.object(OcOrderProduct, 'save') as save_mock:
            response = views.order_product_status_bulk(request, 97266)

        filter_mock.assert_called_once_with(order_id=97266, order_product_id__in=['1', '2'])
        self.assertEqual([line.status_id for line in lines], [12, 12])
        self.assertEqual(save_mock.call_count, 2)
        save_mock.assert_called_with(update_fields=['status'])
        self.assertJSONEqual(response.content, {'form_is_valid': True})


class ApplyOrderStoreDetailsTests(SimpleTestCase):
    def test_copies_store_name_and_url(self):
        order = SimpleNamespace(store_name='', store_url=None)

        services.apply_order_store_details(order, SimpleNamespace(name='Safety Signs and Notices',
                                                                  url='https://www.safetysignsandnotices.co.uk/'))

        self.assertEqual(order.store_name, 'Safety Signs and Notices')
        self.assertEqual(order.store_url, 'https://www.safetysignsandnotices.co.uk/')

    def test_missing_store_name_is_blank_not_none(self):
        order = SimpleNamespace(store_name=None, store_url=None)

        services.apply_order_store_details(order, SimpleNamespace(name=None, url=None))

        self.assertEqual(order.store_name, '')


class OrderDuplicateTests(SimpleTestCase):
    def test_copy_gets_store_name_from_its_store(self):
        store = SimpleNamespace(name='Safety Signs and Notices', url='https://www.safetysignsandnotices.co.uk/')
        original = mock.Mock(order_id=97247, store=store, store_name='', store_url=None)
        request = RequestFactory().post('/orders/api/orders/duplicate', {'order_id': '97247'})

        with mock.patch.object(views, 'get_object_or_404', return_value=original), \
                mock.patch.object(views.OcOrderProduct.objects, 'filter', return_value=[]), \
                mock.patch.object(views.OcOrderTotal.objects, 'filter', return_value=[]), \
                mock.patch.object(views, 'reverse_lazy', return_value='/orders/97248'):
            response = views.order_duplicate(request)

        self.assertEqual(original.store_name, 'Safety Signs and Notices')
        self.assertEqual(original.store_url, 'https://www.safetysignsandnotices.co.uk/')
        self.assertJSONEqual(response.content, {'form_is_valid': True, 'redirect_url': '/orders/97248'})


class WayfindingLineTests(SimpleTestCase):
    """Wayfinding lines (version 4) get their own read-only artwork page."""

    SPEC = {'mode': 'combined', 'level': '3', 'arrow_side': 'auto',
            'flats': [{'from': '1', 'to': '4', 'dir': 'left'}, {'from': '5', 'to': '7', 'dir': 'right'}],
            'ground': 'number', 'below': 'number', 'lower_ground': '0'}

    def line(self, version=4, record=None):
        record = record if record is not None else {
            'role': 'wayfinding', 'engine': '2026-10-05-nimbus', 'kind': 'combined', 'spec': self.SPEC,
            'width': 450, 'height': 330, 'group': {'id': 'g1', 'label': 'Building: floors 0 to 5'}}
        # The cart json_encodes the JSON string it is handed, so it is stored twice encoded.
        row = OcTsgOrderBespokeImage(pk=12, order_product_id=55, version=version,
                                     svg_json=json.dumps(json.dumps(record)),
                                     svg_raw='<svg xmlns="http://www.w3.org/2000/svg"/>',
                                     svg_texts=json.dumps(['Floor 3', 'Flats 1–4', 'Flats 5–7']))
        row.order_product = OcOrderProduct(order_product_id=55, product_id=41900)
        return row

    def test_query_string_is_php_style_for_flat_rows(self):
        query = wayfinding.query_string(self.SPEC)
        self.assertIn('flats[0][from]=1&flats[0][to]=4&flats[0][dir]=left', query)
        self.assertIn('flats[1][dir]=right', query)
        self.assertTrue(query.startswith('mode=combined&level=3'))

    def test_query_string_escapes_values(self):
        self.assertEqual(wayfinding.query_string({'level': '−1', 'stair': 'A&B'}),
                         'level=%E2%88%921&stair=A%26B')

    def test_record_ignores_sign_designer_lines(self):
        self.assertIsNone(wayfinding.record(self.line(version=3, record={'root': {'role': 'sign'}})))
        self.assertEqual(wayfinding.record(self.line())['kind'], 'combined')

    def test_context_links_back_to_the_shop_product(self):
        order = SimpleNamespace(order_id=97300, store_url='https://www.safetysignsandnotices.co.uk')
        with mock.patch.object(views, 'reverse', return_value='/bespoke/api/convert-order-product/12'):
            context = views._wayfinding_context(order, self.line(), {})

        self.assertTrue(context['shop_url'].startswith(
            'https://www.safetysignsandnotices.co.uk/index.php?route=product/product&product_id=41900&makebespoke=1&mode=combined'))
        self.assertEqual(context['text_line'], ['Floor 3', 'Flats 1–4', 'Flats 5–7'])
        self.assertEqual(context['record']['group']['label'], 'Building: floors 0 to 5')

    def test_no_link_without_a_store_url(self):
        order = SimpleNamespace(order_id=97300, store_url=None)
        with mock.patch.object(views, 'reverse', return_value='/x'):
            self.assertEqual(views._wayfinding_context(order, self.line(), {})['shop_url'], '')

    def test_version_4_line_opens_the_wayfinding_page_not_the_designer(self):
        order = SimpleNamespace(order_id=97300, store_url='https://shop/')
        request = RequestFactory().get('/orders/97300/bespoke/55')
        filtered = mock.Mock()
        filtered.first.return_value = self.line()

        with mock.patch.object(views, 'get_object_or_404', return_value=order), \
                mock.patch.object(views.OcTsgOrderBespokeImage.objects, 'filter', return_value=filtered), \
                mock.patch.object(views, 'reverse', return_value='/x'), \
                mock.patch.object(views, 'render', return_value='page') as render_mock:
            views.bespoke_order_product(request, 97300, 55)

        self.assertEqual(render_mock.call_args[0][1], 'orders/order_bespoke_wayfinding.html')


class WayfindingOptionLinesTests(SimpleTestCase):
    """A wayfinding sign's wording, as options on the order page and paperwork."""

    def row(self, kind, texts, group=None, version=4):
        record = {'role': 'wayfinding', 'kind': kind, 'title': ' · '.join(texts), 'group': group}
        return OcTsgOrderBespokeImage(version=version, svg_json=json.dumps(json.dumps(record)),
                                      svg_texts=json.dumps(texts))

    def test_floor_sign_reads_its_wording(self):
        self.assertEqual(wayfinding.option_lines(self.row('floor', ['Floor −1'])),
                         [('Sign', 'Floor sign'), ('Reads', 'Floor -1')])

    def test_combined_sign_lists_floor_then_each_flats_row_with_its_arrow(self):
        lines = wayfinding.option_lines(self.row(
            'combined', ['Floor 3', 'Flats 1–4 ←', 'Flats 5–7 →'],
            group={'id': 'g', 'label': 'Building: floors −1 to 5'}))
        self.assertEqual(lines, [
            ('Sign', 'Floor + flats sign'),
            ('Floor', 'Floor 3'),
            ('Flats row 1', 'Flats 1–4, arrow left'),
            ('Flats row 2', 'Flats 5–7, arrow right'),
            ('Building', 'floors -1 to 5'),
        ])

    def test_single_row_flat_sign(self):
        self.assertEqual(wayfinding.option_lines(self.row('flats', ['Flat 5 ↑'])),
                         [('Sign', 'Flat sign'), ('Flats', 'Flat 5, arrow up')])

    def test_lines_drawn_by_anything_else_have_none(self):
        designer = OcTsgOrderBespokeImage(version=3, svg_json=json.dumps(json.dumps({'root': {'role': 'sign'}})),
                                          svg_texts='["KEEP OUT"]')
        self.assertEqual(wayfinding.option_lines(designer), [])
        self.assertEqual(wayfinding.option_lines(OcTsgOrderBespokeImage(version=2)), [])
