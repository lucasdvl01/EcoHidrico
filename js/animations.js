// Lógica de animações avançadas: Parallax e Efeito Spotlight Suave
export function initAnimations() {
    // 1. Efeito Parallax nas Bolhas de Fundo
    const bubbles = document.querySelectorAll('.bubble');
    
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / 80; // Mais suave
        const moveY = (clientY - centerY) / 80;

        bubbles.forEach((bubble, index) => {
            const speed = (index + 1) * 0.3;
            bubble.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });
    });

    // 2. Efeito Spotlight Suave nos Cards
    const cards = document.querySelectorAll('.feature-card, .integration-card, .team-member, .metric-card, .disease-card, .form-wrapper');

    cards.forEach(card => {
        const spotlight = document.createElement('div');
        spotlight.className = 'spotlight';
        card.appendChild(spotlight);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            spotlight.style.left = `${x}px`;
            spotlight.style.top = `${y}px`;
        });
    });
}
