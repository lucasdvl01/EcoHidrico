import { initNav } from './js/nav.js';
import { initChart } from './js/chart.js';
import { initForm } from './js/form.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Menu e Abas
    initNav();

    // 2. Inicializa o Gráfico Interativo
    initChart();

    // 3. Inicializa o Formulário de Denúncias
    initForm();
});
