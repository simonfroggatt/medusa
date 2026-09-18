"""Sending a quote to the customer.

Email goes through the Gmail API (apps/emails/views.send_email) from the store's sales address,
using that store's TEMPLATE_WEB_QUOTE template. WhatsApp is not built yet: a quote with an email
address is emailed whatever the store's region, and one without is left for staff to send by
hand from the Customer link panel.

Real sending is switched on by settings.QUOTES_WEB_SEND_EMAILS, so a development machine never
emails customers by accident. With it off, everything is checked and built, then logged instead
of sent.

An 'email_sent' action is written only when the email actually went - the audit trail must
never claim a send that did not happen.
"""
import logging
from decimal import Decimal

from django.conf import settings

from apps.emails import views as email_views
from apps.templating.models import OcTsgTemplates

from .. import constants
from . import quotes as quote_service

logger = logging.getLogger(__name__)

ROUTE_EMAIL = 'email'
ROUTE_WHATSAPP = 'whatsapp'
TEMPLATE_WEB_QUOTE = 'TEMPLATE_WEB_QUOTE'


def route_for(quote):
    """Which channel this quote's store implies (decision 4)."""
    return ROUTE_WHATSAPP if quote.is_whatsapp_region() else ROUTE_EMAIL


def _firstname(quote):
    name = (quote.customer_name or '').strip()
    return name.split()[0] if name else 'there'


def _money_text(quote, value):
    symbol = quote.currency.symbol_left if getattr(quote, 'currency_id', None) else ''
    return f'{symbol or ""}{Decimal(str(value or 0)):.2f}'


def sender_for(quote):
    """The store's sales address - the email invites a reply, so it should come from sales."""
    store = quote.store
    return (store.email_address or store.accounts_email_address or '').strip()


def build_quote_email(quote):
    """Subject and HTML body from the store's TEMPLATE_WEB_QUOTE, or None if it has none."""
    store = quote.store
    template = (OcTsgTemplates.objects
                .filter(store_id=store.store_id, template_type__enum_val=TEMPLATE_WEB_QUOTE)
                .first())
    if template is None:
        return None

    replacements = {
        '{{firstname}}': _firstname(quote),
        '{{quote_number}}': quote.quote_number,
        '{{quote_link}}': quote_service.portal_url(quote),
        '{{quote_total}}': _money_text(quote, quote.total),
        '{{valid_days}}': constants.VALIDITY_DAYS,
        '{{store_name}}': store.name or '',
        '{{store_website}}': store.website or '',
        '{{company_name}}': store.company_name or '',
        '{{sales_email}}': store.email_address or '',
    }
    replacements['{{store_email_footer}}'] = email_views.apply_template_replacements(
        store.email_footer_text or '', replacements)

    return {
        'subject': email_views.apply_template_replacements(template.subject or '', replacements),
        'body': email_views.apply_template_replacements(template.main or '', replacements),
    }


def send_quote(quote, user=None):
    """Email the customer their quote link. Returns (route, sent, reason).

    `reason` says why nothing was sent, so staff can be told to send the link themselves.
    """
    route = route_for(quote)

    if not quote.customer_email:
        return route, False, 'there is no email address on the quote'
    if not quote.store_id:
        return route, False, 'the quote has no store'
    if not quote_service.portal_url(quote):
        return route, False, 'the store has no website address'

    email = build_quote_email(quote)
    if email is None:
        return route, False, f'{quote.store.name} has no web quote email template'

    sender = sender_for(quote)
    if not sender:
        return route, False, f'{quote.store.name} has no email address to send from'

    if not getattr(settings, 'QUOTES_WEB_SEND_EMAILS', False):
        logger.info('quotes_web: [sending off] would email %s to %s from %s - "%s"',
                    quote.quote_number, quote.customer_email, sender, email['subject'])
        return route, False, 'sending is switched off on this machine'

    try:
        status = email_views.send_email([quote.customer_email], sender,
                                        email['subject'], email['body'])
    except Exception:
        logger.exception('quotes_web: emailing %s failed', quote.quote_number)
        return route, False, 'the email could not be sent'

    if not status.get('success'):
        logger.warning('quotes_web: emailing %s refused: %s',
                       quote.quote_number, status.get('message'))
        return route, False, f"the email could not be sent ({status.get('message')})"

    quote_service.log_action(quote, constants.ACTION_EMAIL_SENT, user=user,
                             data={'to': quote.customer_email, 'from': sender})
    logger.info('quotes_web: emailed %s to %s', quote.quote_number, quote.customer_email)
    return route, True, ''
