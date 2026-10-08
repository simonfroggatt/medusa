-- Wayfinding signs: every size the configurator draws, priced for the four
-- materials they are sold in, and offered on the Custom wayfinding products.
--
-- The wayfinding configurator draws every sign 450mm wide: 150 high for a
-- floor or stair sign, 100/190/280/370 for 1-4 rows of flats, 240/330/420/510
-- for a floor sign with 1-4 rows of flats. Only Basement n and Lower Ground
-- Floor ever needed more than 450, and they are not offered (8 Oct 2026); its
-- code still widens in 50mm steps as a safety net, and a size with no variant
-- shows "Call for price" and cannot be bought online.
--
-- Materials: Self Adhesive Photoluminescent (124), Rigid Photoluminescent (5),
-- Self Adhesive Vinyl Sticker (1, white) and 1mm Rigid (2). Approved Document B
-- 15.14 asks for text readable in low light or by torchlight, not for
-- photoluminescent material, so all four comply.
--
-- Prices are the 450 x 150 price per square metre, read from THIS database
-- when it runs, from the lowest-numbered 450 x 150 size (@base_size: 42 on
-- live, which the wayfinding stock signs use). Live, 26 Sept 2026 copy:
--   Self Adhesive Photoluminescent  8.34  = 123.56/m2
--   Rigid Photoluminescent         10.87  = 161.04/m2
--   Self Adhesive Vinyl (white)     3.94  =  58.37/m2
--   1mm Rigid                       6.31  =  93.48/m2
-- (live's other 450 x 150, size 50, has white 5.39 and 1mm 8.18; not used.)
-- A sign twice the area costs twice as much, before quantity breaks.
--
--   1. sizes the configurator needs that do not exist yet
--   2. a price for all four materials at every one of them (existing prices
--      are left alone: sizes and their prices are shared by every product)
--   3. variants for all four at every size on the Custom wayfinding products:
--      the is_bespoke product on each wayfinding template (Floor X, and the
--      Flats and Floor + flats ones). A Custom product that does not exist yet
--      gets nothing; run this again after creating it.
--   4. any other material switched off on those products (bl_live = 0)
--
-- @max_width: 450 is every sign the configurator draws (9 sizes). Raise it in
-- 50s only if wider signs ever come back.
--
-- Safe to run twice: nothing that exists is inserted again.

SET @max_width = 450;

SET @base_size = (SELECT MIN(s.size_id) FROM oc_tsg_product_sizes s
                   WHERE s.size_width = 450 AND s.size_height = 150 AND s.size_units = 'mm' AND s.archived = 0);
SET @p124 = (SELECT c.price FROM oc_tsg_size_material_comb c WHERE c.product_size_id = @base_size AND c.product_material_id = 124 AND c.price > 0);
SET @p5 = (SELECT c.price FROM oc_tsg_size_material_comb c WHERE c.product_size_id = @base_size AND c.product_material_id = 5 AND c.price > 0);
SET @p1 = (SELECT c.price FROM oc_tsg_size_material_comb c WHERE c.product_size_id = @base_size AND c.product_material_id = 1 AND c.price > 0);
SET @p2 = (SELECT c.price FROM oc_tsg_size_material_comb c WHERE c.product_size_id = @base_size AND c.product_material_id = 2 AND c.price > 0);


-- PREVIEW ----------------------------------------------------------------

-- The base prices. All four must be set, or stop here.
SELECT @base_size AS base_size_id,
       @p124 AS self_adhesive_photo, @p5 AS rigid_photo, @p1 AS white_vinyl, @p2 AS rigid_1mm,
       ROUND(@p124 / 0.0675, 2) AS sa_photo_per_m2, ROUND(@p5 / 0.0675, 2) AS rigid_photo_per_m2,
       ROUND(@p1 / 0.0675, 2) AS white_per_m2, ROUND(@p2 / 0.0675, 2) AS rigid_1mm_per_m2;

-- Every size, whether it exists, and its four prices.
SELECT t.template, CONCAT(t.w, 'mm x ', t.h, 'mm') AS size, (SELECT MIN(s.size_id) FROM oc_tsg_product_sizes s WHERE s.size_width = t.w AND s.size_height = t.h AND s.size_units = 'mm' AND s.archived = 0) AS existing_size_id,
       ROUND(@p124 * t.w * t.h / 67500, 2) AS self_adhesive_photo, ROUND(@p5 * t.w * t.h / 67500, 2) AS rigid_photo,
       ROUND(@p1 * t.w * t.h / 67500, 2) AS white_vinyl, ROUND(@p2 * t.w * t.h / 67500, 2) AS rigid_1mm
  FROM (SELECT ht.template, wd.w, ht.h
           FROM (SELECT 450 AS w UNION ALL SELECT 500 AS w UNION ALL SELECT 550 AS w UNION ALL SELECT 600 AS w UNION ALL SELECT 650 AS w UNION ALL SELECT 700 AS w UNION ALL SELECT 750 AS w UNION ALL SELECT 800 AS w UNION ALL SELECT 850 AS w UNION ALL SELECT 900 AS w UNION ALL SELECT 950 AS w UNION ALL SELECT 1000 AS w) wd
           CROSS JOIN (SELECT 'bespoke/wayfinding_floor' AS template, 150 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 100 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 190 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 280 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 370 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 240 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 330 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 420 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 510 AS h) ht
          WHERE wd.w <= @max_width) t
 ORDER BY t.template, t.h, t.w;

-- The Custom products variants will go on (none listed = create them first).
SELECT p.product_id, p.status, t.path
  FROM oc_product p JOIN oc_tsg_bespoke_templates t ON t.id = p.bespoke_template_id
 WHERE t.path LIKE 'bespoke/wayfinding%' AND p.is_bespoke = 1;


-- EXECUTE ----------------------------------------------------------------

-- 1. Sizes.
INSERT INTO oc_tsg_product_sizes
       (size_name, size_width, size_height, size_units, size_template, size_code,
        symbol_default_location, orientation_id, shipping_width, shipping_height, archived)
SELECT DISTINCT CONCAT(t.w, 'mm x ', t.h, 'mm'), t.w, t.h, 'mm', 0, '',
       0, IF(t.h > t.w, 2, 1), t.w, t.h, 0
  FROM (SELECT ht.template, wd.w, ht.h
           FROM (SELECT 450 AS w UNION ALL SELECT 500 AS w UNION ALL SELECT 550 AS w UNION ALL SELECT 600 AS w UNION ALL SELECT 650 AS w UNION ALL SELECT 700 AS w UNION ALL SELECT 750 AS w UNION ALL SELECT 800 AS w UNION ALL SELECT 850 AS w UNION ALL SELECT 900 AS w UNION ALL SELECT 950 AS w UNION ALL SELECT 1000 AS w) wd
           CROSS JOIN (SELECT 'bespoke/wayfinding_floor' AS template, 150 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 100 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 190 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 280 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 370 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 240 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 330 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 420 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 510 AS h) ht
          WHERE wd.w <= @max_width) t
 WHERE (SELECT MIN(s.size_id) FROM oc_tsg_product_sizes s WHERE s.size_width = t.w AND s.size_height = t.h AND s.size_units = 'mm' AND s.archived = 0) IS NULL;

-- 2. Prices. Where a size already has a price for a material, it is kept.
INSERT INTO oc_tsg_size_material_comb (product_size_id, product_material_id, price, bl_live, weight)
SELECT (SELECT MIN(s.size_id) FROM oc_tsg_product_sizes s WHERE s.size_width = t.w AND s.size_height = t.h AND s.size_units = 'mm' AND s.archived = 0), m.material_id, ROUND((CASE m.material_id WHEN 124 THEN @p124 WHEN 5 THEN @p5 WHEN 1 THEN @p1 WHEN 2 THEN @p2 END) * t.w * t.h / 67500, 2), 1, 0
  FROM (SELECT ht.template, wd.w, ht.h
           FROM (SELECT 450 AS w UNION ALL SELECT 500 AS w UNION ALL SELECT 550 AS w UNION ALL SELECT 600 AS w UNION ALL SELECT 650 AS w UNION ALL SELECT 700 AS w UNION ALL SELECT 750 AS w UNION ALL SELECT 800 AS w UNION ALL SELECT 850 AS w UNION ALL SELECT 900 AS w UNION ALL SELECT 950 AS w UNION ALL SELECT 1000 AS w) wd
           CROSS JOIN (SELECT 'bespoke/wayfinding_floor' AS template, 150 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 100 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 190 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 280 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 370 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 240 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 330 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 420 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 510 AS h) ht
          WHERE wd.w <= @max_width) t
 CROSS JOIN (SELECT 124 AS material_id UNION ALL SELECT 5 UNION ALL SELECT 1 UNION ALL SELECT 2) m
 WHERE @p124 > 0 AND @p5 > 0 AND @p1 > 0 AND @p2 > 0
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_size_material_comb c
                    WHERE c.product_size_id = (SELECT MIN(s.size_id) FROM oc_tsg_product_sizes s WHERE s.size_width = t.w AND s.size_height = t.h AND s.size_units = 'mm' AND s.archived = 0) AND c.product_material_id = m.material_id);

