from unittest import mock

from django.test import RequestFactory, SimpleTestCase

from apps.orders import context_processors, views
from apps.orders.models import OcOrderProduct


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
