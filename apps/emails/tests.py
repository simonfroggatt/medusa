from types import SimpleNamespace
from unittest import mock

from django.template.loader import render_to_string
from django.test import SimpleTestCase

from apps.emails import supplier_orders
from apps.orders.models import OcOrder, OcOrderProduct
from apps.sites.models import OcStore
from apps.suppliers.models import OcSupplier


def make_order(**shipping):
    store = OcStore(store_id=1, name='Safety Signs and Notices', prefix='SSAN',
                    company_name='Safety Signs and Notices Ltd', email_address='sales@example.com',
                    address='1 Test Street', website='https://example.com',
                    email_footer_text='<a href="{{store_website}}">{{store_name}}</a>')
    fields = dict(shipping_fullname='Jo Bloggs', shipping_company='Acme Ltd', shipping_address_1='2 Customer Road',
                  shipping_city='Leeds', shipping_postcode='LS1 1AA', shipping_country='United Kingdom',
                  shipping_telephone='0113 000000')
    fields.update(shipping)
    return OcOrder(order_id=97266, store=store, **fields)


def make_line(order_product_id=195109, status_id=supplier_orders.PRODUCT_STATUS_SUPPLIER_ITEM):
    return OcOrderProduct(order_product_id=order_product_id, name='Fire Exit Sign', model='SSAN-123',
                          supplier_code='TT 770 T', size_name='200x100mm', material_name='Rigid PVC',
                          quantity=3, status_id=status_id)


SUPPLIER = OcSupplier(id=2, code='SYMBOL', company='Symbol', order_email='orders@example.com')
TEMPLATE = SimpleNamespace(subject='{{company_name}} - Purchase Order {{order_number}}',
                           main='<p>Hello {{supplier_company}}</p>{{order_lines}}{{delivery_instructions}}'
                                '{{store_email_footer}}')


class BuildSupplierOrderEmailTests(SimpleTestCase):
    def setUp(self):
        templates = mock.patch.object(supplier_orders, 'OcTsgTemplates')
        self.templates = templates.start()
        self.templates.objects.filter.return_value.first.return_value = TEMPLATE
        self.addCleanup(templates.stop)

        options = mock.patch.object(supplier_orders, '_line_options', return_value=[])
        self.options = options.start()
        self.addCleanup(options.stop)

    def test_collection_email_lists_lines_without_customer_address(self):
        email = supplier_orders.build_supplier_order_email(make_order(), SUPPLIER, [make_line()], bl_direct=False)

        self.assertEqual(email['subject'], 'Safety Signs and Notices Ltd - Purchase Order SSAN-97266')
        for text in ('Hello Symbol', 'SSAN-97266', 'TT 770 T', 'Fire Exit Sign', '200x100mm', 'Rigid PVC',
                     '<strong>3</strong>', 'For collection'):
            self.assertIn(text, email['body'])
        self.assertNotIn('Options', email['body'])
        self.assertNotIn('LS1 1AA', email['body'])
        self.assertIn('<a href="https://example.com">Safety Signs and Notices</a>', email['body'])
        self.assertNotIn('{{', email['body'])

    def test_direct_email_includes_delivery_address_and_telephone(self):
        email = supplier_orders.build_supplier_order_email(make_order(), SUPPLIER, [make_line()], bl_direct=True)

        for text in ('Delivery address', 'Jo Bloggs', 'Acme Ltd', '2 Customer Road', 'LS1 1AA', '0113 000000'):
            self.assertIn(text, email['body'])
        self.assertNotIn('For collection', email['body'])

    def test_options_column_only_when_a_line_has_options(self):
        self.options.return_value = ['Fixing : Screws']
        email = supplier_orders.build_supplier_order_email(make_order(), SUPPLIER, [make_line()], bl_direct=False)

        self.assertIn('Options', email['body'])
        self.assertIn('Fixing : Screws', email['body'])

    def test_each_option_on_its_own_line(self):
        self.options.return_value = ['Metric Measurement : 4m', 'Imperial Measurement : 13\'1"']
        email = supplier_orders.build_supplier_order_email(make_order(), SUPPLIER, [make_line()], bl_direct=False)

        self.assertIn('Metric Measurement : 4m<br>Imperial Measurement : 13&#x27;1&quot;</td>', email['body'])

    def test_storefront_html_entities_are_shown_as_plain_text(self):
        # tsg_store saves input htmlspecialchars()'d, so " arrives as &quot; and & as &amp;
        self.options.return_value = ['Imperial Measurement : 13\'1"']
        order = make_order(shipping_company='Zetland Plants &amp; Garden Services')
        line = make_line()
        line.name = 'Swimming Pool Rules &amp; Depths Sign'

        email = supplier_orders.build_supplier_order_email(order, SUPPLIER, [line], bl_direct=True)

        self.assertIn('Swimming Pool Rules &amp; Depths Sign', email['body'])
        self.assertIn('Zetland Plants &amp; Garden Services', email['body'])
        self.assertIn('13&#x27;1&quot;', email['body'])
        self.assertNotIn('&amp;amp;', email['body'])
        self.assertNotIn('&amp;quot;', email['body'])

    def test_customer_address_is_escaped(self):
        order = make_order(shipping_fullname='<b>Jo</b>')
        email = supplier_orders.build_supplier_order_email(order, SUPPLIER, [make_line()], bl_direct=True)

        self.assertIn('&lt;b&gt;Jo&lt;/b&gt;', email['body'])

    def test_missing_template_is_reported(self):
        self.templates.objects.filter.return_value.first.return_value = None

        with self.assertRaises(supplier_orders.SupplierOrderError):
            supplier_orders.build_supplier_order_email(make_order(), SUPPLIER, [make_line()], bl_direct=False)


