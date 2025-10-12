const experiences = [
    {
        company: 'National Telecommunication Institute (NTI)',
        role: 'Flutter Trainee / Scholarship Program',
        period: 'Jul 2025 - Aug 2025',
        tasks: [ 'Completed an intensive one-month Flutter training program focused on mobile app development.', 'Learned Dart programming language and mastered Flutter framework fundamentals.', 'Built practical apps integrating RESTful APIs and managing state with BLoC and Cubit.', 'Gained experience in UI/UX design, responsive layouts, and clean project structure.', 'Applied best practices for app architecture and performance optimization' ]
    },
    
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