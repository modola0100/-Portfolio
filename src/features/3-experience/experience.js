const experiences = [
    {
        company: 'Tech Solutions Inc.',
        role: 'Lead Flutter Developer',
        period: 'May 2022 - Present',
        tasks: [ 'Lead the development of major new features for our flagship mobile applications.', 'Write modern, performant, and maintainable code for a diverse array of client and internal projects.', 'Work with a team of designers, product managers, and other engineers to bring ideas to life.', 'Mentor junior developers and contribute to improving our internal coding standards.' ]
    },
    {
        company: 'Creative Apps LLC',
        role: 'Junior Flutter Developer',
        period: 'Jan 2021 - Apr 2022',
        tasks: [ 'Developed and shipped multiple Flutter applications for iOS and Android.', 'Collaborated with senior developers on complex features and bug fixes.', 'Integrated third-party APIs and services to extend app functionality.', 'Participated in code reviews and agile development ceremonies.' ]
    }
];

export function initExperienceFeature() {
    const tabsContainer = document.getElementById('experience-tabs');
    const contentContainer = document.getElementById('experience-content');
    if (!tabsContainer || !contentContainer) return;

    experiences.forEach((exp, index) => {
        const isActive = index === 0;
        tabsContainer.innerHTML += `<button class="experience-tab-btn flex-shrink-0 ${isActive ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'} px-4 py-2 transition-colors duration-300" data-index="${index}">${exp.company}</button>`;
        contentContainer.innerHTML += `
            <div class="experience-content-panel ${isActive ? 'block' : 'hidden'}" data-index="${index}">
                <h3 class="text-2xl font-bold text-white">${exp.role} <span class="text-blue-400">@ ${exp.company}</span></h3>
                <p class="text-sm text-gray-500 mt-1 mb-6">${exp.period}</p>
                <ul class="space-y-3">${exp.tasks.map(task => `<li class="flex items-start gap-3"><span class="flutter-blue mt-1">▹</span><span class="text-gray-300">${task}</span></li>`).join('')}</ul>
            </div>`;
    });

    tabsContainer.addEventListener('click', (e) => {
        if (e.target.matches('.experience-tab-btn')) {
            const index = e.target.getAttribute('data-index');
            document.querySelectorAll('.experience-tab-btn').forEach(b => b.classList.remove('text-blue-400', 'border-b-2', 'border-blue-400'));
            e.target.classList.add('text-blue-400', 'border-b-2', 'border-blue-400');
            document.querySelectorAll('.experience-content-panel').forEach(p => p.classList.add('hidden'));
            contentContainer.querySelector(`.experience-content-panel[data-index="${index}"]`).classList.remove('hidden');
        }
    });
}