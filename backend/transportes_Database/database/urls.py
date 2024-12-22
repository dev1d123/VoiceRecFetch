from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ViviendaViewSet

# Crear un enrutador y registrar el ViewSet
router = DefaultRouter()
router.register(r'viviendas', ViviendaViewSet, basename='vivienda')

urlpatterns = [
    path('api/', include(router.urls)),  # Incluimos las URLs generadas automáticamente
]
