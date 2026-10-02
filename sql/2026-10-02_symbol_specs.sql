-- The two columns left empty on the 16 ISO 7010 symbols added 2026-10-02:
-- refenceno and content.
--
-- refenceno is the ISO code, which is what the shop's search matches on and
-- what the symbol search results print beside the referent (p002 for No
-- smoking). Set here in the case the filenames use.
--
-- content is the visual content description, in the same terse style as the
-- rows already there ("Match (profile, outlined), flame"). WRITTEN FROM THE
-- ARTWORK, NOT TAKEN FROM ISO -- the Online Browsing Platform would not serve
-- them. If you can get the registered wording, run this again with it; the
-- rows are matched on svg_path, so overwriting is safe.
--
-- Safe to run twice.

START TRANSACTION;

UPDATE oc_tsg_symbols
   SET refenceno = 'E071', content = 'Rescue toboggan (profile), cross'
 WHERE svg_path = 'stores/symbols/svg/E071.svg';   -- Rescue toboggan
UPDATE oc_tsg_symbols
   SET refenceno = 'M063', content = 'Hand, ski pole strap released from wrist'
 WHERE svg_path = 'stores/symbols/svg/M063.svg';   -- Remove ski pole strap from wrist
UPDATE oc_tsg_symbols
   SET refenceno = 'M064', content = 'Hand holding two ski poles'
 WHERE svg_path = 'stores/symbols/svg/M064.svg';   -- Hold two ski poles with a single hand
UPDATE oc_tsg_symbols
   SET refenceno = 'M065', content = 'Adult figure and child figure, hands joined'
 WHERE svg_path = 'stores/symbols/svg/M065.svg';   -- Children must be accompanied
UPDATE oc_tsg_symbols
   SET refenceno = 'M066', content = 'Head (profile) wearing a sports helmet'
 WHERE svg_path = 'stores/symbols/svg/M066.svg';   -- Wear a sports helmet
UPDATE oc_tsg_symbols
   SET refenceno = 'M067', content = 'Head (profile) wearing snow goggles'
 WHERE svg_path = 'stores/symbols/svg/M067.svg';   -- Wear snow goggles
UPDATE oc_tsg_symbols
   SET refenceno = 'P009', content = 'Human figure climbing a framework'
 WHERE svg_path = 'stores/symbols/svg/P009.svg';   -- No climbing
UPDATE oc_tsg_symbols
   SET refenceno = 'P016', content = 'Nozzle, water jet'
 WHERE svg_path = 'stores/symbols/svg/P016.svg';   -- Do not spray with water
UPDATE oc_tsg_symbols
   SET refenceno = 'P076', content = 'Human figure skiing'
 WHERE svg_path = 'stores/symbols/svg/P076.svg';   -- No skiing
UPDATE oc_tsg_symbols
   SET refenceno = 'P077', content = 'Human figure snowboarding'
 WHERE svg_path = 'stores/symbols/svg/P077.svg';   -- No snowboarding
UPDATE oc_tsg_symbols
   SET refenceno = 'P078', content = 'Human figure on a toboggan'
 WHERE svg_path = 'stores/symbols/svg/P078.svg';   -- No tobogganing or sledding
UPDATE oc_tsg_symbols
   SET refenceno = 'P079', content = 'Human figure ice skating'
 WHERE svg_path = 'stores/symbols/svg/P079.svg';   -- No ice skating
UPDATE oc_tsg_symbols
   SET refenceno = 'W082', content = 'Human figure falling into a crevasse beneath snow'
 WHERE svg_path = 'stores/symbols/svg/W082.svg';   -- Crevasses under snow
UPDATE oc_tsg_symbols
   SET refenceno = 'W083', content = 'Snow mass sliding down a slope'
 WHERE svg_path = 'stores/symbols/svg/W083.svg';   -- Avalanche
UPDATE oc_tsg_symbols
   SET refenceno = 'W084', content = 'Cloud, lightning flash'
 WHERE svg_path = 'stores/symbols/svg/W084.svg';   -- Thunderstorm
UPDATE oc_tsg_symbols
   SET refenceno = 'W085', content = 'Cyclone spiral'
 WHERE svg_path = 'stores/symbols/svg/W085.svg';   -- Typhoon/hurricane/cyclone zone

COMMIT;

-- Check: 16 rows, every one with a reference number and a content description.
SELECT s.refenceno, s.referent, s.content
  FROM oc_tsg_symbols s
 WHERE s.svg_path IN ('stores/symbols/svg/E071.svg',
                      'stores/symbols/svg/M063.svg',
                      'stores/symbols/svg/M064.svg',
                      'stores/symbols/svg/M065.svg',
                      'stores/symbols/svg/M066.svg',
                      'stores/symbols/svg/M067.svg',
                      'stores/symbols/svg/P009.svg',
                      'stores/symbols/svg/P016.svg',
                      'stores/symbols/svg/P076.svg',
                      'stores/symbols/svg/P077.svg',
                      'stores/symbols/svg/P078.svg',
                      'stores/symbols/svg/P079.svg',
                      'stores/symbols/svg/W082.svg',
                      'stores/symbols/svg/W083.svg',
                      'stores/symbols/svg/W084.svg',
                      'stores/symbols/svg/W085.svg')
 ORDER BY s.refenceno;
