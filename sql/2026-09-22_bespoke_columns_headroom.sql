-- Room for a whole sign.
--
-- The columns were sized for the old drawer. The designer stores more, and one
-- of them already overflows:
--
--   oc_cart.svg_images is VARCHAR(64). It now holds a JSON list of ISO codes,
--   and a site board uses a dozen: ["E001","P002","W012","M003","P003","W025"]
--   is 47 characters before you reach the seventh. Past 64 MySQL truncates it,
--   which leaves JSON that will not parse, so the order records no symbols at
--   all. The order's own column is VARCHAR(255) and has more room, but not much.
--
--   svg_json is TEXT, which stops at 65,535 bytes. A simple sign measures about
--   11 KB today, and it is stored twice encoded, so every quote costs two
--   characters. A full site board with eight rows will get close. Truncation
--   there loses the design silently: the line still has its print file, but
--   nothing can reopen it.
--
-- None of this changes what is stored, only how much of it fits.
--
-- LOCAL FIRST (2026-09-22).


-- What is in there now, against the limits.
SELECT MAX(LENGTH(svg_json))  AS json_max,
       MAX(LENGTH(svg_raw))   AS raw_max,
       MAX(LENGTH(svg_images)) AS images_max
  FROM oc_cart;

SELECT MAX(LENGTH(svg_json))  AS json_max,
       MAX(LENGTH(svg_raw))   AS raw_max,
       MAX(LENGTH(svg_images)) AS images_max
  FROM oc_tsg_order_bespoke_image;


-- The cart.
ALTER TABLE oc_cart
    MODIFY svg_images VARCHAR(255) NULL,
    MODIFY svg_json   MEDIUMTEXT   NULL,
    MODIFY svg_raw    MEDIUMBLOB   NULL,
    MODIFY svg_export MEDIUMBLOB   NULL,
    MODIFY svg_texts  MEDIUMTEXT   NULL;

-- The order.
ALTER TABLE oc_tsg_order_bespoke_image
    MODIFY svg_images VARCHAR(255) NULL,
    MODIFY svg_json   MEDIUMTEXT   NULL,
    MODIFY svg_export MEDIUMBLOB   NULL,
    MODIFY svg_texts  MEDIUMTEXT   NULL;
-- svg_raw is already MEDIUMTEXT.


-- And afterwards.
SHOW COLUMNS FROM oc_cart LIKE 'svg%';
SHOW COLUMNS FROM oc_tsg_order_bespoke_image LIKE 'svg%';
