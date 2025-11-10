export function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        const isScrolled = window.scrollY > 50;
        header.classList.toggle('bg-gray-900/50', isScrolled);
        header.classList.toggle('backdrop-blur-sm', isScrolled);
        header.classList.toggle('shadow-lg', isScrolled);
    });
}
