-- What the material looks like: oc_tsg_product_material.face_hex
--
-- ALREADY RUN (2026-09-21):
--     ALTER TABLE oc_tsg_product_material
--         ADD COLUMN face_hex VARCHAR(7) NULL AFTER colour_desc;
--
-- Left here for the record, and for the values. The second column, which says
-- which design colour the material stands in for, is in
-- 2026-09-21_material_unprinted_colour.sql.


-- Which materials are coloured?
SELECT material_id, material_name, colour_desc, face_hex
  FROM oc_tsg_product_material
 ORDER BY material_id;


-- Set the ones that are not white. Check the ids above first.
-- UPDATE oc_tsg_product_material SET face_hex = '#FFD200' WHERE material_name LIKE '%yellow%reflect%';
-- UPDATE oc_tsg_product_material SET face_hex = '#D9E8A0' WHERE material_name LIKE '%photolum%';

-- White stock (white reflective, vinyl, rigid, foamex) stays NULL: it prints everything.
