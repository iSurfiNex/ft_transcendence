from django.apps import AppConfig

class transcendenceBackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'transcendence_backend'

    def ready(self):
        import transcendence_backend.signals  # Import signal handlers
