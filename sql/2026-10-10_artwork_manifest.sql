-- Record how each artwork's images were made, so a bad batch can be diagnosed and re-made.
--
-- oc_tsg_product_artwork.manifest
--     JSON text written by Medusa every time images are made: SHA-256 of the source PDF, the page box used,
--     page size in mm, renderer and its version, pipeline version, output pixel sizes and SHA-256 of each file.
--     NULL = made before this column existed.
--
-- RUN THIS BEFORE pulling the Medusa update that uses it. Safe to run twice (ADD COLUMN IF NOT EXISTS).
-- Nothing existing is changed.


-- 1. Preview: no rows before the first run
SELECT column_name
  FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_product_artwork' AND column_name = 'manifest';


-- 2. Execute
ALTER TABLE `oc_tsg_product_artwork`
  ADD COLUMN IF NOT EXISTS `manifest` text DEFAULT NULL AFTER `checks`;


-- 3. Verify: one row
SELECT column_name, column_type, is_nullable
  FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_product_artwork' AND column_name = 'manifest';


-- Rollback (only if nothing has used it yet):
-- ALTER TABLE `oc_tsg_product_artwork` DROP COLUMN `manifest`;
