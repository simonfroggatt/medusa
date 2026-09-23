"""Tests for quotes_web.

Models are managed=False with no migrations, so there is no test database: SimpleTestCase
with unsaved instances and mocks (see apps/orders/tests.py). Everything here is the maths
and validation that has to be right before a price reaches a customer.
"""
from decimal import Decimal
from types import SimpleNamespace
from unittest import mock

from django.test import SimpleTestCase, override_settings

from .forms import CreateQuoteForm
from .services import notify
from .services import quotes as quote_service


def _quote_for_email(**overrides):
    store = SimpleNamespace(
        store_id=1, name='Safety Signs and Notices', ssl=None, url='http://ssan.example/',
        email_address='sales@ssan.example', accounts_email_address='accounts@ssan.example',
        company_name='Total Safety Group', website='ssan.example',
        address='Heanor Gate Road, Heanor',
        email_footer_text='Regards from {{store_name}}')
    values = dict(
        quote_number='QW-SSAN-9', public_token='TOKEN123', customer_name='Jane Smith',
        customer_email='jane@example.com', customer_phone='0113',
        store=store, store_id=1, currency=SimpleNamespace(symbol_left='£'), currency_id=1,
        total=Decimal('12.5'))
    values.update(overrides)
    quote = SimpleNamespace(**values)
    quote.is_whatsapp_region = lambda: False
    return quote


def _template(subject='{{store_name}} - Your quote {{quote_number}}',
              main='Hi {{firstname}} {{quote_link}} total {{quote_total}} '
                   'for {{valid_days}} days {{store_email_footer}}'):
    template = SimpleNamespace(subject=subject, main=main)
    return mock.patch.object(notify.OcTsgTemplates.objects, 'filter',
                             return_value=SimpleNamespace(first=lambda: template))


class QuoteEmailTests(SimpleTestCase):
    def test_placeholders_are_filled(self):
        with _template():
            email = notify.build_quote_email(_quote_for_email())
        self.assertEqual(email['subject'], 'Safety Signs and Notices - Your quote QW-SSAN-9')
        self.assertIn('Hi Jane', email['body'])
        self.assertIn('http://ssan.example/index.php?route=tsg/quote&token=TOKEN123', email['body'])
        self.assertIn('total £12.50', email['body'])
        self.assertIn('for 30 days', email['body'])
        self.assertIn('Regards from Safety Signs and Notices', email['body'])

    def test_store_details_reach_the_footer(self):
        """The footer is a template of its own, and had an unfilled {{store_address}}."""
        store = _quote_for_email().store
        store.address = '5 Example Way, Nottingham'
        store.email_footer_text = '{{store_name}} | {{store_address}} | {{accounts_email}}'
        quote = _quote_for_email(store=store)
        with _template(main='{{store_email_footer}}'):
            email = notify.build_quote_email(quote)
        self.assertIn('5 Example Way, Nottingham', email['body'])
        self.assertIn('accounts@ssan.example', email['body'])

    def test_unfilled_placeholders_are_reported(self):
        with _template(main='Hi {{firstname}}, see {{something_new}} and {{another_one}}'):
            email = notify.build_quote_email(_quote_for_email())
        self.assertEqual(notify._warn_unfilled(_quote_for_email(), email),
                         {'{{something_new}}', '{{another_one}}'})

    def test_store_without_a_template_gives_nothing(self):
        with mock.patch.object(notify.OcTsgTemplates.objects, 'filter',
                               return_value=SimpleNamespace(first=lambda: None)):
            self.assertIsNone(notify.build_quote_email(_quote_for_email()))

    def test_sends_from_the_sales_address(self):
        self.assertEqual(notify.sender_for(_quote_for_email()), 'sales@ssan.example')


