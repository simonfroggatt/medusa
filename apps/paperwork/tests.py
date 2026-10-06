from types import SimpleNamespace
from unittest import mock

from django.test import SimpleTestCase

from apps.paperwork import utils


@mock.patch.object(utils.wayfinding, 'line_option_lines', mock.Mock(return_value=[]))
@mock.patch.object(utils, 'OcTsgOrderProductOptions')
@mock.patch.object(utils, 'OcTsgOrderOption')
class OrderProductLineOptionsTests(SimpleTestCase):
    def configure(self, order_option, product_options, options=(), addons=()):
        order_option.objects.filter.return_value = [SimpleNamespace(option_name=n, value_name=v) for n, v in options]
        product_options.objects.filter.return_value = [SimpleNamespace(class_name=n, value_name=v) for n, v in addons]

    def test_each_addon_on_its_own_line(self, order_option, product_options):
        self.configure(order_option, product_options,
                       addons=[('Metric Measurement', '4m'), ('Imperial Measurement', '13\'1"')])

        self.assertEqual(utils.get_order_product_line_options(195109),
                         'Metric Measurement : 4m<BR/>Imperial Measurement : 13\'1"')

    def test_options_then_addons_without_trailing_break(self, order_option, product_options):
        self.configure(order_option, product_options,
                       options=[('FORS ID', 'ABC-123'), ('colour', 'Red')], addons=[('Fixing', 'Screws')])

        self.assertEqual(utils.get_order_product_line_options(194860),
                         'FORS ID : ABC-123<BR/>colour : Red<BR/>Fixing : Screws')

    def test_single_option_and_none(self, order_option, product_options):
        self.configure(order_option, product_options, options=[('FORS ID', 'ABC-123')])
        self.assertEqual(utils.get_order_product_line_options(194861), 'FORS ID : ABC-123')

        self.configure(order_option, product_options)
        self.assertEqual(utils.get_order_product_line_options(1), '')

    def test_product_description_puts_options_on_following_lines(self, order_option, product_options):
        self.configure(order_option, product_options, addons=[('Metric Measurement', '4m'), ('Imperial Measurement', '13\'1"')])
        line = SimpleNamespace(order_product_id=195109, product_id=1, name='DOT 629A Vehicle width restriction sign',
                               size_name='450mm Diameter', material_name='RA2 Reflective', orientation_name='Circle')

        self.assertEqual(utils.create_product_desc(line),
                         'DOT 629A Vehicle width restriction sign<BR/>450mm Diameter - RA2 Reflective (Circle)'
                         '<BR/>Metric Measurement : 4m<BR/>Imperial Measurement : 13\'1"')

    def test_wayfinding_sign_wording_follows_the_options_escaped(self, order_option, product_options):
        self.configure(order_option, product_options, addons=[('Fixing', 'Screws')])
        with mock.patch.object(utils.wayfinding, 'line_option_lines',
                               return_value=[('Sign', 'Floor + flats sign'), ('Flats row 1', 'Flats 1–4, arrow left'),
                                             ('Note', 'A & B')]):
            self.assertEqual(utils.get_order_product_line_options(195402),
                             'Fixing : Screws<BR/>Sign : Floor + flats sign<BR/>Flats row 1 : Flats 1–4, arrow left'
                             '<BR/>Note : A &amp; B')

    def test_quotes_never_look_for_a_wayfinding_sign(self, order_option, product_options):
        self.configure(order_option, product_options)
        line = SimpleNamespace(order_product_id=195109, product_id=41966, name='Floor sign',
                               size_name='450mm x 150mm', material_name='Vinyl', orientation_name='Landscape')
        with mock.patch.object(utils.wayfinding, 'line_option_lines') as lookup:
            utils.create_product_desc(line, bl_quote=True)
        lookup.assert_not_called()
