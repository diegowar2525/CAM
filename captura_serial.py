import serial
import django
import time
from datetime import datetime
from django.utils import timezone

# Inicializa Django
django.setup()

from monitor.models import AirQuality

# Configura el puerto serial
try:
    arduino = serial.Serial('COM3', 9600, timeout=2)
    print("✅ Conexión serial establecida.")
except serial.SerialException as e:
    print("❌ No se pudo conectar al puerto serial:", e)
    exit()

def procesar_linea(linea):
    datos = {}
    partes = linea.split(',')
    for parte in partes:
        try:
            clave, valor = parte.split(':', 1)
            datos[clave.strip().lower()] = valor.strip()
        except ValueError as e:
            print(f"⚠️ Error al dividir la parte: {parte} -> {e}")
    return datos

def validar_float(valor, minimo, maximo):
    try:
        valor = float(valor)
        if minimo <= valor <= maximo:
            return valor
        else:
            return None
    except:
        return None

while True:
    try:
        linea = arduino.readline().decode().strip()
        if not linea:
            continue

        print("🧾 Línea recibida:", repr(linea))  # Ver línea cruda

        datos = procesar_linea(linea)

        # Imprimir claves y valores recibidos
        print("🔍 Claves detectadas:", datos.keys())
        for clave, valor in datos.items():
            print(f"🔸 {clave} => {valor}")

        co2 = validar_float(datos.get('co2'), 0, 5000)
        humo = validar_float(datos.get('humo'), 0, 1)
        temperatura = validar_float(datos.get('temp'), -10, 80)
        humedad = validar_float(datos.get('hum'), 0, 100)

        if not all([co2 is not None, humo is not None, temperatura is not None, humedad is not None]):
            print("❌ Datos inválidos, se omite esta línea:", {
                'co2': co2,
                'humo': humo,
                'temperatura': temperatura,
                'humedad': humedad,
            })
            continue

        AirQuality.objects.create(
            co2=co2,
            humo=humo,
            temperatura=temperatura,
            humedad=humedad
        )

        print("✅ Datos guardados:", {
            "co2": co2,
            "humo": humo,
            "temperatura": temperatura,
            "humedad": humedad
        })

    except serial.SerialException as e:
        print("❌ Error con el puerto serial:", e)
        break
    except Exception as e:
        print("❌ Error inesperado:", e)
