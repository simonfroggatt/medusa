-- Let a category's "make your own" offer open the designer with a particular symbol already chosen
-- (e.g. Fork-Lift Signs -> the forklift warning symbol W014), set in Medusa on Sites > Bespoke Offers.
--
-- Adds one column to oc_tsg_category_bespoke: symbol_id = oc_tsg_symbols.id. NULL = no symbol chosen, the
-- designer starts from its type's default. A symbol applies to that exact category only: sub-categories that
-- inherit the offer do NOT inherit the symbol (a forklift symbol on "Warning Signs" would otherwise leak onto
-- everything under it).
-- Run this before pulling the Medusa update: until the column exists the Bespoke Offers page says so.
-- The storefront works either way: with no column, offers simply open without a symbol.
-- Safe to run twice (ADD COLUMN IF NOT EXISTS).


-- 1. Preview: no rows before the first run
SELECT column_name FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_category_bespoke' AND column_name = 'symbol_id';


-- 2. Execute
ALTER TABLE `oc_tsg_category_bespoke`
  ADD COLUMN IF NOT EXISTS `symbol_id` int(10) unsigned DEFAULT NULL AFTER `bespoke_product_id`;


-- 3. Verify: the column exists and nothing has a symbol yet
SELECT column_name, column_type, is_nullable FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_category_bespoke' AND column_name = 'symbol_id';
SELECT COUNT(*) AS rows_, SUM(symbol_id IS NOT NULL) AS with_symbol FROM oc_tsg_category_bespoke;
