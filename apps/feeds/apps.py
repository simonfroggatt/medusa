from django.apps import AppConfig


class FeedsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.feeds'
    label = 'feeds'

    def ready(self):
        from apps.feeds import signals  # noqa: F401  push-on-save to Merchant Center
