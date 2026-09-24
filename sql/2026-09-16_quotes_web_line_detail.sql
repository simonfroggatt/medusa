-- quotes_web: give a quote line the same shape as an order line, so staff can change the
-- size/material (variant swap) and add options like drill holes.
--
-- Why: oc_tsg_quote_item only had product_name / variant_code, with size, material,
-- orientation and supplier code squeezed into the bespoke_data JSON by the storefront. That
-- is fine for showing a quote, but not for editing one - and "accepted -> order" later needs
-- these as real columns to copy across.
--
-- The column names deliberately match oc_tsg_quote_product (the legacy staff quote line) and
-- oc_order_product, so the same dialogs, forms and copy-to-order code can work on all three.
--
--   1. oc_tsg_quote_item gains: size_name, width, height, orientation_name, material_name,
--      supplier_id, supplier_code, base_unit_price, line_discount, exclude_discount
--   2. New oc_tsg_quote_item_options, mirroring oc_tsg_order_product_options - this is where
--      drill holes, laminate and the rest are recorded. No quote table held these before.
--   3. Backfill: copy size/orientation/material/supplier_code out of bespoke_data into the new
--      columns for storefront lines, then clear that duplicated JSON.
--
-- NOTE on the backfill: only lines with is_bespoke = 0 are touched. The bespoke line's JSON
-- holds real bespoke content (e.g. {"text": "KEEP CLEAR"}) and is left exactly as it is.
-- Locally that means 2 rows are backfilled; no row currently has an options array, so nothing
-- goes into the new options table.
--
-- oc_supplier's primary key is `id` (not supplier_id) - the FK below reflects that.
--
-- Run in Navicat on totalsafetygroup_oc. Local only; fold into the production script before
-- that is run (quotes_web_v1_plan.md decision 13).


-- ---------------------------------------------------------------------------
-- 1. PREVIEW
-- ---------------------------------------------------------------------------

-- none of the new columns should exist yet
SHOW COLUMNS FROM oc_tsg_quote_item;

-- the options table should not exist yet (expect 0 rows)
SELECT TABLE_NAME FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'oc_tsg_quote_item_options';

-- what the backfill will copy: expect the storefront lines with detail JSON
SELECT quote_item_id,
       is_bespoke,
       JSON_VALUE(bespoke_data, '$.size_name')        AS will_set_size,
       JSON_VALUE(bespoke_data, '$.orientation_name') AS will_set_orientation,
       JSON_VALUE(bespoke_data, '$.material_name')    AS will_set_material,
       JSON_VALUE(bespoke_data, '$.supplier_code')    AS will_set_supplier_code,
       JSON_QUERY(bespoke_data, '$.options')          AS options_present
FROM oc_tsg_quote_item
WHERE bespoke_data IS NOT NULL
ORDER BY quote_item_id;


-- ---------------------------------------------------------------------------
-- 2. EXECUTE
-- ---------------------------------------------------------------------------

-- 2.1 line detail columns (names match oc_tsg_quote_product / oc_order_product)
ALTER TABLE oc_tsg_quote_item
    ADD COLUMN IF NOT EXISTS `size_name` varchar(256) DEFAULT NULL AFTER `variant_code`,
    ADD COLUMN IF NOT EXISTS `width` decimal(10,0) DEFAULT NULL AFTER `size_name`,
    ADD COLUMN IF NOT EXISTS `height` decimal(10,0) DEFAULT NULL AFTER `width`,
    ADD COLUMN IF NOT EXISTS `orientation_name` varchar(255) DEFAULT NULL AFTER `height`,
    ADD COLUMN IF NOT EXISTS `material_name` varchar(255) DEFAULT NULL AFTER `orientation_name`,
    ADD COLUMN IF NOT EXISTS `supplier_id` int(11) DEFAULT NULL AFTER `material_name`,
    ADD COLUMN IF NOT EXISTS `supplier_code` varchar(64) DEFAULT NULL AFTER `supplier_id`,
    ADD COLUMN IF NOT EXISTS `base_unit_price` decimal(15,4) NOT NULL DEFAULT 0.0000
        COMMENT 'Variant price before options and bulk discount' AFTER `single_unit_price`,
    ADD COLUMN IF NOT EXISTS `line_discount` decimal(10,2) DEFAULT NULL AFTER `bulk_used`,
    ADD COLUMN IF NOT EXISTS `exclude_discount` tinyint(1) NOT NULL DEFAULT 0 AFTER `line_discount`;

ALTER TABLE oc_tsg_quote_item
    ADD CONSTRAINT `fk_web_quote_item_supplier`
        FOREIGN KEY IF NOT EXISTS (`supplier_id`) REFERENCES `oc_supplier` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE;

