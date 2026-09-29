-- The fire action notice, as a product template.
--
-- oc_tsg_bespoke_templates is the list the product editor offers and the shop
-- reads to decide which designer a product opens. It had Site Board and Road
-- Sign but no Fire Action, so a stock fire action product could only be set to
-- the standard designer -- which has no step numbers, no plates behind its
-- symbols and no box to write in.
--
-- One template serves every designer kind on the shop side: the row a product
-- points at names the kind, and catalog/controller/product/product.php maps
-- the path to it. So this is a row and a two-line map, not a new template file.
--
-- Also fixes "Road Sigm", which has been in the product editor's dropdown
-- since the road sign designer was added.
--
-- LOCAL FIRST (2026-09-29). Safe to run twice.


SELECT * FROM oc_tsg_bespoke_templates ORDER BY id;

INSERT IGNORE INTO oc_tsg_bespoke_templates (id, title, path)
     VALUES (8, 'Fire Action Notice', 'bespoke/designer_fireaction');

UPDATE oc_tsg_bespoke_templates SET title = 'Road Sign'
 WHERE id = 7 AND title = 'Road Sigm';

SELECT * FROM oc_tsg_bespoke_templates ORDER BY id;