class LineOptionsTests(SimpleTestCase):
    @mock.patch.object(supplier_orders, 'OcTsgOrderProductOptions')
    @mock.patch.object(supplier_orders, 'OcTsgOrderOption')
    def test_options_then_addons_one_per_entry(self, order_option, product_options):
        order_option.objects.filter.return_value = [SimpleNamespace(option_name='Fixing', value_name='Screws')]
        product_options.objects.filter.return_value = [
            SimpleNamespace(class_name='Metric Measurement', value_name='4m'),
            SimpleNamespace(class_name='Imperial Measurement', value_name='13\'1"'),
        ]

        self.assertEqual(supplier_orders._line_options(195109),
                         ['Fixing : Screws', 'Metric Measurement : 4m', 'Imperial Measurement : 13\'1"'])
        order_option.objects.filter.assert_called_once_with(order_product_id=195109)
        product_options.objects.filter.assert_called_once_with(order_product_id=195109)

    @mock.patch.object(supplier_orders, 'OcTsgOrderProductOptions')
    @mock.patch.object(supplier_orders, 'OcTsgOrderOption')
    def test_storefront_entities_are_decoded(self, order_option, product_options):
        order_option.objects.filter.return_value = []
        product_options.objects.filter.return_value = [
            SimpleNamespace(class_name='Imperial Measurement', value_name='13\'1&quot;')]

        self.assertEqual(supplier_orders._line_options(195109), ['Imperial Measurement : 13\'1"'])


class SupplierOrderDialogTemplateTests(SimpleTestCase):
    def test_dialog_renders_with_display_rows(self):
        outstanding = make_line(195109)
        ordered = make_line(195110, status_id=supplier_orders.PRODUCT_STATUS_SUPPLIER_ORDERED)
        ordered.supplier_code = None
        ordered.name = 'Rules &amp; Depths'
        suppliers = [SimpleNamespace(pk=2, code='SYMBOL', company='Symbol'),
                     SimpleNamespace(pk=4, code=None, company='Viewtec Signs Ltd')]

        html = render_to_string('emails/supplier_order_dialog.html', {
            'order_obj': SimpleNamespace(order_id=114308),
            'order_number': 'SSAN-114308',
            'groups': [{'supplier': supplier, 'outstanding': 1} for supplier in suppliers],
            'supplier_obj': suppliers[1],
            'lines': [supplier_orders.line_display_row(line) for line in (outstanding, ordered)],
            'status_supplier_item': supplier_orders.PRODUCT_STATUS_SUPPLIER_ITEM,
            'status_supplier_ordered': supplier_orders.PRODUCT_STATUS_SUPPLIER_ORDERED,
            'email_to': 'orders@example.com',
            'email_from': 'sales@example.com',
            'email_subject': 'Purchase Order SSAN-114308',
            'email_content': '<p>Hello</p>',
        })

        self.assertIn('TT 770 T', html)
        self.assertIn('SSAN-123', html)  # model code shown when there is no supplier code
        self.assertIn('Rules &amp; Depths', html)
        self.assertNotIn('&amp;amp;', html)
        self.assertIn('already ordered', html)
        self.assertIn('Send to Viewtec Signs Ltd', html)


class LineDisplayRowTests(SimpleTestCase):
    def test_decodes_entities_and_falls_back_to_model_code(self):
        line = make_line()
        line.supplier_code = None
        line.name = 'Rules &amp; Depths'
        line.size_name = None

        row = supplier_orders.line_display_row(line)

        self.assertEqual(row['supplier_code'], 'SSAN-123')
        self.assertEqual(row['name'], 'Rules & Depths')
        self.assertEqual(row['size_name'], '')
        self.assertEqual(row['order_product_id'], 195109)


