-- Bump the symbol library's version so every symbol URL changes, and the
-- caches between the shop and the customer let go of the old artwork.
--
-- Run this whenever you upload replacement symbol SVGs. It is what makes the
-- designer show new artwork straight away instead of a day later.
--
-- Only needed while USE_CDN is on. With the files on this server the feed uses
-- each file's own modification time and never looks at this.
--
-- Written as DELETE + INSERT rather than ON DUPLICATE KEY, because oc_setting
-- has no unique index on (store_id, key) to hang that on.

START TRANSACTION;

DELETE FROM oc_setting
 WHERE store_id = 0 AND `key` = 'config_bespoke_symbol_version';

INSERT INTO oc_setting (store_id, `code`, `key`, value, serialized)
VALUES (0, 'config', 'config_bespoke_symbol_version', UNIX_TIMESTAMP(), 0);

COMMIT;

SELECT value, FROM_UNIXTIME(value) AS bumped_at
  FROM oc_setting WHERE `key` = 'config_bespoke_symbol_version';