-- 3a. Variants on the Custom wayfinding products, one per size and material.
INSERT INTO oc_tsg_product_variant_core
       (product_id, size_material_id, supplier_id, supplier_code, supplier_price, bl_live, pack_count, order_by)
SELECT p.product_id, c.id, 1, CONCAT('WAYF-', c.product_size_id, CASE c.product_material_id WHEN 124 THEN '-PLSA' WHEN 5 THEN '-PL' WHEN 1 THEN '-SAV' WHEN 2 THEN '-RP' END), 0, 1, 1, 99
  FROM (SELECT ht.template, wd.w, ht.h
           FROM (SELECT 450 AS w UNION ALL SELECT 500 AS w UNION ALL SELECT 550 AS w UNION ALL SELECT 600 AS w UNION ALL SELECT 650 AS w UNION ALL SELECT 700 AS w UNION ALL SELECT 750 AS w UNION ALL SELECT 800 AS w UNION ALL SELECT 850 AS w UNION ALL SELECT 900 AS w UNION ALL SELECT 950 AS w UNION ALL SELECT 1000 AS w) wd
           CROSS JOIN (SELECT 'bespoke/wayfinding_floor' AS template, 150 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 100 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 190 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 280 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 370 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 240 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 330 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 420 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 510 AS h) ht
          WHERE wd.w <= @max_width) t
  JOIN oc_tsg_bespoke_templates bt ON bt.path = t.template
  JOIN oc_product p ON p.bespoke_template_id = bt.id AND p.is_bespoke = 1
  JOIN oc_tsg_size_material_comb c ON c.product_size_id = (SELECT MIN(s.size_id) FROM oc_tsg_product_sizes s WHERE s.size_width = t.w AND s.size_height = t.h AND s.size_units = 'mm' AND s.archived = 0) AND c.product_material_id IN (124, 5, 1, 2)
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_product_variant_core vc
                    WHERE vc.product_id = p.product_id AND vc.size_material_id = c.id);

