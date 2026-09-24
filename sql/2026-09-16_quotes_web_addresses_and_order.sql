-- quotes_web: addresses on a quote, and the link to the order it becomes.
--
-- Why: accepting a quote on the website now asks the customer for their address (nobody is
-- logged in on that page - the link is the credential), and converting an accepted quote to
-- an order needs somewhere to copy that address from. oc_order's address columns are
-- nullable, so an order would save without them, but it would be one nobody can ship or
-- invoice.
--
--   1. payment_* / shipping_* blocks on oc_tsg_quote_request, named exactly as on oc_order,
--      so conversion is a straight copy
--   2. shipping_same_as_billing, for the "deliver somewhere else" tick
--   3. order_id - which order this quote became
--   4. a new 'order_created' status, and the staff transition accepted -> order_created
--
-- The address the customer types is deliberately parked on the quote rather than written
-- into a customer's address book: that page is unauthenticated, and a forwarded link must
-- not be able to change someone's account. Staff decide at conversion.
--
-- Country foreign keys point at oc_tsg_country_iso(iso_id).
--
-- Run in Navicat on totalsafetygroup_oc. Local only; fold into the production script before
-- that is run (quotes_web_v1_plan.md decision 13).


-- ---------------------------------------------------------------------------
-- 1. PREVIEW
-- ---------------------------------------------------------------------------

SHOW COLUMNS FROM oc_tsg_quote_request;   -- no payment_*/shipping_*/order_id yet

SELECT status_id, status_code, status_name, `order`, is_terminal
FROM oc_tsg_quote_status ORDER BY `order`;   -- expect 9, no order_created

SELECT COUNT(*) AS transitions_now FROM oc_tsg_quote_status_transition;  -- expect 19


-- ---------------------------------------------------------------------------
-- 2. EXECUTE
-- ---------------------------------------------------------------------------

-- 2.1 billing address, as given by the customer when they accept (or typed by staff)
ALTER TABLE oc_tsg_quote_request
    ADD COLUMN IF NOT EXISTS `payment_fullname` varchar(255) DEFAULT NULL AFTER `notes`,
    ADD COLUMN IF NOT EXISTS `payment_firstname` varchar(32) DEFAULT NULL AFTER `payment_fullname`,
    ADD COLUMN IF NOT EXISTS `payment_lastname` varchar(32) DEFAULT NULL AFTER `payment_firstname`,
    ADD COLUMN IF NOT EXISTS `payment_email` varchar(512) DEFAULT NULL AFTER `payment_lastname`,
    ADD COLUMN IF NOT EXISTS `payment_telephone` varchar(50) DEFAULT NULL AFTER `payment_email`,
    ADD COLUMN IF NOT EXISTS `payment_company` varchar(255) DEFAULT NULL AFTER `payment_telephone`,
    ADD COLUMN IF NOT EXISTS `payment_address_1` varchar(512) DEFAULT NULL AFTER `payment_company`,
    ADD COLUMN IF NOT EXISTS `payment_address_2` varchar(128) DEFAULT NULL AFTER `payment_address_1`,
    ADD COLUMN IF NOT EXISTS `payment_city` varchar(128) DEFAULT NULL AFTER `payment_address_2`,
    ADD COLUMN IF NOT EXISTS `payment_area` varchar(255) DEFAULT NULL AFTER `payment_city`,
    ADD COLUMN IF NOT EXISTS `payment_postcode` varchar(10) DEFAULT NULL AFTER `payment_area`,
    ADD COLUMN IF NOT EXISTS `payment_country` varchar(128) DEFAULT NULL AFTER `payment_postcode`,
    ADD COLUMN IF NOT EXISTS `payment_country_id` int(11) DEFAULT NULL AFTER `payment_country`;

