-- quotes_web: let staff pull a sent quote back for amendment.
--
-- Why: lines and totals may only change while a quote is draft or under review
-- (apps/quotes_web/services/quotes.py ensure_editable). The seeded transitions let staff move
-- a quote INTO sent, but the only ways out of sent are the customer opening it (-> viewed) or
-- staff cancelling it. So a quote sent with a wrong price could not be corrected at all - the
-- staff page even said "Return it to draft first", which was impossible.
--
-- This adds two staff transitions:
--   sent   -> under_review   "Amend quote"
--   viewed -> under_review   "Amend quote"
--
-- Same shape as the rest of the workflow: the customer's link keeps working throughout, and
-- the quote simply shows as Under Review until staff send it again. Sending again resets
-- date_sent and pushes the expiry date out another 30 days.
--
-- Run in Navicat on totalsafetygroup_oc. Local only for now; folded into the production
-- script later (quotes_web_v1_plan.md decision 13).


-- ---------------------------------------------------------------------------
-- 1. PREVIEW: what can staff do from sent / viewed today?
-- ---------------------------------------------------------------------------

SELECT f.status_code AS from_code, s.status_code AS to_code,
       t.transition_name, t.role_required
FROM oc_tsg_quote_status_transition t
JOIN oc_tsg_quote_status f ON f.status_id = t.from_status_id
JOIN oc_tsg_quote_status s ON s.status_id = t.to_status_id
WHERE f.status_code IN ('sent', 'viewed')
ORDER BY f.`order`, s.`order`;
-- expect: sent -> viewed (customer), sent -> cancelled (staff),
--         viewed -> accepted (customer), viewed -> change_requested (customer),
--         viewed -> cancelled (staff). No way back to under_review.

SELECT COUNT(*) AS transitions_now FROM oc_tsg_quote_status_transition;  -- expect 15


-- ---------------------------------------------------------------------------
-- 2. EXECUTE
-- ---------------------------------------------------------------------------

INSERT INTO oc_tsg_quote_status_transition
    (from_status_id, to_status_id, transition_name, role_required, is_allowed)
SELECT f.status_id, t.status_id, 'Amend quote', 'staff', 1
FROM oc_tsg_quote_status f
JOIN oc_tsg_quote_status t ON t.status_code = 'under_review'
WHERE f.status_code IN ('sent', 'viewed')
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
ORDER BY f.`order`, s.`order`;
-- expect sent -> under_review and viewed -> under_review, both 'staff', named "Amend quote"

SELECT COUNT(*) AS transitions_expect_17 FROM oc_tsg_quote_status_transition;
