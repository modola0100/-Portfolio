export function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (!scrollToTopBtn) return;

    const showThreshold = 300;

    const handleScroll = () => {
        if (window.scrollY > showThreshold) {
            scrollToTopBtn.classList.remove('hidden', 'translate-y-20');
            scrollToTopBtn.classList.add('flex');
        } else {
            scrollToTopBtn.classList.add('translate-y-20');
            setTimeout(() => {
                if (window.scrollY <= showThreshold) {
                    scrollToTopBtn.classList.add('hidden');
                    scrollToTopBtn.classList.remove('flex');
                }
            }, 300);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('scroll', handleScroll);
    scrollToTopBtn.addEventListener('click', scrollToTop);
}
