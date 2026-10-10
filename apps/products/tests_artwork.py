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


def pdf_with_trimbox(width_mm, height_mm, trim_inset_mm):
    """A print PDF with bleed: the page is bigger than the finished sign, and the TrimBox says by how much."""
    import pymupdf
    page_pdf = sign_pdf(width_mm + 2 * trim_inset_mm - 10, height_mm + 2 * trim_inset_mm - 10, margin_mm=5)
    doc = pymupdf.open(stream=page_pdf, filetype='pdf')
    page = doc[0]
    inset = trim_inset_mm / 25.4 * 72
    page.set_trimbox(pymupdf.Rect(page.rect.x0 + inset, page.rect.y0 + inset, page.rect.x1 - inset, page.rect.y1 - inset))
    return doc.tobytes()


class RenderMasterTests(SimpleTestCase):
    def test_the_whole_page_is_the_sign_and_nothing_is_trimmed_away(self):
        # a 300 x 100 sign drawn with a 5 mm white margin inside a 310 x 110 page
        master = artwork.render_master(sign_pdf(300, 100))
        self.assertEqual(max(master.size), 2000)
        self.assertAlmostEqual(master.width / master.height, 310 / 110, delta=0.02)

    def test_the_trimbox_is_the_finished_sign_and_the_bleed_outside_it_is_left_out(self):
        pdf = pdf_with_trimbox(300, 100, trim_inset_mm=5)     # page 310 x 110 incl. bleed, finished 300 x 100
        master = artwork.render_master(pdf)
        self.assertAlmostEqual(master.width / master.height, 300 / 100, delta=0.03)

    def test_print_green_is_snapped_to_the_designer_green(self):
        master = artwork.render_master(sign_pdf(200, 200))
        r, g, b = master.getpixel((master.width - 80, master.height - 80))
        self.assertLessEqual(abs(r - 9) + abs(g - 145) + abs(b - 70), 6)

    def test_keep_colours_leaves_the_print_colours_alone(self):
        master = artwork.render_master(sign_pdf(200, 200), keep_colours=True)
        r, g, b = master.getpixel((master.width - 80, master.height - 80))
        self.assertLessEqual(abs(r - 0) + abs(g - 165) + abs(b - 80), 8)

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

    def test_page_is_the_signs_natural_shape_with_a_1200_long_edge(self):
        page = open_image(self.versions['page'])
        self.assertEqual((page.format, page.width), ('WEBP', 1200))
        self.assertAlmostEqual(page.width / page.height, 310 / 110, delta=0.02)

    def test_page_and_tile_are_lossless_webp(self):
        for kind in ('page', 'tile'):
            self.assertEqual(self.versions[kind][12:16], b'VP8L', kind)   # the lossless WebP chunk

    def test_the_outline_is_exactly_on_the_signs_edge_with_no_gap(self):
        page = open_image(self.versions['page']).convert('RGB')
        dark = lambda p: sum(p) < 200
        self.assertTrue(dark(page.getpixel((0, 0))))
        self.assertTrue(dark(page.getpixel((page.width // 2, 0))))
        self.assertTrue(dark(page.getpixel((0, page.height // 2))))
        self.assertTrue(dark(page.getpixel((page.width - 1, page.height - 1))))
        # one line-width in, it is the sign (white margin here), not a gap and not more outline
        line = max(2, round(1200 * artwork.OUTLINE_FRACTION))
        self.assertFalse(dark(page.getpixel((line + 2, page.height // 2))))

    def test_the_feed_image_has_white_space_round_the_outlined_sign(self):
        feed = open_image(self.versions['feed']).convert('RGB')
        self.assertEqual(feed.getpixel((2, 2)), (255, 255, 255))
        self.assertEqual(feed.getpixel((750, 2)), (255, 255, 255))


class CheckMasterTests(SimpleTestCase):
    def test_a_normal_sign_passes(self):
        self.assertEqual(artwork.check_master(artwork.render_master(sign_pdf(300, 100))), [])

    def test_a_small_sign_on_a_big_white_page_is_flagged(self):
        import pymupdf
        small = pymupdf.open(stream=sign_pdf(60, 40, margin_mm=0), filetype='pdf')
        page = small[0]
        page.set_mediabox(pymupdf.Rect(0, 0, 600, 400))      # a big page with the sign in one corner
        problems = artwork.check_master(artwork.render_master(small.tobytes()))
        self.assertTrue(any('white' in p for p in problems))

    def test_a_very_thin_sign_is_flagged(self):
        problems = artwork.check_master(artwork.render_master(sign_pdf(700, 75)))
        self.assertTrue(any('thin' in p for p in problems))

    def test_unusual_colours_are_flagged(self):
        problems = artwork.check_master(artwork.render_master(sign_pdf(200, 200, fill='#8844AA')))
        self.assertTrue(any('palette' in p for p in problems))
