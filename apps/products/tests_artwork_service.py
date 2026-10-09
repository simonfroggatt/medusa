from unittest import mock

from django.http import QueryDict
from django.test import RequestFactory, SimpleTestCase, override_settings

from apps.products import artwork_service, artwork_views
from apps.products.artwork import ArtworkError
from apps.products.forms import VariantCoreEditForm, VariantCoreForm
from apps.products.models import OcProduct, OcTsgProductArtwork, OcTsgProductVariantCore
from apps.products.tests_artwork import sign_pdf


class PrepareTests(SimpleTestCase):
    def test_not_a_pdf_is_turned_down(self):
        with self.assertRaises(ArtworkError):
            artwork_service.prepare(b'GIF89a not a pdf')

    def test_a_large_file_is_turned_down(self):
        with mock.patch.object(artwork_service, 'MAX_PDF_BYTES', 10):
            with self.assertRaises(ArtworkError):
                artwork_service.prepare(sign_pdf(100, 100))

    def test_returns_the_three_versions_and_the_shape(self):
        prepared = artwork_service.prepare(sign_pdf(300, 100))
        self.assertEqual(set(prepared.versions), {'feed', 'page', 'tile'})
        self.assertEqual(prepared.problems, [])
        self.assertAlmostEqual(float(prepared.ratio), 3.0, delta=0.05)

    def test_photolum_file_name_without_keep_colours_is_flagged(self):
        prepared = artwork_service.prepare(sign_pdf(300, 100), filename='FE 1 Photolum 300x100.pdf')
        self.assertTrue(any('photoluminescent' in p for p in prepared.problems))
        kept = artwork_service.prepare(sign_pdf(300, 100), filename='FE 1 Photolum 300x100.pdf', keep_colours=True)
        self.assertEqual(kept.problems, [])


class SavePreparedTests(SimpleTestCase):
    def setUp(self):
        self.prepared = artwork_service.prepare(sign_pdf(300, 100))

    def _save(self, art, **kwargs):
        with mock.patch.object(artwork_service.default_storage, 'save', side_effect=lambda name, content: name) as storage, \
                mock.patch.object(art, 'save') as save:
            drive_id = artwork_service.save_prepared(art, self.prepared, 'Fire exit arrow left sign Landscape', **kwargs)
        return storage, save, drive_id

    def test_writes_three_new_files_under_v2_and_records_them(self):
        art = OcTsgProductArtwork(artwork_id=1)
        storage, _, _ = self._save(art, code='593')
        self.assertEqual(storage.call_count, 3)
        self.assertEqual(art.image_feed, 'stores/products/v2/fire-exit-arrow-left-sign-landscape-593-feed.jpg')
        self.assertEqual(art.image_page, 'stores/products/v2/fire-exit-arrow-left-sign-landscape-593-page.webp')
        self.assertEqual(art.image_tile, 'stores/products/v2/fire-exit-arrow-left-sign-landscape-593-tile.webp')
        self.assertAlmostEqual(float(art.shape_ratio), 3.0, delta=0.05)

    def test_only_the_artwork_columns_are_saved(self):
        art = OcTsgProductArtwork(artwork_id=1)
        _, save, _ = self._save(art)
        self.assertEqual(set(save.call_args.kwargs['update_fields']),
                         {'image_feed', 'image_page', 'image_tile', 'shape_ratio', 'keep_colours', 'checks', 'date_modified'})

    @override_settings(ARTWORK_DRIVE_FOLDER=None)
    def test_without_a_drive_folder_no_drive_id_is_recorded(self):
        art = OcTsgProductArtwork(artwork_id=1)
        _, save, drive_id = self._save(art)
        self.assertIsNone(drive_id)
        self.assertNotIn('drive_id', save.call_args.kwargs['update_fields'])

    def test_drive_id_and_name_are_recorded_when_the_upload_works(self):
        art = OcTsgProductArtwork(artwork_id=1)
        with mock.patch.object(artwork_service, 'upload_to_drive', return_value='drive-id-1'), \
                mock.patch.object(artwork_service.default_storage, 'save', side_effect=lambda n, c: n), \
                mock.patch.object(art, 'save') as save:
            artwork_service.save_prepared(art, self.prepared, 'Fire exit', code='FE 1')
        self.assertEqual(art.drive_id, 'drive-id-1')
        self.assertTrue(art.drive_filename.startswith('FE 1 Fire exit website upload'))
        self.assertIn('drive_id', save.call_args.kwargs['update_fields'])


