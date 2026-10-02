-- The house palette, set once so panels and symbols agree.
--
-- Red and yellow are unchanged in HEX. Blue and green are new. The red RGB
-- column said 237,28,38, which is not #ED1C24 -- the two columns disagreed
-- with each other -- so it is corrected to 237,28,36 here.
--
-- Safe to run twice.

START TRANSACTION;

UPDATE oc_tsg_symbol_category
   SET default_colour_HEX = '#ED1C24', default_colour_RGB = '237,28,36'
 WHERE id = 1;   -- prohibition
UPDATE oc_tsg_symbol_category
   SET default_colour_HEX = '#FFF200', default_colour_RGB = '255,242,0'
 WHERE id = 2;   -- warning
UPDATE oc_tsg_symbol_category
   SET default_colour_HEX = '#006EC7', default_colour_RGB = '0,110,199'
 WHERE id = 3;   -- mandatory
UPDATE oc_tsg_symbol_category
   SET default_colour_HEX = '#00A44F', default_colour_RGB = '0,164,79'
 WHERE id = 4;   -- fire & emergency
UPDATE oc_tsg_symbol_category
   SET default_colour_HEX = '#ED1C24', default_colour_RGB = '237,28,36'
 WHERE id = 5;   -- fire

COMMIT;

SELECT id, title, default_colour_HEX, default_colour_RGB
  FROM oc_tsg_symbol_category WHERE id IN (1,2,3,4,5);
