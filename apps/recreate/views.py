import json
from collections import defaultdict

from django.contrib.auth.decorators import login_required
from django.db.models import Count
import requests
from django.http import Http404, HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import render
from django.templatetags.static import static
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.views.decorators.http import require_POST

from apps.recreate import services
from apps.recreate.models import OcTsgBespokeRecreations as Recreation
from medusa.decorators import group_required

STAFF = ('superuser', 'sales')
MAX_DESIGN_BYTES = 5_000_000


def staff_view(view):
    return login_required(group_required(*STAFF)(view))


def _row(product_id):
    row = Recreation.objects.filter(product_id=product_id).first()
    if row is None:
        raise Http404('No recreation for this product yet')
    return row


def _names(ids):
    if not ids:
        return {}
    return {p['product_id']: p for p in services.live_products(list(ids))}


@staff_view
def recreation_list(request):
    counts = dict(Recreation.objects.values_list('status').annotate(n=Count('id')))
    context = {
        'heading': 'Stock sign recreations',
        'statuses': [(key, label, counts.get(key, 0)) for key, label in Recreation.STATUSES.items()],
        'current': request.GET.get('status', ''),
    }
    return render(request, 'recreate/list.html', context)


@staff_view
def recreation_list_api(request):
    rows = Recreation.objects.all().order_by('product_id')
    status = request.GET.get('status')
    if status:
        rows = rows.filter(status=status)
    rows = list(rows)
    products = _names(r.product_id for r in rows)
    data = []
    for r in rows:
        p = products.get(r.product_id, {})
        data.append({
            'product_id': r.product_id,
            'name': p.get('name') or '',
            'image': services.image_url(r.source_image) if r.source_image else '',
            'sign_reads': r.sign_reads or '',
            'status': r.status,
            'status_label': r.status_label,
            'confidence': float(r.confidence) if r.confidence is not None else None,
            'missing': ', '.join(m.get('iso_ref') or m.get('description', '') for m in r.missing_list),
            'notes': r.error or r.ai_notes or '',
            'updated': r.updated_at.strftime('%d/%m/%Y %H:%M') if r.updated_at else '',
            'url': reverse('recreate-review', args=[r.product_id]),
        })
    return JsonResponse({'data': data})


@staff_view
def review(request, product_id):
    row = _row(product_id)
    p = _names([product_id]).get(product_id, {})
    ids = list(Recreation.objects.filter(status=row.status).order_by('product_id').values_list('product_id', flat=True))
    at = ids.index(product_id) if product_id in ids else -1
    nav = {
        'label': f'({row.status_label})',
        'previous_url': reverse('recreate-review', args=[ids[at - 1]]) if at > 0 else '',
        'next_url': reverse('recreate-review', args=[ids[at + 1]]) if 0 <= at < len(ids) - 1 else '',
    }
    context = {
        'heading': f'Product {product_id}',
        'breadcrumbs': [{'name': 'Stock sign recreations', 'url': reverse('recreate-list')}],
        'nav_data': nav,
        'row': row,
        'product': p,
        'image': services.image_url(row.source_image) if row.source_image else '',
        'size': services.size_by_id(row.size_id) if row.size_id else None,
        'frame_url': reverse('recreate-frame', args=[product_id]),
        'statuses': Recreation.STATUSES,
    }
    return render(request, 'recreate/review.html', context)


@staff_view
def feed(request, name):
    """The shop's symbol data, served by Medusa so the designer stays on one site."""
    try:
        data = services.feed(name)
    except services.RecreateError:
        raise Http404('Unknown feed')
    except requests.RequestException as e:
        return JsonResponse({'error': f'The shop’s feed could not be read: {e}'}, status=502)
    if name == 'symbols':
        # Symbol artwork comes through Medusa too (same site, no cross-site request).
        for item in data:
            item['url'] = reverse('recreate-symbol', args=[item['symbol_id']])
    response = JsonResponse(data, safe=False)
    response['Cache-Control'] = 'private, max-age=300'
    return response


@staff_view
def symbol(request, symbol_id):
    """One symbol's artwork, passed through from the shop."""
    svg = services.symbol_svg(symbol_id)
    if svg is None:
        raise Http404('Symbol not found')
    response = HttpResponse(svg, content_type='image/svg+xml')
    response['Cache-Control'] = 'private, max-age=86400'
    response['X-Content-Type-Options'] = 'nosniff'
    return response


def _open_config(row, product, request):
    """What the designer should open for this product."""
    size = services.size_by_id(row.size_id) if row.size_id else None
    return {
        'dataUrl': request.build_absolute_uri(reverse('recreate-feed', args=['NAME'])).replace('NAME', '{name}'),
        'suggestUrl': None,
        'translateUrl': None,
        'assetBase': static('recreate/designer/'),
        'open': {
            'productName': product.get('name') or f'Product {row.product_id}',
            'size': size,
            'recipe': json.loads(row.recipe) if row.recipe else None,
            'design': json.loads(row.design) if row.design else None,
        },
    }


