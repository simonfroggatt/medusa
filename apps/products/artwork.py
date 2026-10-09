"""
Print-ready sign artwork (a PDF) -> the product images.

Pure functions, no database and no network, so they are easy to test and can be
called from the product form, a management command or a background job.

    master = render_master(pdf_bytes)          # trimmed RGB image, palette colours
    versions = make_versions(master)           # {'feed': ..., 'page': ..., 'tile': ...}
    problems = check_master(master)            # [] when it is good enough to publish

Colours: the Digital/ print PDFs carry print colours that differ from the sign
designer's palette (oc_tsg_category_types / oc_tsg_symbol_category). PALETTE_MAP
snaps them onto the designer palette so every product has the same greens, reds
and blues. Anything not in the map is left alone and reported by check_master.
"""
import io

import numpy as np
from PIL import Image, ImageChops, ImageDraw

MASTER_LONG_EDGE = 2000
RENDER_LONG_EDGE = 3000
MIN_FEED_FILL = 0.55   # of the square canvas's long edge; below this the sign looks lost
BORDER_RGB = (35, 31, 32)

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
    """First page of the PDF as a trimmed RGB image, long edge 2000 px.

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
    rect = page.rect
    if not rect.width or not rect.height:
        raise ArtworkError('The PDF page has no size.')
    scale = RENDER_LONG_EDGE / max(rect.width, rect.height)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), colorspace=pymupdf.csRGB, alpha=False)
    image = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    ink = ImageChops.difference(image, Image.new('RGB', image.size, (255, 255, 255)))
    bbox = ink.point(lambda v: 255 if v > 12 else 0).getbbox()
    if not bbox:
        raise ArtworkError('The PDF page is blank.')
    sign = image.crop(bbox)
    if not keep_colours:
        sign = remap_palette(sign)
    k = MASTER_LONG_EDGE / max(sign.size)
    return sign.resize((max(1, round(sign.width * k)), max(1, round(sign.height * k))), Image.LANCZOS)


def _framed(sign, long_edge):
    """The sign scaled to long_edge, with a thin dark border and a small white gap."""
    k = long_edge / max(sign.size)
    scaled = sign.resize((max(1, round(sign.width * k)), max(1, round(sign.height * k))), Image.LANCZOS)
    line = max(2, round(long_edge * 0.007))
    gap = max(2, round(long_edge * 0.012))
    out = Image.new('RGB', (scaled.width + 2 * (gap + line), scaled.height + 2 * (gap + line)), 'white')
    ImageDraw.Draw(out).rectangle([0, 0, out.width - 1, out.height - 1], outline=BORDER_RGB, width=line)
    out.paste(scaled, (gap + line, gap + line))
    return out


def _square(sign, side, fill=0.86):
    framed = _framed(sign, round(side * fill))
    canvas = Image.new('RGB', (side, side), 'white')
    canvas.paste(framed, ((side - framed.width) // 2, (side - framed.height) // 2))
    return canvas


def _encode(image, fmt, **options):
    buf = io.BytesIO()
    image.save(buf, fmt, **options)
    return buf.getvalue()


def make_versions(master):
    """feed: square 1500 JPEG; page: natural shape 1200 WebP; tile: square 600 WebP."""
    page = _framed(master, 1130)
    page_canvas = Image.new('RGB', (page.width + 70, page.height + 70), 'white')
    page_canvas.paste(page, (35, 35))
    return {
        'feed': _encode(_square(master, 1500), 'JPEG', quality=92, subsampling=0),
        'page': _encode(page_canvas, 'WEBP', quality=92),
        'tile': _encode(_square(master, 600), 'WEBP', quality=90),
    }


def check_master(master):
    """Reasons this artwork should be looked at by a person. Empty list = fine to publish."""
    problems = []
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
