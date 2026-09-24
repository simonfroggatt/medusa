-- quotes_web V1 — schema fixes to the customer quote tables created 2026-07-30
-- (oc_tsg_quote_request, oc_tsg_quote_item, oc_tsg_quote_action, oc_tsg_quote_status,
--  oc_tsg_quote_status_transition). Plan: tsg_medusa/docs/quotes_web_v1_plan.md decision 12.
--
-- LOCAL ONLY for now. These tables are not on production yet; the production CREATE TABLE
-- script gets written from the finished local schema once V1 works (decision 13).
--
-- What this does:
--   1. oc_tsg_quote_action.action_type  enum -> varchar(32), so the log can record created,
--      sent, cancelled, edited etc. Allowed values live in apps/quotes_web/constants.py.
--      Adds user_id (staff member who acted; NULL for customer actions).
--   2. oc_tsg_quote_request.customer_email becomes optional (phone stays required) — UAE
--      customers may leave only a phone number.
--   3. Drops duplicate indexes (each of status_code, quote_number, public_token carries two
--      identical unique keys; public_token also has a third, plain one).
--   4. oc_tsg_quote_item gains single_unit_price / bulk_discount_id / bulk_used so staff can
--      change a quantity and have the line repriced from the bulk band, like an order line.
--      NOTE: on a QUOTE line, single_unit_price = variant base price + option add-ons (the
--      figure the storefront applies the bulk discount to). On an ORDER line the same column
--      holds the base price only.
--   5. Transitions: the customer's own page records "viewed", so sent -> viewed becomes a
--      customer transition; staff gain Cancel from under_review, sent, viewed and
--      change_requested.
--
-- MariaDB 12.0.2 locally: IF EXISTS / IF NOT EXISTS is supported on ADD COLUMN, DROP INDEX,
-- ADD CONSTRAINT, so the whole file is safe to run twice.
-- Parents before children: oc_tsg_bulkdiscount_groups and auth_user already exist.


-- ---------------------------------------------------------------------------
-- 1. PREVIEW: what is there now
-- ---------------------------------------------------------------------------

-- action_type should still be an enum, and there should be no user_id column
SHOW COLUMNS FROM oc_tsg_quote_action;

-- customer_email should still be NOT NULL ("NO" in the Null column)
SHOW COLUMNS FROM oc_tsg_quote_request LIKE 'customer_email';

-- the duplicates to be dropped: expect uk_status_code, uk_quote_number,
-- uk_public_token and idx_public_token to be listed
SHOW INDEX FROM oc_tsg_quote_status WHERE Key_name IN ('status_code', 'uk_status_code');
SHOW INDEX FROM oc_tsg_quote_request WHERE Key_name IN
    ('quote_number', 'uk_quote_number', 'public_token', 'uk_public_token', 'idx_public_token');

-- no bulk columns yet
SHOW COLUMNS FROM oc_tsg_quote_item;

-- 11 transitions, sent -> viewed currently role_required = 'staff', no Cancel past 'requested'
SELECT t.transition_id, f.status_code AS from_code, s.status_code AS to_code,
       t.transition_name, t.role_required, t.is_allowed
FROM oc_tsg_quote_status_transition t
JOIN oc_tsg_quote_status f ON f.status_id = t.from_status_id
JOIN oc_tsg_quote_status s ON s.status_id = t.to_status_id
ORDER BY f.`order`, s.`order`;

-- rows: all three should be 0 locally (nothing has used these tables yet)
SELECT (SELECT COUNT(*) FROM oc_tsg_quote_request) AS quotes,
       (SELECT COUNT(*) FROM oc_tsg_quote_item)    AS items,
       (SELECT COUNT(*) FROM oc_tsg_quote_action)  AS actions;


-- ---------------------------------------------------------------------------
-- 2. EXECUTE
-- ---------------------------------------------------------------------------

-- 2.1 action log: free-text action type + which staff member did it
ALTER TABLE oc_tsg_quote_action
    MODIFY COLUMN `action_type` varchar(32) NOT NULL
        COMMENT 'Action code, see apps/quotes_web/constants.py (created, viewed, sent, accepted, ...)';

ALTER TABLE oc_tsg_quote_action
    ADD COLUMN IF NOT EXISTS `user_id` int(11) DEFAULT NULL
        COMMENT 'auth_user who performed a staff action; NULL for customer actions'
        AFTER `action_data`;

-- MariaDB wants IF NOT EXISTS after FOREIGN KEY, not after CONSTRAINT
ALTER TABLE oc_tsg_quote_action
    ADD CONSTRAINT `fk_web_quote_action_user`
        FOREIGN KEY IF NOT EXISTS (`user_id`) REFERENCES `auth_user` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE;

