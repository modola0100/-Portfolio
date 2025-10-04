function typeEffect() {
    const words = ["Flutter.", "Web Apps.", "Mobile Apps.", "Great UI/UX."];
    let wordIndex = 0, charIndex = 0, isDeleting = false;
    const typingElement = document.getElementById("typing-text");
    if (!typingElement) return;

    function type() {
        const currentWord = words[wordIndex];
        typingElement.textContent = currentWord.substring(0, charIndex);
        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(type, 150);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, 100);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(type, 1200);
        }
    }
    type();
}

function animateHeroText() {
    const h1 = document.getElementById('hero-name-h1');
    if (!h1) return;
    const text = h1.textContent;
    h1.innerHTML = '';
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${i * 0.05}s`;
        h1.appendChild(span);
    });
}

export function initHeroFeature() {
    // These animations should start after the preloader has faded out
    window.addEventListener('load', () => {
        animateHeroText();
        typeEffect();
    });
}