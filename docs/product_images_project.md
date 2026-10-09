# Product images project: brief for a fresh session

Written 2026-10-09. Read this first, then `product_image_audit_2026_10` in the auto-memory.

## Goal
Replace the live product images (mostly small GIFs) with a new, consistent, high-quality set,
starting with the products that are in the Google Shopping feed. Build it as a repeatable pipeline
(source artwork -> master -> feed / page / tile versions), not a one-off.

## Why now
Google Merchant Center is raising the minimum `image_link` / `additional_image_link` size to
**500 x 500 px** (warnings since 2026-04-14, **enforcement 2027-01-31**). ~77-79% of our GIF main
images are below that. Google recommends ~1500 x 1500 and the product filling 75-90% of the frame.

## What the audit found (store 1, measured from the public CDN)
- 4,052 of 4,129 live main images are GIF (256 colours; 24% with 1-bit transparency); 73 PNG, 3 SVG, 1 JPG.
- Median GIF long edge 303 px; 77% under 500 px; 56% at or under 300 px. Shapes: ~45% square, 36% landscape
  (to 3:1 and 4:1), 19% portrait. Common sizes 500x500, 300x300, 301x301, 300x100.
- Only ~230 additional images for ~4,100 products. Product page uses the same file for picture and
  enlarge. Best seller (product 593) is a 303 x 103 GIF shown in a 300 px box: soft on retina.
- Shopping feed: 19,845 live variants; only 821 have their own `variant_image`. ~19,000 fall back to the
  product main image (`apps/products/models.py` `variant_image_url`, used by `apps/feeds/merchant_feed.py`).
- CDN image responses carry no Cache-Control. Product JSON-LD has one relative `image` path. The main
  `<img>` has no width/height/srcset/fetchpriority.
- Lossless WebP of the flat sign artwork is ~half the GIF size (median 5 KB vs 10 KB at the same size);
  PNG is bigger than the GIF; JPEG is biggest and smears text. Scripts: `tools/image_audit/`.

## Decisions already made (Simon, 2026-10-09)
- Plain **white** background for the feed images.
- OK to install **Ghostscript and Inkscape** if `.ai` / PDF rendering needs them (check with `brew` first).
- Create a whole new set of images, feed products first. New filenames; never overwrite the live files.
- **Out of scope / ignore:** `My Drive/CorelDraw Artwork` (Paul's CDR), `My Drive/Paul SVG's`,
  `My Drive/NEW Signs`, `My Drive/Digital/digital_orig`.
- Paul designed many website GIFs in CorelDRAW (.cdr) on his laptop. Those CDR files are vector, so they
  would be usable, but they are skipped for now. If ever needed: export from CorelDRAW to PDF/SVG on his
  laptop; do not rely on parsing CDR (Inkscape/libcdr is unreliable on newer files).

## Source priority (revised 2026-10-09 after a matching test)
Simon's view that `Digital/` is the better source was right. A crude test (strip any leading `#order` number from the
filename, read the product code at the start, compare with live variant/supplier codes) gave, for the 4,123 live products:
- `Digital/` PDFs: **1,791 products (43%)** match a file by full code (type+number+letter); 2,103 (51%) at type+number.
- `SSAN/website_images` AI: only **452 products** match by full code (1,133 at type+number) despite 1,247 files.
- Either source: 1,921 (46%) exact, 2,300 (55%) at type+number. AI adds only 130 products that Digital lacks.
- ~1,259 live products have no parseable code at all (newer 40xxx-41xxx products, DOT signs, wording-only products, supplier
  items like TT 760 T): those need name/title matching, or have no in-house artwork.
- Of the 25,544 PDFs in `Digital/`, 16,843 are `#order`-number job files (the code is often still in the name), ~8,700 are not;
  about 7,200 carry a code-like name once the order number is stripped. Ignore layups and one-off job names.
- Typical product file names: `WS 41 B 200x300mm.pdf`, `PS 139 K 150X50MM NO SMOKING SIGN.pdf`, `#33740 IMSK 48 250mm x 65mm.pdf`.
  Matching is crude (simple regex), so a proper matcher should do better than these figures.
So: **`Digital/` PDFs first** (all orientations/sizes), AI originals only where they add something (cleaner vector, no
bleed/crop marks, or products Digital lacks). Digital also carries the orientation variants the AI files lack.

## Supplier-provided images (Simon, 2026-10-09: "some might be supplier provided")
Treat these as their own lane, not something to redraw from our artwork.
- The database only marks a few: of 4,123 live store-1 products, `supplier_id` is 1 (SSAN, in-house) for 4,095, **2 (Symbol) for 27**
  (e.g. the `TT 760 T` tie tags, images `tt760.gif`) and 3 (Freight) for 2. `oc_supplier` has 3 rows. Codes like `RCS`, `GA`, `DP` are
  in-house (supplier_id 1), so the DB cannot find the other supplier-provided images; **ask Simon which code ranges / folders** are
  supplier images.
- Handling: use the supplier image if it meets the spec (>= 1500 px for the feed ideally, never < 500) and is clean; otherwise ask the
  supplier for a larger/vector file (contacts are in `oc_supplier`: Symbol, Freight). Still normalise to a white square canvas.
- Check each one: usage permission, and Google forbids watermarks, logos, promo text and borders on the feed image, so a supplier's
  watermark/logo means it can't be used for the feed as supplied.
