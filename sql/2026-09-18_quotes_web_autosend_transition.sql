-- quotes_web: let a quote send itself.
--
-- Why: quotes are now sent automatically the moment a customer asks for one - they only
-- contain products already sold on the site, so there is nothing to price up first. The
-- workflow had no way to get from 'requested' to 'sent' except through a staff Begin Review
-- and Send Quote, and the code refuses any move the transition table does not allow.
--
-- This adds one transition with a new role, 'system':
--   requested -> sent   "Auto sent"   role_required = system
--
-- 'system' keeps the audit trail honest: the history shows the quote was sent automatically
-- rather than pretending a member of staff did it. Staff still see their own options
-- (allowed_transitions filters by role), so this row never appears as a button.
--
-- A quote only moves if the email actually goes. If sending is off, the store has no
-- template, or the customer gave no email address, it stays 'requested' for staff to deal
-- with by hand - see apps/quotes_web/services/notify.py.
--
-- Run in Navicat on totalsafetygroup_oc.


-- ---------------------------------------------------------------------------
-- 1. PREVIEW
-- ---------------------------------------------------------------------------

SELECT f.status_code AS from_code, s.status_code AS to_code, t.transition_name, t.role_required
FROM oc_tsg_quote_status_transition t
JOIN oc_tsg_quote_status f ON f.status_id = t.from_status_id
JOIN oc_tsg_quote_status s ON s.status_id = t.to_status_id
WHERE f.status_code = 'requested'
ORDER BY s.`order`;
-- expect: requested -> under_review (staff), requested -> cancelled (staff). No route to sent.

SELECT COUNT(*) AS transitions_now FROM oc_tsg_quote_status_transition;   -- expect 20


-- ---------------------------------------------------------------------------
-- 2. EXECUTE
-- ---------------------------------------------------------------------------

INSERT INTO oc_tsg_quote_status_transition
    (from_status_id, to_status_id, transition_name, role_required, is_allowed)
SELECT f.status_id, t.status_id, 'Auto sent', 'system', 1
FROM oc_tsg_quote_status f
JOIN oc_tsg_quote_status t ON t.status_code = 'sent'
WHERE f.status_code = 'requested'
  AND NOT EXISTS (
      SELECT 1 FROM oc_tsg_quote_status_transition x
      WHERE x.from_status_id = f.status_id AND x.to_status_id = t.status_id
  );


-- ---------------------------------------------------------------------------
-- 3. VERIFY
-- ---------------------------------------------------------------------------

SELECT f.status_code AS from_code, s.status_code AS to_code, t.transition_name, t.role_required
FROM oc_tsg_quote_status_transition t
JOIN oc_tsg_quote_status f ON f.status_id = t.from_status_id
JOIN oc_tsg_quote_status s ON s.status_id = t.to_status_id
WHERE f.status_code = 'requested'
ORDER BY s.`order`;
-- expect the new requested -> sent "Auto sent" (system) alongside the two staff ones

SELECT COUNT(*) AS transitions_expect_21 FROM oc_tsg_quote_status_transition;
