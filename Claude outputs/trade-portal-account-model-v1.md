# Trade Portal — Account model v1 (organisation, billing, users, addresses)

Status: proposed, 30 Sep 2026. This is the foundation everything else hangs off. Get it right once; the UI for phase one only shows the simple case.

## 1. The rule

Five things, kept separate:

| Thing | What it is | One per… |
|---|---|---|
| **Organisation node** | A company, group, division or branch. Nodes form a tree. | Any level of a customer's structure that changes who pays, what price applies, or who may order |
| **Billing account** | Who gets invoiced: terms, credit limit, mandate, Xero contact, AP email, PO rules | A node flagged as "bills here"; several nodes can roll up to one |
| **User** | A person who logs in | Email address |
| **Membership** | A user's role at a node | User × node |
| **Address** | A delivery address | Node (saved) or order (one-off) |

Everything else (orders, quotes, saved lists, branding) attaches to a node and records which billing account applied at the time.

## 2. Organisation node

Table `trade_org` (portal-owned, real Django migration).

- `id`
- `parent_id` nullable → self. Null = top of a tree.
- `kind`: `group` | `company` | `division` | `branch` | `site`. Labels only; the code never branches on kind, it walks the tree.
- `name`, `display_name` (what the buyer sees, e.g. "Hayley Lincolnshire")
- `legal_name`, `company_number`, `vat_number` (nullable; usually only on `company` nodes)
- `sector`: `reseller_sign` | `reseller_print` | `fire_services` | `electrical` | `mro` | `fm` | `contractor` | `housing` | `council` | `education` | `nhs` | `other`
- `is_billing_account` bool — this node has a billing record (see §3)
- `medusa_company_id` nullable → `oc_tsg_company.company_id`. Set on billing nodes so Medusa, orders and Xero keep working unchanged.
- `status`: `pending` | `approved` | `on_stop` | `closed`
- `branding_id` nullable → `trade_branding` (logo, paperwork name; inherited down the tree if null)
- `pricing_store_id` → `oc_store` (5 = Trade). Per node so a group deal can override.
- `settings` JSON: `po_required` (bool), `order_ref_required`, `approval_threshold` (money, null = none). Inherited down the tree when absent.
- timestamps, `created_by`

Rules: a node inherits anything it doesn't set from its nearest ancestor. Depth is unlimited but the UI shows at most group → company → branch in phase one.

### Resolution: "who pays for this node"

Walk up from the node (including itself) to the first node with `is_billing_account = true`. That is the billing account. Every order stores both `org_id` (where it was placed) and `billing_org_id` (resolved at the time), so restructuring later never rewrites history.

## 3. Billing account

Table `trade_billing` — one row per node with `is_billing_account = true`.

- `org_id` (unique) → `trade_org`
- `payment_terms`: `proforma` | `card` | `account_30` | `account_60` | `direct_debit`
- `credit_limit`, `credit_used` (derived, cached)
- `xero_contact_id`
- `invoice_email` (AP mailbox), `statement_email`
- `invoice_split`: `per_billing_account` | `per_branch` | `per_po`
- `tier_pool_level`: `billing_account` | `top_of_tree` — where monthly quantities pool
- `dd_mandate_ref` nullable (GoCardless)
- `billing_address_*` (the invoice address; not a delivery address)
- `accounts_contact_name`, `accounts_phone`

Phase one: only `per_billing_account` and `billing_account` are implemented; the columns exist.

## 4. Users and membership

Table `trade_user` — the portal's own Django user model. Not `auth_user` (that's staff), not `oc_customer` passwords.

- `id`, `email` (unique, login), `password`, `first_name`, `last_name`, `phone`, `is_active`, `last_login`
- `medusa_customer_id` nullable → `oc_customer` (link to the existing contact record; needed so historic orders can be shown)

Table `trade_membership`

- `user_id`, `org_id`, `role`: `admin` | `buyer` | `approver` | `viewer`
- `inherit` bool — role applies to every descendant of `org_id`
- `spend_limit` nullable — per-order cap for buyers
- `default` bool — the node the user lands on at login
- unique (user, org)

Rules: visibility is exactly the set of nodes a user has membership on, plus descendants when `inherit` is set. Being in a group tree grants nothing by itself. A user can belong to nodes in different trees (a consultant who buys for two clients).

## 5. Addresses

