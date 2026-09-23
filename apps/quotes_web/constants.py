"""Constants for the customer quote system (quotes_web).

Status codes and transitions live in oc_tsg_quote_status / _status_transition; the codes
below only name the rows the code has to react to. Ids are never hard-coded - look a status
up by code, and validate every status change against the transition table.
"""

# oc_tsg_quote_status.status_code
STATUS_DRAFT = 'draft'
STATUS_REQUESTED = 'requested'
STATUS_UNDER_REVIEW = 'under_review'
STATUS_SENT = 'sent'
STATUS_VIEWED = 'viewed'
STATUS_ACCEPTED = 'accepted'
STATUS_CHANGE_REQUESTED = 'change_requested'
STATUS_EXPIRED = 'expired'
STATUS_CANCELLED = 'cancelled'
STATUS_ORDER_CREATED = 'order_created'

# lines and quote details may only be edited in these
EDITABLE_STATUS_CODES = {STATUS_DRAFT, STATUS_UNDER_REVIEW}

# what a customer may open on their public link. A quote staff have not sent yet - and one
# they have cancelled - must never be reachable, even by someone holding the token.
CUSTOMER_VISIBLE_STATUS_CODES = {
    STATUS_SENT, STATUS_VIEWED, STATUS_ACCEPTED, STATUS_CHANGE_REQUESTED, STATUS_EXPIRED,
}

# oc_tsg_quote_status_transition.role_required
ROLE_STAFF = 'staff'
ROLE_CUSTOMER = 'customer'
# used when a quote sends itself; keeps the history honest about who acted
ROLE_SYSTEM = 'system'

# oc_tsg_quote_action.action_type
ACTION_CREATED = 'created'
ACTION_STATUS_CHANGED = 'status_changed'
ACTION_EDITED = 'edited'
ACTION_VIEWED = 'viewed'
ACTION_ACCEPTED = 'accepted'
ACTION_CHANGE_REQUESTED = 'change_requested'
ACTION_DOWNLOAD_PDF = 'download_pdf'
ACTION_EMAIL_SENT = 'email_sent'
ACTION_WHATSAPP_SENT = 'whatsapp_sent'

# oc_tsg_quote_request.created_from
CREATED_FROM_WEBSITE = 'website'
CREATED_FROM_MEDUSA = 'medusa'

# quote number: QW-<oc_store.prefix>-<quote_id>, e.g. QW-SSAN-12. One sequence across all
# stores; the prefix only labels the brand. QW keeps these apart from the old staff quotes
# on oc_tsg_quote, which display as Q-<prefix>-<id>.
QUOTE_NUMBER_PREFIX = 'QW'
STORE_PREFIX_FALLBACK = 'TSG'

# how long a sent quote stays valid. Per-store later (an oc_store column).
VALIDITY_DAYS = 30

# oc_store.country values that should be quoted by WhatsApp rather than email
WHATSAPP_COUNTRIES = {'United Arab Emirates'}
