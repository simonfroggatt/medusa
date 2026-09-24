-- quotes_web V1 - PRODUCTION install.
--
-- Creates the five customer-quote tables and their seed data, exactly as they finished up
-- locally after the build (schema changes of 2026-09-16 folded in - there is nothing to run
-- afterwards). Plan: tsg_medusa/docs/quotes_web_v1_plan.md decision 13.
--
-- Tables, in the order they must be created (children reference parents):
--   oc_tsg_quote_status              lookup, 9 rows seeded below
--   oc_tsg_quote_status_transition   which status may follow which, and who may do it (17 rows)
--   oc_tsg_quote_request             the quote header
--   oc_tsg_quote_item                the lines
--   oc_tsg_quote_action              audit trail
--
-- Existing tables these reference, which must already be present (they are, in production):
--   oc_currency, oc_customer, oc_store, oc_product, oc_tsg_product_variants,
--   oc_tsg_bulkdiscount_groups, auth_user
--
-- No quote data is inserted: production starts empty, and quote numbers begin at QW-<prefix>-1.
-- Everything is idempotent - safe to run twice.


-- ---------------------------------------------------------------------------
-- 1. PREVIEW: nothing here should exist yet
-- ---------------------------------------------------------------------------

SELECT TABLE_NAME, TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('oc_tsg_quote_status', 'oc_tsg_quote_status_transition',
                     'oc_tsg_quote_request', 'oc_tsg_quote_item', 'oc_tsg_quote_action');

-- and the parents must be there (expect 7 rows)
SELECT TABLE_NAME FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('oc_currency', 'oc_customer', 'oc_store', 'oc_product',
                     'oc_tsg_product_variants', 'oc_tsg_bulkdiscount_groups', 'auth_user');


