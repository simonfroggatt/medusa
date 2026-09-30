-- Which Google Merchant Center account a store's products are pushed to.
--
-- The Merchant API sync (apps/feeds, `manage.py merchant_sync` and the
-- push-on-save hooks) only touches stores that have an id here. A store with
-- NULL is skipped, so IMO Signs, Highway and Fire stay off until they get their
-- own Merchant Center accounts.
--
-- RUN THIS BEFORE DEPLOYING THE CODE, locally and on live. OcStore gains a
-- merchant_center_id field, and every query on oc_store will fail until the
-- column exists. Safe to run twice.


-- 1. Preview
SHOW COLUMNS FROM oc_store LIKE 'merchant_center_id';

-- 2. Execute
ALTER TABLE oc_store
    ADD COLUMN IF NOT EXISTS merchant_center_id VARCHAR(20) NULL DEFAULT NULL AFTER branding_dir;

-- Safety Signs and Notices only for now. IMO Signs and the others stay NULL.
UPDATE oc_store SET merchant_center_id = '131345215' WHERE store_id = 1;

-- 3. Verify
SELECT store_id, name, merchant_center_id FROM oc_store ORDER BY store_id;
