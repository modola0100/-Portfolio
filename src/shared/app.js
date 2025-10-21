import { initGeneralUI, initPreloader } from './ui/ui.js';
import { initParticles } from './ui/particles.js';
import { initAnimations } from './ui/animations.js';
import { initHeroFeature } from '../features/1-hero/hero.js';
import { initWorkFeature } from '../features/2-work/work.js';
import { initExperienceFeature } from '../features/3-experience/experience.js';

// Initialize preloader as soon as possible
initPreloader();

// Initialize the rest of the app after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initGeneralUI();
    initParticles();
    initAnimations();
    initHeroFeature();
    initWorkFeature();
    initExperienceFeature();
});
