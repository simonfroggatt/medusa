"""
Push a product to Merchant Center shortly after it is saved in Medusa.

Saves are collected for a few seconds (one edit usually saves several rows) and
then pushed on a background thread, so pages never wait on Google. Anything
missed here, including queryset .update() calls and size/material price
changes, is picked up by the nightly merchant_sync.
"""
import logging
import threading

from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.feeds import merchant_api
from apps.products.models import (
    OcProduct,
    OcProductDescriptionBase,
    OcProductToStore,
    OcTsgProductVariantCore,
    OcTsgProductVariants,
)

logger = logging.getLogger('apps')

DELAY_SECONDS = 5

_lock = threading.Lock()
_pending = set()
_timer = None


def _flush():
    global _timer
    with _lock:
        product_ids = sorted(_pending)
        _pending.clear()
        _timer = None
    if product_ids:
        from apps.feeds.merchant_sync import push_products
        push_products(product_ids)


def _queue(product_id):
    global _timer
    if not product_id:
        return
    with _lock:
        _pending.add(product_id)
        if _timer is None:
            _timer = threading.Timer(DELAY_SECONDS, _flush)
            _timer.daemon = True
            _timer.start()


def queue_product(product_id):
    if not merchant_api.is_enabled():
        return
    transaction.on_commit(lambda: _queue(product_id))


@receiver(post_save, sender=OcProduct)
@receiver(post_save, sender=OcProductDescriptionBase)
@receiver(post_save, sender=OcProductToStore)
@receiver(post_save, sender=OcTsgProductVariantCore)
def product_saved(sender, instance, **kwargs):
    product_id = instance.pk if sender is OcProduct else instance.product_id
    queue_product(product_id)


@receiver(post_save, sender=OcTsgProductVariants)
def store_variant_saved(sender, instance, **kwargs):
    if not merchant_api.is_enabled():
        return
    try:
        product_id = OcTsgProductVariantCore.objects.values_list('product_id', flat=True).get(pk=instance.prod_var_core_id)
    except OcTsgProductVariantCore.DoesNotExist:
        return
    queue_product(product_id)