class DriveUploadTests(SimpleTestCase):
    @override_settings(ARTWORK_DRIVE_FOLDER=None)
    def test_off_when_no_folder_is_set(self):
        self.assertIsNone(artwork_service.upload_to_drive('a.pdf', b'%PDF-'))

    @override_settings(ARTWORK_DRIVE_FOLDER='folder123')
    def test_a_drive_error_is_swallowed(self):
        with mock.patch('apps.bespoke.views._google_auth', side_effect=RuntimeError('no access')):
            self.assertIsNone(artwork_service.upload_to_drive('a.pdf', b'%PDF-'))

    @override_settings(ARTWORK_DRIVE_FOLDER='folder123')
    def test_creates_the_file_in_the_folder(self):
        service = mock.MagicMock()
        service.files.return_value.create.return_value.execute.return_value = {'id': 'abc'}
        with mock.patch('apps.bespoke.views._google_auth', return_value=service):
            self.assertEqual(artwork_service.upload_to_drive('a.pdf', b'%PDF-1'), 'abc')
        body = service.files.return_value.create.call_args.kwargs['body']
        self.assertEqual(body, {'name': 'a.pdf', 'parents': ['folder123']})


class FallbackOrderTests(SimpleTestCase):
    """variant's artwork -> variant's old image -> product's main artwork -> product's old image"""

    def setUp(self):
        self.product = OcProduct(image='stores/products/old.gif')
        self.product.__dict__['main_artwork'] = None
        self.variant = OcTsgProductVariantCore(product=self.product)

    def url(self):
        return self.variant.image_url_for('feed')

    def test_products_old_image_when_nothing_new(self):
        self.assertTrue(self.url().endswith('stores/products/old.gif'))

    def test_products_main_artwork_beats_its_old_image(self):
        self.product.__dict__['main_artwork'] = OcTsgProductArtwork(image_feed='stores/products/v2/main-feed.jpg')
        self.assertTrue(self.url().endswith('v2/main-feed.jpg'))

    def test_variants_old_image_beats_the_products_main_artwork(self):
        self.product.__dict__['main_artwork'] = OcTsgProductArtwork(image_feed='stores/products/v2/main-feed.jpg')
        self.variant.variant_image = 'stores/products/portrait.png'
        self.assertTrue(self.url().endswith('stores/products/portrait.png'))

    def test_variants_own_artwork_beats_everything(self):
        self.product.__dict__['main_artwork'] = OcTsgProductArtwork(image_feed='stores/products/v2/main-feed.jpg')
        self.variant.variant_image = 'stores/products/portrait.png'
        self.variant.artwork = OcTsgProductArtwork(artwork_id=9, image_feed='stores/products/v2/portrait-feed.jpg')
        self.assertTrue(self.url().endswith('v2/portrait-feed.jpg'))

    def test_an_artwork_with_no_images_yet_falls_through(self):
        self.variant.artwork = OcTsgProductArtwork(artwork_id=9)
        self.variant.variant_image = 'stores/products/portrait.png'
        self.assertTrue(self.url().endswith('stores/products/portrait.png'))

    def test_page_and_tile_follow_the_same_order(self):
        self.variant.artwork = OcTsgProductArtwork(artwork_id=9, image_page='p.webp', image_tile='t.webp')
        self.assertTrue(self.variant.image_url_for('page').endswith('p.webp'))
        self.assertTrue(self.variant.image_url_for('tile').endswith('t.webp'))


