document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Toggle Mobile Menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Handle Tab Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');

            // Remove active class from all links and contents
            navLinks.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                // Force reflow to restart animation
                void content.offsetWidth;
            });

            // Add active class to clicked link and corresponding content
            link.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // Close mobile menu if it's open
            if (navMenu.classList.contains('open')) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('open');
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.background = 'rgba(11, 29, 46, 0.9)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(11, 29, 46, 0.7)';
            header.style.boxShadow = 'none';
        }
    });
    // Render Bar Chart (Lixo Coletado)
    const renderChart = () => {
        const chartContainer = document.getElementById('bar-chart');
        if (!chartContainer) return;

        // Clear existing to avoid duplicates if called multiple times
        chartContainer.innerHTML = '';

        const mockData = [
            { month: 'Out', value: 120 },
            { month: 'Nov', value: 150 },
            { month: 'Dez', value: 180 },
            { month: 'Jan', value: 210 },
            { month: 'Fev', value: 270 },
            { month: 'Mar', value: 310 }
        ];

        const maxValue = Math.max(...mockData.map(d => d.value));

        mockData.forEach((data, index) => {
            const heightPercent = (data.value / maxValue) * 100;
            
            const group = document.createElement('div');
            group.className = 'chart-bar-group';

            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            // Start at 0 height for animation
            bar.style.height = '0%';
            
            // Add a small delay based on index for a cascade animation effect
            setTimeout(() => {
                bar.style.height = `${heightPercent}%`;
            }, 100 * index);

            const label = document.createElement('div');
            label.className = 'chart-label';
            label.innerText = data.month;

            const valueLabel = document.createElement('div');
            valueLabel.className = 'chart-value';
            valueLabel.innerText = `${data.value}kg`;

            group.appendChild(valueLabel);
            group.appendChild(bar);
            group.appendChild(label);
            
            chartContainer.appendChild(group);
        });
    };

    // Call renderChart initially
    renderChart();

    // Re-trigger animation when clicking on 'lixo-coletado' tab
    const lixoTabBtn = document.querySelector('[data-target="lixo-coletado"]');
    if (lixoTabBtn) {
        lixoTabBtn.addEventListener('click', () => {
            setTimeout(renderChart, 100);
        });
    }
});
