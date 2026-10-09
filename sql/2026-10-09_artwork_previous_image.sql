-- Artwork images are written into the existing image fields, so everything that already reads them
-- (the shop, carts, orders, emails, Medusa paperwork and screens, the old feeds) shows the new picture
-- with no code change:
--   oc_product.image                        <- the main artwork's page picture
--   oc_tsg_product_variant_core.variant_image <- the page picture of the artwork the variant uses
-- The square tile and the Google feed picture stay as lookups (they are different files).
--
-- These two columns remember what the field held before an artwork took it over, so that removing the
-- artwork (or taking a variant off it) puts the old image back. The old image FILES are never touched.
--
-- oc_product.previous_image
--     NULL = no artwork has taken over image. Otherwise the path image held before ('' = it was empty).
-- oc_tsg_product_variant_core.previous_variant_image
--     NULL = variant_image is the variant's own. Otherwise the path variant_image held before the
--     variant started using an artwork ('' = it was empty).
--
-- RUN THIS BEFORE pulling the Medusa update that uses it (Medusa reads these columns with every product
-- and variant). Safe to run twice (ADD COLUMN IF NOT EXISTS). Nothing existing is changed.


-- 1. Preview: no rows before the first run
SELECT table_name, column_name
  FROM information_schema.columns
 WHERE table_schema = DATABASE()
   AND ((table_name = 'oc_product' AND column_name = 'previous_image')
     OR (table_name = 'oc_tsg_product_variant_core' AND column_name = 'previous_variant_image'));


-- 2. Execute
ALTER TABLE `oc_product`
  ADD COLUMN IF NOT EXISTS `previous_image` varchar(255) DEFAULT NULL AFTER `image`;

ALTER TABLE `oc_tsg_product_variant_core`
  ADD COLUMN IF NOT EXISTS `previous_variant_image` varchar(255) DEFAULT NULL AFTER `variant_image`;


-- 3. Verify: two rows, and nothing has taken over an image yet (both counts 0)
SELECT table_name, column_name, column_type, is_nullable
  FROM information_schema.columns
 WHERE table_schema = DATABASE()
   AND ((table_name = 'oc_product' AND column_name = 'previous_image')
     OR (table_name = 'oc_tsg_product_variant_core' AND column_name = 'previous_variant_image'));

SELECT COUNT(*) AS products_with_previous_image FROM oc_product WHERE previous_image IS NOT NULL;
SELECT COUNT(*) AS variants_with_previous_image FROM oc_tsg_product_variant_core WHERE previous_variant_image IS NOT NULL;


-- Rollback (only if nothing has used the columns yet):
-- ALTER TABLE `oc_product` DROP COLUMN `previous_image`;
-- ALTER TABLE `oc_tsg_product_variant_core` DROP COLUMN `previous_variant_image`;
