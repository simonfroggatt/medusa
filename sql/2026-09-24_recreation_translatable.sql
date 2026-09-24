-- Which approved signs are simple enough to offer in another language.
--
-- Every recreation is reviewed by hand already, so the reviewer is the right
-- person to say it: a sign that is one symbol and a short line of wording
-- translates cleanly, and a site safety board or a sign carrying names, part
-- numbers or a local rule does not. Left to the reviewer's judgement rather
-- than guessed from the design, because "simple enough" is about the wording's
-- meaning, not its shape.
--
-- It says nothing about WHICH language: the customer picks that in the
-- designer, from the languages the translate service offers. So one flag
-- covers every language, now and later.
--
-- LOCAL FIRST (2026-09-24).

ALTER TABLE oc_tsg_bespoke_recreations
    ADD COLUMN translatable TINYINT(1) NOT NULL DEFAULT 0
    COMMENT 'Reviewer says this design is simple enough to offer translated'
    AFTER status;

-- Nothing is ticked to start with; the reviewer opts each one in.
SELECT status,
       COUNT(*)            AS designs,
       SUM(translatable)   AS translatable
  FROM oc_tsg_bespoke_recreations
 GROUP BY status;
