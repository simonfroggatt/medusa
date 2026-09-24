-- quotes_web: let staff reopen a quote that was cancelled (or has expired).
--
-- Why: `cancelled` and `expired` are both flagged is_terminal, and no transition leads out of
-- either, so a quote cancelled by mistake was gone for good - staff would have to ask the
-- customer to request a new one. Same for a quote whose expiry date has passed.
--
-- This adds two staff transitions:
--   cancelled -> under_review   "Reopen quote"
--   expired   -> under_review   "Reopen quote"
--
-- Reopening puts the quote back where staff can edit it. The customer's existing link starts
-- working again at that point (a quote is only hidden from them while draft/requested/
-- under_review... so it stays hidden until staff send it again) - see
-- apps/quotes_web/constants.py CUSTOMER_VISIBLE_STATUS_CODES.
--
-- Note the is_terminal flag stays as it is: it is descriptive only. The code decides what is
-- possible from oc_tsg_quote_status_transition alone, so these two rows are the whole change.
--
-- Run in Navicat on totalsafetygroup_oc. Local only for now; fold into the production script
-- before that is run (quotes_web_v1_plan.md decision 13).


-- ---------------------------------------------------------------------------
-- 1. PREVIEW: nothing leads out of cancelled or expired today
-- ---------------------------------------------------------------------------

SELECT f.status_code AS from_code, s.status_code AS to_code,
       t.transition_name, t.role_required
FROM oc_tsg_quote_status_transition t
JOIN oc_tsg_quote_status f ON f.status_id = t.from_status_id
JOIN oc_tsg_quote_status s ON s.status_id = t.to_status_id
WHERE f.status_code IN ('cancelled', 'expired')
ORDER BY f.`order`, s.`order`;
-- expect: no rows

SELECT COUNT(*) AS transitions_now FROM oc_tsg_quote_status_transition;  -- expect 17


-- ---------------------------------------------------------------------------
-- 2. EXECUTE
-- ---------------------------------------------------------------------------

INSERT INTO oc_tsg_quote_status_transition
    (from_status_id, to_status_id, transition_name, role_required, is_allowed)
SELECT f.status_id, t.status_id, 'Reopen quote', 'staff', 1
FROM oc_tsg_quote_status f
JOIN oc_tsg_quote_status t ON t.status_code = 'under_review'
WHERE f.status_code IN ('cancelled', 'expired')
  AND NOT EXISTS (
      SELECT 1 FROM oc_tsg_quote_status_transition x
      WHERE x.from_status_id = f.status_id AND x.to_status_id = t.status_id
  );


-- ---------------------------------------------------------------------------
-- 3. VERIFY
-- ---------------------------------------------------------------------------

SELECT f.status_code AS from_code, s.status_code AS to_code,
       t.transition_name, t.role_required
FROM oc_tsg_quote_status_transition t
JOIN oc_tsg_quote_status f ON f.status_id = t.from_status_id
JOIN oc_tsg_quote_status s ON s.status_id = t.to_status_id
WHERE f.status_code IN ('cancelled', 'expired')
ORDER BY f.`order`, s.`order`;
-- expect two rows, both 'staff', named "Reopen quote"

SELECT COUNT(*) AS transitions_expect_19 FROM oc_tsg_quote_status_transition;
