-- Give every symbol a timestamp of its own, so replacing its artwork changes
-- its URL in the designer's feed and the caches let go by themselves.
--
-- The database maintains it: ON UPDATE CURRENT_TIMESTAMP means any save of the
-- row sets it, and saving the row is what uploading a replacement SVG does.
-- Nobody has to remember a step.
--
-- Safe to run twice: MariaDB accepts ADD COLUMN IF NOT EXISTS.

ALTER TABLE oc_tsg_symbols
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL
  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Existing rows get today, which is right: their artwork was just replaced.
UPDATE oc_tsg_symbols SET updated_at = NOW() WHERE updated_at IS NULL OR updated_at = 0;

SELECT COUNT(*) AS symbols, MIN(updated_at) AS oldest, MAX(updated_at) AS newest
  FROM oc_tsg_symbols;
