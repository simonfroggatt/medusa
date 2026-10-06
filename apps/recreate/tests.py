import json
from types import SimpleNamespace
from unittest import mock

from django.test import RequestFactory, SimpleTestCase

from apps.recreate import views, wayfinding
from apps.recreate.models import OcTsgBespokeRecreations as Recreation


class WayfindingWordingTests(SimpleTestCase):
    """A stock wayfinding sign's wording, read as configurator settings."""

    def test_the_stock_product_names(self):
        self.assertEqual(wayfinding.spec_from_wording('Floor 2 Wayfinding Sign '),
                         {'mode': 'single', 'type': 'floor', 'level': '2',
                          'ground': 'number', 'below': 'number', 'lower_ground': '0'})
        self.assertEqual(wayfinding.spec_from_wording('Floor -1 Wayfinding Sign')['level'], '-1')
        self.assertEqual(wayfinding.spec_from_wording('Stairway A Wayfinding Sign'),
                         {'mode': 'single', 'type': 'stair', 'stair': 'A'})
        self.assertEqual(wayfinding.spec_from_wording('Flats 1 - 4 Arrow Left Wayfinding Sign'),
                         {'mode': 'flats', 'arrow_side': 'auto', 'flats': [{'from': '1', 'to': '4', 'dir': 'left'}]})

    def test_floor_names(self):
        ground = wayfinding.spec_from_wording('Ground Floor')
        self.assertEqual((ground['level'], ground['ground']), ('0', 'words'))
        lower = wayfinding.spec_from_wording('Lower Ground Floor')
        self.assertEqual((lower['level'], lower['lower_ground']), ('-1', '1'))
        basement = wayfinding.spec_from_wording('Basement 2')
        self.assertEqual((basement['level'], basement['below']), ('-2', 'basement'))

    def test_floor_with_flats_is_a_combined_sign(self):
        spec = wayfinding.spec_from_wording('Floor 3 Flats 1-4 Left Flats 5 - 8 →')
        self.assertEqual(spec['mode'], 'combined')
        self.assertEqual(spec['level'], '3')
        self.assertEqual(spec['flats'], [{'from': '1', 'to': '4', 'dir': 'left'}, {'from': '5', 'to': '8', 'dir': 'right'}])

    def test_unreadable_wording_starts_at_floor_1(self):
        self.assertEqual(wayfinding.spec_from_wording('Something else')['level'], '1')


class WayfindingCleanSpecTests(SimpleTestCase):
    def test_keeps_only_what_the_configurator_reads(self):
        spec = wayfinding.clean_spec({'mode': 'combined', 'level': '−2', 'below': 'basement', 'extra': 'x',
                                      'flats': [{'from': '1', 'to': '', 'dir': 'sideways'}, {'from': ''}]})
        self.assertEqual(spec, {'mode': 'combined', 'level': '-2', 'ground': 'number', 'below': 'basement',
                                'lower_ground': '0', 'arrow_side': 'auto',
                                'flats': [{'from': '1', 'to': '1', 'dir': 'none'}]})

    def test_says_what_is_wrong(self):
        for raw, message in [
            ({'mode': 'single', 'type': 'floor', 'level': 'two'}, 'whole number'),
            ({'mode': 'single', 'type': 'floor', 'level': '500'}, 'between'),
            ({'mode': 'single', 'type': 'stair', 'stair': 'ABC'}, 'stair reference'),
            ({'mode': 'flats', 'flats': []}, 'at least one row'),
            ({'mode': 'flats', 'flats': [{'from': '1a', 'to': '4'}]}, 'whole numbers'),
            ({'mode': 'building'}, 'what kind'),
        ]:
            with self.subTest(raw=raw), self.assertRaisesRegex(ValueError, message):
                wayfinding.clean_spec(raw)

    def test_kind_decides_the_shop_product(self):
        self.assertEqual(wayfinding.kind_of({'mode': 'single', 'type': 'stair'}), 'stair')
        self.assertEqual(wayfinding.design({'mode': 'flats', 'flats': []})['kind'], 'flats')


