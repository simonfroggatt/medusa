-- Signs drawn in Medusa that belong to nobody yet.
--
-- Every design so far hangs off something: a product (a recreation), a basket
-- line, an order line. There is nowhere to just draw a sign -- to work one up
-- for a customer who rang, to try a layout, to make artwork for a quote -- and
-- keep it. This is that drawer.
--
-- Shaped with the "send it for approval" idea in mind, so that feature can add
-- a recipient and a token to these rows rather than starting a second table of
-- designs. Hence the nullable order_product_id: a design may be free-standing,
-- or it may be the sign on an order line someone is redrawing.
--
-- LOCAL FIRST (2026-09-24).

CREATE TABLE IF NOT EXISTS oc_tsg_bespoke_designs (
    design_id        INT(11)      NOT NULL AUTO_INCREMENT,
    name             VARCHAR(160) NOT NULL DEFAULT '',
    -- Which designer drew it: standard, board, roadsign, bilingual. The same
    -- words the shop's templates use, so a design reopens as what it is.
    kind             VARCHAR(20)  NOT NULL DEFAULT 'standard',
    design           MEDIUMTEXT   NULL COMMENT 'The sign document, as JSON',
    svg_raw          MEDIUMTEXT   NULL COMMENT 'As it looks, colours and all',
    svg_export       MEDIUMBLOB   NULL COMMENT 'The print file: no material colour',
    width            DECIMAL(10,2) NULL,
    height           DECIMAL(10,2) NULL,
    order_product_id INT(11)      NULL COMMENT 'Set when the design is an order line being redrawn',
    created_by_id    INT(11)      NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (design_id),
    KEY idx_designs_updated (updated_at),
    KEY idx_designs_order_product (order_product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT COUNT(*) AS designs FROM oc_tsg_bespoke_designs;
