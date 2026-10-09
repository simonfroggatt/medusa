-- Product artworks: the print-ready PDFs a product's pictures are made from, kept as a list on the
-- product's new Artwork tab. A variant (size + material) picks one of its product's artworks, or none.
--
-- Why a list: the picture follows the SHAPE of the sign, not the size or material. No Smoking Sign has
-- 19 variant rows but only three shapes (landscape 3:1, portrait 2:3, portrait 3:4), so three PDFs.
-- Photoluminescent is its own artwork (keep_colours = 1).
--
-- oc_tsg_product_artwork   one row per artwork: label, shape, the three images, the Drive copy of the PDF
--   is_main                1 = the product's main picture (product page, and every variant with no artwork of its own)
--   shape_ratio            width / height of the artwork, used to suggest which variants share it
--   keep_colours           1 = skip the sign-palette remap (photoluminescent artwork)
--   image_feed / _page / _tile   new files under stores/products/v2/, never replacing the old oc_product.image
--   drive_id / drive_filename    the print PDF on the Google Drive (blank until the Drive upload is switched on)
--   checks                 what the automatic checks flagged; blank = passed
-- oc_tsg_product_variant_core.artwork_id   the artwork this variant shows; NULL = the product's main artwork
--
-- Shown order, per image kind:  variant's artwork -> variant's old image (variant_image)
--   -> product's main artwork -> product's old image (image)
--
-- The image_* / artwork_* columns added to oc_product and oc_tsg_product_variant_core by
-- 2026-10-09_product_artwork.sql stay, unused for now; nothing is dropped here.
--
-- RUN THIS BEFORE pulling the Medusa update that uses it. Safe to run twice for the table;
-- the foreign key in step 2 is only added once (the preview shows whether it is already there).


-- 1. Preview: no rows before the first run
SELECT table_name, column_name
  FROM information_schema.columns
 WHERE table_schema = DATABASE()
   AND ((table_name = 'oc_tsg_product_artwork') OR
        (table_name = 'oc_tsg_product_variant_core' AND column_name = 'artwork_id'));


-- 2. Execute
CREATE TABLE IF NOT EXISTS `oc_tsg_product_artwork` (
  `artwork_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `label` varchar(100) NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT 0,
  `shape_ratio` decimal(8,4) DEFAULT NULL,
  `keep_colours` tinyint(1) NOT NULL DEFAULT 0,
  `image_feed` varchar(255) DEFAULT NULL,
  `image_page` varchar(255) DEFAULT NULL,
  `image_tile` varchar(255) DEFAULT NULL,
  `drive_id` varchar(100) DEFAULT NULL,
  `drive_filename` varchar(255) DEFAULT NULL,
  `checks` varchar(500) DEFAULT NULL,
  `date_added` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`artwork_id`),
  KEY `idx_artwork_product` (`product_id`, `is_main`),
  CONSTRAINT `fk_artwork_product` FOREIGN KEY (`product_id`) REFERENCES `oc_product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

ALTER TABLE `oc_tsg_product_variant_core`
  ADD COLUMN IF NOT EXISTS `artwork_id` int(11) DEFAULT NULL,
  ADD KEY IF NOT EXISTS `idx_variant_core_artwork` (`artwork_id`);

-- run once only; if it says the constraint already exists, step 2 has been run before
ALTER TABLE `oc_tsg_product_variant_core`
  ADD CONSTRAINT `fk_variant_core_artwork` FOREIGN KEY (`artwork_id`) REFERENCES `oc_tsg_product_artwork` (`artwork_id`)
  ON DELETE SET NULL ON UPDATE CASCADE;


-- 3. Verify: the table exists and is empty, artwork_id exists and is NULL on every variant
SELECT COUNT(*) AS artworks FROM oc_tsg_product_artwork;
SELECT COUNT(*) AS variants, SUM(artwork_id IS NOT NULL) AS with_artwork FROM oc_tsg_product_variant_core;
SHOW CREATE TABLE oc_tsg_product_artwork;


-- Rollback (only if nothing uses it yet):
-- ALTER TABLE `oc_tsg_product_variant_core` DROP FOREIGN KEY `fk_variant_core_artwork`;
-- ALTER TABLE `oc_tsg_product_variant_core` DROP COLUMN `artwork_id`;
-- DROP TABLE `oc_tsg_product_artwork`;
