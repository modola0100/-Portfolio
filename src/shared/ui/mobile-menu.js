export function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!mobileMenuBtn || !mobileMenu) return;

    const toggleMenu = () => mobileMenu.classList.toggle('hidden');
    const closeMenu = () => mobileMenu.classList.add('hidden');

    mobileMenuBtn.addEventListener('click', toggleMenu);
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}
