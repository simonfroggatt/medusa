-- ISO 7010 codes missing from the symbol library, audited 2026-10-02.
--
-- Upload the matching SVGs to stores/symbols/svg/ FIRST -- the rows point at
-- them. Filenames are uppercase, which is what every symbol added since F013
-- uses.
--
-- Safe to run twice: each insert is guarded on the file it points at and on
-- the code already being registered, so a second run changes nothing. It does
-- NOT use LAST_INSERT_ID(), which would go stale the moment one row is
-- skipped.
--
-- referent is the registered ISO name. function/hazard/humanbehav are plain
-- English written for the wizard's search -- they are not the standard's own
-- wording, so replace them from ISO 7010 if you want the official text.

START TRANSACTION;

-- E071  Rescue toboggan
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/E071.svg', 'Rescue toboggan', 'To show where a rescue toboggan is kept', NULL, 'Injury on a slope, away from vehicle access', '<p>Fetching the toboggan to move a casualty</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/E071.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 4, 'E071', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/E071.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- M063  Remove ski pole strap from wrist
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/M063.svg', 'Remove ski pole strap from wrist', 'To require ski pole straps off the wrist', NULL, 'Arm or shoulder injury if a pole catches', '<p>Taking the strap off the wrist</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/M063.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 3, 'M063', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/M063.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- M064  Hold two ski poles with a single hand
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/M064.svg', 'Hold two ski poles with a single hand', 'To require both poles in one hand', NULL, 'Injury from a loose pole on a lift or in a queue', '<p>Carrying both poles in one hand</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/M064.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 3, 'M064', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/M064.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- M065  Children must be accompanied
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/M065.svg', 'Children must be accompanied', 'To require an adult with any child', NULL, 'Harm to an unaccompanied child', '<p>Staying with the child</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/M065.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 3, 'M065', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/M065.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- M066  Wear a sports helmet
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/M066.svg', 'Wear a sports helmet', 'To require a sports helmet', NULL, 'Head injury from a fall or collision', '<p>Wearing a helmet</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/M066.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 3, 'M066', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/M066.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- M067  Wear snow goggles
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/M067.svg', 'Wear snow goggles', 'To require snow goggles', NULL, 'Eye injury or snow blindness', '<p>Wearing goggles</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/M067.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 3, 'M067', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/M067.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- P009  No climbing
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/P009.svg', 'No climbing', 'To prohibit climbing', NULL, 'Fall from height, or a collapse under the load', '<p>Not climbing</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/P009.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 1, 'P009', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/P009.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- P016  Do not spray with water
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/P016.svg', 'Do not spray with water', 'To prohibit spraying with water', NULL, 'Electric shock, or damage from water ingress', '<p>Not spraying water</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/P016.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 1, 'P016', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/P016.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- P076  No skiing
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/P076.svg', 'No skiing', 'To prohibit skiing', NULL, 'Collision or fall where skiing is not safe', '<p>Not skiing</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/P076.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 1, 'P076', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/P076.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- P077  No snowboarding
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/P077.svg', 'No snowboarding', 'To prohibit snowboarding', NULL, 'Collision or fall where snowboarding is not safe', '<p>Not snowboarding</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/P077.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 1, 'P077', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/P077.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- P078  No tobogganing or sledding
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/P078.svg', 'No tobogganing or sledding', 'To prohibit tobogganing and sledding', NULL, 'Collision or fall on an unsuitable slope', '<p>Not tobogganing or sledding</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/P078.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 1, 'P078', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/P078.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- P079  No ice skating
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/P079.svg', 'No ice skating', 'To prohibit ice skating', NULL, 'Falling through ice, or injury on a fall', '<p>Not skating</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/P079.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 1, 'P079', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/P079.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- W082  Crevasses under snow
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/W082.svg', 'Crevasses under snow', 'To warn of crevasses hidden by snow', NULL, 'Falling into a crevasse covered by snow', '<p>Keeping clear, or roping up</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/W082.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 2, 'W082', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/W082.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- W083  Avalanche
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/W083.svg', 'Avalanche', 'To warn of avalanche risk', NULL, 'Being caught or buried by an avalanche', '<p>Keeping clear of the slope</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/W083.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 2, 'W083', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/W083.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- W084  Thunderstorm
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/W084.svg', 'Thunderstorm', 'To warn of thunderstorms', NULL, 'Lightning strike', '<p>Getting under cover</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/W084.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 2, 'W084', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/W084.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

-- W085  Typhoon/hurricane/cyclone zone
INSERT INTO oc_tsg_symbols (image_path, svg_path, referent, `function`, content, hazard, humanbehav, shape_id)
SELECT NULL, 'stores/symbols/svg/W085.svg', 'Typhoon/hurricane/cyclone zone', 'To warn of a typhoon, hurricane or cyclone', NULL, 'Injury from extreme wind and flying debris', '<p>Getting under cover and following instructions</p>', 1
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_symbols WHERE svg_path = 'stores/symbols/svg/W085.svg');

INSERT INTO oc_tsg_symbol_standard (symbol_id, compliance_id, category_id, code, status, photolume, reflective, created_at, updated_at)
SELECT s.id, 2, 2, 'W085', 1, 0, 0, NOW(), NOW()
  FROM oc_tsg_symbols s
 WHERE s.svg_path = 'stores/symbols/svg/W085.svg'
   AND NOT EXISTS (SELECT 1 FROM oc_tsg_symbol_standard x
                    WHERE x.symbol_id = s.id AND x.compliance_id = 2);

COMMIT;

-- Check: should be 16, and 16 again after a second run.
SELECT COUNT(*) AS added
  FROM oc_tsg_symbol_standard
 WHERE compliance_id = 2
   AND code IN ('E071', 'M063', 'M064', 'M065', 'M066', 'M067', 'P009', 'P016', 'P076', 'P077', 'P078', 'P079', 'W082', 'W083', 'W084', 'W085');
