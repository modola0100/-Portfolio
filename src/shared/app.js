import { initPreloader } from './ui/preloader.js';
import { initHeader } from './ui/header.js';
import { initMobileMenu } from './ui/mobile-menu.js';
import { initScrollToTop } from './ui/scroll-to-top.js';
import { initParticles } from './ui/particles.js';
import { initAnimations } from './ui/animations.js';
import { initHeroFeature } from '../features/1-hero/hero.js';
import { initHeroAnimation } from '../features/1-hero/hero-animation.js';
import { initWorkFeature } from '../features/2-work/work.js';
import { initExperienceFeature } from '../features/3-experience/experience.js';
import { initContactForm } from '../features/4-contact/contact.js';

function initializeApp() {
    initPreloader();
    
    document.addEventListener('DOMContentLoaded', () => {
        initHeader();
        initMobileMenu();
        initScrollToTop();
        initParticles();
        initAnimations();
        initHeroFeature();
        initHeroAnimation();
        initWorkFeature();
        initExperienceFeature();
        initContactForm();
    });
}

initializeApp();


