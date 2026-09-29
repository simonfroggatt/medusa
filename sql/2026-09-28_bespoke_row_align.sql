-- Which edge a standard row's wording sits against.
--
-- A row is a template: the same band is drawn on a 300x400 board and a
-- 1200x800 one, so it can only carry settings that survive any size. A fixed
-- letter height or a nudge does not. Alignment does -- it means the same thing
-- however big the sign is -- and without it every standard row comes out
-- centred. The printed five point fire action notice is set left, which ours
-- could not express until now.
--
-- LOCAL FIRST (2026-09-28). Safe to run twice.


SHOW COLUMNS FROM oc_tsg_bespoke_row_line LIKE 'align';

ALTER TABLE oc_tsg_bespoke_row_line
    ADD COLUMN IF NOT EXISTS align VARCHAR(8) NOT NULL DEFAULT 'centre' AFTER bold;

-- Every band on the printed 5PFAN sets its wording left against the plate.
UPDATE oc_tsg_bespoke_row_line l
  JOIN oc_tsg_bespoke_row r USING (row_id)
  JOIN oc_tsg_bespoke_row_group g USING (group_id)
   SET l.align = 'left'
 WHERE g.kind = 'fireaction' AND r.code IN
       ('fa-alarm', 'fa-alarm-callpoint', 'fa-dial', 'fa-leave', 'fa-leave-short',
        'fa-assembly', 'fa-assembly-short', 'fa-no-belongings', 'fa-no-return',
        'fa-no-lifts', 'fa-no-risks');


-- How the wording sits, per row.
SELECT g.kind, r.code, l.align, LEFT(l.text, 36) AS wording
  FROM oc_tsg_bespoke_row_line l
  JOIN oc_tsg_bespoke_row r USING (row_id)
  JOIN oc_tsg_bespoke_row_group g USING (group_id)
 WHERE g.kind = 'fireaction'
 ORDER BY g.sort_order, r.sort_order, l.sort_order;
