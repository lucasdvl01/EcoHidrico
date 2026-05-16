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
});
