-- Take 63 loss-making products out of Shopping ads on Safety Signs and Notices.
--
-- From shopping-products-to-exclude.csv (Google Ads, last 120 days): every
-- product here cost more in ads than it brought in. Each listed variant was
-- the product's advertised (cheapest) variant, so the product-level
-- "Include Google Ads" tick is turned off rather than the variant's own
-- exclude flag; that would only move the ad to the next cheapest size.
--
-- The products stay in Google free listings. The Merchant API sync marks every
-- variant of them "excluded from Shopping ads". Reverse any product by ticking
-- Include Google Ads again in Medusa (store tab).
--
-- AFTER RUNNING: SQL updates don't trigger push-on-save, so run
--     python manage.py merchant_sync --store 1
-- or leave it for the 3am sync. Store 1 only. Safe to run twice.
--
-- Pairs below are (product_id, variant/Merchant item id), worst loss first.
-- The "Watch" rows from the CSV are deliberately not included.


-- 1. Preview: should list 63 rows, all include_google_ads = 1 today
SELECT p2s.product_id, p2s.include_google_ads, pdb.name
  FROM oc_product_to_store p2s
  JOIN oc_product_description_base pdb ON pdb.product_id = p2s.product_id
 WHERE p2s.store_id = 1
   AND p2s.product_id IN (1171, 1238, 1993, 41010, 41711, 533, 40700, 41122, 42285, 571, 1881, 1551, 42073, 40040, 41683, 41945, 1627, 41535, 41696, 40737, 1649, 987, 1811, 934, 41003, 41545, 41738, 41691, 41551, 40766, 594, 42094, 40400, 41459, 41616, 41085, 41682, 1701, 3509, 41148, 41179, 73, 41663, 41576, 1851, 40994, 659, 593, 40056, 1828, 1379, 969, 1879, 40929, 41744, 41919, 41722, 41724, 42306, 41854, 528, 40160, 40734)
 ORDER BY p2s.product_id;

-- 2. Execute
UPDATE oc_product_to_store
   SET include_google_ads = 0
 WHERE store_id = 1
   AND product_id IN (1171, 1238, 1993, 41010, 41711, 533, 40700, 41122, 42285, 571, 1881, 1551, 42073, 40040, 41683, 41945, 1627, 41535, 41696, 40737, 1649, 987, 1811, 934, 41003, 41545, 41738, 41691, 41551, 40766, 594, 42094, 40400, 41459, 41616, 41085, 41682, 1701, 3509, 41148, 41179, 73, 41663, 41576, 1851, 40994, 659, 593, 40056, 1828, 1379, 969, 1879, 40929, 41744, 41919, 41722, 41724, 42306, 41854, 528, 40160, 40734);

-- 3. Verify: should return 63, 0
SELECT COUNT(*) AS products, SUM(include_google_ads) AS still_in_ads
  FROM oc_product_to_store
 WHERE store_id = 1
   AND product_id IN (1171, 1238, 1993, 41010, 41711, 533, 40700, 41122, 42285, 571, 1881, 1551, 42073, 40040, 41683, 41945, 1627, 41535, 41696, 40737, 1649, 987, 1811, 934, 41003, 41545, 41738, 41691, 41551, 40766, 594, 42094, 40400, 41459, 41616, 41085, 41682, 1701, 3509, 41148, 41179, 73, 41663, 41576, 1851, 40994, 659, 593, 40056, 1828, 1379, 969, 1879, 40929, 41744, 41919, 41722, 41724, 42306, 41854, 528, 40160, 40734);