-- ---------------------------------------------------------------------------
-- 2. EXECUTE
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `oc_tsg_quote_status` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `status_code` varchar(32) NOT NULL COMMENT 'Machine-readable code (draft, sent, accepted, etc)',
  `status_name` varchar(255) NOT NULL COMMENT 'Display name for UI',
  `status_description` text DEFAULT NULL,
  `color_hex` varchar(7) DEFAULT '#808080' COMMENT 'Display color in UI',
  `order` int(11) DEFAULT 0 COMMENT 'Workflow sequence',
  `is_terminal` tinyint(1) DEFAULT 0 COMMENT 'If 1, quote cannot change status after reaching this',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`status_id`),
  UNIQUE KEY `status_code` (`status_code`),
  KEY `idx_order` (`order`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `oc_tsg_quote_status_transition` (
  `transition_id` int(11) NOT NULL AUTO_INCREMENT,
  `from_status_id` int(11) NOT NULL,
  `to_status_id` int(11) NOT NULL,
  `transition_name` varchar(255) DEFAULT NULL COMMENT 'e.g., "Submit for Review", "Send Quote"',
  `role_required` varchar(64) DEFAULT 'staff' COMMENT 'customer or staff',
  `is_allowed` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`transition_id`),
  UNIQUE KEY `uk_transition` (`from_status_id`,`to_status_id`),
  KEY `fk_from_status` (`from_status_id`),
  KEY `fk_to_status` (`to_status_id`),
  CONSTRAINT `fk_transition_from_status` FOREIGN KEY (`from_status_id`) REFERENCES `oc_tsg_quote_status` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_transition_to_status` FOREIGN KEY (`to_status_id`) REFERENCES `oc_tsg_quote_status` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `oc_tsg_quote_request` (
  `quote_id` int(11) NOT NULL AUTO_INCREMENT,
  `quote_number` varchar(32) NOT NULL COMMENT 'QW-<store prefix>-<quote_id>, e.g. QW-SSAN-12',
  `public_token` varchar(64) NOT NULL COMMENT 'Secure token for public portal access',
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(32) NOT NULL,
  `customer_email` varchar(96) DEFAULT NULL COMMENT 'Optional - UAE customers may give a phone number only',
  `medusa_customer_id` int(11) DEFAULT NULL COMMENT 'oc_customer when the customer was logged in',
  `status_id` int(11) NOT NULL COMMENT 'Foreign key to oc_tsg_quote_status table',
  `created_from` enum('website','medusa') DEFAULT 'website',
  `store_id` int(11) DEFAULT NULL,
  `currency_id` int(11) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Products subtotal',
  `tax_total` decimal(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Sum of all tax',
  `shipping_cost` decimal(15,2) DEFAULT 0.00,
  `discount_amount` decimal(15,2) DEFAULT 0.00,
  `total` decimal(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Grand total',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `viewed_at` datetime DEFAULT NULL COMMENT 'When customer viewed quote',
  `accepted_at` datetime DEFAULT NULL COMMENT 'When customer accepted quote',
  `expiry_date` datetime DEFAULT NULL,
  `date_sent` datetime DEFAULT NULL COMMENT 'When quote was sent to customer',
  `pdf_url` varchar(255) DEFAULT NULL COMMENT 'Path to generated PDF',
  `notes` text DEFAULT NULL COMMENT 'Staff notes about the quote',
  PRIMARY KEY (`quote_id`),
  UNIQUE KEY `quote_number` (`quote_number`),
  UNIQUE KEY `public_token` (`public_token`),
  KEY `fk_quote_status` (`status_id`),
  KEY `fk_quote_customer` (`medusa_customer_id`),
  KEY `fk_quote_store` (`store_id`),
  KEY `fk_quote_currency` (`currency_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_customer_email` (`customer_email`),
  KEY `idx_status_created` (`status_id`,`created_at` DESC),
  KEY `idx_customer_email_status` (`customer_email`,`status_id`),
  KEY `idx_expiry_date` (`expiry_date`,`status_id`),
  CONSTRAINT `fk_web_quote_currency` FOREIGN KEY (`currency_id`) REFERENCES `oc_currency` (`currency_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_web_quote_customer` FOREIGN KEY (`medusa_customer_id`) REFERENCES `oc_customer` (`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_web_quote_status` FOREIGN KEY (`status_id`) REFERENCES `oc_tsg_quote_status` (`status_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_web_quote_store` FOREIGN KEY (`store_id`) REFERENCES `oc_store` (`store_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `oc_tsg_quote_item` (
  `quote_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `quote_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_variant_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `variant_code` varchar(255) DEFAULT NULL COMMENT 'SKU/variant code snapshot',
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(15,4) NOT NULL COMMENT 'Price per unit frozen at quote creation',
  `single_unit_price` decimal(15,4) NOT NULL DEFAULT 0.0000 COMMENT 'Unit price before bulk discount = variant base price + option add-ons',
  `bulk_discount_id` int(11) DEFAULT NULL COMMENT 'Bulk group used to price this line (oc_product_to_store, else oc_product)',
  `bulk_used` tinyint(1) DEFAULT 1 COMMENT 'Apply the bulk discount when repricing this line',
  `line_total` decimal(15,4) NOT NULL COMMENT 'quantity * unit_price',
  `tax_amount` decimal(15,4) DEFAULT 0.0000,
  `tax_rate_percent` decimal(5,2) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL COMMENT 'Path to product image',
  `is_bespoke` tinyint(1) DEFAULT 0,
  `bespoke_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON line detail: size/material/orientation/options' CHECK (json_valid(`bespoke_data`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `line_order` int(11) DEFAULT 0 COMMENT 'Display order in quote',
  PRIMARY KEY (`quote_item_id`),
  KEY `fk_quote_item_quote` (`quote_id`),
  KEY `fk_quote_item_product` (`product_id`),
  KEY `fk_quote_item_variant` (`product_variant_id`),
  KEY `idx_quote_id` (`quote_id`),
  KEY `fk_web_quote_item_bulk` (`bulk_discount_id`),
  CONSTRAINT `fk_web_quote_item_bulk` FOREIGN KEY (`bulk_discount_id`) REFERENCES `oc_tsg_bulkdiscount_groups` (`bulk_group_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_web_quote_item_product` FOREIGN KEY (`product_id`) REFERENCES `oc_product` (`product_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_web_quote_item_quote` FOREIGN KEY (`quote_id`) REFERENCES `oc_tsg_quote_request` (`quote_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_web_quote_item_variant` FOREIGN KEY (`product_variant_id`) REFERENCES `oc_tsg_product_variants` (`prod_variant_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `oc_tsg_quote_action` (
  `action_id` int(11) NOT NULL AUTO_INCREMENT,
  `quote_id` int(11) NOT NULL,
  `action_type` varchar(32) NOT NULL COMMENT 'Action code, see apps/quotes_web/constants.py (created, status_changed, edited, ...)',
  `action_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Additional data (e.g., reason for change request)' CHECK (json_valid(`action_data`)),
  `user_id` int(11) DEFAULT NULL COMMENT 'auth_user who performed a staff action; NULL for customer actions',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`action_id`),
  KEY `fk_action_quote` (`quote_id`),
  KEY `idx_action_type` (`action_type`),
  KEY `idx_action_quote_created` (`quote_id`,`created_at` DESC),
  KEY `fk_web_quote_action_user` (`user_id`),
  CONSTRAINT `fk_web_quote_action_quote` FOREIGN KEY (`quote_id`) REFERENCES `oc_tsg_quote_request` (`quote_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_web_quote_action_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;


-- 2.2 statuses. Ids are fixed so both environments read the same, but the code always looks
-- a status up by status_code, never by id.
INSERT INTO oc_tsg_quote_status (status_id, status_code, status_name, status_description, color_hex, `order`, is_terminal, is_active)
SELECT * FROM (
    SELECT 1 AS a, 'draft' AS b, 'Draft' AS c, 'Quote created but not yet submitted for review' AS d, '#9CA3AF' AS e, 1 AS f, 0 AS g, 1 AS h
    UNION ALL SELECT 2, 'requested', 'Quote Requested', 'Customer has requested a quote from website', '#3B82F6', 2, 0, 1
    UNION ALL SELECT 3, 'under_review', 'Under Review', 'Staff is reviewing and editing the quote', '#F59E0B', 3, 0, 1
    UNION ALL SELECT 4, 'sent', 'Sent', 'Quote has been sent to customer', '#8B5CF6', 4, 0, 1
    UNION ALL SELECT 5, 'viewed', 'Viewed', 'Customer has viewed the quote', '#06B6D4', 5, 0, 1
    UNION ALL SELECT 6, 'accepted', 'Accepted', 'Customer has accepted the quote', '#10B981', 6, 0, 1
    UNION ALL SELECT 7, 'change_requested', 'Changes Requested', 'Customer has requested changes', '#EF4444', 7, 0, 1
    UNION ALL SELECT 8, 'expired', 'Expired', 'Quote validity period has ended', '#6B7280', 8, 1, 1
    UNION ALL SELECT 9, 'cancelled', 'Cancelled', 'Quote has been cancelled', '#6B7280', 9, 1, 1
) seed
WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_quote_status x WHERE x.status_code = seed.b);

-- 2.3 transitions. Joined on status_code, so this is safe whatever ids the statuses got.
INSERT INTO oc_tsg_quote_status_transition (from_status_id, to_status_id, transition_name, role_required, is_allowed)
SELECT f.status_id, t.status_id, v.tname, v.role, 1
FROM (
    SELECT 'draft' AS fcode, 'under_review' AS tcode, 'Begin Review' AS tname, 'staff' AS role
    UNION ALL SELECT 'draft', 'cancelled', 'Cancel', 'staff'
    UNION ALL SELECT 'requested', 'under_review', 'Begin Review', 'staff'
    UNION ALL SELECT 'requested', 'cancelled', 'Cancel', 'staff'
    UNION ALL SELECT 'under_review', 'draft', 'Return to Draft', 'staff'
    UNION ALL SELECT 'under_review', 'sent', 'Send Quote', 'staff'
    UNION ALL SELECT 'under_review', 'cancelled', 'Cancel', 'staff'
    UNION ALL SELECT 'sent', 'viewed', 'Mark Viewed', 'customer'
    UNION ALL SELECT 'sent', 'under_review', 'Amend quote', 'staff'
    UNION ALL SELECT 'sent', 'cancelled', 'Cancel', 'staff'
    UNION ALL SELECT 'viewed', 'accepted', 'Accept Quote (Customer)', 'customer'
    UNION ALL SELECT 'viewed', 'change_requested', 'Request Changes (Customer)', 'customer'
    UNION ALL SELECT 'viewed', 'under_review', 'Amend quote', 'staff'
    UNION ALL SELECT 'viewed', 'cancelled', 'Cancel', 'staff'
    UNION ALL SELECT 'accepted', 'draft', 'Revise Quote', 'staff'
    UNION ALL SELECT 'change_requested', 'under_review', 'Resume Review', 'staff'
    UNION ALL SELECT 'change_requested', 'cancelled', 'Cancel', 'staff'
) v
JOIN oc_tsg_quote_status f ON f.status_code = v.fcode
JOIN oc_tsg_quote_status t ON t.status_code = v.tcode
WHERE NOT EXISTS (
    SELECT 1 FROM oc_tsg_quote_status_transition x
    WHERE x.from_status_id = f.status_id AND x.to_status_id = t.status_id
);


-- ---------------------------------------------------------------------------
-- 3. VERIFY
-- ---------------------------------------------------------------------------

SELECT COUNT(*) AS statuses_expect_9 FROM oc_tsg_quote_status;
SELECT COUNT(*) AS transitions_expect_17 FROM oc_tsg_quote_status_transition;

SELECT f.status_code AS from_code, s.status_code AS to_code, t.transition_name, t.role_required
FROM oc_tsg_quote_status_transition t
JOIN oc_tsg_quote_status f ON f.status_id = t.from_status_id
JOIN oc_tsg_quote_status s ON s.status_id = t.to_status_id
ORDER BY f.`order`, s.`order`;

-- the five tables, all empty at this point
SELECT 'oc_tsg_quote_request' AS tbl, COUNT(*) AS rows_now FROM oc_tsg_quote_request
UNION ALL SELECT 'oc_tsg_quote_item', COUNT(*) FROM oc_tsg_quote_item
UNION ALL SELECT 'oc_tsg_quote_action', COUNT(*) FROM oc_tsg_quote_action;

-- foreign keys in place (expect 12: transition 2, request 4, item 4, action 2)
SELECT TABLE_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('oc_tsg_quote_status_transition', 'oc_tsg_quote_request',
                     'oc_tsg_quote_item', 'oc_tsg_quote_action')
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME;


-- ---------------------------------------------------------------------------
-- 4. AFTER RUNNING THIS, on the production Medusa host
-- ---------------------------------------------------------------------------
-- a) Add QUOTES_WEB_API_KEY=<same value as tsg_store> to Medusa's env, and restart Django.
--    Without it the create endpoint answers 503 and refuses every quote request.
-- b) Add the same QUOTES_WEB_API_KEY to tsg_store's system/.env.
-- c) tsg_store's config_remote*.php must carry MEDUSA_QUOTE_CREATE_URL and
--    MEDUSA_QUOTE_PORTAL_URL (both already in the repo).
-- d) Check each store's oc_store.url / .ssl is the real domain: the customer's quote link is
--    built from it, and a wrong value makes an unreachable link.
