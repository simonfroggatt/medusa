from unittest import mock

from django.test import SimpleTestCase, override_settings

from apps.products import artwork_service
from apps.products.artwork import ArtworkError
from apps.products.forms import ARTWORK_COLUMNS, ProductForm, VariantCoreEditForm, VariantCoreForm
from apps.products.models import OcProduct, OcTsgProductVariantCore
from apps.products.tests_artwork import sign_pdf


class PrepareTests(SimpleTestCase):
    def test_not_a_pdf_is_turned_down(self):
        with self.assertRaises(ArtworkError):
            artwork_service.prepare(b'GIF89a not a pdf')

    def test_a_large_file_is_turned_down(self):
        with mock.patch.object(artwork_service, 'MAX_PDF_BYTES', 10):
            with self.assertRaises(ArtworkError):
                artwork_service.prepare(sign_pdf(100, 100))

    def test_returns_the_three_versions(self):
        prepared = artwork_service.prepare(sign_pdf(300, 100))
        self.assertEqual(set(prepared.versions), {'feed', 'page', 'tile'})
        self.assertEqual(prepared.problems, [])

    def test_photolum_file_name_without_keep_colours_is_flagged(self):
        prepared = artwork_service.prepare(sign_pdf(300, 100), filename='FE 1 Photolum 300x100.pdf')
        self.assertTrue(any('photoluminescent' in p for p in prepared.problems))
        kept = artwork_service.prepare(sign_pdf(300, 100), filename='FE 1 Photolum 300x100.pdf', keep_colours=True)
        self.assertEqual(kept.problems, [])


class SavePreparedTests(SimpleTestCase):
    def setUp(self):
        self.prepared = artwork_service.prepare(sign_pdf(300, 100))

    def _save(self, instance, **kwargs):
        saved = []
        with mock.patch.object(artwork_service.default_storage, 'save',
                               side_effect=lambda name, content: name) as storage, \
                mock.patch.object(instance, 'save') as save:
            drive_id = artwork_service.save_prepared(instance, self.prepared, 'Fire exit arrow left sign', **kwargs)
        return storage, save, drive_id

    def test_writes_three_new_files_under_v2_and_records_them(self):
        product = OcProduct(product_id=593)
        storage, save, _ = self._save(product, code='593')
        self.assertEqual(storage.call_count, 3)
        self.assertEqual(product.image_feed, 'stores/products/v2/fire-exit-arrow-left-sign-593-feed.jpg')
        self.assertEqual(product.image_page, 'stores/products/v2/fire-exit-arrow-left-sign-593-page.webp')
        self.assertEqual(product.image_tile, 'stores/products/v2/fire-exit-arrow-left-sign-593-tile.webp')
        self.assertIsNotNone(product.artwork_date)

    def test_only_the_artwork_columns_are_saved_and_the_old_image_is_untouched(self):
        product = OcProduct(product_id=593, image='stores/products/sc666.gif')
        _, save, _ = self._save(product)
        fields = save.call_args.kwargs['update_fields']
        self.assertNotIn('image', fields)
        self.assertEqual(product.image, 'stores/products/sc666.gif')

    @override_settings(ARTWORK_DRIVE_FOLDER=None)
    def test_without_a_drive_folder_nothing_is_uploaded_and_no_drive_id_recorded(self):
        product = OcProduct(product_id=1)
        _, save, drive_id = self._save(product)
        self.assertIsNone(drive_id)
        self.assertNotIn('artwork_drive_id', save.call_args.kwargs['update_fields'])

    @override_settings(ARTWORK_DRIVE_FOLDER='folder123')
    def test_drive_id_and_name_are_recorded_when_the_upload_works(self):
        product = OcProduct(product_id=1)
        with mock.patch.object(artwork_service, 'upload_to_drive', return_value='drive-id-1'):
            with mock.patch.object(artwork_service.default_storage, 'save', side_effect=lambda n, c: n), \
                    mock.patch.object(product, 'save') as save:
                artwork_service.save_prepared(product, self.prepared, 'Fire exit', code='FE 1')
        self.assertEqual(product.artwork_drive_id, 'drive-id-1')
        self.assertTrue(product.artwork_filename.startswith('FE 1 Fire exit website upload'))
        self.assertIn('artwork_drive_id', save.call_args.kwargs['update_fields'])


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
    """variant new -> variant old -> product new -> product old"""

    def setUp(self):
        self.product = OcProduct(image='stores/products/old.gif')
        self.variant = OcTsgProductVariantCore(product=self.product)

    def url(self):
        return self.variant.image_url_for('feed')

    def test_product_old_image_when_nothing_new(self):
        self.assertTrue(self.url().endswith('stores/products/old.gif'))

    def test_product_new_beats_product_old(self):
        self.product.image_feed = 'stores/products/v2/p-feed.jpg'
        self.assertTrue(self.url().endswith('v2/p-feed.jpg'))

    def test_variant_old_image_beats_product_new(self):
        self.product.image_feed = 'stores/products/v2/p-feed.jpg'
        self.variant.variant_image = 'stores/products/portrait.png'
        self.assertTrue(self.url().endswith('stores/products/portrait.png'))

    def test_variant_new_beats_everything(self):
        self.product.image_feed = 'stores/products/v2/p-feed.jpg'
        self.variant.variant_image = 'stores/products/portrait.png'
        self.variant.image_feed = 'stores/products/v2/v-feed.jpg'
        self.assertTrue(self.url().endswith('v2/v-feed.jpg'))


class FormGuardTests(SimpleTestCase):
    def test_variant_forms_never_post_the_new_image_columns(self):
        for form in (VariantCoreForm, VariantCoreEditForm):
            for column in ARTWORK_COLUMNS:
                self.assertNotIn(column, form().fields, f'{form.__name__} would blank {column}')
            self.assertIn('artwork_pdf', form().fields)

    def test_product_form_does_not_post_the_new_image_columns(self):
        fields = ProductForm().fields
        for column in ARTWORK_COLUMNS:
            self.assertNotIn(column, fields)
        self.assertIn('artwork_pdf', fields)
