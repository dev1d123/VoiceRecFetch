from django.db import models

class Vivienda(models.Model):
    tipo = models.CharField(max_length=50, verbose_name="Tipo de vivienda")
    zona = models.CharField(max_length=50, verbose_name="Zona")
    dormitorios = models.PositiveIntegerField(verbose_name="Número de dormitorios")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio en USD")
    tamaño = models.PositiveIntegerField(verbose_name="Tamaño en metros cuadrados")
    extras = models.TextField(blank=True, null=True, verbose_name="Extras o características adicionales")
    foto = models.ImageField(upload_to='viviendas/', blank=True, null=True, verbose_name="Foto de la vivienda")

    def __str__(self):
        return f"{self.tipo} en {self.zona} - ${self.precio}"