@xframe_options_sameorigin
@staff_view
def designer_frame(request, product_id):
    """The designer with Medusa's review buttons."""
    row = _row(product_id)
    config = _open_config(row, _names([product_id]).get(product_id, {}), request)
    config['review'] = {
        'productId': product_id,
        'status': row.status,
        'saveUrl': reverse('recreate-save', args=[product_id]),
        'csrfToken': get_token(request),
    }
    return render(request, 'recreate/frame.html', {'config': config})


@staff_view
def approved(request):
    """Quick check inside Medusa: the approved products with "Customise me" on each image.
    The customer-facing version of this page is on the test site (approved.html)."""
    rows = list(Recreation.objects.filter(status=Recreation.STATUS_APPROVED).order_by('product_id'))
    products = _names(r.product_id for r in rows)
    items = [{
        'product_id': r.product_id,
        'name': products.get(r.product_id, {}).get('name') or f'Product {r.product_id}',
        'image': services.image_url(r.source_image) if r.source_image else '',
        'size': services.size_by_id(r.size_id) if r.size_id else None,
        'url': reverse('recreate-customise', args=[r.product_id]),
    } for r in rows]
    context = {
        'heading': 'Approved signs (shop preview)',
        'breadcrumbs': [{'name': 'Stock sign recreations', 'url': reverse('recreate-list')}],
        'items': items,
    }
    return render(request, 'recreate/approved.html', context)


@staff_view
def customise(request, product_id):
    """Shop preview: the customer's designer, opened on the approved design."""
    row = _row(product_id)
    if row.status != Recreation.STATUS_APPROVED:
        raise Http404('That design is not approved yet')
    product = _names([product_id]).get(product_id, {})
    return render(request, 'recreate/customise.html', {
        'config': _open_config(row, product, request),
        'name': product.get('name') or f'Product {product_id}',
        'back_url': reverse('recreate-approved'),
    })


@require_POST
@staff_view
def save(request, product_id):
    row = _row(product_id)
    if len(request.body) > MAX_DESIGN_BYTES:
        return JsonResponse({'error': 'Design too large'}, status=413)
    try:
        body = json.loads(request.body)
    except ValueError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    status = body.get('status')
    design = body.get('design')
    if status not in (Recreation.STATUS_REVIEW, Recreation.STATUS_APPROVED):
        return JsonResponse({'error': 'Unknown status'}, status=400)
    if not isinstance(design, dict) or design.get('root', {}).get('role') != 'sign':
        return JsonResponse({'error': 'Not a sign design'}, status=400)
    row.design = json.dumps(design, ensure_ascii=False)
    row.status = status
    row.reviewed_by_id = request.user.id
    row.reviewed_at = timezone.now()
    row.save()
    return JsonResponse({'status': row.status, 'label': row.status_label})


@require_POST
@staff_view
def set_status(request, product_id):
    row = _row(product_id)
    status = request.POST.get('status')
    if status not in (Recreation.STATUS_UNSUITABLE, Recreation.STATUS_REVIEW, Recreation.STATUS_NEEDS_SYMBOL):
        return JsonResponse({'error': 'Unknown status'}, status=400)
    row.status = status
    row.reviewed_by_id = request.user.id
    row.reviewed_at = timezone.now()
    row.save()
    return JsonResponse({'status': row.status, 'label': row.status_label})


@require_POST
@staff_view
def rerun(request, product_id):
    row = services.recreate(product_id)
    return JsonResponse({'status': row.status, 'label': row.status_label, 'error': row.error or ''})


@staff_view
def missing_symbols(request):
    groups = defaultdict(lambda: {'description': '', 'products': []})
    for row in Recreation.objects.filter(status=Recreation.STATUS_NEEDS_SYMBOL).order_by('product_id'):
        for m in row.missing_list:
            ref = (m.get('iso_ref') or '').strip().upper() or '(not ISO)'
            key = ref if ref != '(not ISO)' else f"(not ISO) {m.get('description', '')[:60]}"
            group = groups[key]
            group['ref'] = ref
            group['description'] = group['description'] or m.get('description', '')
            if row.product_id not in group['products']:
                group['products'].append(row.product_id)
    ordered = sorted(groups.values(), key=lambda g: (-len(g['products']), g['ref']))
    context = {
        'heading': 'Missing symbols',
        'breadcrumbs': [{'name': 'Stock sign recreations', 'url': reverse('recreate-list')}],
        'groups': ordered,
    }
    return render(request, 'recreate/missing.html', context)
