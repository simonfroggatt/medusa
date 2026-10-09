"""What visitors typed into the storefront search box (oc_tsg_customer_intent, source 1)."""
from datetime import timedelta

from django.db.models import Avg, Count, Max
from django.db.models.functions import Lower
from django.utils import timezone

from apps.sites.models import OcStore, OcTsgCustomerIntent

SOURCE_INTERNAL_SEARCH = 1
INTENT_TYPE_SEARCH = 1

PERIODS = [(7, 'Last 7 days'), (30, 'Last 30 days'), (90, 'Last 90 days'), (0, 'All time')]
DEFAULT_DAYS = 30
ROW_LIMIT = 200


def parse_filters(params):
    """Store id (0 = all stores) and period in days (0 = all time) from a GET dict.
    Anything unrecognised falls back to the default rather than erroring."""
    try:
        site_id = max(int(params.get('site', 0)), 0)
    except (TypeError, ValueError):
        site_id = 0
    try:
        days = int(params.get('days', DEFAULT_DAYS))
    except (TypeError, ValueError):
        days = DEFAULT_DAYS
    if days not in [d for d, _ in PERIODS]:
        days = DEFAULT_DAYS
    return site_id, days


def _searches(site_id, days):
    qs = OcTsgCustomerIntent.objects.filter(
        source_id=SOURCE_INTERNAL_SEARCH, intent_type_id=INTENT_TYPE_SEARCH)
    if site_id:
        qs = qs.filter(site_id=site_id)
    if days:
        qs = qs.filter(created_at__gte=timezone.now() - timedelta(days=days))
    return qs


def _by_term(qs):
    return (qs.annotate(term=Lower('intent_text')).values('term')
            .annotate(searches=Count('intent_id'),
                      people=Count('session_id', distinct=True),
                      avg_results=Avg('results_found'),
                      last_searched=Max('created_at')))


def percent(part, whole):
    return round(100.0 * part / whole, 1) if whole else 0.0


def build_report(site_id, days):
    qs = _searches(site_id, days)
    total = qs.count()
    no_results_total = qs.filter(results_found=0).count()
    people = qs.values('session_id').distinct().count()
    avg_ms = qs.aggregate(ms=Avg('response_ms'))['ms']

    return {
        'total': total,
        'people': people,
        'no_results_total': no_results_total,
        'no_results_pct': percent(no_results_total, total),
        'avg_ms': int(avg_ms) if avg_ms is not None else None,
        'top': list(_by_term(qs).order_by('-searches', '-last_searched')[:ROW_LIMIT]),
        'no_results': list(_by_term(qs.filter(results_found=0)).order_by('-searches', '-last_searched')[:ROW_LIMIT]),
    }


def store_choices():
    return list(OcStore.objects.filter(store_id__gt=0).order_by('name').values_list('store_id', 'name'))
