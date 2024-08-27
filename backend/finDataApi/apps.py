from django.apps import AppConfig

class FindataapiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'finDataApi'
#It dynamically grows the traning data and updates the ML model 
    def ready(self):
        import finDataApi.signals  