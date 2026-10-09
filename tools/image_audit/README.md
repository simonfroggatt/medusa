# Product image audit

Read-only helpers used on 2026-10-09 to measure the live product images (see
`docs/product_images_project.md`). They only READ the database and the public CDN.

Run from the Medusa repo root with the project venv:

```
.venv1/bin/python tools/image_audit/sample_images.py  --out /tmp/img_sample.json --gifs 400 --store 1
.venv1/bin/python tools/image_audit/audit_images.py   --sample /tmp/img_sample.json --out /tmp/img_audit.json
.venv1/bin/python tools/image_audit/format_test.py    --audit /tmp/img_audit.json --count 40
```

- `sample_images.py`  picks live main images (all non-GIF, a random sample of GIFs), the extra
  product images and the per-variant images that the Shopping feed uses.
- `audit_images.py`   downloads each one from the CDN into memory only and records format,
  pixel size, colour mode, bytes, transparency and the cache header. Nothing is saved to disk.
- `format_test.py`    re-encodes a sample as PNG / lossless WebP / WebP q90 / JPEG q90 and
  compares the sizes.
