"""
Keeping Merchant Center in step with Medusa.

sync_store: the nightly full push. Every offer is re-sent, which also resets
Google's 30 day expiry, then anything of ours Google still has that Medusa no
longer builds is deleted.

sync_product: one product after it is saved in Medusa.
"""
import logging
from concurrent.futures import ThreadPoolExecutor

from django.db import close_old_connections

from apps.feeds.merchant_api import MerchantClient, to_product_input
from apps.feeds.merchant_feed import build_offers, store_variant_ids_for_product
from apps.sites.models import OcStore

logger = logging.getLogger('apps')

WORKERS = 8
# A full sync that would delete more than this share of what Google holds
# stops instead, unless forced: an empty or broken build must not wipe the feed.
MAX_DELETE_SHARE = 0.25


class SyncAborted(Exception):
    pass


def merchant_stores(store_id=None):
    stores = OcStore.objects.filter(status=True).exclude(merchant_center_id__isnull=True).exclude(merchant_center_id='')
    if store_id is not None:
        stores = stores.filter(store_id=store_id)
    return list(stores)


def _insert_all(client, offers):
    errors = []
    if not offers:
        return errors
    client.data_source()  # resolve once, before the threads race to create it

    def push(offer):
        try:
            client.insert(to_product_input(offer))
        except Exception as e:
            errors.append((offer['offer_id'], str(e)))

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        list(pool.map(push, offers))
    return errors


def sync_store(store, client=None, force=False):
    """Push every offer for `store` and delete stale ones. Returns a summary dict."""
    client = client or MerchantClient(store.merchant_center_id)
    offers, skipped = build_offers(store)
    wanted = {o['offer_id'] for o in offers}

    existing = client.our_offer_ids()
    stale = existing - wanted
    if existing and not force and len(stale) > len(existing) * MAX_DELETE_SHARE:
        raise SyncAborted(
            f"{store.name}: would delete {len(stale)} of {len(existing)} offers on Google. "
            f"Check the build, then re-run with --force if that is right."
        )

    errors = _insert_all(client, offers)
    failed = {offer_id for offer_id, _ in errors}

    deleted = 0
    for offer_id in stale:
        try:
            if client.delete(offer_id):
                deleted += 1
        except Exception as e:
            errors.append((offer_id, f"delete: {e}"))

    summary = {
        'store': store.name,
        'offers': len(offers),
        'pushed': len(offers) - len(failed),
        'deleted': deleted,
        'errors': errors,
        'skipped_products': skipped,
    }
    logger.info(f"Merchant sync {store.name}: {summary['pushed']} pushed, {deleted} deleted, "
                f"{len(errors)} errors, skipped {skipped}")
    for offer_id, message in errors[:20]:
        logger.warning(f"Merchant sync {store.name} offer {offer_id}: {message}")
    return summary


def sync_product(store, product_id, client=None):
    """Push one product's offers for `store` and remove any of its variants no longer offered."""
    client = client or MerchantClient(store.merchant_center_id)
    offers, _ = build_offers(store, product_ids=[product_id])
    wanted = {o['offer_id'] for o in offers}

    errors = _insert_all(client, offers)
    for offer_id in store_variant_ids_for_product(store, product_id) - wanted:
        try:
            client.delete(offer_id)
        except Exception as e:
            errors.append((offer_id, f"delete: {e}"))

    for offer_id, message in errors:
        logger.warning(f"Merchant push {store.name} product {product_id} offer {offer_id}: {message}")
    return len(offers), errors


def push_products(product_ids, store_ids=None):
    """Background push after saves. Never raises: the nightly sync is the backstop."""
    close_old_connections()
    try:
        clients = {}
        for store in merchant_stores():
            if store_ids is not None and store.store_id not in store_ids:
                continue
            for product_id in product_ids:
                try:
                    client = clients.setdefault(store.store_id, MerchantClient(store.merchant_center_id))
                    sync_product(store, product_id, client=client)
                except Exception:
                    logger.exception(f"Merchant push failed: store {store.store_id} product {product_id}")
    finally:
        close_old_connections()
