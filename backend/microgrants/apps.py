from django.apps import AppConfig


class MicrograntsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'microgrants'
    
    def ready(self):
        import microgrants.signals
