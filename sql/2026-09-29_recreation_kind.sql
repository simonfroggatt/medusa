-- Which designer a recreated stock sign belongs in.
--
-- Every recreation opened in the standard designer, because nothing recorded
-- what kind of sign it was. That is right for a prohibition or a mandatory,
-- and wrong for the ones built out of bands: a five point fire action notice
-- opened as a stack of sections with no step numbers, no plates behind the
-- symbols and no box to write in, because the standard designer has none of
-- those things.
--
-- The AI does not decide this. It is the reviewer's call, set on the review
-- page, because a human can tell a fire action notice from a stack of rows at
-- a glance and the model has been refusing them outright ("more than 2
-- symbols") rather than classifying them.
--
-- LOCAL FIRST (2026-09-29). Safe to run twice.


SHOW COLUMNS FROM oc_tsg_bespoke_recreations LIKE 'kind';

ALTER TABLE oc_tsg_bespoke_recreations
    ADD COLUMN IF NOT EXISTS kind VARCHAR(20) NOT NULL DEFAULT 'standard' AFTER status;


-- Nothing is reclassified here: an existing recreation stays standard until
-- somebody says otherwise on the review page.
SELECT kind, status, COUNT(*) AS recreations
  FROM oc_tsg_bespoke_recreations
 GROUP BY kind, status ORDER BY kind, status;