class WayfindingReviewViewTests(SimpleTestCase):
    def row(self, design=None, kind='wayfinding'):
        row = Recreation(product_id=41829, kind=kind, status=Recreation.STATUS_REVIEW,
                         design=json.dumps(design) if design else None)
        row.save = mock.Mock()
        return row

    def post(self, body):
        request = RequestFactory().post('/x', data=json.dumps(body), content_type='application/json')
        request.user = SimpleNamespace(id=7)
        return request

    def test_approving_stores_the_settings_not_a_sign_design(self):
        row = self.row()
        with mock.patch.object(wayfinding, 'shop_url', return_value='https://shop/x'):
            response = views._save_wayfinding(self.post({}), row, Recreation.STATUS_APPROVED,
                                              {'spec': {'mode': 'single', 'type': 'floor', 'level': '2'}})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(row.design)['role'], 'wayfinding')
        self.assertEqual(json.loads(row.design)['spec']['level'], '2')
        self.assertEqual(row.status, Recreation.STATUS_APPROVED)
        row.save.assert_called_once()

    def test_bad_settings_are_refused_and_nothing_saved(self):
        row = self.row()
        response = views._save_wayfinding(self.post({}), row, Recreation.STATUS_APPROVED,
                                          {'spec': {'mode': 'single', 'type': 'floor', 'level': 'x'}})
        self.assertEqual(response.status_code, 400)
        row.save.assert_not_called()

    def test_saved_settings_win_over_the_wording(self):
        saved = wayfinding.design({'mode': 'single', 'type': 'stair', 'stair': 'C'})
        with mock.patch.object(views, '_names', return_value={41829: {'name': 'Floor 2 Wayfinding Sign'}}):
            self.assertEqual(views._wayfinding_spec(self.row(saved))['stair'], 'C')
            self.assertEqual(views._wayfinding_spec(self.row())['level'], '2')
            # A sign designer document is not settings: read the wording instead.
            self.assertEqual(views._wayfinding_spec(self.row({'root': {'role': 'sign'}}))['level'], '2')


@mock.patch.object(wayfinding, '_shop_base', return_value='http://shop/')
class WayfindingPreviewTests(SimpleTestCase):
    def answer(self, data):
        response = mock.Mock()
        response.json.return_value = data
        response.raise_for_status.return_value = None
        return response

    def test_the_drawn_sign_and_its_size(self, _base):
        html = '<div class="preview-stage"><svg xmlns="http://www.w3.org/2000/svg"><path/></svg></div><p>checks</p>'
        with mock.patch.object(wayfinding.requests, 'get', return_value=self.answer({
                'ok': True, 'html': html, 'items': [{'width': 450, 'height': 150, 'compliant': True}]})) as get:
            result = wayfinding.preview({'mode': 'single', 'type': 'floor', 'level': '2'})
        self.assertEqual(result, {'svg': '<svg xmlns="http://www.w3.org/2000/svg"><path/></svg>',
                                  'width': 450, 'height': 150, 'compliant': True})
        self.assertTrue(get.call_args[0][0].startswith(
            'http://shop/index.php?route=bespoke/wayfinding/preview&mode=single&type=floor&level=2'))

    def test_the_configurators_own_reason_when_it_cannot_draw_it(self, _base):
        with mock.patch.object(wayfinding.requests, 'get', return_value=self.answer(
                {'ok': False, 'error': 'Floor must be between -20 and 200.'})):
            self.assertEqual(wayfinding.preview({'mode': 'single'}), {'error': 'Floor must be between -20 and 200.'})

    def test_an_unreachable_shop_is_said_plainly(self, _base):
        with mock.patch.object(wayfinding.requests, 'get', side_effect=wayfinding.requests.ConnectionError('down')):
            self.assertEqual(wayfinding.preview({'mode': 'single'}),
                             {'error': 'The shop could not be reached for a preview'})
