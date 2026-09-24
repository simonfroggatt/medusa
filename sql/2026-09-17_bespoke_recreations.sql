-- Bespoke recreations of stock products (apps/recreate).
--
-- One row per stock product: the AI's attempt to rebuild the product's sign in
-- the bespoke sign designer, and the reviewed version. "Customise me" on the
-- shop will later start from the approved design.
--
--   status          pending | review | needs_symbol | unsuitable | approved | failed
--   recipe          the AI's design (JSON: layout, symbols, panels, lines)
--   design          the reviewed SignDocument saved from the designer (JSON)
--   missing_symbols ISO 7010 refs the AI recognised but the library lacks
--                   (JSON list of {"iso_ref": "W026", "description": "..."})
--
-- LOCAL ONLY for now (2026-09-17). Safe to run twice.


-- ---------------------------------------------------------------------------
-- 1. PREVIEW
-- ---------------------------------------------------------------------------

SHOW TABLES LIKE 'oc_tsg_bespoke_recreations';


-- ---------------------------------------------------------------------------
-- 2. CREATE
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS oc_tsg_bespoke_recreations (
    id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id        INT NOT NULL,
    store_id          INT NOT NULL DEFAULT 0,
    status            VARCHAR(20) NOT NULL DEFAULT 'pending',
    source_image      VARCHAR(255) NULL,
    sign_reads        TEXT NULL,
    size_id           INT NULL,
    recipe            LONGTEXT NULL,
    design            LONGTEXT NULL,
    missing_symbols   TEXT NULL,
    confidence        DECIMAL(3,2) NULL,
    ai_notes          TEXT NULL,
    ai_model          VARCHAR(64) NULL,
    ai_cost_usd       DECIMAL(8,5) NULL,
    error             TEXT NULL,
    attempts          INT NOT NULL DEFAULT 0,
    reviewed_by_id    INT NULL,
    reviewed_at       DATETIME NULL,
    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_recreation_product (product_id),
    KEY idx_recreation_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------------
-- 3. CHECK
-- ---------------------------------------------------------------------------

SHOW COLUMNS FROM oc_tsg_bespoke_recreations;