class BuildSupplierOrderAttachmentsTests(SimpleTestCase):
    def test_no_attachments_for_collection(self):
        self.assertEqual(supplier_orders.build_supplier_order_attachments(make_order(), [make_line()], False), [])

    @mock.patch.object(supplier_orders, 'gen_shipping_page_for_emails', return_value=b'shipping')
    @mock.patch.object(supplier_orders, 'gen_supplier_despatch_for_emails', return_value=b'despatch')
    def test_direct_attaches_despatch_note_for_selected_lines_and_shipping_page(self, despatch, shipping):
        lines = [make_line(195109), make_line(195110)]
        attachments = supplier_orders.build_supplier_order_attachments(make_order(), lines, True)

        despatch.assert_called_once_with(97266, [195109, 195110])
        shipping.assert_called_once_with(97266)
        self.assertEqual([a[0] for a in attachments],
                         ['Despatch-Note-SSAN-97266.pdf', 'Shipping-Address-SSAN-97266.pdf'])


class SendSupplierOrderTests(SimpleTestCase):
    def setUp(self):
        self.line = make_line()
        patches = {
            'lines': mock.patch.object(supplier_orders, 'get_supplier_order_lines', return_value=[self.line]),
            'attachments': mock.patch.object(supplier_orders, 'build_supplier_order_attachments', return_value=[]),
            'mark': mock.patch.object(supplier_orders, 'mark_supplier_lines_ordered'),
            'send': mock.patch.object(supplier_orders.email_views, 'send_email',
                                      return_value={'success': True, 'message': 'Email sent successfully'}),
        }
        self.mocks = {name: patcher.start() for name, patcher in patches.items()}
        for patcher in patches.values():
            self.addCleanup(patcher.stop)

    def send(self):
        return supplier_orders.send_supplier_order(make_order(), SUPPLIER, [195109], True, ['orders@example.com'],
                                                   'sales@example.com', 'Subject', 'Body', user_id=5)

    def test_success_sends_then_marks_lines(self):
        self.assertEqual(self.send(), [self.line])
        self.mocks['send'].assert_called_once_with(['orders@example.com'], 'sales@example.com', 'Subject', 'Body', [])
        self.mocks['mark'].assert_called_once()

    def test_failed_email_does_not_mark_lines(self):
        self.mocks['send'].return_value = {'success': False, 'message': 'Bad request'}

        with self.assertRaisesMessage(supplier_orders.SupplierOrderError, 'Bad request'):
            self.send()
        self.mocks['mark'].assert_not_called()

    def test_no_selected_lines_does_not_send(self):
        self.mocks['lines'].return_value = []

        with self.assertRaises(supplier_orders.SupplierOrderError):
            self.send()
        self.mocks['send'].assert_not_called()

    def test_marking_failure_after_send_is_reported(self):
        self.mocks['mark'].side_effect = RuntimeError('db down')

        with self.assertLogs('apps', level='ERROR'), \
                self.assertRaisesMessage(supplier_orders.SupplierOrderError, 'email was sent'):
            self.send()


@mock.patch.object(supplier_orders, 'transaction')
@mock.patch.object(supplier_orders, 'OcTsgOrderActivity')
@mock.patch.object(OcOrderProduct, 'save')
class MarkSupplierLinesOrderedTests(SimpleTestCase):
    def test_marks_outstanding_lines_and_logs_activity(self, save, activity, transaction):
        outstanding = make_line(195109)
        already_ordered = make_line(195110, status_id=supplier_orders.PRODUCT_STATUS_SUPPLIER_ORDERED)

        supplier_orders.mark_supplier_lines_ordered(make_order(), SUPPLIER, [outstanding, already_ordered],
                                                    True, ['orders@example.com'], user_id=5)

        self.assertEqual(outstanding.status_id, supplier_orders.PRODUCT_STATUS_SUPPLIER_ORDERED)
        save.assert_called_once_with(update_fields=['status'])
        kwargs = activity.objects.create.call_args.kwargs
        self.assertEqual(kwargs['activity_type_id'], supplier_orders.ACTIVITY_TYPE_EMAIL_SENT)
        self.assertEqual(kwargs['user_id'], 5)
        self.assertIn('SYMBOL', kwargs['description'])
        self.assertIn('direct to customer', kwargs['description'])

    def test_activity_uses_company_when_supplier_has_no_code(self, save, activity, transaction):
        supplier = OcSupplier(id=4, code=None, company='Acme Signs', order_email='orders@example.com')

        supplier_orders.mark_supplier_lines_ordered(make_order(), supplier, [make_line()], False,
                                                    ['orders@example.com'], user_id=5)

        description = activity.objects.create.call_args.kwargs['description']
        self.assertIn('Acme Signs', description)
        self.assertNotIn('None', description)

    def test_no_activity_without_user(self, save, activity, transaction):
        supplier_orders.mark_supplier_lines_ordered(make_order(), SUPPLIER, [make_line()], False, ['orders@example.com'])

        activity.objects.create.assert_not_called()