-- 2.2 delivery address
ALTER TABLE oc_tsg_quote_request
    ADD COLUMN IF NOT EXISTS `shipping_fullname` varchar(255) DEFAULT NULL AFTER `payment_country_id`,
    ADD COLUMN IF NOT EXISTS `shipping_firstname` varchar(32) DEFAULT NULL AFTER `shipping_fullname`,
    ADD COLUMN IF NOT EXISTS `shipping_lastname` varchar(32) DEFAULT NULL AFTER `shipping_firstname`,
    ADD COLUMN IF NOT EXISTS `shipping_email` varchar(512) DEFAULT NULL AFTER `shipping_lastname`,
    ADD COLUMN IF NOT EXISTS `shipping_telephone` varchar(50) DEFAULT NULL AFTER `shipping_email`,
    ADD COLUMN IF NOT EXISTS `shipping_company` varchar(255) DEFAULT NULL AFTER `shipping_telephone`,
    ADD COLUMN IF NOT EXISTS `shipping_address_1` varchar(512) DEFAULT NULL AFTER `shipping_company`,
    ADD COLUMN IF NOT EXISTS `shipping_address_2` varchar(128) DEFAULT NULL AFTER `shipping_address_1`,
    ADD COLUMN IF NOT EXISTS `shipping_city` varchar(128) DEFAULT NULL AFTER `shipping_address_2`,
    ADD COLUMN IF NOT EXISTS `shipping_area` varchar(255) DEFAULT NULL AFTER `shipping_city`,
    ADD COLUMN IF NOT EXISTS `shipping_postcode` varchar(10) DEFAULT NULL AFTER `shipping_area`,
    ADD COLUMN IF NOT EXISTS `shipping_country` varchar(128) DEFAULT NULL AFTER `shipping_postcode`,
    ADD COLUMN IF NOT EXISTS `shipping_country_id` int(11) DEFAULT NULL AFTER `shipping_country`,
    ADD COLUMN IF NOT EXISTS `shipping_same_as_billing` tinyint(1) NOT NULL DEFAULT 1
        COMMENT 'Customer ticked "deliver somewhere else" when 0'
        AFTER `shipping_country_id`;

-- 2.3 which order this quote became
ALTER TABLE oc_tsg_quote_request
    ADD COLUMN IF NOT EXISTS `order_id` int(11) DEFAULT NULL
        COMMENT 'oc_order created from this quote' AFTER `shipping_same_as_billing`;

ALTER TABLE oc_tsg_quote_request
    ADD CONSTRAINT `fk_web_quote_payment_country`
        FOREIGN KEY IF NOT EXISTS (`payment_country_id`) REFERENCES `oc_tsg_country_iso` (`iso_id`)
        ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE oc_tsg_quote_request
    ADD CONSTRAINT `fk_web_quote_shipping_country`
        FOREIGN KEY IF NOT EXISTS (`shipping_country_id`) REFERENCES `oc_tsg_country_iso` (`iso_id`)
        ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE oc_tsg_quote_request
    ADD CONSTRAINT `fk_web_quote_order`
        FOREIGN KEY IF NOT EXISTS (`order_id`) REFERENCES `oc_order` (`order_id`)
        ON DELETE SET NULL ON UPDATE CASCADE;

-- 2.4 the status a converted quote lands in. Terminal: the order carries on from here, and
--     the customer's link shows it as accepted/ordered rather than something they can act on.
INSERT INTO oc_tsg_quote_status (status_code, status_name, status_description, color_hex, `order`, is_terminal, is_active)
SELECT 'order_created', 'Order Created', 'Quote has been turned into an order', '#0F766E', 10, 1, 1
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_quote_status WHERE status_code = 'order_created');

-- 2.5 only an accepted quote can become an order
INSERT INTO oc_tsg_quote_status_transition
    (from_status_id, to_status_id, transition_name, role_required, is_allowed)
SELECT f.status_id, t.status_id, 'Create order', 'staff', 1
FROM oc_tsg_quote_status f
JOIN oc_tsg_quote_status t ON t.status_code = 'order_created'
WHERE f.status_code = 'accepted'
  AND NOT EXISTS (
      SELECT 1 FROM oc_tsg_quote_status_transition x
      WHERE x.from_status_id = f.status_id AND x.to_status_id = t.status_id
  );


-- ---------------------------------------------------------------------------
-- 3. VERIFY
-- ---------------------------------------------------------------------------

SHOW COLUMNS FROM oc_tsg_quote_request;   -- 27 new columns: 13 payment, 14 shipping, order_id

SELECT status_id, status_code, status_name, `order`, is_terminal
FROM oc_tsg_quote_status ORDER BY `order`;   -- expect 10, ending with order_created

SELECT f.status_code AS from_code, s.status_code AS to_code, t.transition_name, t.role_required
FROM oc_tsg_quote_status_transition t
JOIN oc_tsg_quote_status f ON f.status_id = t.from_status_id
JOIN oc_tsg_quote_status s ON s.status_id = t.to_status_id
WHERE s.status_code = 'order_created';   -- expect accepted -> order_created, staff

SELECT COUNT(*) AS transitions_expect_20 FROM oc_tsg_quote_status_transition;

SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'oc_tsg_quote_request'
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY CONSTRAINT_NAME;   -- the three new FKs plus the four existing ones
