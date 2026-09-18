from django.apps import AppConfig


class RecreateConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.recreate'
    verbose_name = 'Bespoke recreations of stock products'