-- 3b. ...offered on Safety Signs & Notices (store 1). No price override: the
-- size's price above is the price. Kept out of Google Shopping: a sign that is
-- sized by its wording is not a product with a fixed size to advertise.
INSERT INTO oc_tsg_product_variants
       (prod_var_core_id, variant_code, variant_overide_price, store_id, isdeleted, orderby, exclude_google_ads, show_google_ads)
SELECT vc.prod_variant_core_id, vc.supplier_code, 0.00, 1, 0, 99, 1, 0
  FROM oc_tsg_product_variant_core vc
  JOIN oc_product p ON p.product_id = vc.product_id AND p.is_bespoke = 1
  JOIN oc_tsg_bespoke_templates bt ON bt.id = p.bespoke_template_id AND bt.path LIKE 'bespoke/wayfinding%'
  JOIN oc_tsg_size_material_comb c ON c.id = vc.size_material_id AND c.product_material_id IN (124, 5, 1, 2)
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_product_variants pv
                    WHERE pv.prod_var_core_id = vc.prod_variant_core_id AND pv.store_id = 1);

-- 4. Only these four materials on the Custom wayfinding products: anything
-- else is switched off (bl_live = 0), not deleted.
UPDATE oc_tsg_product_variant_core vc
  JOIN oc_product p ON p.product_id = vc.product_id AND p.is_bespoke = 1
  JOIN oc_tsg_bespoke_templates bt ON bt.id = p.bespoke_template_id AND bt.path LIKE 'bespoke/wayfinding%'
  JOIN oc_tsg_size_material_comb c ON c.id = vc.size_material_id
   SET vc.bl_live = 0
 WHERE c.product_material_id NOT IN (124, 5, 1, 2) AND vc.bl_live = 1;