class SendQuoteTests(SimpleTestCase):
    @override_settings(QUOTES_WEB_SEND_EMAILS=False)
    def test_nothing_is_sent_when_sending_is_off(self):
        with _template(), mock.patch.object(notify.email_views, 'send_email') as send, \
                mock.patch.object(notify.quote_service, 'log_action') as log:
            route, sent, reason = notify.send_quote(_quote_for_email())
        self.assertFalse(sent)
        self.assertIn('switched off', reason)
        send.assert_not_called()
        log.assert_not_called()

    @override_settings(QUOTES_WEB_SEND_EMAILS=True)
    def test_sends_and_records_it(self):
        with _template(), \
                mock.patch.object(notify.email_views, 'send_email',
                                  return_value={'success': True, 'message': 'ok'}) as send, \
                mock.patch.object(notify.quote_service, 'log_action') as log:
            route, sent, reason = notify.send_quote(_quote_for_email())
        self.assertTrue(sent)
        to, sender = send.call_args.args[0], send.call_args.args[1]
        self.assertEqual(to, ['jane@example.com'])       # Django wants a list
        self.assertEqual(sender, 'sales@ssan.example')
        log.assert_called_once()

    @override_settings(QUOTES_WEB_SEND_EMAILS=True)
    def test_a_failed_send_is_not_recorded_as_sent(self):
        with _template(), \
                mock.patch.object(notify.email_views, 'send_email',
                                  return_value={'success': False, 'message': 'Delegation denied'}), \
                mock.patch.object(notify.quote_service, 'log_action') as log:
            route, sent, reason = notify.send_quote(_quote_for_email())
        self.assertFalse(sent)
        self.assertIn('Delegation denied', reason)
        log.assert_not_called()

    @override_settings(QUOTES_WEB_SEND_EMAILS=True)
    def test_an_unexpected_error_does_not_escape(self):
        with _template(), \
                mock.patch.object(notify.email_views, 'send_email', side_effect=FileNotFoundError), \
                mock.patch.object(notify.quote_service, 'log_action') as log:
            route, sent, reason = notify.send_quote(_quote_for_email())
        self.assertFalse(sent)
        log.assert_not_called()

    @override_settings(QUOTES_WEB_SEND_EMAILS=True)
    def test_quote_without_an_email_is_left_for_staff(self):
        with mock.patch.object(notify.email_views, 'send_email') as send:
            route, sent, reason = notify.send_quote(_quote_for_email(customer_email=None))
        self.assertFalse(sent)
        self.assertIn('no email address', reason)
        send.assert_not_called()


class QuoteNumberTests(SimpleTestCase):
    def test_uses_store_prefix(self):
        store = SimpleNamespace(prefix='SSAN')
        self.assertEqual(quote_service.quote_number_for(store, 12), 'QW-SSAN-12')

    def test_second_store_keeps_the_shared_sequence(self):
        """One counter across all stores: SSAN-12 is followed by HSS-13."""
        self.assertEqual(quote_service.quote_number_for(SimpleNamespace(prefix='HSS'), 13),
                         'QW-HSS-13')

    def test_store_without_a_prefix_falls_back(self):
        self.assertEqual(quote_service.quote_number_for(SimpleNamespace(prefix=None), 7),
                         'QW-TSG-7')


class BulkPricingTests(SimpleTestCase):
    def test_discount_matches_the_storefront_maths(self):
        # cart.php: round(price * (1 - discount/100), 2)
        self.assertEqual(quote_service.apply_bulk_discount('10.00', 15), Decimal('8.50'))
        self.assertEqual(quote_service.apply_bulk_discount('4.99', 18), Decimal('4.09'))

    def test_no_discount_leaves_the_price_alone(self):
        self.assertEqual(quote_service.apply_bulk_discount('12.34', 0), Decimal('12.34'))

    def test_line_with_bulk_switched_off_keeps_its_base_price(self):
        item = SimpleNamespace(bulk_used=False, single_unit_price=Decimal('9.99'),
                               bulk_discount_id=1, quantity=50)
        self.assertEqual(quote_service.reprice_line(item), Decimal('9.99'))

    def test_line_reprices_from_the_band_for_its_quantity(self):
        item = SimpleNamespace(bulk_used=True, single_unit_price=Decimal('10.00'),
                               bulk_discount_id=1, quantity=20)
        with mock.patch.object(quote_service, 'bulk_discount_percent',
                               return_value=Decimal('18.00')) as percent:
            self.assertEqual(quote_service.reprice_line(item), Decimal('8.20'))
        percent.assert_called_once_with(1, 20)


class TotalsTests(SimpleTestCase):
    def _quote(self, items, shipping='0.00', discount='0.00'):
        quote = mock.MagicMock()
        quote.items.all.return_value = items
        quote.shipping_cost = Decimal(shipping)
        quote.discount_amount = Decimal(discount)
        return quote

    def test_totals_add_tax_and_shipping_and_take_off_discount(self):
        items = [SimpleNamespace(line_total=Decimal('100.00'), tax_amount=Decimal('20.00')),
                 SimpleNamespace(line_total=Decimal('50.00'), tax_amount=Decimal('10.00'))]
        quote = self._quote(items, shipping='5.95', discount='10.00')
        quote_service.recalculate_totals(quote, save=False)
        self.assertEqual(quote.subtotal, Decimal('150.00'))
        self.assertEqual(quote.tax_total, Decimal('30.00'))
        self.assertEqual(quote.total, Decimal('175.95'))

    def test_empty_quote_totals_zero(self):
        quote = self._quote([])
        quote_service.recalculate_totals(quote, save=False)
        self.assertEqual(quote.total, Decimal('0.00'))

    def test_money_rounds_half_up(self):
        self.assertEqual(quote_service._money('2.345'), Decimal('2.35'))


