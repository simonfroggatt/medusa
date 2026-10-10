"""
Print-ready sign artwork (a PDF) -> the product images.

Pure functions, no database and no network, so they are easy to test and can be
called from the product form, a management command or a background job.

    master = render_master(pdf_bytes)          # trimmed RGB image, palette colours
    versions = make_versions(master)           # {'feed': ..., 'page': ..., 'tile': ...}
    problems = check_master(master)            # [] when it is good enough to publish

The PDF page IS the sign: the print-ready PDFs are the true size of the sign (white margin included), so
the whole page (its TrimBox when it has one) is rendered, nothing is cropped away, and the outline is drawn
exactly on the sign's outer edge, so the customer sees the real edge and proportions of the sign.

Colours: the Digital/ print PDFs carry print colours that differ from the sign
designer's palette (oc_tsg_category_types / oc_tsg_symbol_category). PALETTE_MAP
snaps them onto the designer palette so every product has the same greens, reds
and blues. Anything not in the map is left alone and reported by check_master.
"""
import io

from PIL import Image, ImageChops, ImageDraw

MASTER_LONG_EDGE = 2000
RENDER_LONG_EDGE = 3000
MIN_FEED_FILL = 0.55   # of the square canvas's long edge; below this the sign looks lost
OUTLINE_RGB = (35, 31, 32)
OUTLINE_FRACTION = 0.003   # line thickness as a share of the sign's long edge (about 4 px on a 1500 feed image)
PAGE_LONG_EDGE = 1200
MIN_INK_SHARE = 0.5        # below this share of the page carrying ink, ask a person to look

# (print colour from the Digital PDFs) -> (designer palette)
PALETTE_MAP = [
    ((0, 165, 80), (9, 145, 70)),      # safe condition green  #099146
    ((0, 150, 62), (9, 145, 70)),      # a second print green found in some files
    ((207, 16, 45), (237, 28, 38)),    # prohibition / fire red #ED1C24
    ((0, 93, 185), (5, 107, 179)),     # mandatory blue         #056BB3
    ((27, 120, 186), (5, 107, 179)),   # a second print blue found in some files
    ((255, 242, 0), (255, 242, 0)),    # warning yellow         #FFF200
]
PALETTE_TOLERANCE = 14.0


class ArtworkError(Exception):
    """The artwork could not be turned into an image."""


def remap_palette(image):
    """Snap print colours to the designer palette, keeping anti-aliased edges.

    A pixel on an edge is a blend of a flat colour with white (or black). Each
    pixel is projected onto the white->colour and black->colour lines; when it
    sits on one it is rebuilt with the same blend of the palette colour.
    """
    import numpy as np  # here, not at the top, so Medusa starts even where numpy is missing

    pixels = np.asarray(image.convert('RGB'), dtype=np.float32)
    out = pixels.copy()
    best = np.full(pixels.shape[:2], 1e9, dtype=np.float32)
    for src, dst in PALETTE_MAP:
        s, d = np.array(src, np.float32), np.array(dst, np.float32)
        for base in (np.array([255, 255, 255], np.float32), np.array([0, 0, 0], np.float32)):
            v = s - base
            t = np.clip(((pixels - base) @ v) / (v @ v), 0, 1)
            residual = np.linalg.norm(pixels - (base + t[..., None] * v), axis=2)
            hit = (residual < PALETTE_TOLERANCE) & (residual < best) & (t > 0.02)
            out[hit] = (base + t[..., None] * (d - base))[hit]
            best[hit] = residual[hit]
    return Image.fromarray(np.clip(out + 0.5, 0, 255).astype(np.uint8))


