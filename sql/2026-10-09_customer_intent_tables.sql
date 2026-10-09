-- Create the tables behind storefront search logging and Medusa's Search Terms page.
--
-- tsg_store (tsg/dynamic_search) writes one row per search to oc_tsg_customer_intent
-- and Medusa (Admin Tools > Search Terms) reads it. They exist on the development
-- database but not on live, so on live the Search Terms page errors with
--   (1146, "Table 'totalsafetygroup_oc.oc_tsg_customer_intent' doesn't exist")
-- The storefront is unaffected either way: its logging is wrapped in try/catch,
-- so a missing table is silently skipped and searching still works.
--
-- source_id 1 = Internal Search and intent_type_id 1 = Search are the two values the
-- storefront writes today. No foreign keys (none exist on the development copy).
-- Safe to run twice: CREATE ... IF NOT EXISTS and INSERT IGNORE.


-- 1. Preview: which of the three tables already exist (expect 0 rows on live before running)
SELECT table_name
  FROM information_schema.tables
 WHERE table_schema = DATABASE()
   AND table_name IN ('oc_tsg_customer_intent', 'oc_tsg_customer_intent_source', 'oc_tsg_customer_intent_type');


-- 2. Execute
CREATE TABLE IF NOT EXISTS `oc_tsg_customer_intent_source` (
  `source_id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `source_name` varchar(50) NOT NULL,
  PRIMARY KEY (`source_id`),
  UNIQUE KEY `uk_source_name` (`source_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `oc_tsg_customer_intent_type` (
  `intent_type_id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `intent_type_name` varchar(50) NOT NULL,
  PRIMARY KEY (`intent_type_id`),
  UNIQUE KEY `uk_type_name` (`intent_type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `oc_tsg_customer_intent` (
  `intent_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `site_id` smallint(5) unsigned NOT NULL,
  `customer_id` int(10) unsigned DEFAULT NULL,
  `session_id` varchar(64) DEFAULT NULL,
  `source_id` tinyint(3) unsigned NOT NULL,
  `intent_type_id` tinyint(3) unsigned NOT NULL,
  `intent_text` varchar(255) NOT NULL,
  `search_type` varchar(50) DEFAULT NULL,
  `results_found` smallint(5) unsigned DEFAULT NULL,
  `clicked_product_id` int(10) unsigned DEFAULT NULL,
  `response_ms` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`intent_id`),
  KEY `idx_created` (`created_at`),
  KEY `idx_site` (`site_id`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_source` (`source_id`),
  KEY `idx_type` (`intent_type_id`),
  KEY `idx_intent` (`intent_text`(100)),
  KEY `idx_clicked` (`clicked_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `oc_tsg_customer_intent_source` (`source_id`, `source_name`) VALUES
  (1, 'Internal Search'), (2, 'Google'), (3, 'Google Ads'), (4, 'ChatGPT'), (5, 'Claude'),
  (6, 'Perplexity'), (7, 'Gemini'), (8, 'Bing'), (9, 'Manual');

INSERT IGNORE INTO `oc_tsg_customer_intent_type` (`intent_type_id`, `intent_type_name`) VALUES
  (1, 'Search'), (2, 'Filter'), (3, 'Category'), (4, 'Question'), (5, 'Quote'), (6, 'AI Conversation');


-- 3. Verify: all three tables exist, 9 sources and 6 types, and the log is empty
SELECT table_name
  FROM information_schema.tables
 WHERE table_schema = DATABASE()
   AND table_name IN ('oc_tsg_customer_intent', 'oc_tsg_customer_intent_source', 'oc_tsg_customer_intent_type');
SELECT (SELECT COUNT(*) FROM oc_tsg_customer_intent_source) AS sources,
       (SELECT COUNT(*) FROM oc_tsg_customer_intent_type)   AS types,
       (SELECT COUNT(*) FROM oc_tsg_customer_intent)         AS logged_searches;
