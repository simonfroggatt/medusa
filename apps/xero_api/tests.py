import datetime
from unittest import mock

from django.test import SimpleTestCase

from apps.xero_api import views


@mock.patch.object(views, '_xero_invoice_check_rounding', return_value={'status': 'OK'})
@mock.patch.object(views, 'OcOrderTotal')
@mock.patch.object(views, 'OcOrder')
@mock.patch.object(views, 'XeroInvoice')
class CreateNewOrderTests(SimpleTestCase):
    def configure(self, invoice_cls, order_model, totals_model, fresh_order):
        invoice = invoice_cls.return_value
        invoice.save_invoice.return_value = 'inv-1'
        invoice.xero_api.get_error.return_value = None
        invoice.create_payment.return_value = 'pay-1'
        totals_model.objects.filter.return_value.filter.return_value = []
        order_model.objects.get.return_value = fresh_order
        return invoice

    def test_saves_only_xero_id_and_pays_from_fresh_order(self, invoice_cls, order_model, totals_model, rounding):
        # loaded before the Xero calls, while the storefront was still recording the payment
        stale = mock.Mock(order_id=97247, payment_status_id=6, payment_method_id=8)
        fresh = mock.Mock(order_id=97247, payment_status_id=2, payment_method_id=11, payment_date=None)
        invoice = self.configure(invoice_cls, order_model, totals_model, fresh)

        data = views._create_new_order(stale, 'contact-1')

        stale.save.assert_not_called()
        updates = order_model.objects.filter.return_value.update.call_args_list
        self.assertEqual(updates[0], mock.call(xero_id='inv-1'))
        self.assertEqual(list(updates[1].kwargs), ['payment_date'])
        self.assertIsNotNone(fresh.payment_date)
        invoice.add_invoice_payment.assert_called_once_with(fresh)
        self.assertEqual(data['paymentID'], 'pay-1')

    def test_existing_payment_date_is_kept(self, invoice_cls, order_model, totals_model, rounding):
        paid_on = datetime.datetime(2026, 9, 14, 20, 13)
        fresh = mock.Mock(order_id=97247, payment_status_id=2, payment_method_id=11, payment_date=paid_on)
        self.configure(invoice_cls, order_model, totals_model, fresh)

        views._create_new_order(mock.Mock(order_id=97247), 'contact-1')

        self.assertEqual(fresh.payment_date, paid_on)
        order_model.objects.filter.return_value.update.assert_called_once_with(xero_id='inv-1')

    def test_unpaid_order_gets_no_xero_payment(self, invoice_cls, order_model, totals_model, rounding):
        fresh = mock.Mock(order_id=97247, payment_status_id=3, payment_date=None)
        invoice = self.configure(invoice_cls, order_model, totals_model, fresh)

        data = views._create_new_order(mock.Mock(order_id=97247), 'contact-1')

        invoice.add_invoice_payment.assert_not_called()
        self.assertEqual(data['orderID'], 'inv-1')


class ParseXeroDateTests(SimpleTestCase):
    def test_xero_json_date(self):
        paid_on = datetime.datetime(2026, 9, 10, tzinfo=datetime.timezone.utc)
        value = f'/Date({int(paid_on.timestamp() * 1000)}+0000)/'

        self.assertEqual(views._parse_xero_date(value), paid_on)

    def test_iso_date_is_made_aware(self):
        parsed = views._parse_xero_date('2026-09-10T00:00:00')

        self.assertEqual((parsed.year, parsed.month, parsed.day), (2026, 9, 10))
        self.assertIsNotNone(parsed.tzinfo)

    def test_unreadable_or_missing(self):
        self.assertIsNone(views._parse_xero_date('not a date'))
        self.assertIsNone(views._parse_xero_date(None))


@mock.patch.object(views, 'add_payment_status_history')
@mock.patch.object(views, 'OcOrder')
@mock.patch.object(views, 'XeroInvoice')
class XeroWebhookInvoiceUpdateTests(SimpleTestCase):
    def configure(self, invoice_cls, order_model, order, payments):
        invoice = invoice_cls.return_value
        invoice.get_invoice.return_value = 'inv-1'
        invoice.get_payments.return_value = payments
        order_model.objects.get.return_value = order
        return order_model.objects.filter.return_value.exclude.return_value

    def test_marks_paid_with_xero_payment_date_without_full_save(self, invoice_cls, order_model, history):
        order = mock.Mock(order_id=97247, payment_status_id=3)
        paid_on = datetime.datetime(2026, 9, 10, tzinfo=datetime.timezone.utc)
        unpaid = self.configure(invoice_cls, order_model, order,
                                [{'Date': f'/Date({int(paid_on.timestamp() * 1000)}+0000)/'}])
        unpaid.update.return_value = 1

        self.assertTrue(views._xero_webhook_invoice_update('inv-1'))

        order_model.objects.filter.assert_called_once_with(pk=97247)
        order_model.objects.filter.return_value.exclude.assert_called_once_with(
            payment_status_id=views.settings.TSG_PAYMENT_STATUS_PAID)
        unpaid.update.assert_called_once_with(payment_status_id=views.settings.TSG_PAYMENT_STATUS_PAID,
                                              payment_date=paid_on)
        order.save.assert_not_called()
        history.assert_called_once_with(97247)

    def test_already_paid_order_is_left_alone(self, invoice_cls, order_model, history):
        order = mock.Mock(order_id=97247, payment_status_id=views.settings.TSG_PAYMENT_STATUS_PAID)
        self.configure(invoice_cls, order_model, order, [{'Date': '/Date(0+0000)/'}])

        self.assertFalse(views._xero_webhook_invoice_update('inv-1'))

        order_model.objects.filter.assert_not_called()
        history.assert_not_called()

    def test_unreadable_payment_date_falls_back_to_now(self, invoice_cls, order_model, history):
        order = mock.Mock(order_id=97247, payment_status_id=3)
        unpaid = self.configure(invoice_cls, order_model, order, [{'Date': 'garbage'}])
        unpaid.update.return_value = 1
        now = datetime.datetime(2026, 9, 15, 12, 0, tzinfo=datetime.timezone.utc)

        with mock.patch.object(views.timezone, 'now', return_value=now), self.assertLogs('apps', level='WARNING'):
            views._xero_webhook_invoice_update('inv-1')

        self.assertEqual(unpaid.update.call_args.kwargs['payment_date'], now)

    def test_no_payments_leaves_order_unpaid(self, invoice_cls, order_model, history):
        order = mock.Mock(order_id=97247, payment_status_id=3)
        self.configure(invoice_cls, order_model, order, [])

        views._xero_webhook_invoice_update('inv-1')

        order_model.objects.filter.assert_not_called()
        history.assert_not_called()
