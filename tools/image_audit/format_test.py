"""Compare file sizes of the same real artwork in different formats."""
import argparse
import io
import json
import random
import statistics
import urllib.parse
import urllib.request

from PIL import Image

BASE = 'https://cdn.totalsafetygroup.com/'


def encoded_size(image, **options):
    buffer = io.BytesIO()
    image.save(buffer, **options)
    return buffer.tell()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--audit', required=True, help='JSON written by audit_images.py')
    ap.add_argument('--count', type=int, default=40)
    ap.add_argument('--min-edge', type=int, default=300)
    args = ap.parse_args()
    random.seed(11)
    pool = [r for r in json.load(open(args.audit)) if r.get('group') == 'main_gif' and r.get('w', 0) >= args.min_edge]
    rows = []
    for record in random.sample(pool, min(args.count, len(pool))):
        url = BASE + urllib.parse.quote(record['path'])
        data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'tsg-image-audit'}), timeout=30).read()
        rgba = Image.open(io.BytesIO(data)).convert('RGBA')
        flat = Image.new('RGB', rgba.size, 'white')
        flat.paste(rgba, mask=rgba.split()[3])
        rows.append({
            'gif': len(data),
            'png': encoded_size(rgba, format='PNG', optimize=True),
            'webp_lossless': encoded_size(rgba, format='WEBP', lossless=True, quality=100, method=6),
            'webp_q90': encoded_size(rgba, format='WEBP', quality=90, method=6),
            'jpeg_q90': encoded_size(flat, format='JPEG', quality=90, optimize=True),
        })
    print('median / mean KB over', len(rows), 'real images at their current size')
    for key in rows[0]:
        print(f"  {key:14s} {statistics.median(r[key] for r in rows) / 1024:6.1f} / {statistics.mean(r[key] for r in rows) / 1024:6.1f}")


if __name__ == '__main__':
    main()