class EditableGuardTests(SimpleTestCase):
    def _quote(self, status_code):
        return SimpleNamespace(
            quote_number='QW-SSAN-9',
            status=SimpleNamespace(status_code=status_code, status_name=status_code))

    def test_draft_and_under_review_may_be_edited(self):
        for code in ('draft', 'under_review'):
            quote_service.ensure_editable(self._quote(code))  # must not raise

    def test_sent_quote_is_locked(self):
        """A customer may be looking at it, so staff must pull it back to draft first."""
        from apps.quotes_web.services.exceptions import QuoteNotEditable
        for code in ('sent', 'viewed', 'accepted', 'cancelled'):
            with self.assertRaises(QuoteNotEditable):
                quote_service.ensure_editable(self._quote(code))


class LinePricingTests(SimpleTestCase):
    def _item(self, options=(), **kwargs):
        defaults = dict(quantity=10, bulk_used=True, single_unit_price=Decimal('10.00'),
                        base_unit_price=Decimal('10.00'), unit_price=Decimal('10.00'),
                        bulk_discount_id=1, tax_rate_percent=Decimal('20.00'),
                        line_total=Decimal('0'), tax_amount=Decimal('0'),
                        pk=1 if options else None,
                        options=SimpleNamespace(all=lambda: list(options)))
        defaults.update(kwargs)
        return SimpleNamespace(**defaults)

    def test_options_are_added_before_the_bulk_discount(self):
        """The storefront discounts (variant price + options) together - so do we."""
        item = self._item(options=[SimpleNamespace(price_modifier=Decimal('0.85'))],
                          base_unit_price=Decimal('4.69'), quantity=10)
        with mock.patch.object(quote_service, 'bulk_discount_percent',
                               return_value=Decimal('15.00')):
            quote_service._price_line(item)
        self.assertEqual(item.single_unit_price, Decimal('5.5400'))   # 4.69 + 0.85
        self.assertEqual(item.unit_price, Decimal('4.7100'))          # less 15%
        self.assertEqual(item.line_total, Decimal('47.1000'))

    def test_line_without_options_prices_from_the_variant_alone(self):
        item = self._item(base_unit_price=Decimal('4.69'), quantity=10)
        with mock.patch.object(quote_service, 'bulk_discount_percent',
                               return_value=Decimal('15.00')):
            quote_service._price_line(item)
        self.assertEqual(item.single_unit_price, Decimal('4.6900'))
        self.assertEqual(item.unit_price, Decimal('3.9900'))

    def test_bulk_line_reprices_and_totals_follow(self):
        item = self._item(quantity=20)
        with mock.patch.object(quote_service, 'bulk_discount_percent',
                               return_value=Decimal('18.00')):
            quote_service._price_line(item)
        self.assertEqual(item.unit_price, Decimal('8.2000'))
        self.assertEqual(item.line_total, Decimal('164.0000'))
        self.assertEqual(item.tax_amount, Decimal('32.8000'))

    def test_manual_price_is_kept_when_bulk_is_off(self):
        item = self._item(bulk_used=False, unit_price=Decimal('7.50'), quantity=4)
        quote_service._price_line(item)
        self.assertEqual(item.unit_price, Decimal('7.50'))
        self.assertEqual(item.line_total, Decimal('30.0000'))
        self.assertEqual(item.tax_amount, Decimal('6.0000'))

    def test_zero_rated_line_has_no_tax(self):
        item = self._item(bulk_used=False, tax_rate_percent=Decimal('0.00'), quantity=2,
                          unit_price=Decimal('5.00'))
        quote_service._price_line(item)
        self.assertEqual(item.tax_amount, Decimal('0.0000'))


class CreateQuoteFormTests(SimpleTestCase):
    HEADER = {'store_id': 1, 'customer_name': 'A Buyer', 'customer_phone': '07700 900000'}
    LINE = {'product_name': 'Fire Exit sign', 'quantity': 10, 'unit_price': '4.25'}

    def test_valid_request(self):
        form = CreateQuoteForm(self.HEADER, lines=[self.LINE])
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(len(form.cleaned_data['lines']), 1)

    def test_email_is_optional(self):
        """UAE customers may leave only a phone number."""
        form = CreateQuoteForm(self.HEADER, lines=[self.LINE])
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data['customer_email'], '')

    def test_no_lines_is_rejected(self):
        form = CreateQuoteForm(self.HEADER, lines=[])
        self.assertFalse(form.is_valid())

    def test_missing_price_is_rejected(self):
        form = CreateQuoteForm(self.HEADER, lines=[{'product_name': 'x', 'quantity': 1}])
        self.assertFalse(form.is_valid())

    def test_zero_quantity_is_rejected(self):
        line = dict(self.LINE, quantity=0)
        form = CreateQuoteForm(self.HEADER, lines=[line])
        self.assertFalse(form.is_valid())

    def test_phone_is_required(self):
        header = {k: v for k, v in self.HEADER.items() if k != 'customer_phone'}
        form = CreateQuoteForm(header, lines=[self.LINE])
        self.assertFalse(form.is_valid())
