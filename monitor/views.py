# views.py
import subprocess
import os
from django.http import JsonResponse
from django.shortcuts import render
from .models import AirQuality

def iniciar_captura(request):
    try:
        subprocess.Popen(['python', 'captura_serial.py'])  # Asegúrate de que este path sea correcto
        return JsonResponse({'status': 'OK', 'message': 'Captura iniciada exitosamente'})
    except Exception as e:
        return JsonResponse({'status': 'Error', 'message': str(e)})

def obtener_datos(request):
    # Recupera los últimos datos de calidad del aire
    datos = AirQuality.objects.order_by('-fecha')[:10]
    datos_json = list(datos.values('fecha', 'co2', 'humo', 'temperatura'))
    return JsonResponse({'datos': datos_json})

def dashboard(request):
    return render(request, 'dashboard.html')

