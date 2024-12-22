from django.shortcuts import render

from rest_framework import viewsets
from .models import Vivienda
from .serializers import ViviendaSerializer

class ViviendaViewSet(viewsets.ModelViewSet):
    queryset = Vivienda.objects.all()
    serializer_class = ViviendaSerializer
