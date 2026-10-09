"""Measure images straight from the public CDN. Nothing is written to disk except the JSON result."""
import argparse
import io
import json
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

Image.MAX_IMAGE_PIXELS = None
DEFAULT_BASE = 'https://cdn.totalsafetygroup.com/'


def probe(base, item):
    group, path = item
    url = base + urllib.parse.quote(path)
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'tsg-image-audit'})
        with urllib.request.urlopen(request, timeout=30) as response:
            data = response.read()
            record = dict(group=group, path=path, bytes=len(data), ctype=response.headers.get('Content-Type'),
                          cache=response.headers.get('Cache-Control'))
        if path.lower().endswith('.svg'):
            record['kind'] = 'svg'
            return record
        image = Image.open(io.BytesIO(data))
        record.update(kind=image.format, w=image.width, h=image.height, mode=image.mode,
                      frames=getattr(image, 'n_frames', 1),
                      transparency=('transparency' in image.info) or image.mode in ('RGBA', 'LA', 'PA'))
        if image.format == 'GIF':
            record['palette_colours'] = len(image.getpalette() or []) // 3
        return record
    except Exception as error:  # a broken file is a finding, not a crash
        return dict(group=group, path=path, error=str(error)[:80])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--sample', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--base', default=DEFAULT_BASE)
    ap.add_argument('--limit', type=int, default=0, help='only the first N per group (for a quick test)')
    args = ap.parse_args()
    sample = json.load(open(args.sample))
    items = [(group, path) for group, paths in sample.items() for path in (paths[:args.limit] if args.limit else paths)]
    with ThreadPoolExecutor(16) as pool:
        results = list(pool.map(lambda item: probe(args.base, item), items))
    json.dump(results, open(args.out, 'w'))
    print('probed', len(results), '| errors', sum(1 for r in results if 'error' in r))


if __name__ == '__main__':
    main()
