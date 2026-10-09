-- "Make your own" offer on category pages: which bespoke designer each shop category leads to.
--
-- Managed in Medusa (Sites > Bespoke Offers); read by the storefront category page
-- (tsg_store catalog/model/tsg/category_bespoke.php), which shows a card in the product grid and a
-- slim strip under the intro text, both linking to the designer ("Custom signs at stock prices").
--
-- How a category is decided: its own row if it has one, otherwise its parent's, then the grandparent's.
-- A row with bespoke_product_id NULL means "no offer here" and also stops sub-categories inheriting.
-- Categories with no row anywhere up the tree show nothing. The offer is also hidden automatically when
-- every product in the category is ticked "not bespoke" in Medusa.
--   bespoke_product_id : the designer product the link opens (Custom Prohibition Sign = 41077, Warning 41079,
--                        Mandatory 41078, Safe Conditions 41080, Fire Safety 41081, Fire Action Notice 41556,
--                        Site Safety 41964, Bi-Lingual 41965)
--   type_label         : used in the wording, e.g. "Custom prohibition signs at stock sign prices"
--   headline/text      : optional wording for this category; blank uses the default wording
--   prefill            : optional words handed to the designer's "describe it" AI box
-- The rows below are a DRAFT mapping from the category tree. status 1 = on (clear matches); status 0 = a
-- best guess, left OFF until reviewed in Medusa. Safe to run twice: CREATE IF NOT EXISTS and INSERT IGNORE
-- on the unique category_id, so it never overwrites an edit you have made in Medusa.


-- 1. Preview: no rows before the first run
SELECT table_name FROM information_schema.tables
 WHERE table_schema = DATABASE() AND table_name = 'oc_tsg_category_bespoke';


-- 2. Execute
CREATE TABLE IF NOT EXISTS `oc_tsg_category_bespoke` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(10) unsigned NOT NULL,
  `bespoke_product_id` int(10) unsigned DEFAULT NULL,
  `symbol_id` int(10) unsigned DEFAULT NULL,
  `type_label` varchar(40) DEFAULT NULL,
  `headline` varchar(150) DEFAULT NULL,
  `text` varchar(300) DEFAULT NULL,
  `prefill` varchar(150) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `note` varchar(255) DEFAULT NULL,
  `date_added` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `oc_tsg_category_bespoke` (`category_id`, `bespoke_product_id`, `type_label`, `status`, `note`) VALUES
  (249, 41077, 'prohibition', 1, 'type of the main category'),
  (257, 41079, 'warning', 1, 'type of the main category'),
  (270, 41078, 'mandatory', 1, 'type of the main category'),
  (283, 41080, 'safe condition', 1, 'type of the main category'),
  (301, 41081, 'fire safety', 1, 'type of the main category'),
  (479, 41556, 'fire action notice', 1, 'type of the main category'),
  (555, 41080, 'safe condition', 1, 'type of the main category'),
  (280, 41556, 'fire action notice', 1, 'Fire action notices have their own designer'),
  (281, 41080, 'safe condition', 1, 'Escape route signs are green safe-condition signs'),
  (306, 41080, 'safe condition', 1, 'Photoluminescent fire exit signs'),
  (313, 41081, 'fire safety', 1, 'Photoluminescent extinguisher signs'),
  (312, 41081, 'fire safety', 1, 'Photoluminescent fire equipment signs'),
  (315, 41556, 'fire action notice', 1, 'Photoluminescent fire action signs'),
  (346, 41078, 'mandatory', 1, 'Construction mandatory'),
  (350, 41077, 'prohibition', 1, 'Construction prohibition'),
  (345, 41079, 'warning', 1, 'Construction warning/danger'),
  (296, 41965, 'bilingual', 0, 'REVIEW: Welsh signs: the bilingual designer'),
  (308, 41080, 'safe condition', 0, 'REVIEW: EEC 92-58 photoluminescent: guess safe condition'),
  (478, 41964, 'site safety', 0, 'REVIEW: Site safety: the site board designer'),
  (351, 41964, 'site safety', 0, 'REVIEW: Pick & mix boards: site board designer'),
  (347, 41964, 'site safety', 0, 'REVIEW: Site security: site board designer'),
  (349, 41964, 'site safety', 0, 'REVIEW: Construction general: guess site board'),
  (490, 41081, 'fire safety', 0, 'REVIEW: IMO fire control'),
  (488, 41080, 'safe condition', 0, 'REVIEW: IMO life saving'),
  (489, 41080, 'safe condition', 0, 'REVIEW: Water safety'),
  (269, 41079, 'warning', 0, 'REVIEW: COSHH: warning'),
  (568, 41079, 'warning', 0, 'REVIEW: GHS: warning'),
  (337, 41078, 'mandatory', 0, 'REVIEW: CCTV: guess mandatory/blue'),
  (894, 41078, 'mandatory', 0, 'REVIEW: Social distancing: guess mandatory/blue'),
  (896, 41078, 'mandatory', 0, 'REVIEW: Social distancing (shops): guess'),
  (893, 41078, 'mandatory', 0, 'REVIEW: COVID-19: guess'),
  (898, 41078, 'mandatory', 0, 'REVIEW: Vaccination & testing: guess'),
  (895, 41078, 'mandatory', 0, 'REVIEW: School social distancing: guess'),
  (334, 41079, 'warning', 0, 'REVIEW: Fork-lift truck signs: warning'),
  (255, NULL, NULL, 1, 'NO OFFER: Tie tags'),
  (260, NULL, NULL, 1, 'NO OFFER: Tie tags'),
  (341, NULL, NULL, 1, 'NO OFFER: Tie tags'),
  (279, NULL, NULL, 1, 'NO OFFER: Tie-on tags'),
  (258, NULL, NULL, 1, 'NO OFFER: Labels in packs'),
  (556, NULL, NULL, 1, 'NO OFFER: Lockout labels'),
  (375, NULL, NULL, 1, 'NO OFFER: Glass awareness stickers'),
  (362, NULL, NULL, 1, 'NO OFFER: Hazard labels on rolls (children inherit)'),
  (316, NULL, NULL, 1, 'NO OFFER: Tapes and labels'),
  (338, NULL, NULL, 1, 'NO OFFER: Pipeline tapes'),
  (394, NULL, NULL, 1, 'NO OFFER: Hi-vis clothing'),
  (330, NULL, NULL, 1, 'NO OFFER: Stands and frames'),
  (363, NULL, NULL, 1, 'NO OFFER: Accessories and fittings'),
  (339, NULL, NULL, 1, 'NO OFFER: Quality control labels'),
  (472, NULL, NULL, 1, 'NO OFFER: Safety stickers 6 up'),
  (569, NULL, NULL, 1, 'NO OFFER: FORS stickers'),
  (378, NULL, NULL, 1, 'NO OFFER: Custom signs: already custom');


-- 3. Verify: 51 draft rows = 16 on + 18 off (review) + 17 "no offer"; the products named exist
SELECT status, IF(bespoke_product_id IS NULL, 'no offer', 'offer') AS kind, COUNT(*) AS rows_
  FROM oc_tsg_category_bespoke GROUP BY status, kind ORDER BY kind, status;
SELECT b.bespoke_product_id, pdb.title, COUNT(*) AS categories
  FROM oc_tsg_category_bespoke b
  LEFT JOIN oc_product_description_base pdb ON pdb.product_id = b.bespoke_product_id
 WHERE b.bespoke_product_id IS NOT NULL GROUP BY b.bespoke_product_id, pdb.title ORDER BY categories DESC;
