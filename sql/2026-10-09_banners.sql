-- Homepage banners, managed in Medusa (Admin Tools > Sites > Banners) and shown by the
-- storefront carousel (tsg_store catalog/model/tsg/banner.php + tsg/banner_carousel.twig).
--
-- Replaces the slides that were typed into the IMO / Fire Safety Signs templates. One row
-- per slide per store. A slide can be text over a background image (title/subtitle/button
-- filled in) or just a finished picture (leave the text empty and the whole slide is a link).
--   image / image_mobile : path as Medusa stores uploads, e.g. stores/banners/lss-banner.jpg
--   bg_from / bg_to      : gradient shown behind (or instead of) the image
--   date_start / date_end: optional dates to run a banner for a campaign (both inclusive);
--                          NULL = no limit
-- The old OpenCart oc_banner / oc_banner_image tables only hold demo data and are not used.
--
-- Seeds the five IMO slides (store 4) exactly as they were, so IMO keeps its banners.
-- Fire Safety Signs had a copy of the IMO slides; it is NOT seeded, so it shows no banner
-- until you add its own in Medusa.
-- Safe to run twice (CREATE IF NOT EXISTS, INSERT IGNORE on fixed ids).


-- 1. Preview: no rows before the first run
SELECT table_name FROM information_schema.tables
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_banner';


-- 2. Execute
CREATE TABLE IF NOT EXISTS `oc_tsg_banner` (
  `banner_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `store_id` smallint(5) unsigned NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `image_mobile` varchar(255) DEFAULT NULL,
  `alt_text` varchar(150) DEFAULT NULL,
  `tag` varchar(100) DEFAULT NULL,
  `title` varchar(150) DEFAULT NULL,
  `subtitle` varchar(400) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `button_text` varchar(60) DEFAULT NULL,
  `button_style` varchar(10) NOT NULL DEFAULT 'outline',
  `bg_from` varchar(7) NOT NULL DEFAULT '#0B2545',
  `bg_to` varchar(7) NOT NULL DEFAULT '#1a3a5c',
  `date_start` date DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `date_added` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`banner_id`),
  KEY `idx_store_status_sort` (`store_id`, `status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `oc_tsg_banner`
  (`banner_id`, `store_id`, `status`, `sort_order`, `image`, `tag`, `title`, `subtitle`, `link`, `button_text`, `button_style`, `bg_from`, `bg_to`) VALUES
  (1, 4, 1, 1, 'stores/banners/lss-banner.jpg',    'IMO Resolution A.760(18)',     'Life Saving System & Appliance',
   'Internationally standardised LSS signage for lifeboats, lifejackets and rescue equipment — meeting SOLAS requirements fleet-wide.',
   '/life-saving-system--appliance-signs-lss', 'View Details', 'outline', '#0B2545', '#1a3a5c'),
  (2, 4, 1, 2, 'stores/banners/sis-banner.jpg',    'IMO Resolution A.952(23)',     'Shipboard Fire Control Signs',
   'Fire safety and emergency response signage compliant with IMO SIS standards — keeping crews informed and ready in critical moments.',
   '/imo-shipboard-fire-control-signs-sis', 'View Details', 'outline', '#7a1a1a', '#0B2545'),
  (3, 4, 1, 3, 'stores/banners/mes-banner.jpg',    'IMO Resolution A.760(18) MES', 'Means of Escape Signs',
   'Clear, durable MES evacuation route signage manufactured to IMO specifications — photoluminescent and non-photoluminescent options available.',
   '/imo-means-of-escape-signs-mes', 'View Details', 'outline', '#1a4a1a', '#0B2545'),
  (4, 4, 1, 4, 'stores/banners/hazard-banner.jpg', 'Safety Compliance',            'Prohibition & Hazard Warning Signs',
   'Comprehensive range of prohibition, mandatory and hazard warning signs keeping vessels operationally safe and Port State Control compliant.',
   '/imo-hazard-warning-signs-wss', 'View Details', 'outline', '#4a3a00', '#0B2545'),
  (5, 4, 1, 5, 'stores/banners/trade-banner.jpg',  'Maritime Resellers & Operators', 'Trade Accounts Available',
   'Exclusive trade pricing for ship chandlers, marine suppliers and fleet operators. IMO-compliant signage solutions delivered worldwide.',
   '/index.php?route=account/register', 'Request Account', 'solid', '#0B2545', '#3D5A80');


-- 3. Verify: the table exists and holds the 5 IMO slides
SELECT table_name FROM information_schema.tables
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_banner';
SELECT banner_id, store_id, status, sort_order, title, image FROM oc_tsg_banner ORDER BY store_id, sort_order;
