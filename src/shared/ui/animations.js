export function initAnimations() {
    if (typeof ScrollReveal === 'undefined') {
        console.error("ScrollReveal is not loaded.");
        return;
    }
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '60px',
        duration: 1000,
        delay: 200,
        reset: false
    });

    sr.reveal('.reveal-fade', { origin: 'top', delay: 200 });
    sr.reveal('.reveal-up', { interval: 100 });
    sr.reveal('.reveal-left', { origin: 'left', interval: 100 });
    sr.reveal('.reveal-right', { origin: 'right', delay: 400 });
    sr.reveal('.nav-item', { origin: 'top', distance: '20px', interval: 100, delay: 800 });
}