def render_master(pdf_bytes, keep_colours=False):
    """The sign as an RGB image, long edge 2000 px: the whole PDF page, or its TrimBox when it has one.

    Nothing is trimmed away: the white margin inside a print-ready PDF is part of the sign.
    The palette is applied unless keep_colours (photoluminescent artwork keeps its own colours).
    """
    try:
        import pymupdf  # imported here so the rest of Medusa does not need it to start
    except ImportError as exc:
        raise ArtworkError('PDF rendering is not installed on this server (pip install PyMuPDF).') from exc

    try:
        doc = pymupdf.open(stream=pdf_bytes, filetype='pdf')
        page = doc[0]
    except Exception as exc:
        raise ArtworkError(f'Could not open the PDF: {exc}') from exc
    # the finished size: TrimBox when the file defines one (bleed and crop marks sit outside it)
    box = page.rect
    try:
        trim = page.trimbox
        if trim and not trim.is_empty and trim != page.mediabox and trim.width > 1 and trim.height > 1:
            box = trim & page.rect
    except Exception:
        box = page.rect
    if not box.width or not box.height:
        raise ArtworkError('The PDF page has no size.')
    scale = MASTER_LONG_EDGE / max(box.width, box.height)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), clip=box, colorspace=pymupdf.csRGB, alpha=False)
    image = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    if not _ink_bbox(image):
        raise ArtworkError('The PDF page is blank.')
    return image if keep_colours else remap_palette(image)


def _ink_bbox(image):
    """Bounding box of everything that is not white, or None for a blank page."""
    ink = ImageChops.difference(image, Image.new('RGB', image.size, (255, 255, 255)))
    return ink.point(lambda v: 255 if v > 12 else 0).getbbox()


def _outlined(sign, long_edge):
    """The sign scaled to long_edge with a thin line drawn exactly on its outer edge (the sign's true size)."""
    k = long_edge / max(sign.size)
    scaled = sign.resize((max(1, round(sign.width * k)), max(1, round(sign.height * k))), Image.LANCZOS)
    line = max(2, round(long_edge * OUTLINE_FRACTION))
    ImageDraw.Draw(scaled).rectangle([0, 0, scaled.width - 1, scaled.height - 1], outline=OUTLINE_RGB, width=line)
    return scaled


def _square(sign, side, fill=0.86):
    outlined = _outlined(sign, round(side * fill))
    canvas = Image.new('RGB', (side, side), 'white')
    canvas.paste(outlined, ((side - outlined.width) // 2, (side - outlined.height) // 2))
    return canvas


def _encode(image, fmt, **options):
    buf = io.BytesIO()
    image.save(buf, fmt, **options)
    return buf.getvalue()


def make_versions(master):
    """feed: square 1500 JPEG; page: natural shape 1200 lossless WebP; tile: square 600 lossless WebP."""
    return {
        'feed': _encode(_square(master, 1500), 'JPEG', quality=92, subsampling=0),
        'page': _encode(_outlined(master, PAGE_LONG_EDGE), 'WEBP', lossless=True),
        'tile': _encode(_square(master, 600), 'WEBP', lossless=True),
    }


def check_master(master):
    """Reasons this artwork should be looked at by a person. Empty list = fine to publish."""
    import numpy as np

    problems = []
    bbox = _ink_bbox(master)
    if bbox:
        share = ((bbox[2] - bbox[0]) * (bbox[3] - bbox[1])) / (master.width * master.height)
        if share < MIN_INK_SHARE:
            problems.append('Most of the PDF page is white (a small sign on a big page, or bleed / crop marks): '
                            'check the PDF is the finished sign size.')
    if max(master.size) < MASTER_LONG_EDGE * 0.95:
        problems.append(f'Master is only {max(master.size)} px on its long edge.')
    ratio = max(master.size) / min(master.size)
    if ratio > 6:
        problems.append(f'Very thin sign ({ratio:.1f}:1); it will look small on a square feed image.')
    small = master.copy()
    small.thumbnail((300, 300))
    colours = np.asarray(small.convert('RGB'), dtype=np.float32).reshape(-1, 3)
    palette = np.array([dst for _, dst in PALETTE_MAP] + [(255, 255, 255), (35, 31, 32), (0, 0, 0)], np.float32)
    dist = np.linalg.norm(colours[:, None, :] - palette[None, :, :], axis=2).min(axis=1)
    if (dist > 40).mean() > 0.25:
        problems.append('A lot of the artwork is in colours outside the sign palette (photo or unusual colours).')
    return problems
