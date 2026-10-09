-- Search ranking rules, edited in Medusa (Admin Tools > Search Rules) and read by the
-- storefront search (tsg_store catalog/model/tsg/dynamic_search.php, cached for an hour).
--
-- rule_type:
--   demote_only  a product that is ONLY in the listed categories goes to the bottom of a
--                search (NHS-style, Welsh signs) unless the search contains a trigger word
--   demote_any   a product in ANY of the listed categories ranks below the standard sign
--                (Prestige, ClearView, floor markers) unless the search contains a trigger word
--   ignore_word  words that describe every product ("sign"); they don't count when ranking
-- category_patterns: category names as LIKE patterns, one per line (% = any text)
-- trigger_words:     comma separated
-- penalty:           how far a demoted product drops (e.g. 300); unused for ignore_word
-- store_id 0 = every store.
--
-- The six rows seeded below are exactly what the storefront did before this table
-- existed, so searching behaves the same until you edit them. Until the table exists
-- the storefront uses those same built-in rules, so running this is not urgent.
-- Safe to run twice (CREATE IF NOT EXISTS, INSERT IGNORE on fixed ids).


-- 1. Preview: should return no rows before the first run
SELECT table_name
  FROM information_schema.tables
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_search_rule';


-- 2. Execute
CREATE TABLE IF NOT EXISTS `oc_tsg_search_rule` (
  `rule_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `store_id` smallint(5) unsigned NOT NULL DEFAULT 0,
  `rule_type` varchar(20) NOT NULL,
  `label` varchar(100) NOT NULL,
  `category_patterns` varchar(1000) DEFAULT NULL,
  `trigger_words` varchar(500) DEFAULT NULL,
  `penalty` smallint(5) unsigned NOT NULL DEFAULT 300,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `date_added` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`rule_id`),
  KEY `idx_store_status` (`store_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `oc_tsg_search_rule`
  (`rule_id`, `store_id`, `rule_type`, `label`, `category_patterns`, `trigger_words`, `penalty`, `status`) VALUES
  (1, 0, 'demote_only', 'NHS signs',          'NHS Signs',                         'nhs,hospital,htm',                          400, 1),
  (2, 0, 'demote_only', 'Welsh signs',        'Welsh Signs',                       'welsh,cymraeg,allanfa,gofal,bilingual',     400, 1),
  (3, 0, 'demote_any',  'Prestige signs',     'Prestige%',                         'prestige',                                  300, 1),
  (4, 0, 'demote_any',  'ClearView acrylic',  '%Cast Acrylic%\n%ClearVIEW%',       'clearview,acrylic,cast',                    300, 1),
  (5, 0, 'demote_any',  'Floor markers',      'Floor Graphics\nFloor Markers & Signs', 'floor,marker,graphic',                  300, 1),
  (6, 0, 'ignore_word', 'Words on every sign', NULL,                               'sign,notice,label,sticker',                   0, 1);


-- 3. Verify: 6 rules, and the multi-line patterns really contain line breaks (rows 4 and 5 = 2 lines)
SELECT rule_id, rule_type, label, penalty, status,
       (LENGTH(category_patterns) - LENGTH(REPLACE(category_patterns, CHAR(10), ''))) + 1 AS pattern_lines
  FROM oc_tsg_search_rule ORDER BY rule_id;
