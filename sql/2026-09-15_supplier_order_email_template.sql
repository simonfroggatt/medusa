-- Supplier order email template, used by the Order Products dialog on the order page
-- (apps/emails/supplier_orders.py, enum TEMPLATE_SUPPLIER_ORDER).
--
-- Placeholders filled in by Medusa:
--   {{order_number}} {{supplier_company}} {{store_name}} {{company_name}} {{sales_email}}
--   {{store_address}} {{store_email_footer}}
--   {{order_lines}}            product table (supplier code, description, size, material, options, qty)
--   {{delivery_instructions}}  "for collection" note, or direct-delivery note with customer address + telephone
--
-- oc_tsg_templates has FK constraints to oc_tsg_template_predefines and oc_store, so run in this order.

-- 1. PREVIEW: both should return no rows before running
SELECT * FROM oc_tsg_template_predefines WHERE enum_val = 'TEMPLATE_SUPPLIER_ORDER';
SELECT t.* FROM oc_tsg_templates t
JOIN oc_tsg_template_predefines p ON p.id = t.template_type AND p.enum_val = 'TEMPLATE_SUPPLIER_ORDER';

-- 2. EXECUTE
INSERT INTO oc_tsg_template_predefines (title, enum_val)
SELECT 'Supplier Order', 'TEMPLATE_SUPPLIER_ORDER' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM oc_tsg_template_predefines WHERE enum_val = 'TEMPLATE_SUPPLIER_ORDER');

INSERT INTO oc_tsg_templates (store_id, template_type, name, subject, main, plain_text, description, header_image)
SELECT s.store_id,
       p.id,
       'supplier order',
       '{{company_name}} - Purchase Order {{order_number}}',
       '<p>Hello {{supplier_company}},</p>
<p>Please supply the following for our order <strong>{{order_number}}</strong>. Please quote this reference on all paperwork.</p>
{{order_lines}}
{{delivery_instructions}}
<p>If you have any questions please reply to this email or contact us at <a href="mailto:{{sales_email}}">{{sales_email}}</a>.</p>
<p>Many thanks</p>
<p>{{company_name}}</p>
<p>{{store_email_footer}}</p>',
       1,
       'Supplier Order',
       NULL
FROM oc_store s
JOIN oc_tsg_template_predefines p ON p.enum_val = 'TEMPLATE_SUPPLIER_ORDER'
WHERE s.store_id > 0
  AND NOT EXISTS (SELECT 1 FROM oc_tsg_templates x WHERE x.store_id = s.store_id AND x.template_type = p.id);

-- 3. VERIFY: one row per store (store_id > 0)
SELECT t.id, t.store_id, t.name, t.subject FROM oc_tsg_templates t
JOIN oc_tsg_template_predefines p ON p.id = t.template_type AND p.enum_val = 'TEMPLATE_SUPPLIER_ORDER'
ORDER BY t.store_id;
