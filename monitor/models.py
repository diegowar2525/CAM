from django.db import models

class AirQuality(models.Model):
    co2 = models.FloatField(null=True, blank=True)
    humo = models.FloatField(null=True, blank=True)
    temperatura = models.FloatField(null=True, blank=True)
    humedad = models.FloatField(null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"AirQuality(co2={self.co2}, humo={self.humo}, temperatura={self.temperatura}, humedad={self.humedad}, fecha={self.fecha})"