Table `trade_address`

- `org_id` → node that owns it
- `label` ("Head office", "Site 14 Kettering")
- address fields, `contact_name`, `contact_phone`, `delivery_notes`
- `is_default` per org
- `medusa_address_id` nullable → `oc_address`

One-off addresses (drop-ship to the customer's customer) are written straight onto the order (`oc_order.shipping_*`) with `trade_order_ext.saved_address_id = null` and `is_dropship = true`. They are never added to the book unless the buyer ticks "save".

## 6. Branding

Table `trade_branding`

- `org_id`
- `paperwork_name` (what appears as the sender on despatch notes and quotes)
- `logo` file, `logo_on_paperwork` bool, `logo_on_signs_allowed` bool
- `contact_line` (phone/email printed on paperwork)
- `plain_packaging` bool — nothing of ours in the box

Attached to a node; children inherit if they have none. AMS can have its own while Hayley Group has another.

## 7. Order and quote extension

Table `trade_order_ext` (one row per portal order; `oc_order` itself is untouched)

- `order_id` → `oc_order`
- `org_id` (placed at), `billing_org_id` (resolved), `user_id` (placed by)
- `po_number`, `cost_centre`, `order_ref`
- `saved_address_id` nullable, `is_dropship` bool, `branding_id` used
- `approval_status`: `none` | `pending` | `approved` | `rejected`, `approved_by`, `approved_at`
- `price_snapshot` JSON: store, tier level, band applied per line at the time
- `billing_period` (YYYY-MM) — which month-end run this belongs to

Same shape for quotes (`trade_quote_ext` over `oc_tsg_quote_request`).

## 8. Worked examples

**Single reseller (TPT Fire):** one node, `company`, `is_billing_account = true`. One user, `admin`. Two saved addresses. Drop-ships to clients. Tree depth 1. This is 90% of phase one.

**Hayley:** `Hayley Group` (group, not billing) → `Hayley Lincolnshire` (branch, not billing), `Hayley Rail Oldbury` (branch, not billing), `Hayley HQ` (company, **billing**) ; and `AMS` (company, **billing**) → `AMS Nuclear Division` (branch). Lincolnshire's orders resolve up to Hayley HQ; AMS Nuclear resolves to AMS. Amanda in accounts has `viewer` on Hayley Group with `inherit`. Jo at Lincolnshire has `buyer` on her branch only. `tier_pool_level = top_of_tree` on both billing accounts if a group deal is agreed.

**CEF:** `CEF` (group) → `CEF Reading` (branch, **billing**) ; `CEF Region South` (division, **billing**) → three branches. Branch D independent: its own `company` node, billing, no parent.

**Clarion Housing:** one company node, billing, one buyer, 104 saved addresses labelled by scheme. `po_required = true`. Later a `site` node per scheme when the sign register arrives.

**Edmundson:** today three branches buy separately under three emails. Create `Edmundson Electrical` (group, not billing) with three branch nodes each `is_billing_account = true` (they pay separately today). If HQ later centralises, flip the branches' flag off and set it on the group; history keeps `billing_org_id` as it was.

## 9. Migration from what exists

- 217 `oc_tsg_company` rows → 217 `company` nodes, `is_billing_account = true`, `medusa_company_id` set; billing from `payment_terms`, `credit_limit`, `accounts_*`.
- `oc_customer` rows with `company_id` → `trade_user` (inactive until they set a password) + `admin` membership on that node.
- PO-paying emails with no company row (most of the ~1,000 PO orders/yr) → nodes created on approval, not in bulk; staff "merge into tree" tool attaches them to an existing tree when the buyer turns out to be a branch of a known group.
- Historic orders are linked by `oc_order.email` → `trade_user.email` so the buyer sees their past orders on first login.

## 10. Phase-one UI over this model

Shows one company node with users, addresses and branding. No tree editor. No branch switcher. The account switcher component exists but is hidden when a user has one node. Staff (in Medusa) can build trees and set billing flags from day one, so Hayley-style accounts can be set up by hand before the customer-facing tree UI exists.

## 11. Things this deliberately does not do

- Model a customer's real corporate structure. Only nodes that change price, payer or permission exist.
- Put billing fields on the node. Billing is its own row so two nodes with the same invoice address still get separate statements and limits.
- Reuse `oc_customer` as the login. It's a contact record; keep it that way.
