-- Wayfinding signs, as product templates.
--
-- The wayfinding configurator (Approved Document B 15.13-15.16 floor, flat and
-- floor+flats signs) is its own PHP code inside the shop, not a kind of the
-- sign designer. A product opens it by pointing bespoke_template_id at one of
-- these rows; catalog/controller/product/product.php maps the path to the
-- configurator and to which signs that product offers:
--
--   bespoke/wayfinding_floor     floor or stair sign, or a whole building
--   bespoke/wayfinding_flats     flat sign on its own
--   bespoke/wayfinding_combined  floor sign with the flats built in
--
-- The paths deliberately do not start with 'bespoke/designer': the shop and
-- Medusa treat that prefix as "opens the sign designer", which these do not.
--
-- Rows are matched by path, not id, so this is safe whatever ids the live
-- table has reached. After running, set each new wayfinding product's
-- template in the product editor.
--
-- LOCAL FIRST (2026-10-05). Safe to run twice.


-- PREVIEW
SELECT * FROM oc_tsg_bespoke_templates ORDER BY id;


-- EXECUTE
INSERT INTO oc_tsg_bespoke_templates (title, path)
SELECT 'Wayfinding - Floor', 'bespoke/wayfinding_floor'
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_bespoke_templates WHERE path = 'bespoke/wayfinding_floor');

INSERT INTO oc_tsg_bespoke_templates (title, path)
SELECT 'Wayfinding - Flats', 'bespoke/wayfinding_flats'
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_bespoke_templates WHERE path = 'bespoke/wayfinding_flats');

INSERT INTO oc_tsg_bespoke_templates (title, path)
SELECT 'Wayfinding - Floor + Flats', 'bespoke/wayfinding_combined'
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_bespoke_templates WHERE path = 'bespoke/wayfinding_combined');


-- VERIFY: three rows, one per path
SELECT * FROM oc_tsg_bespoke_templates WHERE path LIKE 'bespoke/wayfinding%' ORDER BY id;
