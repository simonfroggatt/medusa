-- Where the text sits on a homepage banner: left, centre or right (default centre, which is
-- how the IMO banners have always looked). Adds one column to oc_tsg_banner, set per banner
-- in Medusa (Sites > Banners). Run this BEFORE pulling the Medusa update that adds the field,
-- otherwise the Banners page tells you to run it. The storefront works either way: until the
-- column exists every banner is centred.
-- Safe to run twice (ADD COLUMN IF NOT EXISTS).


-- 1. Preview: no rows before the first run
SELECT column_name FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_banner' AND column_name = 'text_align';


-- 2. Execute
ALTER TABLE `oc_tsg_banner`
  ADD COLUMN IF NOT EXISTS `text_align` varchar(10) NOT NULL DEFAULT 'center' AFTER `button_style`;


-- 3. Verify: the column exists and every existing banner is 'center'
SELECT column_name, column_default FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_banner' AND column_name = 'text_align';
SELECT text_align, COUNT(*) AS banners FROM oc_tsg_banner GROUP BY text_align;
