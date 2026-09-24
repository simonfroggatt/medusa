-- The order keeps the sign as it looks, not only as it prints.
--
-- svg_export is the print file: the material's own colour is left out of it,
-- because the press is printing onto that colour. That is right for the PDF
-- and wrong for a picklist, where a yellow reflective sign would appear with
-- no yellow and a photoluminescent one with no green.
--
-- The cart already carries svg_raw. This gives the order somewhere to put it.
--
-- LOCAL FIRST (2026-09-22).

ALTER TABLE oc_tsg_order_bespoke_image
    ADD COLUMN svg_raw MEDIUMTEXT NULL
    COMMENT 'The sign as it looks, colours and all. svg_export is the print file.'
    AFTER svg_json;

-- Old lines have none, and fall back to svg_export as before.
SELECT version, COUNT(*) AS lines_, SUM(svg_raw IS NOT NULL) AS with_raw
  FROM oc_tsg_order_bespoke_image
 GROUP BY version;
