// Lógica do Gráfico usando Chart.js
export function initChart() {
    const ctx = document.getElementById('lixoChart');
    if (!ctx) return;

    // Dados Mock
    const mockData = {
        labels: ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar'],
        datasets: [{
            label: 'Lixo Coletado (kg)',
            data: [120, 150, 180, 210, 270, 310],
            backgroundColor: 'rgba(0, 255, 209, 0.5)',
            borderColor: 'rgba(0, 255, 209, 1)',
            borderWidth: 2,
            borderRadius: 6,
            hoverBackgroundColor: 'rgba(0, 168, 232, 0.8)',
            hoverBorderColor: 'rgba(0, 168, 232, 1)',
        }]
    };

    // Configuração do Chart.js
    const config = {
        type: 'bar',
        data: mockData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(11, 29, 46, 0.9)',
                    titleColor: '#00ffd1',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(0, 255, 209, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + ' kg';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false,
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    };

    let lixoChart = null;

    // Função para renderizar o gráfico quando a aba for clicada
    const lixoTabBtn = document.querySelector('[data-target="lixo-coletado"]');
    if (lixoTabBtn) {
        lixoTabBtn.addEventListener('click', () => {
            if (lixoChart) {
                // Se já existe, destrói para animar novamente ou apenas não faz nada.
                // Decidi destruir e recriar para manter a animação bonita.
                lixoChart.destroy();
            }
            // Pequeno delay para a aba ficar visível antes de desenhar o canvas
            setTimeout(() => {
                lixoChart = new Chart(ctx, config);
            }, 100);
        });
    }
}
