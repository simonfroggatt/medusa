-- Standard rows for the fire action notice (Admin Tools -> Sign Designer).
--
-- A notice is a board: a stack of bands, each a symbol beside a message. So it
-- lives in the tables 2026-09-28_bespoke_board_rows.sql already built, with
-- three additions rather than a second set of tables:
--
--   row_group.kind        which picker a heading belongs to. A board offers
--                         Headers / Site rules / PPE / Warnings / Prohibitions;
--                         a notice offers Header / Raise the alarm / Leave /
--                         Assemble / Do not.
--   row.is_step           the band is a numbered step. The NUMBER is not stored
--                         anywhere: it comes from where the band sits, so
--                         moving one renumbers the rest and a notice can never
--                         read 1, 2, 4.
--   row.has_write_on      the band wants a white box to write in -- the
--                         assembly point, the fire brigade's number. Empty it
--                         is somewhere to put a pen; typed in, it is the same
--                         box printed.
--   board.kind/width/     a notice template carries the size it is drawn at,
--       height/numbered   and says whether its steps are numbered at all. The
--                         printed 5PFAN does not number its steps.
--
-- Two of the rows below test the edges of the shape, and both fit: 'fa-symbol'
-- is a symbol with no wording (no row_line records), 'fa-title' is wording with
-- no symbol (no row_symbol records).
--
-- What is NOT here, deliberately: how tall a band stands. A notice forces every
-- band that has a symbol beside wording to the same height, because the plate
-- behind the symbol is a square cut from that height -- one odd weight and the
-- symbols stop lining up down the left of the sign. The weight column is still
-- read for the bands that have no symbol, or no wording. That rule belongs in
-- the designer, not in a table someone can edit.
--
-- Seeded with the 15 rows and 4 notices the designer had built in.
-- LOCAL FIRST (2026-09-28). Safe to run twice.


-- ---------------------------------------------------------------------------
-- 1. PREVIEW
-- ---------------------------------------------------------------------------

SHOW COLUMNS FROM oc_tsg_bespoke_row_group LIKE 'kind';
SHOW COLUMNS FROM oc_tsg_bespoke_row LIKE '%_step';
SHOW COLUMNS FROM oc_tsg_bespoke_board LIKE 'kind';
SELECT COUNT(*) AS rows_now FROM oc_tsg_bespoke_row;


-- ---------------------------------------------------------------------------
-- 2. ALTER
-- ---------------------------------------------------------------------------

ALTER TABLE oc_tsg_bespoke_row_group
    ADD COLUMN IF NOT EXISTS kind VARCHAR(16) NOT NULL DEFAULT 'board' AFTER group_id;

-- A heading only has to be unique within its own picker: a board may want
-- "Warnings" and a notice its own "Warnings" without one blocking the other.
ALTER TABLE oc_tsg_bespoke_row_group DROP INDEX IF EXISTS uk_row_group_title;
ALTER TABLE oc_tsg_bespoke_row_group
    ADD UNIQUE KEY IF NOT EXISTS uk_row_group_kind_title (kind, title);

ALTER TABLE oc_tsg_bespoke_row
    ADD COLUMN IF NOT EXISTS is_step      TINYINT(1) NOT NULL DEFAULT 0 AFTER weight,
    ADD COLUMN IF NOT EXISTS has_write_on TINYINT(1) NOT NULL DEFAULT 0 AFTER is_step;

ALTER TABLE oc_tsg_bespoke_board
    ADD COLUMN IF NOT EXISTS kind     VARCHAR(16)    NOT NULL DEFAULT 'board' AFTER board_id,
    ADD COLUMN IF NOT EXISTS width    DECIMAL(10,2)  NULL AFTER hint,
    ADD COLUMN IF NOT EXISTS height   DECIMAL(10,2)  NULL AFTER width,
    ADD COLUMN IF NOT EXISTS numbered TINYINT(1)     NOT NULL DEFAULT 1 AFTER height;

-- Everything seeded before today is a board.
UPDATE oc_tsg_bespoke_row_group SET kind = 'board' WHERE kind = '' OR kind IS NULL;
UPDATE oc_tsg_bespoke_board      SET kind = 'board' WHERE kind = '' OR kind IS NULL;


-- ---------------------------------------------------------------------------
-- 3. SEED — the rows the notice designer had built in
-- ---------------------------------------------------------------------------

INSERT IGNORE INTO oc_tsg_bespoke_row_group (group_id, kind, title, sort_order) VALUES ( 7, 'fireaction', 'Header', 10);
INSERT IGNORE INTO oc_tsg_bespoke_row_group (group_id, kind, title, sort_order) VALUES ( 8, 'fireaction', 'Raise the alarm', 20);
INSERT IGNORE INTO oc_tsg_bespoke_row_group (group_id, kind, title, sort_order) VALUES ( 9, 'fireaction', 'Leave', 30);
INSERT IGNORE INTO oc_tsg_bespoke_row_group (group_id, kind, title, sort_order) VALUES (10, 'fireaction', 'Assemble', 40);
INSERT IGNORE INTO oc_tsg_bespoke_row_group (group_id, kind, title, sort_order) VALUES (11, 'fireaction', 'Do not', 50);

