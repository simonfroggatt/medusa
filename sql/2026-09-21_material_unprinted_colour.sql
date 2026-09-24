-- Which colour the material supplies, and so must be left out of the print file.
--
-- face_hex says what the material looks like. That is not the same question as
-- what to leave unprinted, and the two coloured stocks differ:
--
--   yellow reflective    the stock IS the sign's yellow. Leave the yellow out
--                        of the artwork; everything else prints.
--   photoluminescent     the stock is pale green and shows through wherever the
--                        design is WHITE. So it is white that is left out, not
--                        the stock's own colour.
--
-- So: unprinted_hex is the colour in the DESIGN that this material provides.
-- NULL means "same as face_hex", which is the yellow reflective case, so only
-- photoluminescent actually needs a value.
--
-- White stock leaves both NULL and prints everything, as now.
--
-- LOCAL FIRST (2026-09-21).


-- ---------------------------------------------------------------------------
-- 1. ADD THE COLUMN
-- ---------------------------------------------------------------------------

ALTER TABLE oc_tsg_product_material
    ADD COLUMN unprinted_hex VARCHAR(7) NULL
    COMMENT 'Design colour this material supplies, so it is not printed. NULL = same as face_hex.'
    AFTER face_hex;


-- ---------------------------------------------------------------------------
-- 2. SET THE VALUES
--    Check the material ids first; the LIKEs are a starting point, not gospel.
-- ---------------------------------------------------------------------------

-- Photoluminescent: pale green stock standing in for the design's white.
-- UPDATE oc_tsg_product_material
--    SET face_hex = '#D9E8A0', unprinted_hex = '#FFFFFF'
--  WHERE material_name LIKE '%photolum%';

-- Yellow reflective: stock is the sign's own yellow, so NULL is right.
-- UPDATE oc_tsg_product_material
--    SET face_hex = '#FFD200', unprinted_hex = NULL
--  WHERE material_name LIKE '%yellow%reflect%';


-- ---------------------------------------------------------------------------
-- 3. CHECK
-- ---------------------------------------------------------------------------

SELECT material_id, material_name, face_hex, unprinted_hex,
       CASE
           WHEN face_hex IS NULL THEN 'white stock: prints everything'
           WHEN unprinted_hex IS NULL THEN CONCAT('stock is ', face_hex, '; that colour is not printed')
           ELSE CONCAT('stock looks ', face_hex, '; ', unprinted_hex, ' in the design is not printed')
       END AS behaviour
  FROM oc_tsg_product_material
 ORDER BY (face_hex IS NULL), material_id;
