import subprocess
import os
from django.http import JsonResponse
from django.shortcuts import render
from .models import AirQuality
from django.contrib.auth.decorators import login_required

pid_file = "captura_pid.txt"

@login_required
def iniciar_captura(request):
    try:
        process = subprocess.Popen(["python", "captura_serial.py"])  # Inicia el proceso
        # Guardar el PID del proceso
        with open(pid_file, "w") as f:
            f.write(str(process.pid))
        return JsonResponse(
            {"status": "OK", "message": "Captura iniciada exitosamente"}
        )
    except Exception as e:
        return JsonResponse({"status": "Error", "message": str(e)})


@login_required
def obtener_datos(request):
    # Recupera los últimos datos de calidad del aire
    datos = AirQuality.objects.order_by("-fecha")[:10]
    datos_json = list(datos.values("fecha", "co2", "humo", "temperatura", "humedad"))
    return JsonResponse({"datos": datos_json})


@login_required
def detener_captura(request):
    try:
        # Leer el PID desde el archivo
        if os.path.exists(pid_file):
            with open(pid_file, "r") as f:
                pid = int(f.read())

            # Matar el proceso con ese PID
            os.kill(pid, 9)  # Signal 9 (SIGKILL) fuerza la terminación del proceso
            os.remove(
                pid_file
            )  # Eliminar el archivo de PID después de detener el proceso
            return JsonResponse(
                {"status": "OK", "message": "Captura detenida exitosamente"}
            )
        else:
            return JsonResponse(
                {"status": "Error", "message": "No hay captura en ejecución"}
            )

    except Exception as e:
        return JsonResponse({"status": "Error", "message": str(e)})


@login_required
def dashboard(request):
    return render(request, "dashboard.html")
