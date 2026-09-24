-- Point products at the new sign designer.
--
-- oc_tsg_bespoke_templates is just (id, title, path). A product picks one by id
-- through product.template_id, or product.bespoke_template_id for the bespoke
-- route (catalog/model/catalog/product.php: getProductTemplate and
-- getProductBespokeTemplatePath). The product carries nothing else, so each
-- kind of designer needs its own row — that row IS how the page knows whether
-- it is drawing a standard sign, a board, a road sign or a two-language sign.
--
-- The three specific twigs are three lines each: they set designer_kind and
-- include bespoke/designer.twig, which does the work.


-- ---------------------------------------------------------------------------
-- 1. WHAT IS THERE NOW
--    Check how existing paths are written: 'bespoke/single_panel' with no
--    .twig is what the code expects. If yours differ, match them.
-- ---------------------------------------------------------------------------

SELECT id, title, path FROM oc_tsg_bespoke_templates ORDER BY id;


-- ---------------------------------------------------------------------------
-- 2. ADD THE FOUR
-- ---------------------------------------------------------------------------

INSERT INTO oc_tsg_bespoke_templates (title, path) VALUES
    ('Sign designer',                 'bespoke/designer'),
    ('Sign designer - site board',    'bespoke/designer_board'),
    ('Sign designer - road sign',     'bespoke/designer_roadsign'),
    ('Sign designer - two languages', 'bespoke/designer_bilingual');

SELECT id, title, path FROM oc_tsg_bespoke_templates WHERE path LIKE 'bespoke/designer%' ORDER BY id;


-- ---------------------------------------------------------------------------
-- 3. PUT ONE PRODUCT ON IT
--    Note the id from above, then point the test product at it. Use
--    bespoke_template_id if the product is reached by the makebespoke route.
-- ---------------------------------------------------------------------------

-- SET @designer = (SELECT id FROM oc_tsg_bespoke_templates WHERE path = 'bespoke/designer');
-- UPDATE oc_product SET bespoke_template_id = @designer WHERE product_id = <your test product>;

-- To put it back:
-- UPDATE oc_product SET bespoke_template_id = <the old id> WHERE product_id = <your test product>;