class SameShapeTests(SimpleTestCase):
    # (variant id, width, height, material name)
    def ids(self, ratio, keep, *candidates):
        return artwork_service.same_shape_ids(ratio, keep, list(candidates))

    def test_150x200_and_450x600_are_the_same_shape(self):
        self.assertEqual(self.ids(0.75, False, (1, 150, 200, '1mm Rigid'), (2, 450, 600, '3mm Foamex')), [1, 2])

    def test_a_different_shape_is_not_matched(self):
        self.assertEqual(self.ids(0.75, False, (1, 200, 300, '1mm Rigid'), (2, 300, 100, '1mm Rigid')), [])

    def test_the_other_orientation_is_not_matched(self):
        self.assertEqual(self.ids(0.75, False, (1, 200, 150, '1mm Rigid')), [])

    def test_a_normal_artwork_never_goes_on_photoluminescent(self):
        self.assertEqual(self.ids(0.75, False, (1, 300, 400, 'Photoluminescent Rigid')), [])

    def test_a_photoluminescent_artwork_goes_only_on_photoluminescent(self):
        self.assertEqual(self.ids(0.75, True, (1, 300, 400, 'Photoluminescent Rigid'), (2, 300, 400, '1mm Rigid')), [1])

    def test_no_shape_means_nothing_is_matched(self):
        self.assertEqual(self.ids(None, False, (1, 150, 200, '1mm Rigid')), [])

    def test_a_zero_size_is_ignored(self):
        self.assertEqual(self.ids(0.75, False, (1, 0, 0, '1mm Rigid')), [])


class VariantFormTests(SimpleTestCase):
    def test_variant_forms_offer_an_artwork_choice_defaulting_to_the_main_artwork(self):
        for form_class in (VariantCoreForm, VariantCoreEditForm):
            form = form_class(initial={'product': 1})
            field = form.fields['artwork']
            self.assertFalse(field.required)
            self.assertIn('main artwork', field.empty_label)

    def test_the_choice_is_limited_to_the_variants_product(self):
        core = OcTsgProductVariantCore(product_id=593)
        with mock.patch.object(OcTsgProductArtwork.objects, 'filter') as filt:
            VariantCoreEditForm(instance=core)
        filt.assert_called_with(product_id=593)


class ArtworkViewTests(SimpleTestCase):
    def post(self, data=None, files=None):
        request = RequestFactory().post('/x', data or {})
        request.FILES.update(files or {})
        request.user = mock.Mock(is_authenticated=True)
        return request

    def test_a_label_is_required(self):
        with mock.patch('apps.products.artwork_views.get_object_or_404', return_value=OcProduct(product_id=1)):
            resp = artwork_views.artwork_save(self.post({}), 1)
        self.assertEqual(resp.status_code, 400)
        self.assertIn(b'label', resp.content)

    def test_a_new_artwork_needs_a_pdf(self):
        with mock.patch('apps.products.artwork_views.get_object_or_404', return_value=OcProduct(product_id=1)):
            resp = artwork_views.artwork_save(self.post({'label': 'Landscape'}), 1)
        self.assertEqual(resp.status_code, 400)
        self.assertIn(b'PDF', resp.content)

    def test_a_bad_pdf_is_turned_down_and_nothing_is_saved(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        upload = SimpleUploadedFile('x.pdf', b'not a pdf')
        with mock.patch('apps.products.artwork_views.get_object_or_404', return_value=OcProduct(product_id=1)), \
                mock.patch.object(OcTsgProductArtwork, 'save') as save:
            resp = artwork_views.artwork_save(self.post({'label': 'Landscape'}, {'pdf': upload}), 1)
        self.assertEqual(resp.status_code, 400)
        save.assert_not_called()
