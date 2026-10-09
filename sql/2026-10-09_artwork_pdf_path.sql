-- Keep the print-ready PDF an artwork was made from, so it can be downloaded again to make changes.
--
-- oc_tsg_product_artwork.pdf_path
--     Path of the stored PDF in the media storage (S3), e.g. medusa/product/artwork/no-smoking-sign-landscape-1-print.pdf.
--     NULL = no PDF kept (artworks made before this column existed).
-- The PDF is stored under medusa/product/artwork/ (with the product documents), not in the public
-- stores/products/ image folder, and is downloaded through Medusa (Artwork tab > Download PDF).
--
-- RUN THIS BEFORE pulling the Medusa update that uses it (Medusa reads the column whenever it reads an
-- artwork). Safe to run twice (ADD COLUMN IF NOT EXISTS). Nothing existing is changed.


-- 1. Preview: no rows before the first run
SELECT column_name
  FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_product_artwork' AND column_name = 'pdf_path';


-- 2. Execute
ALTER TABLE `oc_tsg_product_artwork`
  ADD COLUMN IF NOT EXISTS `pdf_path` varchar(255) DEFAULT NULL AFTER `image_tile`;


-- 3. Verify: one row
SELECT column_name, column_type, is_nullable
  FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_product_artwork' AND column_name = 'pdf_path';


-- Rollback (only if nothing has used it yet):
-- ALTER TABLE `oc_tsg_product_artwork` DROP COLUMN `pdf_path`;
