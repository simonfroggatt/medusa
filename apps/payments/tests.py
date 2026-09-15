from types import SimpleNamespace
from unittest import mock

from django.conf import settings
from django.test import RequestFactory, SimpleTestCase

from apps.payments import views


def stripe_event(event_type='payment_intent.succeeded', order_id='97247'):
    return {'type': event_type,
            'data': {'object': SimpleNamespace(id='pi_123', metadata={'order_id': order_id})}}


@mock.patch.object(views, 'xero_order_update')
@mock.patch.object(views, 'Fernet')
@mock.patch.object(views, 'add_payment_status_history')
@mock.patch.object(views, 'OcOrder')
@mock.patch.object(views.stripe.Webhook, 'construct_event')
class StripeWebhookTests(SimpleTestCase):
    def post(self):
        request = RequestFactory().post('/payments/webhook/stripe/', data='{}', content_type='application/json',
                                        HTTP_STRIPE_SIGNATURE='sig')
        return views.webhook_stripe(request)

    def test_marks_paid_without_overwriting_payment_method(self, construct_event, order_model, history, fernet,
                                                          xero_update):
        construct_event.return_value = stripe_event()
        order_model.objects.filter.return_value.update.return_value = 1

        self.assertEqual(self.post().status_code, 200)

        updates = order_model.objects.filter.return_value.update.call_args_list
        self.assertEqual(updates[0], mock.call(payment_status_id=settings.TSG_PAYMENT_STATUS_PAID))
        self.assertEqual(list(updates[1].kwargs), ['payment_date'])
        order_model.objects.filter.assert_any_call(pk='97247', payment_date__isnull=True)
        for update in updates:
            self.assertNotIn('payment_method_id', update.kwargs)
            self.assertNotIn('payment_ref', update.kwargs)
        order_model.objects.get.assert_not_called()
        history.assert_called_once_with('97247')
        xero_update.assert_called_once()

    def test_unknown_order_is_ignored(self, construct_event, order_model, history, fernet, xero_update):
        construct_event.return_value = stripe_event()
        order_model.objects.filter.return_value.update.return_value = 0

        self.assertEqual(self.post().status_code, 200)

        history.assert_not_called()
        xero_update.assert_not_called()

    def test_other_events_are_ignored(self, construct_event, order_model, history, fernet, xero_update):
        construct_event.return_value = stripe_event(event_type='payment_intent.created')

        self.assertEqual(self.post().status_code, 200)

        order_model.objects.filter.assert_not_called()
        xero_update.assert_not_called()