/* Source list (product_id, Merchant item id):
    (1171, 3792)  -- Attention all visitors do not enter unless authorised by staff sign (lost £183.92),
    (1238, 3958)  -- Metal Temporary Road Sign Frame Stanchion 600mm x 450mm (lost £152.84),
    (1993, 20373)  -- HSE The Health and Safety Law Poster A3 (lost £118.17),
    (41010, 16766)  -- REFLEXITE ECE 104 Reflective Tape 50mm x 50m (lost £117.53),
    (41711, 20208)  -- Next Inspection Labels 300x200 vinyl (lost £94.61),
    (533, 2093)  -- Fire exit keep clear sign 300x110 vinyl (lost £94.38),
    (40700, 16158)  -- Stop Go Sign 600mm Metal (lost £90.42),
    (41122, 17549)  -- PPE Policy in Operation Sign 300x400 vinyl (lost £87.83),
    (42285, 24606)  -- Site Safety Sign - Past this point all safety wear MUST be worn (lost £83.78),
    (571, 2202)  -- Push bar to open sign 300x50 vinyl (lost £67.15),
    (1881, 5646)  -- Disabled parking only sign 320x250 DiBond (lost £64.81),
    (1551, 4669)  -- Beware vehicles crossing pedestrians look both ways 600x450 (lost £64.77),
    (42073, 23725)  -- DOT 7001 Men at Work Quick-Lock Sign 600mm (lost £62.21),
    (40040, 7315)  -- Closed for cleaning A Board (lost £59.60),
    (41683, 20097)  -- Safety electrical connection do not remove labels 300x200 (lost £58.06),
    (41945, 21611)  -- 6 Point Fire Action Notice 150x200 vinyl (lost £55.95),
    (1627, 4786)  -- Danger deep excavations sign 600x450 vinyl (lost £50.77),
    (41535, 19419)  -- Private Car Park - We accept no liability sign (lost £49.42),
    (41696, 20143)  -- Blind spot take care & FORS Silver sticker 300x200 (lost £48.34),
    (40737, 11433)  -- Spill Kit For Emergency Spill Team Only Sign 150x200 (lost £47.98),
    (1649, 4870)  -- Danger construction site keep out sign 600x200 (lost £46.90),
    (987, 3462)  -- Photoluminescent Fire exit arrow down 300x100 rigid (lost £45.91),
    (1811, 22036)  -- 5 mph speed limit sign DOT 670 300mm (lost £45.43),
    (934, 20294)  -- Fire Hydrant H Symbol Sign 180x200 window sticker (lost £45.28),
    (41003, 16694)  -- Max speeds for this vehicle sign 250x125 (lost £43.88),
    (41545, 19488)  -- Warning Keep Clear Moving Gate Sign 200x300 (lost £43.52),
    (41738, 20311)  -- Fire door keep shut do not block or wedge open (lost £42.72),
    (41691, 20119)  -- Universal Screw Banding and Channel Clamps (Pair) (lost £40.93),
    (41551, 19538)  -- Angles Morts / Blind Spot HGV Sticker (lost £40.82),
    (40766, 11938)  -- Four Truck Marker Boards ECE70 (lost £39.72),
    (594, 2313)  -- Fire exit arrow right sign 300x100 vinyl (lost £39.56),
    (42094, 23777)  -- DOT 7018 Pedestrians Right Arrow Quick-Lock 600x450 (lost £39.54),
    (40400, 8895)  -- Back to Back Mounting Set 76mm (lost £39.50),
    (41459, 19122)  -- Limited and Excepted Quantity Labels (roll of 250) (lost £38.82),
    (41616, 19836)  -- Maximum Load Per Level Sign 300x400 (lost £38.66),
    (41085, 17173)  -- Polite Notice - dog fouling clean up (lost £38.65),
    (41682, 20096)  -- Warning More than one supply labels 300x200 (lost £38.32),
    (1701, 5072)  -- Highway maintenance sticker 1000x100 (lost £36.99),
    (3509, 6424)  -- Caution construction traffic sign 600x450 Zintec (lost £36.81),
    (41148, 17626)  -- Calibrated Stickers - QC Labels 300x200 (lost £35.58),
    (41179, 17819)  -- Fire Door Keep Shut Stickers 300x200 (lost £35.24),
    (73, 353)  -- No Parking Sign 400x300 vinyl (lost £34.70),
    (41663, 20049)  -- Type 6/7 HGV Truck Marker Boards (lost £34.55),
    (41576, 19685)  -- Electric Vehicle Charging Only Sign 320x250 DiBond (lost £34.20),
    (1851, 5528)  -- Car park users at own risk sign (lost £32.97),
    (40994, 16665)  -- Long Load Triangle Sign 600mm (lost £32.81),
    (659, 2541)  -- First aider Stickers (5 pack) (lost £32.55),
    (593, 2305)  -- Fire exit arrow left sign 300x100 vinyl (lost £32.18),
    (40056, 16531)  -- School Bus Reflective Sign 200x200 (lost £32.17),
    (1828, 23251)  -- DOT 557.1 Road hump ahead sign 450mm (lost £31.44),
    (1379, 4286)  -- Anti-climb paint warning sign 200x300 (lost £30.80),
    (969, 3383)  -- Fire Blanket sign 220x95 (lost £30.75),
    (1879, 5638)  -- Vehicles parked at owners risk sign 320x250 DiBond (lost £27.43),
    (40929, 16504)  -- Smoking area please keep tidy sign (lost £27.16),
    (41744, 20356)  -- 5 Point Fire Action Notice Welsh/English (lost £27.08),
    (41919, 21459)  -- First Aid Point Sign 450x600 Correx (lost £26.44),
    (41722, 20278)  -- LITH-EX lithium-ion battery fires sign (lost £25.13),
    (41724, 20285)  -- Warning Swinging gate sign 200x300 (lost £24.05),
    (42306, 24781)  -- IMPA Restricted Area Authorised Personnel Only (lost £22.44),
    (41854, 20906)  -- Caution Hot water sticker 150x50 (lost £19.85),
    (528, 2056)  -- Keep clear fire exit 300x200 (lost £19.16),
    (40160, 7825)  -- Emergency Spill Kit Sign 200x300 (lost £18.97),
    (40734, 11391)  -- Spill Kit Aggressive fluids (Hazchem) Sign (lost £17.10)
*/
