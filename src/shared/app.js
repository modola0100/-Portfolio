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

// Import data service for localStorage management
import { getData, STORAGE_KEYS } from './data/data-service.js';
import { generalData, getGeneralData } from './data/general-data.js';
import { skills as defaultSkills, getSkills } from './data/skills-data.js';
import { getProjects } from './data/projects-data.js';
import { getExperiences } from './data/experience-data.js';

function initializeApp() {
    document.addEventListener('DOMContentLoaded', async () => {
        initPreloader();
        initHeader();
        initMobileMenu();
        initScrollToTop();
        initParticles();
        initAnimations();
        initHeroFeature();

        // initHeroAnimation(); // Disabled - requires .cube element

        await initWorkFeature();
        await initExperienceFeature();
        initContactForm();

        // Load data from admin panel (API)
        loadAdminData();

        // Poll for updates every 5 seconds
        setInterval(loadAdminData, 5000);
    });
}

/**
 * Load portfolio data from API
 */
async function loadAdminData() {
    // Get general settings from API
    const general = await getGeneralData();

    // Update Hero Name
    if (general.heroName) {
        const heroNameElement = document.getElementById('hero-name-h1');
        if (heroNameElement) {
            // Keep the cursor span
            const cursorSpan = heroNameElement.querySelector('.hero-cursor');
            heroNameElement.textContent = general.heroName;
            if (cursorSpan) heroNameElement.appendChild(cursorSpan);
        }
    }

    // Update Profile Picture
    if (general.profilePicture) {
        const profilePictureElement = document.querySelector('.hero-main-image-new');
        if (profilePictureElement) {
            profilePictureElement.src = general.profilePicture;
        }
    }

    // Update About Me Text
    if (general.aboutText) {
        const aboutMeElement = document.querySelector('#about .about-me-card p');
        if (aboutMeElement) {
            aboutMeElement.textContent = general.aboutText;
        }
    }

    // Update Stats
    if (general.stats) {
        const statProjects = document.getElementById('stat-projects');
        const statYears = document.getElementById('stat-years');
        const statClients = document.getElementById('stat-clients');

        if (statProjects) statProjects.textContent = general.stats.projectsCount || 0;
        if (statYears) statYears.textContent = general.stats.yearsExperience || 0;
        if (statClients) statClients.textContent = general.stats.happyClients || 0;
    }

    // Update Skills from API
    const skills = await getSkills();
    if (skills && skills.length > 0) {
        renderSkillsFromData(skills);
    }
}

/**
 * Render skills from localStorage data
 */
function renderSkillsFromData(skills) {
    const skillsGrid = document.querySelector('#skills .grid');
    if (!skillsGrid) return;

    skillsGrid.innerHTML = skills.map(skill => `
        <div class="skill-card">
            <span class="skill-icon">
                <img src="${skill.icon}" class="skill-img" alt="${skill.name}" onerror="this.onerror=null;this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22 viewBox=%220 0 48 48%22><rect fill=%22%231a1f2e%22 width=%2248%22 height=%2248%22 rx=%228%22/><text x=%2224%22 y=%2230%22 font-size=%2220%22 text-anchor=%22middle%22 fill=%22%236b7280%22>?</text></svg>'">
            </span>
            <span class="skill-name">${skill.name}</span>
        </div>
    `).join('');
}

initializeApp();