-- New product images, made from the print-ready PDF uploaded on the product form
-- (apps/products/artwork.py). The old oc_product.image is left exactly as it is: it stays
-- the fallback until a product has the new images, and nothing is overwritten.
--
-- image_feed         square 1500 x 1500 JPEG, bordered: Google Shopping feed (image_link)
-- image_page         natural shape WebP, bordered: the product page picture and enlarge
-- image_tile         square 600 x 600 WebP, bordered: category grids and search results
-- artwork_drive_id   Google Drive file id of the print PDF it was made from
-- artwork_filename   the PDF's name on the Drive
-- artwork_checks     what the automatic checks flagged (NULL = passed, nothing to look at)
-- artwork_date       when the images were last made
-- artwork_keep_colours (variant table only) 1 = skip the palette remap, e.g. photoluminescent artwork
-- The same columns go on oc_tsg_product_variant_core, because a variant (a size/material, e.g.
-- photoluminescent or portrait) can have its own picture. Shown order, per image kind:
-- variant new -> variant old (variant_image) -> product new -> product old (image).
-- Paths are relative to the media root like oc_product.image, e.g. stores/products/v2/ws-401-p-feed.jpg
--
-- Safe to run twice (ADD COLUMN IF NOT EXISTS). No foreign keys, no data change.


-- 1. Preview: should return no rows before the first run
SELECT column_name
  FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name IN ('oc_product', 'oc_tsg_product_variant_core')
   AND column_name IN ('image_feed', 'image_page', 'image_tile',
                       'artwork_drive_id', 'artwork_filename', 'artwork_checks', 'artwork_date',
                       'artwork_keep_colours');


-- 2. Execute
ALTER TABLE `oc_product`
  ADD COLUMN IF NOT EXISTS `image_feed` varchar(255) DEFAULT NULL AFTER `image`,
  ADD COLUMN IF NOT EXISTS `image_page` varchar(255) DEFAULT NULL AFTER `image_feed`,
  ADD COLUMN IF NOT EXISTS `image_tile` varchar(255) DEFAULT NULL AFTER `image_page`,
  ADD COLUMN IF NOT EXISTS `artwork_drive_id` varchar(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `artwork_filename` varchar(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `artwork_checks` varchar(500) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `artwork_date` datetime DEFAULT NULL;

ALTER TABLE `oc_tsg_product_variant_core`
  ADD COLUMN IF NOT EXISTS `image_feed` varchar(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `image_page` varchar(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `image_tile` varchar(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `artwork_drive_id` varchar(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `artwork_filename` varchar(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `artwork_checks` varchar(500) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `artwork_date` datetime DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `artwork_keep_colours` tinyint(1) NOT NULL DEFAULT 0;


-- 3. Verify: 7 rows for oc_product, 8 for oc_tsg_product_variant_core; nothing has new images yet
SELECT table_name, column_name, column_type, is_nullable
  FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name IN ('oc_product', 'oc_tsg_product_variant_core')
   AND column_name IN ('image_feed', 'image_page', 'image_tile',
                       'artwork_drive_id', 'artwork_filename', 'artwork_checks', 'artwork_date',
                       'artwork_keep_colours')
 ORDER BY table_name, ordinal_position;

SELECT COUNT(*) AS variants,
       SUM(image_feed IS NOT NULL OR image_page IS NOT NULL OR image_tile IS NOT NULL) AS with_new_images
  FROM oc_tsg_product_variant_core;

SELECT COUNT(*) AS products,
       SUM(image_feed IS NOT NULL OR image_page IS NOT NULL OR image_tile IS NOT NULL) AS with_new_images
  FROM oc_product;


-- Rollback (only if nothing has used the columns yet):
-- ALTER TABLE `oc_tsg_product_variant_core` DROP COLUMN `image_feed`, DROP COLUMN `image_page`, DROP COLUMN `image_tile`,
--   DROP COLUMN `artwork_drive_id`, DROP COLUMN `artwork_filename`, DROP COLUMN `artwork_checks`, DROP COLUMN `artwork_date`,
--   DROP COLUMN `artwork_keep_colours`;
-- ALTER TABLE `oc_product` DROP COLUMN `image_feed`, DROP COLUMN `image_page`, DROP COLUMN `image_tile`,
--   DROP COLUMN `artwork_drive_id`, DROP COLUMN `artwork_filename`, DROP COLUMN `artwork_checks`, DROP COLUMN `artwork_date`;
