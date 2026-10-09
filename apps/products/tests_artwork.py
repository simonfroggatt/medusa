import io

from cairosvg import svg2pdf
from django.test import SimpleTestCase
from PIL import Image

from apps.products import artwork


def sign_pdf(width_mm, height_mm, fill='#00A550', margin_mm=5):
    """A print-style PDF: coloured sign with white wording on a white page with a margin."""
    w, h = width_mm + 2 * margin_mm, height_mm + 2 * margin_mm
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}mm" height="{h}mm" viewBox="0 0 {w} {h}">'
           f'<rect x="{margin_mm}" y="{margin_mm}" width="{width_mm}" height="{height_mm}" fill="{fill}"/>'
           f'<rect x="{margin_mm + 10}" y="{margin_mm + 10}" width="20" height="10" fill="#FFFFFF"/></svg>')
    return svg2pdf(bytestring=svg.encode())


def open_image(data):
    return Image.open(io.BytesIO(data))


class RenderMasterTests(SimpleTestCase):
    def test_trims_the_page_margin_and_scales_to_2000_px(self):
        master = artwork.render_master(sign_pdf(300, 100))
        self.assertEqual(max(master.size), 2000)
        self.assertAlmostEqual(master.width / master.height, 3.0, delta=0.05)

    def test_print_green_is_snapped_to_the_designer_green(self):
        master = artwork.render_master(sign_pdf(200, 200))
        r, g, b = master.getpixel((master.width - 50, master.height - 50))
        self.assertLessEqual(abs(r - 9) + abs(g - 145) + abs(b - 70), 6)

    def test_blank_page_is_an_error(self):
        blank = svg2pdf(bytestring=b'<svg xmlns="http://www.w3.org/2000/svg" width="50mm" height="50mm"/>')
        with self.assertRaises(artwork.ArtworkError):
            artwork.render_master(blank)

    def test_not_a_pdf_is_an_error(self):
        with self.assertRaises(artwork.ArtworkError):
            artwork.render_master(b'not a pdf')


class MakeVersionsTests(SimpleTestCase):
    def setUp(self):
        self.versions = artwork.make_versions(artwork.render_master(sign_pdf(300, 100)))

    def test_feed_is_a_1500_square_jpeg(self):
        feed = open_image(self.versions['feed'])
        self.assertEqual((feed.format, feed.size), ('JPEG', (1500, 1500)))

    def test_tile_is_a_600_square_webp(self):
        tile = open_image(self.versions['tile'])
        self.assertEqual((tile.format, tile.size), ('WEBP', (600, 600)))

    def test_page_keeps_the_natural_shape(self):
        page = open_image(self.versions['page'])
        self.assertEqual(page.format, 'WEBP')
        self.assertGreater(page.width / page.height, 2.5)

    def test_feed_has_a_dark_border_inside_a_white_canvas(self):
        feed = open_image(self.versions['feed']).convert('RGB')
        self.assertEqual(feed.getpixel((5, 5)), (255, 255, 255))
        row = [feed.getpixel((750, y)) for y in range(feed.height)]
        self.assertTrue(any(sum(p) < 150 for p in row))   # the dark frame


class CheckMasterTests(SimpleTestCase):
    def test_a_normal_sign_passes(self):
        self.assertEqual(artwork.check_master(artwork.render_master(sign_pdf(300, 100))), [])

    def test_a_very_thin_sign_is_flagged(self):
        problems = artwork.check_master(artwork.render_master(sign_pdf(700, 75)))
        self.assertTrue(any('thin' in p for p in problems))

    def test_unusual_colours_are_flagged(self):
        problems = artwork.check_master(artwork.render_master(sign_pdf(200, 200, fill='#8844AA')))
        self.assertTrue(any('palette' in p for p in problems))
