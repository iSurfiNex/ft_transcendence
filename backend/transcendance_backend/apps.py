from django.apps import AppConfig

class TranscendanceBackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'transcendance_backend'

    def ready(self):
        import transcendance_backend.signals  # Import signal handlers
