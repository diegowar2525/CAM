# views.py
import subprocess
from django.http import JsonResponse
from django.shortcuts import render
from .models import AirQuality

def iniciar_captura(request):
    try:
        # Ejecuta el script que captura los datos
        subprocess.Popen(['python', 'captura_serial.py'])
        return JsonResponse({'status': 'OK', 'message': 'Captura iniciada exitosamente'})
    except Exception as e:
        return JsonResponse({'status': 'Error', 'message': str(e)})

def obtener_datos(request):
    # Recupera los últimos datos de calidad del aire
    datos = AirQuality.objects.order_by('-timestamp')[:10]  # Últimos 10 registros
    datos_json = list(datos.values('timestamp', 'co2', 'humo', 'temperatura'))
    return JsonResponse({'datos': datos_json})

def dashboard(request):
    return render(request, 'dashboard.html')