-- 2.2 options on a quote line (drill holes, laminate, ...), mirroring
--     oc_tsg_order_product_options so the two can be copied across later
CREATE TABLE IF NOT EXISTS `oc_tsg_quote_item_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quote_item_id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `class_name` varchar(255) DEFAULT NULL,
  `value_id` int(11) DEFAULT NULL,
  `value_name` varchar(255) DEFAULT NULL,
  `bl_dynamic` int(1) DEFAULT 0,
  `dynamic_class_id` int(11) DEFAULT 0,
  `dynamic_value_id` int(11) DEFAULT 0,
  `class_type_id` int(11) DEFAULT NULL,
  `price_modifier` decimal(15,4) NOT NULL DEFAULT 0.0000
      COMMENT 'What this option added to the unit price when the quote was made',
  PRIMARY KEY (`id`),
  KEY `fk_quote_item_option_item` (`quote_item_id`),
  KEY `fk_quote_item_option_class` (`class_id`),
  KEY `fk_quote_item_option_value` (`value_id`),
  KEY `fk_quote_item_option_type` (`class_type_id`),
  CONSTRAINT `fk_quote_item_option_item` FOREIGN KEY (`quote_item_id`)
      REFERENCES `oc_tsg_quote_item` (`quote_item_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_quote_item_option_type` FOREIGN KEY (`class_type_id`)
      REFERENCES `oc_tsg_option_types` (`option_type_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2.3 backfill the storefront lines from their JSON (bespoke lines untouched)
UPDATE oc_tsg_quote_item
SET size_name        = COALESCE(size_name,        JSON_VALUE(bespoke_data, '$.size_name')),
    orientation_name = COALESCE(orientation_name, JSON_VALUE(bespoke_data, '$.orientation_name')),
    material_name    = COALESCE(material_name,    JSON_VALUE(bespoke_data, '$.material_name')),
    supplier_code    = COALESCE(supplier_code,    JSON_VALUE(bespoke_data, '$.supplier_code'))
WHERE is_bespoke = 0
  AND bespoke_data IS NOT NULL
  AND JSON_VALID(bespoke_data)
  AND JSON_VALUE(bespoke_data, '$.size_name') IS NOT NULL;

-- 2.4 any options that were recorded as label/value pairs keep their wording; ids are unknown
--     because the storefront only sent labels, so class_id / value_id stay NULL
INSERT INTO oc_tsg_quote_item_options (quote_item_id, class_name, value_name)
SELECT i.quote_item_id,
       JSON_VALUE(o.opt, '$.label'),
       JSON_VALUE(o.opt, '$.value')
FROM oc_tsg_quote_item i
JOIN JSON_TABLE(i.bespoke_data, '$.options[*]' COLUMNS (opt JSON PATH '$')) o
WHERE i.is_bespoke = 0
  AND i.bespoke_data IS NOT NULL
  AND JSON_VALID(i.bespoke_data)
  AND JSON_QUERY(i.bespoke_data, '$.options') IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM oc_tsg_quote_item_options x WHERE x.quote_item_id = i.quote_item_id);

-- 2.5 the JSON has served its purpose on those lines - clear it so there is one source of
--     truth. Bespoke lines keep theirs.
UPDATE oc_tsg_quote_item
SET bespoke_data = NULL
WHERE is_bespoke = 0
  AND bespoke_data IS NOT NULL
  AND JSON_VALID(bespoke_data)
  AND JSON_VALUE(bespoke_data, '$.size_name') IS NOT NULL;

-- 2.6 base_unit_price was not recorded before; seed it from the pre-bulk price so repricing
--     has something sensible to work from
UPDATE oc_tsg_quote_item
SET base_unit_price = single_unit_price
WHERE base_unit_price = 0 AND single_unit_price > 0;


-- ---------------------------------------------------------------------------
-- 3. VERIFY
-- ---------------------------------------------------------------------------

SHOW COLUMNS FROM oc_tsg_quote_item;          -- the ten new columns are present
SHOW CREATE TABLE oc_tsg_quote_item_options;  -- new table with both foreign keys

-- the backfilled lines: size/material/orientation now in columns, JSON cleared
SELECT quote_item_id, is_bespoke, LEFT(product_name, 40) AS name,
       size_name, orientation_name, material_name, supplier_code,
       single_unit_price, base_unit_price, bespoke_data
FROM oc_tsg_quote_item
ORDER BY quote_item_id;

-- the bespoke line must still hold its own JSON
SELECT quote_item_id, is_bespoke, bespoke_data
FROM oc_tsg_quote_item WHERE is_bespoke = 1;

SELECT COUNT(*) AS option_rows FROM oc_tsg_quote_item_options;  -- expect 0 locally
