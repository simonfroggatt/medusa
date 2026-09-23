"""
Recreate live stock products as bespoke designs with the AI.

    python manage.py recreate_stock_signs                        # next 100, in product order
    python manage.py recreate_stock_signs --limit 20             # a smaller batch
    python manage.py recreate_stock_signs --product 1234         # one product (re-runs it)
    python manage.py recreate_stock_signs --status failed        # retry failed ones
    python manage.py recreate_stock_signs --status needs_symbol  # after adding symbols

Products already in the table are skipped, so each run carries on where the
last one stopped.
"""
import time

from django.core.management.base import BaseCommand, CommandError

from apps.recreate import services
from apps.recreate.models import OcTsgBespokeRecreations as Recreation


class Command(BaseCommand):
    help = 'Recreate live stock products as bespoke sign designs (AI), for review in Medusa.'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=100, help='How many products this run (default 100)')
        parser.add_argument('--random', action='store_true', help='Pick products at random instead of in order')
        parser.add_argument('--product', type=int, action='append', help='Product id (repeatable); re-runs it')
        parser.add_argument('--status', choices=list(Recreation.STATUSES), help='Re-run products with this status')
        parser.add_argument('--pause', type=float, default=0.5, help='Seconds between products')

    def handle(self, *args, **opts):
        if not services.setting('ANTHROPIC_API_KEY'):
            raise CommandError('Set ANTHROPIC_API_KEY (Medusa .env) first.')

        todo = None
        if opts['product']:
            ids = opts['product']
        elif opts['status']:
            # …but not the ones flagged "not bespoke"; --product still re-runs
            # any single product you name.
            ids = list(Recreation.objects.filter(status=opts['status'])
                       .exclude(product_id__in=services.excluded_products())
                       .order_by('product_id').values_list('product_id', flat=True)[:opts['limit']])
        else:
            todo = services.pending_products(random_order=opts['random'])
            ids = todo[:opts['limit']]
            if ids:
                self.stdout.write(f'{len(todo)} product(s) still to do, starting at {ids[0]}.')
        if not ids:
            self.stdout.write('Nothing selected.' if todo else 'Nothing to do: every live product has been recreated.')
            return

        services.catalogue()   # fail early if the shop feeds can't be read
        self.stdout.write(f'Recreating {len(ids)} product(s) with {services.setting("RECREATE_MODEL", "claude-sonnet-5")}…')
        counts, total = {}, 0.0
        for n, product_id in enumerate(ids, 1):
            row = services.recreate(product_id)
            counts[row.status] = counts.get(row.status, 0) + 1
            total += float(row.ai_cost_usd or 0)
            detail = row.error or (row.ai_notes or '')[:80]
            self.stdout.write(f'{n:>4}/{len(ids)}  product {product_id:<6} {row.status:<13} {detail}')
            if opts['pause']:
                time.sleep(opts['pause'])

        summary = ', '.join(f'{Recreation.STATUSES.get(k, k)}: {v}' for k, v in sorted(counts.items()))
        self.stdout.write(self.style.SUCCESS(f'Done. {summary}. Estimated AI cost ${total:.2f}'))
        left = len(services.pending_products())
        if left:
            self.stdout.write(f'{left} product(s) left — run the command again to carry on.')
