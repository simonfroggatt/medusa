-- Standard rows for the site safety board (Admin Tools -> Sign Designer).
--
-- The board designer's picker is built from these: a row is a group, a label,
-- a colour, its wording and its symbols. A board is an ordered list of rows,
-- one or two to a line. `code` is what a saved design refers to, so rows are
-- retired with status rather than deleted.
--
-- Seeded with the 36 rows and 3 boards the designer had built in.
-- LOCAL FIRST (2026-09-21). Safe to run twice.


-- ---------------------------------------------------------------------------
-- 1. PREVIEW
-- ---------------------------------------------------------------------------

SHOW TABLES LIKE 'oc_tsg_bespoke_row%';
SHOW TABLES LIKE 'oc_tsg_bespoke_board%';


-- ---------------------------------------------------------------------------
-- 2. CREATE
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS oc_tsg_bespoke_row_group (
    group_id     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title        VARCHAR(64) NOT NULL,
    sort_order   INT NOT NULL DEFAULT 0,
    status       TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (group_id),
    UNIQUE KEY uk_row_group_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS oc_tsg_bespoke_row (
    row_id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    group_id     INT UNSIGNED NOT NULL,
    code         VARCHAR(64) NOT NULL,
    label        VARCHAR(128) NOT NULL,
    colour       VARCHAR(32) NULL,          -- category key, 'plain', or NULL to follow the symbol
    cells        TINYINT NOT NULL DEFAULT 1,
    weight       DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    sort_order   INT NOT NULL DEFAULT 0,
    status       TINYINT(1) NOT NULL DEFAULT 1,
    date_added   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (row_id),
    UNIQUE KEY uk_row_code (code),
    KEY idx_row_group (group_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS oc_tsg_bespoke_row_line (
    line_id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    row_id       INT UNSIGNED NOT NULL,
    sort_order   INT NOT NULL DEFAULT 0,
    text         VARCHAR(255) NOT NULL,
    style        VARCHAR(16) NOT NULL DEFAULT 'body',   -- title | body | footer
    caps         TINYINT(1) NOT NULL DEFAULT 0,
    bold         TINYINT(1) NOT NULL DEFAULT 1,
    min_height   DECIMAL(5,2) NULL,                     -- mm; small print may shrink further
    PRIMARY KEY (line_id),
    KEY idx_row_line (row_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS oc_tsg_bespoke_row_symbol (
    id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    row_id       INT UNSIGNED NOT NULL,
    symbol_id    INT NOT NULL,
    sort_order   INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_row_symbol (row_id, symbol_id),
    KEY idx_row_symbol_symbol (symbol_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS oc_tsg_bespoke_board (
    board_id     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    code         VARCHAR(64) NOT NULL,
    title        VARCHAR(128) NOT NULL,
    hint         VARCHAR(255) NULL,
    sort_order   INT NOT NULL DEFAULT 0,
    status       TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (board_id),
    UNIQUE KEY uk_board_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS oc_tsg_bespoke_board_row (
    id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
    board_id      INT UNSIGNED NOT NULL,
    sort_order    INT NOT NULL DEFAULT 0,
    cells         TINYINT NOT NULL DEFAULT 1,
    weight        DECIMAL(3,2) NULL,        -- overrides the row's own height
    row_id_left   INT UNSIGNED NOT NULL,
    row_id_right  INT UNSIGNED NULL,
    PRIMARY KEY (id),
    KEY idx_board_row (board_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------------
-- 3. SEED — the rows the designer had built in
-- ---------------------------------------------------------------------------

INSERT IGNORE INTO oc_tsg_bespoke_row_group (group_id, title, sort_order) VALUES (1, 'Headers', 10);
INSERT IGNORE INTO oc_tsg_bespoke_row_group (group_id, title, sort_order) VALUES (2, 'Site rules', 20);
INSERT IGNORE INTO oc_tsg_bespoke_row_group (group_id, title, sort_order) VALUES (3, 'PPE', 30);
INSERT IGNORE INTO oc_tsg_bespoke_row_group (group_id, title, sort_order) VALUES (4, 'Warnings', 40);
INSERT IGNORE INTO oc_tsg_bespoke_row_group (group_id, title, sort_order) VALUES (5, 'Prohibitions', 50);
INSERT IGNORE INTO oc_tsg_bespoke_row_group (group_id, title, sort_order) VALUES (6, 'Wording only', 60);

INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (1, 1, 'header-site-safety', 'SITE SAFETY header', 'fire_emergency', 1, 0.7, 10);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (1, 10, 'Site safety', 'title', 1, 1, NULL);
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (2, 1, 'header-danger', 'DANGER header', 'fire', 1, 0.7, 20);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (2, 10, 'Danger', 'title', 1, 1, NULL);
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (3, 1, 'header-warning', 'WARNING header', 'warning', 1, 0.7, 30);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (3, 10, 'Warning', 'title', 1, 1, NULL);
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (4, 1, 'header-construction', 'CONSTRUCTION SITE header', 'fire_emergency', 1, 0.7, 40);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (4, 10, 'Construction site', 'title', 1, 1, NULL);
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (5, 6, 'rules-hasawa', 'Health and Safety at Work Act notice', 'plain', 1, 1.2, 50);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (5, 10, 'Under the Health and Safety at Work Act 1974, all persons entering this site must comply with all regulations under this act. All visitors must report to the site office and obtain permission to proceed onto the site or any other work area. Safety signs and procedures must be observed and personal protection and safety equipment must be used at all times.', 'footer', 0, 1, 3);
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (6, 6, 'rules-parents', 'Construction work in progress (parents)', 'warning', 1, 1, 60);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (6, 10, 'Construction work in progress. Parents are advised to warn children of the dangers of entering this site', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 6, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'W001' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (7, 2, 'rules-report', 'All visitors report to site office', 'mandatory', 1, 1, 70);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (7, 10, 'All visitors and drivers must report to the site office', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 7, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M001' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (8, 2, 'rules-accidents', 'Report all accidents immediately', 'mandatory', 1, 1, 80);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (8, 10, 'Report all accidents immediately', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 8, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M001' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (9, 2, 'rules-permission', 'No entry without permission', 'mandatory', 1, 1, 90);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (9, 10, 'No entry to this site without permission', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 9, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M001' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (10, 2, 'rules-obey', 'Obey all safety signs', 'mandatory', 1, 1, 100);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (10, 10, 'Obey all safety signs and site rules', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 10, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M001' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (11, 3, 'ppe-helmet', 'Safety helmets must be worn', 'mandatory', 1, 1, 110);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (11, 10, 'Safety helmets must be worn', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 11, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M014' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (12, 3, 'ppe-hivis', 'High visibility jackets must be worn', 'mandatory', 1, 1, 120);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (12, 10, 'High visibility jackets must be worn', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 12, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M015' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (13, 3, 'ppe-boots', 'Protective footwear must be worn', 'mandatory', 1, 1, 130);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (13, 10, 'Protective footwear must be worn', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 13, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M008' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (14, 3, 'ppe-eyes', 'Eye protection must be worn', 'mandatory', 1, 1, 140);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (14, 10, 'Eye protection must be worn', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 14, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M004' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (15, 3, 'ppe-ears', 'Ear protection must be worn', 'mandatory', 1, 1, 150);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (15, 10, 'Ear protection must be worn', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 15, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M003' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (16, 3, 'ppe-gloves', 'Protective gloves must be worn', 'mandatory', 1, 1, 160);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (16, 10, 'Protective gloves must be worn', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 16, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M009' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (17, 3, 'ppe-harness', 'Safety harness must be worn', 'mandatory', 1, 1, 170);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (17, 10, 'Safety harness must be worn', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 17, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M018' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (18, 3, 'ppe-mask', 'Respiratory protection must be worn', 'mandatory', 1, 1, 180);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (18, 10, 'Respiratory protection must be worn', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 18, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M017' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (19, 3, 'ppe-clothing', 'Protective clothing must be worn', 'mandatory', 1, 1, 190);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (19, 10, 'Protective clothing must be worn', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 19, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M010' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (20, 4, 'warn-danger-work', 'Dangerous work in operation', 'warning', 1, 1, 200);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (20, 10, 'Warning', 'title', 1, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (20, 20, 'Dangerous work in operation', 'body', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 20, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'W001' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (21, 4, 'warn-excavations', 'Danger — deep excavations', 'warning', 1, 1, 210);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (21, 10, 'Danger', 'title', 1, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (21, 20, 'Deep excavations', 'body', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 21, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'W001' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (22, 4, 'warn-trucks', 'Danger — beware of trucks', 'warning', 1, 1, 220);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (22, 10, 'Danger', 'title', 1, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (22, 20, 'Beware of trucks', 'body', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 22, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'W014' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (23, 4, 'warn-overhead', 'Warning — overhead loads', 'warning', 1, 1, 230);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (23, 10, 'Warning: overhead loads', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 23, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'W015' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (24, 4, 'warn-falling', 'Warning — falling objects', 'warning', 1, 1, 240);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (24, 10, 'Warning: falling objects', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 24, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'W035' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (25, 4, 'warn-electricity', 'Warning — electricity', 'warning', 1, 1, 250);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (25, 10, 'Warning: electricity', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 25, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'W012' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (26, 4, 'warn-drop', 'Warning — drop (fall)', 'warning', 1, 1, 260);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (26, 10, 'Warning: risk of falling', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 26, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'W008' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (27, 4, 'warn-scaffold', 'Warning — incomplete scaffolding', 'warning', 1, 1, 270);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (27, 10, 'Incomplete scaffolding must not be used', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 27, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'W001' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (28, 5, 'no-unauthorised', 'No unauthorised access', 'prohibition', 1, 1, 280);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (28, 10, 'No unauthorised access', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 28, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'P080' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (29, 5, 'no-entry-strict', 'Unauthorised entry strictly forbidden', 'prohibition', 1, 1, 290);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (29, 10, 'Unauthorised entry to this site is strictly forbidden', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 29, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'P080' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (30, 5, 'no-children', 'Children must not play on this site', 'prohibition', 1, 1, 300);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (30, 10, 'Children must not play on this site', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 30, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'P036' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (31, 5, 'no-smoking', 'No smoking', 'prohibition', 1, 1, 310);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (31, 10, 'No smoking on this site', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 31, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'P002' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (32, 5, 'no-flame', 'No naked flames', 'prohibition', 1, 1, 320);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (32, 10, 'No naked flames', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 32, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'P003' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (33, 5, 'no-forklift', 'No access for forklift trucks', 'prohibition', 1, 1, 330);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (33, 10, 'No access for forklift trucks', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 33, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'P006' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (34, 5, 'no-dogs', 'No dogs', 'prohibition', 1, 1, 340);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (34, 10, 'No dogs on this site', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 34, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'P021' AND ss.status = 1 LIMIT 1;
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (35, 6, 'text-contact', 'Site contact details', 'plain', 1, 0.7, 350);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (35, 10, 'Site manager: 00000 000000', 'title', 0, 1, NULL);
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, sort_order) VALUES (36, 6, 'text-blank', 'Blank row (your own wording)', 'plain', 1, 1, 360);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (row_id, sort_order, text, style, caps, bold, min_height) VALUES (36, 10, 'Your text here', 'title', 0, 1, NULL);

INSERT IGNORE INTO oc_tsg_bespoke_board (board_id, code, title, hint, sort_order) VALUES (1, 'site-safety', 'Site safety', 'Header, the Act notice, then the usual site rules', 10);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (1, 10, 1, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (1, 20, 1, 5, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (1, 30, 1, 6, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (1, 40, 2, 11, 12);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (1, 50, 2, 13, 28);
INSERT IGNORE INTO oc_tsg_bespoke_board (board_id, code, title, hint, sort_order) VALUES (2, 'construction', 'Construction site', 'Warning header with PPE and access rules', 20);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (2, 10, 1, 4, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (2, 20, 1, 20, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (2, 30, 2, 28, 30);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (2, 40, 2, 11, 12);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (2, 50, 2, 13, 22);
INSERT IGNORE INTO oc_tsg_bespoke_board (board_id, code, title, hint, sort_order) VALUES (3, 'visitors', 'Visitors and deliveries', 'Reporting in, speed and site rules', 30);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (3, 10, 1, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (3, 20, 1, 5, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (3, 30, 2, 7, 8);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (3, 40, 2, 12, 22);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (board_id, sort_order, cells, row_id_left, row_id_right) VALUES (3, 50, 2, 30, 28);


-- ---------------------------------------------------------------------------
-- 4. CHECK
-- ---------------------------------------------------------------------------

SELECT g.title AS `group`, COUNT(*) AS rows_in_group
  FROM oc_tsg_bespoke_row r JOIN oc_tsg_bespoke_row_group g USING (group_id)
 GROUP BY g.title ORDER BY MIN(g.sort_order);
SELECT b.title, COUNT(*) AS rows_on_board FROM oc_tsg_bespoke_board b
  JOIN oc_tsg_bespoke_board_row br USING (board_id) GROUP BY b.title;
SELECT r.code, COUNT(l.line_id) AS lines, COUNT(DISTINCT s.symbol_id) AS symbols
  FROM oc_tsg_bespoke_row r
  LEFT JOIN oc_tsg_bespoke_row_line l USING (row_id)
  LEFT JOIN oc_tsg_bespoke_row_symbol s USING (row_id)
 GROUP BY r.code HAVING symbols = 0 AND r.colour IS NULL;   -- should be empty
