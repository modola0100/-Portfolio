import { projects } from '../../shared/data/projects-data.js';
import { $ } from '../../shared/utils/dom.js';

const modal = $('#project-modal');
const modalContent = $('#project-modal-content');


function openModal(project) {
    if (!modal || !modalContent) return;
    
    modalContent.innerHTML = `
        <div class="relative">
            <button id="close-modal-btn" class="modal-close-btn" aria-label="Close project details">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img src="${project.coverImage}" alt="${project.title}" class="modal-header-image">
            <div class="modal-content-wrapper">
                <h2 class="modal-title">${project.title}</h2>
                <div class="modal-tags">
                    ${project.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
                </div>
                <ul class="modal-description">
                    ${Array.isArray(project.longDescription) 
                        ? project.longDescription.map(point => `<li>${point}</li>`).join('') 
                        : `<li>${project.longDescription || project.shortDescription}</li>`
                    }
                </ul>
                <div class="modal-links">
                     <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="modal-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                         GitHub
                     </a>
                     <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="modal-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                         Live Demo
                     </a>
                </div>
            </div>
        </div>`;
    
    modal.classList.remove('opacity-0', 'pointer-events-none'); // Make modal visible and interactive
    modal.classList.add('active'); // Trigger animation
    document.body.classList.add('overflow-hidden');

    $('#close-modal-btn').onclick = closeModal;
}

function closeModal() {
    if (!modal || !modalContent) return;
    
    modal.classList.remove('active'); // Trigger reverse animation
    
    setTimeout(() => {
        modal.classList.add('opacity-0', 'pointer-events-none'); // Hide modal after animation
        document.body.classList.remove('overflow-hidden');
    }, 500); // Match the transition duration in CSS
}

export function initWorkFeature() {
    const projectsGrid = $('#projects-grid');
    if (!projectsGrid) return;

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.dataset.projectId = project.id;
        
        const isSvg = project.coverImage.endsWith('.svg');
        projectCard.innerHTML = `
            <div class="project-card__image-container">
                <img src="${project.coverImage}" alt="${project.title}" class="project-card__image ${isSvg ? 'project-card__image--svg' : ''}">
            </div>
            <div class="project-card__content">
                <h3 class="project-card__title">${project.title}</h3>
                <p class="project-card__description">${project.shortDescription}</p>
                <div class="project-card__footer">
                    <div class="project-card__tech">
                        <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M78.042 128 32.22 82.178 12.012 102.388 0 90.375 32.22 58.155 12.012 37.945 32.22 17.735 78.042 63.558l17.735-17.735L128 14.265 90.375 0 32.22 58.155 78.042 104 90.375 116.333l-12.333 11.667z" fill="#01b5f8"></path><path d="m78.042 104 37.625-37.625L90.375 41.083 78.042 53.417 32.22 9.625 19.833 22.012l58.209 58.21 17.735-17.735L128 90.375 90.375 128 78.042 115.667v-11.667z" fill="#02569B"></path></svg>
                        <span>Flutter</span>
                    </div>
                    <div class="project-card__links">
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository for ${project.title}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
    
    projectsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('[data-project-id]');
        if (card) {
            const projectId = parseInt(card.dataset.projectId, 10);
            const project = projects.find(p => p.id === projectId);
            if (project) openModal(project);
        }
    });

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}