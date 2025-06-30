let capturaActiva = false;

function toggleCaptura() {
    if (!capturaActiva) {
        // Iniciar Captura
        fetch('/iniciar-captura/')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    capturaActiva = true;
                    document.getElementById('captura-btn').innerText = "Detener Captura";
                    document.getElementById('captura-btn').classList.add("captura-activa");
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
    } else {
        // Detener Captura
        fetch('/detener-captura/')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    capturaActiva = false;
                    document.getElementById('captura-btn').innerText = "Iniciar Captura";
                    document.getElementById('captura-btn').classList.remove("captura-activa");
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
    }
}

// Convierte 0/1 en Sí/No
function convertirHumo(humo) {
    return humo === 1 ? '  SI  ' : '  NO  ';
}

// Obtiene los últimos datos de la base de datos y actualiza la tabla y tarjetas
function obtenerDatos() {
    fetch('/obtener-datos/')
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById('tabla-datos');
            // Limpiar la tabla antes de agregar los nuevos datos
            tabla.innerHTML = `
                <tr>
                    <th>CO₂ (ppm)</th>
                    <th>Humo</th>
                    <th>Temp(°C)</th>
                    <th>Humedad %</th>
                </tr>
            `;

            data.datos.forEach(dato => {
                const fila = tabla.insertRow();
                fila.innerHTML = `
                    <td>${dato.co2}</td>
                    <td>${convertirHumo(dato.humo)}</td>
                    <td>${dato.temperatura}</td>
                    <td>${dato.humedad}%</td>
                `;

                // Si hay al menos un dato, actualizamos las tarjetas y estado de calidad del aire
                if (data.datos.length > 0) {
                    const primer = data.datos[0];
                    document.getElementById('co2val').innerText = primer.co2;
                    document.getElementById('pm25val').innerText = convertirHumo(primer.humo);
                    document.getElementById('tempval').innerText = primer.temperatura;
                    document.getElementById('humeval').innerText = primer.humedad;

                    // Fecha legible
                    let fechaISO = dato.fecha;
                    let fechaObj = new Date(fechaISO);
                    let fechaLegible = fechaObj.toLocaleString('es-EC', {
                        year: "numeric", month: "2-digit", day: "2-digit",
                        hour: "2-digit", minute: "2-digit", second: "2-digit"
                    });
                    document.getElementById('updatedTime').innerText = fechaLegible;

                    // Estado calidad aire
                    let qualDiv = document.getElementById('qualText');
                    let co2 = parseFloat(dato.co2);
                    qualDiv.className = co2 > 300 ? 'quality-bad' : 'quality-good';
                    qualDiv.innerText = co2 > 300 ? 'Calidad de aire Mala' : 'Calidad de aire Buena';
                }
            });

            actualizarCharts(data.datos);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

// Llamada inicial para cargar los datos
obtenerDatos();

// Actualiza cada 1 segundo (antes 5s)
setInterval(obtenerDatos, 1000);

// INICIALIZA CHARTS VACÍOS
let co2Chart, tempChart, humedadPie, humoPie;

function crearCharts() {
    // CO₂ Line Chart
    const ctxCO2 = document.getElementById('co2Chart').getContext('2d');
    co2Chart = new Chart(ctxCO2, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'CO₂ (ppm)',
                data: [],
                borderColor: '#47a6ff',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Muestra' } },
                y: { beginAtZero: true, title: { display: true, text: 'ppm' } }
            }
        }
    });

    // Temperatura Line Chart
    const ctxTemp = document.getElementById('tempChart').getContext('2d');
    tempChart = new Chart(ctxTemp, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperatura (°C)',
                data: [],
                borderColor: '#43e17d',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Muestra' } },
                y: { beginAtZero: false, title: { display: true, text: '°C' } }
            }
        }
    });

    // Humedad Pie Chart (último dato)
    const ctxHumedad = document.getElementById('humedadPie').getContext('2d');
    humedadPie = new Chart(ctxHumedad, {
        type: 'doughnut',
        data: {
            labels: ['Humedad', 'Resto'],
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#28e7e2', '#353c46']
            }]
        },
        options: { responsive: true }
    });

    // Humo Pie Chart (% sí/no)
    const ctxHumo = document.getElementById('humoPie').getContext('2d');
    humoPie = new Chart(ctxHumo, {
        type: 'doughnut',
        data: {
            labels: ['Sí', 'No'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#f14646', '#8ca3c6']
            }]
        },
        options: { responsive: true }
    });
}

// ACTUALIZA CHARTS CUANDO LLEGAN DATOS
function actualizarCharts(datos) {
    const datosInvertidos = [...datos].reverse();

    // Gráfico de línea CO₂
    co2Chart.data.labels = datosInvertidos.map(d => {
        let fecha = new Date(d.fecha);
        return fecha.toLocaleString('es-EC', {
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        });
    });
    co2Chart.data.datasets[0].data = datosInvertidos.map(d => d.co2);
    co2Chart.update();

    // Gráfico de línea Temperatura
    tempChart.data.labels = datosInvertidos.map(d => {
        let fecha = new Date(d.fecha);
        return fecha.toLocaleString('es-EC', {
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        });
    });
    tempChart.data.datasets[0].data = datosInvertidos.map(d => d.temperatura);
    tempChart.update();

    // Gráfico de pastel de humedad (último dato)
    let hum = datosInvertidos[datosInvertidos.length - 1]?.humedad || 0;
    humedadPie.data.datasets[0].data = [hum, 100 - hum];
    humedadPie.update();

    // Gráfico de pastel de humo (% sí/no)
    let total = datosInvertidos.length;
    let si = datosInvertidos.filter(d => d.humo == 1).length;
    let no = total - si;
    humoPie.data.datasets[0].data = [si, no];
    humoPie.update();
}

// Crear charts al cargar la página
crearCharts();
