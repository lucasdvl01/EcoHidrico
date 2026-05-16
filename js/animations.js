// Lógica de animações avançadas: Scroll Reveal e Tilt 3D
export function initAnimations() {
    // 1. Efeito Scroll Reveal
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Opcional: parar de observar após revelar para performance
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Selecionar todos os elementos que devem "nascer" no scroll
    const revealElements = document.querySelectorAll('.hero-title, .hero-description, .hero-actions, .feature-card, .metric-card, .disease-card, .team-member, .section-header, .ods-section, .chart-container, .waste-types-container, .form-wrapper');
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // 2. Efeito Tilt 3D nos Cards
    const tiltCards = document.querySelectorAll('.feature-card, .metric-card, .disease-card, .team-member, .form-wrapper');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (centerY - y) / 10; // Inclinação X
            const rotateY = (x - centerX) / 10; // Inclinação Y

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 3. Efeito Parallax Suave nas Bolhas
    const bubbles = document.querySelectorAll('.bubble');
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        bubbles.forEach((bubble, index) => {
            const speed = (index + 1) * 0.02;
            const x = (clientX - centerX) * speed;
            const y = (clientY - centerY) * speed;
            bubble.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}
