import { experiences } from '../../shared/data/experience-data.js';
import { $, $$ } from '../../shared/utils/dom.js';

function renderExperiencePanel(exp) {
    return `
        <div class="experience-panel">
            <div class="exp-header">
                <div class="exp-header-main">
                    <div class="exp-logo">
                        <img src="${exp.logo}" alt="${exp.company} Logo">
                    </div>
                    <div>
                        <h3 class="exp-company">${exp.company}</h3>
                        <p class="exp-role">${exp.role}</p>
                        <p class="exp-location">${exp.location}</p>
                    </div>
                </div>
                <div class="exp-header-top">
                    <span>${exp.period}</span>
                </div>
            </div>
            <ul class="exp-tasks">
                ${exp.tasks.map(task => `<li>${task}</li>`).join('')}
            </ul>
        </div>
    `;
}

export function initExperienceFeature() {
    const navContainer = $('#experience-nav');
    const contentContainer = $('#experience-content');

    if (!navContainer || !contentContainer) return;

    experiences.forEach((exp, index) => {
        const navBtn = document.createElement('button');
        navBtn.className = 'experience-nav-btn';
        navBtn.dataset.index = index;
        navBtn.textContent = `/0${index + 1}`;
        if (index === 0) {
            navBtn.classList.add('active');
        }
        navContainer.appendChild(navBtn);
    });

    const renderContent = (index) => {
        contentContainer.innerHTML = renderExperiencePanel(experiences[index]);
    };

    navContainer.addEventListener('click', (e) => {
        if (e.target.matches('.experience-nav-btn')) {
            const index = parseInt(e.target.dataset.index, 10);
            $$('.experience-nav-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderContent(index);
        }
    });

    // Initial render
    renderContent(0);
}

