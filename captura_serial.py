import serial
import django

# Esto ya está configurado automáticamente al estar dentro del proyecto
django.setup()

from monitor.models import AirQuality  # Asegúrate de que el nombre de la app sea correcto

arduino = serial.Serial('COM3', 9600)  # Ajusta el puerto según tu sistema

while True:
    try:
        linea = arduino.readline().decode().strip()  # Lee la línea del puerto serial
        partes = linea.split(',')  # Divide la cadena por comas (cada par clave:valor)
        datos = {}

        for parte in partes:
            # Intentar dividir cada parte en clave y valor usando split(':', 1)
            try:
                clave, valor = parte.split(':', 1)  # El '1' asegura que solo se divide una vez
                datos[clave.strip().lower()] = float(valor.strip())
                print(datos)
            except ValueError as e:
                print(f"Error al procesar la parte: {parte}, Error: {e}")

        # Guardar los datos en la base de datos
        AirQuality.objects.create(
            co2=datos.get('co2', 0),  # Usamos .get() para evitar errores si falta algún dato
            humo=datos.get('humo', 0),
            temperatura=datos.get('temp', 0)
            
        )

        print("Dato guardado:", datos)

    except Exception as e:
        print("Error:", e)