-- 2.2 email optional (phone stays required)
ALTER TABLE oc_tsg_quote_request
    MODIFY COLUMN `customer_email` varchar(96) DEFAULT NULL
        COMMENT 'Optional - UAE customers may give a phone number only';

-- 2.3 duplicate indexes (keeps status_code, quote_number, public_token)
ALTER TABLE oc_tsg_quote_status   DROP INDEX IF EXISTS `uk_status_code`;
ALTER TABLE oc_tsg_quote_request  DROP INDEX IF EXISTS `uk_quote_number`;
ALTER TABLE oc_tsg_quote_request  DROP INDEX IF EXISTS `uk_public_token`;
ALTER TABLE oc_tsg_quote_request  DROP INDEX IF EXISTS `idx_public_token`;

-- 2.4 quote lines: bulk repricing
ALTER TABLE oc_tsg_quote_item
    ADD COLUMN IF NOT EXISTS `single_unit_price` decimal(15,4) NOT NULL DEFAULT 0.0000
        COMMENT 'Unit price before bulk discount = variant base price + option add-ons'
        AFTER `unit_price`;

ALTER TABLE oc_tsg_quote_item
    ADD COLUMN IF NOT EXISTS `bulk_discount_id` int(11) DEFAULT NULL
        COMMENT 'Bulk group used to price this line (oc_product_to_store, else oc_product)'
        AFTER `single_unit_price`;

ALTER TABLE oc_tsg_quote_item
    ADD COLUMN IF NOT EXISTS `bulk_used` tinyint(1) DEFAULT 1
        COMMENT 'Apply the bulk discount when repricing this line'
        AFTER `bulk_discount_id`;

ALTER TABLE oc_tsg_quote_item
    ADD CONSTRAINT `fk_web_quote_item_bulk`
        FOREIGN KEY IF NOT EXISTS (`bulk_discount_id`) REFERENCES `oc_tsg_bulkdiscount_groups` (`bulk_group_id`)
        ON DELETE SET NULL ON UPDATE CASCADE;

-- existing rows (none locally) keep the price they were quoted at
UPDATE oc_tsg_quote_item SET single_unit_price = unit_price WHERE single_unit_price = 0;

-- 2.5 transitions
-- the customer's own page records "viewed", so that transition is theirs, not staff's
UPDATE oc_tsg_quote_status_transition
SET role_required = 'customer'
WHERE from_status_id = (SELECT status_id FROM oc_tsg_quote_status WHERE status_code = 'sent')
  AND to_status_id   = (SELECT status_id FROM oc_tsg_quote_status WHERE status_code = 'viewed');

-- staff Cancel from the four statuses that had no way out
INSERT INTO oc_tsg_quote_status_transition (from_status_id, to_status_id, transition_name, role_required, is_allowed)
SELECT f.status_id, t.status_id, 'Cancel', 'staff', 1
FROM oc_tsg_quote_status f
JOIN oc_tsg_quote_status t ON t.status_code = 'cancelled'
WHERE f.status_code IN ('under_review', 'sent', 'viewed', 'change_requested')
  AND NOT EXISTS (
      SELECT 1 FROM oc_tsg_quote_status_transition x
      WHERE x.from_status_id = f.status_id AND x.to_status_id = t.status_id
  );


-- ---------------------------------------------------------------------------
-- 3. VERIFY
-- ---------------------------------------------------------------------------

-- action_type now varchar(32), user_id present with its FK
SHOW COLUMNS FROM oc_tsg_quote_action;

-- customer_email Null = YES
SHOW COLUMNS FROM oc_tsg_quote_request LIKE 'customer_email';

-- three new columns on the quote line, plus the bulk FK
SHOW COLUMNS FROM oc_tsg_quote_item;
SHOW CREATE TABLE oc_tsg_quote_item;

-- duplicates gone: one unique key each, named status_code / quote_number / public_token
SHOW INDEX FROM oc_tsg_quote_status WHERE Non_unique = 0;
SHOW INDEX FROM oc_tsg_quote_request WHERE Key_name IN ('quote_number', 'public_token');

-- 15 transitions; sent -> viewed is 'customer'; Cancel from under_review, sent, viewed,
-- change_requested, draft and requested
SELECT t.transition_id, f.status_code AS from_code, s.status_code AS to_code,
       t.transition_name, t.role_required, t.is_allowed
FROM oc_tsg_quote_status_transition t
JOIN oc_tsg_quote_status f ON f.status_id = t.from_status_id
JOIN oc_tsg_quote_status s ON s.status_id = t.to_status_id
ORDER BY f.`order`, s.`order`;

SELECT COUNT(*) AS transitions_expect_15 FROM oc_tsg_quote_status_transition;
