import { initPreloader } from './ui/preloader.js';
import { initHeader } from './ui/header.js';
import { initMobileMenu } from './ui/mobile-menu.js';
import { initScrollToTop } from './ui/scroll-to-top.js';
import { initParticles } from './ui/particles.js';
import { initAnimations } from './ui/animations.js';
import { initHeroFeature } from '../features/1-hero/hero.js';
import { initHeroAnimation } from '../features/1-hero/hero-animation.js';

// الملف ده بيجيب الأنيميشن، بس إحنا مش هنشغله عشان بيعمل خطأ
import { initWorkFeature } from '../features/2-work/work.js';
import { initExperienceFeature } from '../features/3-experience/experience.js';
import { initContactForm } from '../features/4-contact/contact.js';
                
function initializeApp() {
    
    document.addEventListener('DOMContentLoaded', () => {
        initPreloader(); 
        initHeader();
        initMobileMenu();
        initScrollToTop();
        initParticles();
        initAnimations();
        initHeroFeature();
        
        // --- *** الحل النهائي هنا *** ---
        // السطر ده لازم يفضل "comment" (متعطل)
        // لأنه بيدور على عنصر ".cube" اللي مش موجود
        // initHeroAnimation(); 
        
        initWorkFeature();
        initExperienceFeature();
        initContactForm();
    });
}

initializeApp();