- Flag them in the matching spreadsheet (`supplier_id != 1` plus Simon's list) so they are not rendered from `Digital/` by mistake.

## Where the source artwork is
Google Drive for Desktop is mounted at
`/Users/simonfroggatt/Library/CloudStorage/GoogleDrive-safetysignsandnotices@googlemail.com/My Drive`
- **`Digital/`**: every sign ever printed, as resized print PDFs named with job and/or product code
  (e.g. `#37020 SPR 1 B 600x600mm.pdf`). Some are different orientations of the same sign, which is useful
  (pick the orientation that matches the product). Print PDFs may have bleed/crop marks and CMYK colour.
- Counts (top level, 2026-10-09): `Digital/` **25,794** items = 25,544 PDF, 59 AI, 45 JPG, 43 CDR (and 38 subfolders);
  `SSAN/website_images` **1,296** items = **1,247 AI**, 35 GIF, 11 PDF, 1 EPS (looks like the AI originals of the
  website images: the best first source); `PDF's/` 84 PDFs; `IMO Safety Signs/` 4 PDF + 2 CDR.
- `SSAN/DOT` is small (15 top-level items: zip/ttf/pdf/eps plus 8 subfolders), so not a bulk source. The folder is
  really named `SSAN/global_harmonization_symbols` (not `global_harmonization`). Other `SSAN/*` subfolders worth a
  look for product images: `new-product-images`, `new_iso`, `alphasigns`, `imo`, `A-Boards`, `Hazard Labels`,
  `re-cycling signs`, `escalator`, `bespoke_dnds`. (`NEW SIGNS` is out of scope.)
- **`SSAN/website_images`**, **`SSAN/DOT`** (Department for Transport signs), **`SSAN/global_harmonization`**
  (also a top-level `Global Harmonization Symbols`), and other `SSAN/*` subfolders: to be surveyed.
- Top-level `.ai` originals (12 at the top of My Drive) and `PDF's/`, `IMO Safety Signs/`, `IMO Signs/`:
  candidates, to be confirmed with Simon.
- **Drive listing is slow** (a plain `ls` of a big folder took over 2 minutes; `find` over the tree timed out
  at 280 s) and files stream on first read. Build ONE inventory (path, size, modified, type) per folder, run
  it in the background, cache it to a file outside the repo, and work from that. Never re-list.

## Plan (checkpoint with Simon at the end of each phase)
1. **Pilot, ~20 products**: top sellers that are in the Google feed. Find the source, render, make all
   versions, review side by side with Simon. Agree the look and specs, check colour accuracy (ISO safety
   colours; CMYK print PDF -> sRGB with a proper profile) and the 75-90% fill rule.
2. **Match products to sources.** Medusa has model/variant/supplier codes and current image filenames
   (e.g. `sc666`). Match to Drive filenames; output a spreadsheet: matched / uncertain / unmatched, for
   Simon to review. This is the hard part, not the rendering.
3. **Render in bulk.** Crop to the sign, render vector at ~2000 px long edge, trim, pad to a square canvas
   (never crop the sign), white background, no borders. Outputs per product:
   master (lossless), **feed** 1500 x 1500 (JPEG or WebP, no transparency), **page** ~1200 px WebP, **tile** ~600 px.
   Descriptive filenames (`fire-exit-arrow-left-sign-300x100mm.webp`). Automated checks (min size, fill ratio,
   no transparency, byte size) and contact sheets for visual review.
4. **Wire it up, feed first.** Medusa management command uploads to S3 using Medusa's existing storage
   (`upload_to` style, prefix e.g. `stores/products/v2/`); no AWS console access needed. Point
   `variant_image` / product image / feed `image_link` at the new files. Storefront: serve the sized WebP with
   `srcset`, width/height, `fetchpriority="high"` on the main image, absolute image URLs in the Product JSON-LD,
   a larger file behind click-to-enlarge, and Cache-Control on the CDN. Add an image sitemap. Switch over per
   product, best sellers first, so it can be reversed.

## Page and tile shapes
Do not crop signs to a square. Feed and grid tiles: the sign centred on a square canvas. Product page: natural
shape inside a consistent box (already `object-fit: contain`).

## Tools
Present: ImageMagick (`magick`), `cwebp`, PyMuPDF (`fitz`), cairosvg, Pillow (WebP yes, AVIF no) in `.venv1`.
Missing: Ghostscript, Inkscape, poppler (`pdftoppm`), mutool, exiftool (install allowed for Ghostscript and
Inkscape; ask before anything else).

## Rules for this project
- Drive and the CDN are read-only to us until Simon approves the pilot. Never delete or overwrite originals
  or live image files.
- Database changes are hand-written SQL files in `sql/YYYY-MM-DD_name.sql` (preview / execute / verify).
- Own branch for code. Generated images go in a working folder outside both repos (e.g.
  `~/Development/product_images/`), not in git.
- Medusa `apps/sites` etc. have no migrations (all `oc_*` tables are `managed=False`).
- Checks before claiming done: view the images, run the tests (`manage.py test apps.sites apps.emails apps.orders`).

## Open questions for Simon
- Which Drive folders are authoritative, and is there any naming convention tying `Digital/` files to
  product codes?
- For products with several orientations, which one should be the product image?
- Is the same white background wanted on the website tiles, or a light grey?
- Reference: the Google pages are at support.google.com/merchants/answer/6324350 (image_link) and
  support.google.com/merchants/answer/16989427 (2026 spec update). Google did not say whether 500 x 500
  applies to both sides or only the longer side; both give ~77-79% failing.
