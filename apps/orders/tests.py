from unittest import mock

from django.test import RequestFactory, SimpleTestCase

from apps.orders import views
from apps.orders.models import OcOrderProduct


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
