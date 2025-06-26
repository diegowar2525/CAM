from django.db import models

class AirQuality(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    co2 = models.FloatField()
    humo = models.FloatField()
    temperatura = models.FloatField()
    
    def __str__(self):
        return f"AirQuality at {self.timestamp}: CO2={self.co2}, Humo={self.humo}, Temp={self.temperatura}"