-- Row ids start at 101 so the board's 36 have room to grow.

-- Header ---------------------------------------------------------------------
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (101, 7, 'fa-header', 'Fire action header', 'mandatory', 1, 1.15, 0, 0, 10);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (101, 101, 10, 'Fire action', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (102, 101, 20, 'If you discover or suspect a fire', 'body', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 101, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M001' AND ss.status = 1 LIMIT 1;

INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (102, 7, 'fa-header-plain', 'Fire action (no strapline)', 'mandatory', 1, 1.00, 0, 0, 20);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (103, 102, 10, 'Fire action', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 102, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M001' AND ss.status = 1 LIMIT 1;

-- No symbol: on a 5PFAN the circle is its own band above this one, so the title
-- runs the full width of the sign.
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (103, 7, 'fa-title', 'Fire action (title only)', 'mandatory', 1, 1.50, 0, 0, 30);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (104, 103, 10, 'Fire action', 'title', 0, 1, NULL);

-- No wording: the symbol stands alone, centred on the face with no plate.
-- 45 mm against a 31.8 mm step band on the printed 5PFAN.
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (104, 7, 'fa-symbol', 'Symbol on its own', NULL, 1, 1.40, 0, 0, 40);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 104, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'M001' AND ss.status = 1 LIMIT 1;

-- Raise the alarm ------------------------------------------------------------
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (105, 8, 'fa-alarm', 'Raise the alarm', 'fire', 1, 0.90, 1, 0, 10);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (105, 105, 10, 'Raise the alarm', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 105, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'F001' AND ss.status = 1 LIMIT 1;

INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (106, 8, 'fa-alarm-callpoint', 'Sound the alarm at the call point', 'fire', 1, 1.00, 1, 0, 20);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (106, 106, 10, 'Sound the alarm by operating the nearest fire alarm call point', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 106, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'F005' AND ss.status = 1 LIMIT 1;

INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (107, 8, 'fa-dial', 'Dial … to call the fire brigade', 'fire', 1, 1.00, 1, 1, 30);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (107, 107, 10, 'Call the fire brigade on', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 107, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'F006' AND ss.status = 1 LIMIT 1;

-- Leave ----------------------------------------------------------------------
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (108, 9, 'fa-leave', 'Leave by the nearest exit', 'fire_emergency', 1, 1.00, 1, 0, 10);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (108, 108, 10, 'Leave the building by the nearest available exit', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 108, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'E001' AND ss.status = 1 LIMIT 1;

INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (109, 9, 'fa-leave-short', 'Leave the building', 'fire_emergency', 1, 0.90, 1, 0, 20);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (109, 109, 10, 'Leave the building by the nearest exit', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 109, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'E001' AND ss.status = 1 LIMIT 1;

-- Assemble -------------------------------------------------------------------
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (110, 10, 'fa-assembly', 'Report to the assembly point', 'fire_emergency', 1, 1.25, 1, 1, 10);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (110, 110, 10, 'Report to person in charge of Assembly Point at:', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 110, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'E007' AND ss.status = 1 LIMIT 1;

INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (111, 10, 'fa-assembly-short', 'Report to assembly point', 'fire_emergency', 1, 1.00, 1, 1, 20);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (111, 111, 10, 'Report to assembly point', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 111, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'E007' AND ss.status = 1 LIMIT 1;

-- Do not ---------------------------------------------------------------------
INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (112, 11, 'fa-no-belongings', 'Do not stop for belongings', 'prohibition', 1, 1.00, 1, 0, 10);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (112, 112, 10, 'Do not stop to collect personal belongings', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (113, 112, 20, 'Do not take risks', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 112, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'P001' AND ss.status = 1 LIMIT 1;

INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (113, 11, 'fa-no-return', 'Do not return to the building', 'prohibition', 1, 1.00, 0, 0, 20);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (114, 113, 10, 'Do not return to the building until authorised to do so', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 113, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'P004' AND ss.status = 1 LIMIT 1;

INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (114, 11, 'fa-no-lifts', 'Do not use the lifts', 'prohibition', 1, 0.90, 0, 0, 30);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (115, 114, 10, 'Do not use the lifts', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 114, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'P020' AND ss.status = 1 LIMIT 1;

INSERT IGNORE INTO oc_tsg_bespoke_row (row_id, group_id, code, label, colour, cells, weight, is_step, has_write_on, sort_order) VALUES (115, 11, 'fa-no-risks', 'Do not take any risks', 'prohibition', 1, 0.90, 0, 0, 40);
  INSERT IGNORE INTO oc_tsg_bespoke_row_line (line_id, row_id, sort_order, text, style, caps, bold, min_height) VALUES (116, 115, 10, 'Do not take any risks', 'title', 0, 1, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_row_symbol (row_id, symbol_id, sort_order) SELECT 115, ss.symbol_id, 10 FROM oc_tsg_symbol_standard ss WHERE ss.code = 'P001' AND ss.status = 1 LIMIT 1;


-- The notices people order. Board ids start at 101 for the same reason.

INSERT IGNORE INTO oc_tsg_bespoke_board (board_id, kind, code, title, hint, width, height, numbered, sort_order) VALUES (101, 'fireaction', 'ncp1', 'Four point', 'Alarm, leave, assemble, do not stop — the common one', 150, 200, 1, 10);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (101, 101, 10, 1, 101, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (102, 101, 20, 1, 105, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (103, 101, 30, 1, 108, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (104, 101, 40, 1, 110, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (105, 101, 50, 1, 112, NULL);

INSERT IGNORE INTO oc_tsg_bespoke_board (board_id, kind, code, title, hint, width, height, numbered, sort_order) VALUES (102, 'fireaction', 'five-point', 'Five point', 'Adds do-not-return and do-not-take-risks', 200, 300, 1, 20);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (106, 102, 10, 1, 102, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (107, 102, 20, 1, 105, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (108, 102, 30, 1, 109, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (109, 102, 40, 1, 111, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (110, 102, 50, 1, 113, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (111, 102, 60, 1, 115, NULL);

-- The 5PFAN: the circle stands alone above the title, and nothing is numbered.
INSERT IGNORE INTO oc_tsg_bespoke_board (board_id, kind, code, title, hint, width, height, numbered, sort_order) VALUES (103, 'fireaction', '5pfan', 'Five point, symbol on top', 'Mandatory circle, title, then five unnumbered steps', 200, 300, 0, 30);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (112, 103, 10, 1, 104, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (113, 103, 20, 1, 103, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (114, 103, 30, 1, 105, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (115, 103, 40, 1, 109, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (116, 103, 50, 1, 111, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (117, 103, 60, 1, 113, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (118, 103, 70, 1, 115, NULL);

INSERT IGNORE INTO oc_tsg_bespoke_board (board_id, kind, code, title, hint, width, height, numbered, sort_order) VALUES (104, 'fireaction', 'with-dial', 'With a phone number', 'A box to print or write the fire brigade number in', 150, 200, 1, 40);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (119, 104, 10, 1, 101, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (120, 104, 20, 1, 106, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (121, 104, 30, 1, 107, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (122, 104, 40, 1, 108, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (123, 104, 50, 1, 110, NULL);
  INSERT IGNORE INTO oc_tsg_bespoke_board_row (id, board_id, sort_order, cells, row_id_left, row_id_right) VALUES (124, 104, 60, 1, 112, NULL);


-- ---------------------------------------------------------------------------
-- 4. CHECK
-- ---------------------------------------------------------------------------

-- 36 board rows, 15 notice rows.
SELECT g.kind, COUNT(*) AS rows_in_kind
  FROM oc_tsg_bespoke_row r JOIN oc_tsg_bespoke_row_group g USING (group_id)
 GROUP BY g.kind;

-- 3 boards, 4 notices.
SELECT kind, COUNT(*) AS templates FROM oc_tsg_bespoke_board GROUP BY kind;

-- Every notice row, with what it carries. fa-symbol should show 0 lines and
-- 1 symbol; fa-title 1 line and 0 symbols; nothing else should show 0 of both.
SELECT r.code, r.is_step, r.has_write_on,
       COUNT(DISTINCT l.line_id)  AS text_lines,
       COUNT(DISTINCT s.symbol_id) AS symbols
  FROM oc_tsg_bespoke_row r
  JOIN oc_tsg_bespoke_row_group g USING (group_id)
  LEFT JOIN oc_tsg_bespoke_row_line   l USING (row_id)
  LEFT JOIN oc_tsg_bespoke_row_symbol s USING (row_id)
 WHERE g.kind = 'fireaction'
 GROUP BY r.code, r.is_step, r.has_write_on
 ORDER BY MIN(g.sort_order), MIN(r.sort_order);

-- A notice row that names a symbol we do not stock would land here.
SELECT r.code FROM oc_tsg_bespoke_row r
  JOIN oc_tsg_bespoke_row_group g USING (group_id)
  LEFT JOIN oc_tsg_bespoke_row_symbol s USING (row_id)
 WHERE g.kind = 'fireaction' AND r.code <> 'fa-title' AND s.symbol_id IS NULL;   -- should be empty

-- Every template row points at a row of its own kind.
SELECT b.code AS template, br.sort_order, r.code AS row_code
  FROM oc_tsg_bespoke_board b
  JOIN oc_tsg_bespoke_board_row br USING (board_id)
  LEFT JOIN oc_tsg_bespoke_row r ON r.row_id = br.row_id_left
  LEFT JOIN oc_tsg_bespoke_row_group g ON g.group_id = r.group_id
 WHERE b.kind <> COALESCE(g.kind, '');   -- should be empty
