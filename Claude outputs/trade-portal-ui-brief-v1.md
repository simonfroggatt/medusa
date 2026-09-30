# Safety Signs & Notices — Trade Portal: UI brief v1

Purpose of this document: a brief for designing the user interface of a new trade-only ordering website and account portal. It describes who uses it, what they do, which screens exist and what the design should feel like. It does not describe the back end.

## 1. What it is

A business-to-business website for buying safety signs. Customers are companies, not individuals: sign shops and print shops that resell, fire protection servicing firms, electrical wholesalers and contractors, facilities management companies, industrial suppliers, housing associations, councils, schools and NHS estates.

It sits alongside the existing retail site (safetysignsandnotices.co.uk) but is a separate site with its own domain and look. Products, prices and orders come from the same back-office system (Medusa).

The existing retail site is a normal web shop. The trade site must feel like a trade counter: fast, practical, account-led, priced for volume, built for repeat ordering rather than browsing.

## 2. Who uses it

Buyer: someone at a trade customer who places orders. Often the owner of a small firm, or a branch buyer at a larger one. Wants to reorder quickly, see their price, drop-ship to their own customer, quote their customer, and not phone anyone.

Account admin: the person who set the account up. Manages users, delivery addresses, branding, payment method, sees invoices and statements.

Visitor: a company that hasn't got an account yet. Needs to understand the offer in ten seconds, see enough of the catalogue and pricing to believe it, and apply for an account without friction.

Staff (Safety Signs & Notices office): approves accounts, places orders on behalf of customers who phone or email a PO, manages prices and tiers. Staff screens live in the existing Medusa back office, not in this site, and are out of scope for this brief.

## 3. Decisions already made

- Trade only. No consumer checkout. Prices are visible to logged-in accounts; visitors see "trade price on login" or an indicative from-price (to be decided in design).
- One account can have many users, many delivery addresses, and (later) many branches with separate billing. Phase one shows a single company with users and addresses; the design should not preclude a branch switcher later.
- Discounts pool across the month by sign size and material, not per order (e.g. all 300×200 self-adhesive bought in September count together). Phase one may launch with flat trade pricing; the design should have a place to show "month to date" progress toward the next price band.
- Payment: purchase order / account (invoice, 30 days), card at checkout, and later Direct Debit at month end. Public sector accounts must be able to enter a PO number on every order and it must appear on the invoice.
- Drop-ship: any order can be delivered to a one-off address that is not saved, with the customer's own name and logo on the despatch paperwork and nothing of ours in the box.
- Reseller branding: the account uploads a logo and company details once; these appear on despatch notes, quotes and (optionally) on printed signs where a logo is part of the design.
- Bespoke signs are designed in the browser using an existing sign builder (a separate embeddable component that produces a preview and a price). The portal hosts it; it does not redesign it.
- Quotes: a buyer can turn a basket into a quote, download it as a PDF under their own branding to send to their customer, and convert it to an order later. Quotes are valid for 30 days.
- Front-end framework is Bootstrap 5. Design must not look like default Bootstrap.

## 4. Site structure

### Public (not logged in)

- Home: the trade offer in one screen. Who it's for, why (trade prices, drop-ship under your name, sign builder, quotes, account terms), how to apply. One primary action: apply for an account. Secondary: browse the catalogue.
- Catalogue: categories and product listing, product page with size and material options. Same catalogue as logged in but without account prices. Search by product code or words.
- Sign builder: visible and usable for preview so a visitor can see what it does; ordering requires an account.
- Apply for an account: company name, registration or VAT number, contact, what kind of business, expected use. Short. Instant approval for established limited companies is the goal; otherwise "we'll confirm within one working day".
- Login.
- Standard pages: delivery, terms, contact, about.

### Logged in — buyer

- Dashboard: month-to-date spend and progress to next price band, recent orders with status, reorder buttons, saved lists, quick order box (type product codes and quantities), quotes awaiting action, account messages.
- Catalogue and product pages with the account's prices and quantity breaks shown.
- Quick order: a grid where the buyer types or pastes product codes and quantities; also CSV upload.
- Saved lists: named lists (e.g. "Site fit-out kit", "Fire door set") that can be added to basket in one click.
- Order history: filter by date, user, delivery address, PO number; reorder any order; download invoice and proof of delivery.
- Basket: lines with size/material/options, quantity breaks applied live, delivery address chooser (saved or one-off), PO number field, order reference, delivery notes.
- Checkout: delivery address (saved, new-and-save, or one-off drop-ship), branding option for the despatch note, payment method (account/PO, card), review, confirm.
- Quotes: create from basket, list of quotes with status (draft, sent, accepted, expired), view, download PDF, convert to order.
- Sign builder: full ordering flow.

### Logged in — account admin (in addition to the above)

- Users: invite by email, roles (admin / buyer / view only), remove.
- Addresses: saved delivery addresses, default per user.
- Branding: logo upload, company name and details as they should appear on paperwork, preview of a despatch note and a quote.
- Account: billing details, payment method, credit terms, statements, invoices, PO settings (e.g. "PO number required on every order").

## 5. Key flows to design end to end

1. Visitor → apply for account → approved → first login → first order.
2. Buyer reorders last month's order to a different site with a new PO number.
3. Buyer drop-ships a fire exit sign set to their own customer, with their branding, and pays on account.
4. Buyer builds a bespoke sign, gets a price, turns it into a branded quote, sends it to their customer, converts to an order a week later.
5. Admin adds a new buyer at a second branch and gives them their own delivery address.

## 6. Design direction

- Trade counter, not shop window. Dense but calm. Product code, size, material and price are the hero on every product row. Photography is small and functional.
- Numbers are first-class: prices, quantity breaks, month-to-date, order totals. Use tabular figures and consistent alignment.
- Speed cues everywhere: quick order box on the dashboard, search by code in the header, reorder buttons in lists, keyboard-friendly quantity grids.
- The customer's own branding shows up in their account (their logo on the dashboard, on quote and despatch previews) so the portal feels like theirs.
- Safety sign colour language (red prohibition, yellow warning, green safe condition, blue mandatory) can inform accents but the interface itself should be neutral so signs stand out.
- Works on a phone for checking an order status or approving something, but the primary use is desktop at a desk or trade counter.
- Bootstrap 5 components, customised: own type scale, colour tokens, spacing. No default blue buttons, no default card grids.

## 7. Out of scope for this brief

Staff/admin screens (Medusa), supplier portal, API/punchout, multi-language, the internals of the sign builder, the retail site.

## 8. Open questions for the designer to propose answers to

- What does a visitor see for price: nothing, a from-price, or a blurred trade price with "log in to see"?
- How to show the monthly price-band progress simply enough that a buyer understands it without explanation.
- Where the drop-ship "one-off address, my branding" choice lives so it is obvious but not in the way for normal orders.
