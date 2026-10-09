from django.test import TestCase

# Create your tests here.


# ---- "Make your own" fields on a category ------------------------------------
from unittest import mock

from django.core.exceptions import ValidationError
from django.test import SimpleTestCase

from apps.category import bespoke_offer
from apps.category.forms import CategoryDescriptionForm
from apps.category.models import OcTsgCategory

SYMBOLS = [(46, 'W014', 'Warning; Forklift trucks and other industrial vehicles', 'stores/symbols/svg/w014.svg'),
           (6, 'P006', 'No access for forklift trucks', 'stores/symbols/svg/p006.svg')]
TEMPLATES = [(8, 'Fire Action Notice — 5 Point Fire Action Notice'), (6, 'Site Board — Site safety bespoke')]


def make_form():
    with mock.patch.object(bespoke_offer, 'symbol_options', return_value=SYMBOLS), \
            mock.patch.object(bespoke_offer, 'template_options', return_value=TEMPLATES):
        return CategoryDescriptionForm()


class CategoryBespokeFieldTests(SimpleTestCase):
    def test_the_category_model_has_two_optional_columns(self):
        category = OcTsgCategory()
        self.assertIsNone(category.bespoke_symbol_id)
        self.assertIsNone(category.bespoke_template_id)

    def test_symbol_choices_show_the_code_and_name_after_a_blank(self):
        choices = make_form().fields['bespoke_symbol_id'].choices
        self.assertEqual(choices[0][0], '')
        self.assertIn((46, 'W014 — Warning; Forklift trucks and other industrial vehicles'), choices)

    def test_template_choices_come_from_the_helper(self):
        choices = make_form().fields['bespoke_template_id'].choices
        self.assertEqual(choices[0], ('', 'None'))
        self.assertIn((8, 'Fire Action Notice — 5 Point Fire Action Notice'), choices)

    def test_a_chosen_symbol_becomes_an_int_and_blank_becomes_none(self):
        field = make_form().fields['bespoke_symbol_id']
        self.assertEqual(field.clean('46'), 46)
        self.assertIsNone(field.clean(''))

    def test_the_fields_are_optional(self):
        form = make_form()
        self.assertFalse(form.fields['bespoke_symbol_id'].required)
        self.assertFalse(form.fields['bespoke_template_id'].required)

    def test_an_unknown_symbol_or_template_is_rejected(self):
        form = make_form()
        with self.assertRaises(ValidationError):
            form.fields['bespoke_symbol_id'].clean('999')
        with self.assertRaises(ValidationError):
            form.fields['bespoke_template_id'].clean('999')

    def test_both_fields_are_in_the_edit_form(self):
        # the edit template renders them; a field missing from the POST would be saved as empty
        self.assertIn('bespoke_symbol_id', make_form().fields)
        self.assertIn('bespoke_template_id', make_form().fields)


class BespokeOfferHelperTests(SimpleTestCase):
    def cursor_with(self, rows):
        connection = mock.MagicMock()
        cursor = connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = rows
        return connection, cursor

    def test_symbol_options_shape(self):
        connection, cursor = self.cursor_with([(46, 'W014', ' Warning; Forklift ', 'stores/symbols/svg/w014.svg'), (7, 'X1', None, None)])
        with mock.patch.object(bespoke_offer, 'connection', connection):
            result = bespoke_offer.symbol_options()
        self.assertEqual(result, [(46, 'W014', 'Warning; Forklift', 'stores/symbols/svg/w014.svg'), (7, 'X1', '', '')])
        sql = cursor.execute.call_args[0][0]
        self.assertIn('tsg_symbol_standard', sql)
        self.assertIn("ss.code <> ''", sql)            # a symbol with no code cannot open in the designer

    def test_template_options_only_offer_designers_with_a_live_product(self):
        connection, cursor = self.cursor_with([(8, 'Fire Action Notice', '5 Point Fire Action Notice')])
        with mock.patch.object(bespoke_offer, 'connection', connection):
            result = bespoke_offer.template_options()
        self.assertEqual(result, [(8, 'Fire Action Notice — 5 Point Fire Action Notice')])
        sql, params = cursor.execute.call_args[0]
        self.assertIn('p.status = 1', sql)
        self.assertEqual(set(params), set(bespoke_offer.TEMPLATE_PATHS))
        self.assertNotIn('bespoke/designer\'', sql)           # the symbol-driven designer is not a template choice


class CategoryEditScreenShowsEveryFieldTests(SimpleTestCase):
    def test_every_field_in_the_form_is_on_the_edit_screen(self):
        """The edit screen lists its fields by hand. A form field it does not show is posted back empty, so saving
        the screen would blank that column (adwords_name was being wiped this way)."""
        import re
        from pathlib import Path
        template = Path(__file__).parent / 'templates' / 'category' / 'category_edit.html'
        shown = set(re.findall(r'form\.([a-z_]+)', template.read_text()))
        missing = [name for name in make_form().fields if name not in shown]
        self.assertEqual(missing, [], 'form fields missing from category_edit.html: %s' % missing)
