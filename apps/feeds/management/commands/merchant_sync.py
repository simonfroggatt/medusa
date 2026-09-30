"""
Push every store's Google Merchant offers through the Merchant API.

    python manage.py merchant_sync                   # every store with a merchant_center_id
    python manage.py merchant_sync --store 1
    python manage.py merchant_sync --store 1 --dry-run   # build only, nothing sent
    python manage.py merchant_sync --store 1 --dry-run --show 3
    python manage.py merchant_sync --store 1 --product 379
    python manage.py merchant_sync --store 1 --sources   # list the account's data sources

Run nightly from cron: re-sending everything keeps offers from expiring, adds
new products and removes ones Medusa no longer offers. A run that would delete
more than a quarter of what Google holds stops; --force lets it through.
"""
import json
from collections import Counter

from django.core.management.base import BaseCommand, CommandError

from apps.feeds import merchant_api
from apps.feeds.merchant_api import MerchantClient, to_product_input
from apps.feeds.merchant_feed import build_offers
from apps.feeds.merchant_sync import SyncAborted, merchant_stores, sync_product, sync_store
from apps.sites.models import OcStore


class Command(BaseCommand):
    help = 'Push Google Merchant offers through the Merchant API'

    def add_arguments(self, parser):
        parser.add_argument('--store', type=int)
        parser.add_argument('--product', type=int, action='append',
                            help='Only this product (repeatable). Skips the stale-offer clean-up.')
        parser.add_argument('--dry-run', action='store_true', help='Build offers and report; send nothing')
        parser.add_argument('--show', type=int, default=0, help='With --dry-run, print this many ProductInputs')
        parser.add_argument('--sources', action='store_true', help="List the account's data sources and stop")
        parser.add_argument('--force', action='store_true', help='Allow a large stale-offer delete')

    def handle(self, *args, **opts):
        if opts['dry_run']:
            stores = self._stores_for_dry_run(opts['store'])
        else:
            if not merchant_api.is_enabled():
                raise CommandError(f"Merchant API is off: needs MERCHANT_API_ENABLED = True in settings "
                                   f"and the key at {merchant_api.credentials_file()}")
            stores = merchant_stores(opts['store'])
        if not stores:
            raise CommandError('No matching store with a merchant_center_id')

        for store in stores:
            if opts['dry_run']:
                self._dry_run(store, opts['product'], opts['show'])
            elif opts['sources']:
                self._sources(store)
            elif opts['product']:
                client = MerchantClient(store.merchant_center_id)
                for product_id in opts['product']:
                    count, errors = sync_product(store, product_id, client=client)
                    self.stdout.write(f"{store.name} product {product_id}: {count} offers pushed, {len(errors)} errors")
                    for offer_id, message in errors:
                        self.stderr.write(f"  {offer_id}: {message}")
            else:
                try:
                    summary = sync_store(store, force=opts['force'])
                except SyncAborted as e:
                    raise CommandError(str(e))
                self.stdout.write(
                    f"{summary['store']}: {summary['pushed']}/{summary['offers']} pushed, "
                    f"{summary['deleted']} deleted, {len(summary['errors'])} errors, "
                    f"products skipped {summary['skipped_products']}"
                )
                for offer_id, message in summary['errors'][:20]:
                    self.stderr.write(f"  {offer_id}: {message}")

    def _stores_for_dry_run(self, store_id):
        # A dry run needs no Merchant Center id, so a store can be checked before it has one
        if store_id is None:
            return merchant_stores()
        return list(OcStore.objects.filter(store_id=store_id))

    def _dry_run(self, store, product_ids, show):
        offers, skipped = build_offers(store, product_ids=product_ids)
        in_ads = sum(o['show_in_ads'] for o in offers)
        self.stdout.write(f"{store.name}: {len(offers)} offers from "
                          f"{len({o['product_id'] for o in offers})} products, {in_ads} allowed into ads")
        self.stdout.write(f"  products skipped: {skipped or 'none'}")
        for index in range(5):
            counts = Counter(o['custom_labels'][index] or '(none)' for o in offers)
            self.stdout.write(f"  custom_label_{index}: {dict(counts.most_common(8))}")
        long_titles = sum(o['title'].endswith('…') for o in offers)
        self.stdout.write(f"  titles shortened to 150: {long_titles}")
        for offer in offers[:show]:
            self.stdout.write(json.dumps(to_product_input(offer), indent=2))

    def _sources(self, store):
        client = MerchantClient(store.merchant_center_id)
        for source in client.list_data_sources():
            self.stdout.write(f"{store.name}: {source.get('name')}  '{source.get('displayName')}'  input={source.get('input')}")
