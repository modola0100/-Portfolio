export function initPreloader() {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });
}

export function initGeneralUI() {
    // Header scroll effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('bg-gray-900/50', window.scrollY > 50);
            header.classList.toggle('backdrop-blur-sm', window.scrollY > 50);
            header.classList.toggle('shadow-lg', window.scrollY > 50);
        });
    }

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    // Scroll to Top button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.remove('hidden', 'translate-y-20');
                scrollToTopBtn.classList.add('flex');
            } else {
                scrollToTopBtn.classList.add('translate-y-20');
                setTimeout(() => {
                    if (window.scrollY <= 300) {
                        scrollToTopBtn.classList.add('hidden');
                        scrollToTopBtn.classList.remove('flex');
                    }
                }, 300);
            }
        });
        scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}