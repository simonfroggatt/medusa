-- quotes_web: the email a customer gets when their quote is ready.
--
-- Why a new template rather than reusing TEMPLATE_CUSTOMER_QUOTE: that one is the legacy
-- staff quote email (apps/emails/views.py load_email_template_quotes), it exists only for
-- stores 1 and 4, and its wording says "please find attached your quote". Web quotes are sent
-- automatically and carry a link to the quote page, so they need their own wording - and
-- editing the shared rows would change what the old tool sends.
--
--   1. new predefine TEMPLATE_WEB_QUOTE
--   2. one row per customer-facing store (1 SSAN, 2 HSS, 3 FSS, 4 IMO) - the legacy template
--      was missing for HSS and FSS entirely, so auto-send would have failed for them
--
-- Placeholders filled in by Medusa (apps/quotes_web/services/notify.py):
--   {{firstname}} {{quote_number}} {{quote_link}} {{valid_days}} {{quote_total}}
--   {{store_name}} {{company_name}} {{sales_email}} {{store_email_footer}}
--
-- {{quote_link}} is the customer's own link (oc_store.ssl or .url + the quote token). It is
-- the only way into the quote, so the email must never go anywhere but the address on it.
--
-- oc_tsg_templates has FK constraints to oc_tsg_template_predefines and oc_store, so the
-- predefine is inserted first.
--
-- Run in Navicat on totalsafetygroup_oc.


-- ---------------------------------------------------------------------------
-- 1. PREVIEW: both should return no rows
-- ---------------------------------------------------------------------------

SELECT * FROM oc_tsg_template_predefines WHERE enum_val = 'TEMPLATE_WEB_QUOTE';

SELECT t.id, t.store_id, t.name FROM oc_tsg_templates t
JOIN oc_tsg_template_predefines p ON p.id = t.template_type
WHERE p.enum_val = 'TEMPLATE_WEB_QUOTE';

-- for reference: which stores have the legacy quote email today (expect 1 and 4)
SELECT t.store_id, s.name FROM oc_tsg_templates t
JOIN oc_tsg_template_predefines p ON p.id = t.template_type
LEFT JOIN oc_store s ON s.store_id = t.store_id
WHERE p.enum_val = 'TEMPLATE_CUSTOMER_QUOTE';


-- ---------------------------------------------------------------------------
-- 2. EXECUTE
-- ---------------------------------------------------------------------------

INSERT INTO oc_tsg_template_predefines (title, enum_val)
SELECT 'Web Quote', 'TEMPLATE_WEB_QUOTE' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_template_predefines WHERE enum_val = 'TEMPLATE_WEB_QUOTE');

INSERT INTO oc_tsg_templates (store_id, template_type, name, subject, main, plain_text, description, header_image)
SELECT s.store_id,
       p.id,
       'web quote',
       '{{store_name}} - Your quote {{quote_number}}',
       '<p>Hi {{firstname}},</p>
<p>Thank you for your enquiry. Your quote <strong>{{quote_number}}</strong> is ready, total <strong>{{quote_total}}</strong>.</p>
<p><a href="{{quote_link}}">View your quote</a></p>
<p>You can view it online, accept it when you are ready, or ask us to change anything - just reply to this email.</p>
<p>The quote is valid for <strong>{{valid_days}}</strong> days.</p>
<p>Email: <a href="mailto:{{sales_email}}">{{sales_email}}</a></p>
<p>Best regards</p>
<p>The {{store_name}} team</p>
<p>{{store_email_footer}}</p>',
       1,
       'Web Quote',
       NULL
FROM oc_store s
JOIN oc_tsg_template_predefines p ON p.enum_val = 'TEMPLATE_WEB_QUOTE'
WHERE s.store_id IN (1, 2, 3, 4)
  AND NOT EXISTS (SELECT 1 FROM oc_tsg_templates x WHERE x.store_id = s.store_id AND x.template_type = p.id);


-- ---------------------------------------------------------------------------
-- 3. VERIFY
-- ---------------------------------------------------------------------------

-- one row per customer-facing store, each with a {{quote_link}} in the body
SELECT t.id, t.store_id, s.name AS store, t.subject,
       t.main LIKE '%{{quote_link}}%' AS has_link
FROM oc_tsg_templates t
JOIN oc_tsg_template_predefines p ON p.id = t.template_type
LEFT JOIN oc_store s ON s.store_id = t.store_id
WHERE p.enum_val = 'TEMPLATE_WEB_QUOTE'
ORDER BY t.store_id;

SELECT COUNT(*) AS rows_expect_4 FROM oc_tsg_templates t
JOIN oc_tsg_template_predefines p ON p.id = t.template_type
WHERE p.enum_val = 'TEMPLATE_WEB_QUOTE';
