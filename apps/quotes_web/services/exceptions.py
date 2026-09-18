"""Errors raised by the quotes_web services.

Services raise these; views turn them into HTTP responses (see views.ERROR_STATUS).
"""


class QuotesWebError(Exception):
    """Base for anything the quote services reject."""
    code = 'error'


class EmptyCart(QuotesWebError):
    """A quote was requested with no lines."""
    code = 'empty_cart'


class QuoteNotFound(QuotesWebError):
    code = 'quote_not_found'


class InvalidTransition(QuotesWebError):
    """The status change is not in oc_tsg_quote_status_transition for this role."""
    code = 'invalid_transition'


class QuoteExpired(QuotesWebError):
    """The quote's expiry date has passed."""
    code = 'quote_expired'


class QuoteNotEditable(QuotesWebError):
    """Lines and totals may only change while the quote is draft or under review."""
    code = 'quote_not_editable'