-- VERIFY -----------------------------------------------------------------

-- Every size has all four prices: expect no rows.
SELECT t.template, CONCAT(t.w, 'mm x ', t.h, 'mm') AS missing_price_for, m.material_id
  FROM (SELECT ht.template, wd.w, ht.h
           FROM (SELECT 450 AS w UNION ALL SELECT 500 AS w UNION ALL SELECT 550 AS w UNION ALL SELECT 600 AS w UNION ALL SELECT 650 AS w UNION ALL SELECT 700 AS w UNION ALL SELECT 750 AS w UNION ALL SELECT 800 AS w UNION ALL SELECT 850 AS w UNION ALL SELECT 900 AS w UNION ALL SELECT 950 AS w UNION ALL SELECT 1000 AS w) wd
           CROSS JOIN (SELECT 'bespoke/wayfinding_floor' AS template, 150 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 100 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 190 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 280 AS h
              UNION ALL SELECT 'bespoke/wayfinding_flats' AS template, 370 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 240 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 330 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 420 AS h
              UNION ALL SELECT 'bespoke/wayfinding_combined' AS template, 510 AS h) ht
          WHERE wd.w <= @max_width) t
 CROSS JOIN (SELECT 124 AS material_id UNION ALL SELECT 5 UNION ALL SELECT 1 UNION ALL SELECT 2) m
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_size_material_comb c
                    WHERE c.product_size_id = (SELECT MIN(s.size_id) FROM oc_tsg_product_sizes s WHERE s.size_width = t.w AND s.size_height = t.h AND s.size_units = 'mm' AND s.archived = 0) AND c.product_material_id = m.material_id AND c.price > 0);

-- What each Custom product now sells, live in store 1: expect 4 per size
-- (4 for Floor X, 16 for Flats and 16 for Floor + flats at @max_width = 450).
SELECT p.product_id, bt.path, COUNT(*) AS live_variants, MIN(c.price) AS cheapest, MAX(c.price) AS dearest
  FROM oc_product p
  JOIN oc_tsg_bespoke_templates bt ON bt.id = p.bespoke_template_id AND bt.path LIKE 'bespoke/wayfinding%'
  JOIN oc_tsg_product_variant_core vc ON vc.product_id = p.product_id AND vc.bl_live = 1
  JOIN oc_tsg_product_variants pv ON pv.prod_var_core_id = vc.prod_variant_core_id AND pv.store_id = 1 AND pv.isdeleted = 0
  JOIN oc_tsg_size_material_comb c ON c.id = vc.size_material_id
 WHERE p.is_bespoke = 1
 GROUP BY p.product_id, bt.path;
