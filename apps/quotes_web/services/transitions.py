"""Quote status changes.

Every change is validated against oc_tsg_quote_status_transition - no status rules are
hard-coded here. The status codes below only decide which timestamps go with a change.
"""
import logging

from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from .. import constants
from ..models import Quote, QuoteStatus, QuoteStatusTransition
from .exceptions import InvalidTransition
from .quotes import log_action

logger = logging.getLogger(__name__)


def allowed_transitions(quote, role):
    """Transitions this role may make from the quote's current status."""
    return (QuoteStatusTransition.objects
            .filter(from_status_id=quote.status_id, role_required=role, is_allowed=True,
                    to_status__is_active=True)
            .select_related('to_status')
            .order_by('to_status__sort_order'))


def can_transition(quote, to_code, role):
    return allowed_transitions(quote, role).filter(to_status__status_code=to_code).exists()


def _timestamp_fields(quote, to_code, now):
    """Which columns a given status change owns. Only these are written."""
    fields = []
    if to_code == constants.STATUS_SENT:
        quote.date_sent = now
        quote.expiry_date = now + timedelta(days=constants.VALIDITY_DAYS)
        fields += ['date_sent', 'expiry_date']
    elif to_code == constants.STATUS_VIEWED and quote.viewed_at is None:
        quote.viewed_at = now
        fields.append('viewed_at')
    elif to_code == constants.STATUS_ACCEPTED:
        quote.accepted_at = now
        fields.append('accepted_at')
    return fields


@transaction.atomic
def change_status(quote, to_code, role, user=None, data=None,
                  ip_address=None, user_agent=None):
    """Move a quote to the status with this code, if the table allows it for this role.

    Locks the quote row, so a customer accepting while staff cancel cannot race. Writes only
    the columns this change owns, never a full save of a stale copy.
    """
    quote = Quote.objects.select_for_update().get(pk=quote.pk)
    from_code = quote.status.status_code

    if from_code == to_code:
        return quote

    if not can_transition(quote, to_code, role):
        raise InvalidTransition(
            f'{role} cannot move quote {quote.quote_number} from {from_code} to {to_code}')

    target = QuoteStatus.objects.get(status_code=to_code)
    now = timezone.now()
    quote.status = target
    fields = ['status', 'updated_at'] + _timestamp_fields(quote, to_code, now)
    quote.save(update_fields=fields)

    action_data = {'from': from_code, 'to': to_code, 'role': role}
    if data:
        action_data.update(data)
    log_action(quote, constants.ACTION_STATUS_CHANGED, user=user, data=action_data,
               ip_address=ip_address, user_agent=user_agent)
    logger.info('quotes_web: %s %s -> %s by %s', quote.quote_number, from_code, to_code, role)
    return quote
