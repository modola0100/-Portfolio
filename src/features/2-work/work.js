/* src/features/2-work/work.js */
import { getProjects } from '../../shared/data/projects-data.js';
import { $ } from '../../shared/utils/dom.js';

const ICONS = {
    github: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
    live: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`,
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/></svg>` // نجمة بسيطة
};

export async function initWorkFeature() {
    const projectsGrid = $('#projects-grid');
    if (!projectsGrid) return;

    const projectsToRender = await getProjects();

    projectsGrid.innerHTML = ''; 
    projectsGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

    projectsToRender.forEach(project => {
        const card = document.createElement('div');
        card.className = 'group relative bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-[#01b5f8]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#01b5f8]/10 cursor-pointer flex flex-col h-full';
        
        // أزرار الروابط
        let buttonsHTML = '';
        const btnClass = "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-300 transition-all duration-300 hover:text-white hover:border-[#01b5f8] hover:bg-gradient-to-r hover:from-[#01b5f8]/20 hover:to-blue-600/20 z-20";
        
        if (project.githubUrl) buttonsHTML += `<a href="${project.githubUrl}" target="_blank" class="${btnClass}">${ICONS.github} GitHub</a>`;
        if (project.liveUrl) buttonsHTML += `<a href="${project.liveUrl}" target="_blank" class="${btnClass}">${ICONS.live} Live Demo</a>`;

        card.innerHTML = `
            <div class="relative w-full h-48 overflow-hidden">
                <img src="${project.coverImage}" alt="${project.title}" class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-100">
                
                <div class="absolute inset-0 bg-[#0a0f18]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
                    <div class="bg-[#01b5f8] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-[#01b5f8]/40 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                        Click to explore ✨
                    </div>
                </div>
            </div>

            <div class="p-5 flex flex-col flex-grow border-t border-white/5">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-bold text-white group-hover:text-[#01b5f8] transition-colors line-clamp-1">${project.title}</h3>
                    <svg class="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 128 128" fill="none"><path d="M78.042 128 32.22 82.178 12.012 102.388 0 90.375 32.22 58.155 12.012 37.945 32.22 17.735 78.042 63.558l17.735-17.735L128 14.265 90.375 0 32.22 58.155 78.042 104 90.375 116.333l-12.333 11.667z" fill="#01b5f8"></path><path d="m78.042 104 37.625-37.625L90.375 41.083 78.042 53.417 32.22 9.625 19.833 22.012l58.209 58.21 17.735-17.735L128 90.375 90.375 128 78.042 115.667v-11.667z" fill="#02569B"></path></svg>
                </div>
                
                <p class="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2 flex-grow">
                    ${project.shortDescription}
                </p>
                
                <div class="flex flex-wrap gap-2 mt-auto pt-3 border-t border-white/5 relative z-20">
                    ${buttonsHTML}
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                window.location.href = `project-details.html?id=${project.id}`;
            }
        });

        projectsGrid.appendChild(card);
    });
}