"""Pick the product images to audit. Read-only: SELECTs against the shared database."""
import argparse
import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medusa.settings')
import django  # noqa: E402

django.setup()
from django.db import connection  # noqa: E402

MAIN_SQL = """
    SELECT DISTINCT IF(LENGTH(s.image) > 1, s.image, p.image)
      FROM oc_product p JOIN oc_product_to_store s ON s.product_id = p.product_id
     WHERE p.status = 1 AND s.store_id = %s"""
EXTRA_SQL = "SELECT DISTINCT image FROM oc_product_image"
VARIANT_SQL = """
    SELECT DISTINCT core.variant_image
      FROM oc_tsg_product_variants v
      JOIN oc_tsg_product_variant_core core ON core.prod_variant_core_id = v.prod_var_core_id
      JOIN oc_product p ON p.product_id = core.product_id
     WHERE v.store_id = %s AND v.isdeleted = 0 AND core.bl_live = 1 AND p.status = 1
       AND LENGTH(core.variant_image) > 1"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', required=True)
    ap.add_argument('--store', type=int, default=1)
    ap.add_argument('--gifs', type=int, default=400, help='random GIF main images to include')
    ap.add_argument('--seed', type=int, default=7)
    args = ap.parse_args()
    random.seed(args.seed)
    cur = connection.cursor()
    cur.execute(MAIN_SQL, [args.store])
    main_images = [r[0] for r in cur.fetchall() if r[0]]
    cur.execute(EXTRA_SQL)
    extra = [r[0] for r in cur.fetchall() if r[0]]
    cur.execute(VARIANT_SQL, [args.store])
    variant = [r[0] for r in cur.fetchall() if r[0]]
    gifs = [m for m in main_images if m.lower().endswith('.gif')]
    sample = {
        'main_other': [m for m in main_images if not m.lower().endswith('.gif')],
        'main_gif': random.sample(gifs, min(args.gifs, len(gifs))),
        'extra': extra,
        'variant': variant,
    }
    json.dump(sample, open(args.out, 'w'))
    print({k: len(v) for k, v in sample.items()}, '| GIF main images in total:', len(gifs), 'of', len(main_images))


if __name__ == '__main__':
    main()
