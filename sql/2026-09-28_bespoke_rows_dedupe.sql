-- Undo the damage from re-running the seed files.
--
-- 2026-09-28_bespoke_board_rows.sql said it was safe to run twice. It was not.
-- INSERT IGNORE only suppresses a DUPLICATE KEY error, and two of its tables
-- had no key to violate:
--
--   oc_tsg_bespoke_row_line       a line's only key is its own AUTO_INCREMENT
--   oc_tsg_bespoke_board_row      likewise
--
-- so every re-run appended another copy of every line of wording and every
-- band of every ready-made sign. The other four tables were fine throughout:
-- rows, groups and boards are seeded with explicit ids, and row_symbol has a
-- unique key on (row_id, symbol_id).
--
-- Both seed files now give their lines and bands explicit ids too, so they are
-- genuinely idempotent from here on. This file clears up what the earlier runs
-- left behind, and does nothing at all on a database that was only seeded once.
--
-- Run it AFTER both seed files. Safe to run twice (it is a delete of exact
-- duplicates; once they are gone there is nothing to find).


-- ---------------------------------------------------------------------------
-- 1. PREVIEW — what is duplicated, and by how much
-- ---------------------------------------------------------------------------

SELECT 'row_line' AS what,
       COUNT(*) AS rows_now,
       (SELECT COUNT(*) FROM (SELECT 1 FROM oc_tsg_bespoke_row_line
          GROUP BY row_id, sort_order, text, style, caps, bold) x) AS should_be
  FROM oc_tsg_bespoke_row_line
UNION ALL
SELECT 'board_row',
       COUNT(*),
       (SELECT COUNT(*) FROM (SELECT 1 FROM oc_tsg_bespoke_board_row
          GROUP BY board_id, sort_order, row_id_left, row_id_right) x)
  FROM oc_tsg_bespoke_board_row;


-- ---------------------------------------------------------------------------
-- 2. CLEAN — keep the earliest of each identical set, drop the rest
-- ---------------------------------------------------------------------------

-- `<=>` rather than `=` so two NULL min_heights count as the same.
DELETE dup FROM oc_tsg_bespoke_row_line dup
  JOIN oc_tsg_bespoke_row_line keep
    ON keep.row_id     =   dup.row_id
   AND keep.sort_order =   dup.sort_order
   AND keep.text       =   dup.text
   AND keep.style      =   dup.style
   AND keep.caps       =   dup.caps
   AND keep.bold       =   dup.bold
   AND keep.min_height <=> dup.min_height
   AND keep.line_id    <   dup.line_id;

DELETE dup FROM oc_tsg_bespoke_board_row dup
  JOIN oc_tsg_bespoke_board_row keep
    ON keep.board_id     =   dup.board_id
   AND keep.sort_order   =   dup.sort_order
   AND keep.row_id_left  =   dup.row_id_left
   AND keep.row_id_right <=> dup.row_id_right
   AND keep.id           <   dup.id;


-- ---------------------------------------------------------------------------
-- 3. CHECK
-- ---------------------------------------------------------------------------

-- Both should now read the same in each column.
SELECT 'row_line' AS what,
       COUNT(*) AS rows_now,
       (SELECT COUNT(*) FROM (SELECT 1 FROM oc_tsg_bespoke_row_line
          GROUP BY row_id, sort_order, text, style, caps, bold) x) AS should_be
  FROM oc_tsg_bespoke_row_line
UNION ALL
SELECT 'board_row',
       COUNT(*),
       (SELECT COUNT(*) FROM (SELECT 1 FROM oc_tsg_bespoke_board_row
          GROUP BY board_id, sort_order, row_id_left, row_id_right) x)
  FROM oc_tsg_bespoke_board_row;

-- Every ready-made sign, with how many bands it carries. A board template has
-- five, the four notices have five, six, seven and six.
SELECT b.kind, b.code, COUNT(br.id) AS bands
  FROM oc_tsg_bespoke_board b
  LEFT JOIN oc_tsg_bespoke_board_row br USING (board_id)
 GROUP BY b.kind, b.code ORDER BY b.kind, b.sort_order;

-- No row should carry the same wording twice.
SELECT r.code, l.text, COUNT(*) AS copies
  FROM oc_tsg_bespoke_row_line l JOIN oc_tsg_bespoke_row r USING (row_id)
 GROUP BY r.code, l.text HAVING copies > 1;   -- should be empty
