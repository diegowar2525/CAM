// Simulación de datos

const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
const airQualityIndex = [65, 60, 58, 54, 51, 48, 45];

const ctx = document.getElementById('qualityChart').getContext('2d');
const qualityChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: years,
        datasets: [{
            label: 'Índice de Calidad del Aire (AQI)',
            data: airQualityIndex,
            borderColor: '#7bcfff',
            backgroundColor: 'rgba(123, 207, 255, 0.09)',
            borderWidth: 3,
            fill: true,
            tension: 0.45,
            pointBackgroundColor: '#71faaf',
            pointBorderColor: '#88f3c1',
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    options: {
        plugins: {
            legend: { labels: { color: '#c5d1df' } }
        },
        scales: {
            x: {
                title: { display: true, text: "Año", color: "#b6becd" },
                ticks: { color: '#b6becd' }
            },
            y: {
                beginAtZero: false,
                title: { display: true, text: "AQI (menor es mejor)", color: "#b6becd" },
                ticks: { color: '#b6becd' }
            }
        }
    }
});
// Obtener los elementos
const sidebar = document.querySelector('.sidebar');
const logoutForm = document.querySelector('#logout-form');
const logoutButton = document.querySelector('#logout-button');

// Cuando el mouse entra en el sidebar (menu abierto)
sidebar.addEventListener('mouseenter', () => {
    // Asegurarse de que el botón esté presente cuando el menú está abierto
    if (logoutForm.querySelector('a')) {
        const button = document.createElement('button');
        button.type = 'submit';  // Tipo submit para que funcione con el formulario
        button.id = 'logout-button';
        button.classList.add('button');
        button.textContent = 'Cerrar sesión';

        // Reemplazar el <a> con el <button>
        logoutForm.replaceChild(button, logoutForm.querySelector('a'));
    }
});

// Cuando el mouse sale del sidebar (menu cerrado)
sidebar.addEventListener('mouseleave', () => {
    // Asegurarse de que el enlace esté presente cuando el menú está cerrado
    if (logoutForm.querySelector('button')) {
        const link = document.createElement('a');
        link.href = logoutForm.action;  // Mantén el mismo enlace de acción
        link.classList.add('button');  // Agregar las mismas clases
        link.textContent = 'Cerrar sesión';

        // Reemplazar el <button> con el <a>
        logoutForm.replaceChild(link, logoutForm.querySelector('button'));
    }
});
