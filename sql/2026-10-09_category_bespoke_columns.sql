-- "Make your own" card on category pages: two optional columns on the store category, set in Medusa on the
-- category's edit screen (Catalogue > Categories > edit).
--
--   bespoke_symbol_id    oc_tsg_symbols.id. The card opens the designer with this symbol; which designer it is follows
--                        from the symbol's type (a fork-lift symbol is a warning symbol -> Custom Warning Sign).
--   bespoke_template_id  oc_tsg_bespoke_templates.id, for designers that are not about a symbol: Fire Action Notice,
--                        Site Board, Bi-Lingual, Text Only. The live product using that template opens.
-- Neither set: no card. Both set: that designer, opened with that symbol.
--
-- RUN THIS BEFORE pulling the Medusa update: Medusa reads these columns whenever it reads a category, so until
-- they exist the category screens will error. The storefront is safe either way (it shows nothing until they exist).
-- Safe to run twice (ADD COLUMN IF NOT EXISTS).


-- 1. Preview: no rows before the first run
SELECT column_name FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_category'
   AND column_name IN ('bespoke_symbol_id', 'bespoke_template_id');


-- 2. Execute
ALTER TABLE `oc_tsg_category`
  ADD COLUMN IF NOT EXISTS `bespoke_symbol_id` int(10) unsigned DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `bespoke_template_id` int(10) unsigned DEFAULT NULL;


-- 3. Verify: both columns exist and nothing is set yet
SELECT column_name, column_type, is_nullable FROM information_schema.columns
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_category'
   AND column_name IN ('bespoke_symbol_id', 'bespoke_template_id');
SELECT COUNT(*) AS categories, SUM(bespoke_symbol_id IS NOT NULL) AS with_symbol,
       SUM(bespoke_template_id IS NOT NULL) AS with_template FROM oc_tsg_category;


-- 4. Optional tidy-up. An earlier version of this feature used a separate table, oc_tsg_category_bespoke
--    (and later a symbol_id column on it). It is no longer used by anything. Only run these if you created it
--    on this database; drop it when you are happy with the new fields.
-- DROP TABLE IF EXISTS `oc_tsg_category_bespoke`;
