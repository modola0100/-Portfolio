const experiences = [
    {
        company: 'National Telecommunication Institute (NTI)',
        role: 'Flutter Trainee / Scholarship Program',
        period: 'Jul 2025 - Aug 2025',
        tasks: [ 'Completed an intensive one-month Flutter training program focused on mobile app development.', 'Learned Dart programming language and mastered Flutter framework fundamentals.', 'Built practical apps integrating RESTful APIs and managing state with BLoC and Cubit.', 'Gained experience in UI/UX design, responsive layouts, and clean project structure.', 'Applied best practices for app architecture and performance optimization' ]
    },
    {
    company: 'Google Developer Student Clubs (GDSC) - Benha University',
    role: 'Flutter Trainee (Bootcamp)',
    period: 'Jan 28, 2024 - Feb 1, 2024',
    tasks: [
      'Completed an intensive 36-hour training bootcamp focused on Flutter mobile app development fundamentals.',
      'Developed interactive and engaging User Interfaces (UI) using various Flutter Widgets.',
      'Applied Object-Oriented Programming (OOP) principles for effective code structure and organization.',
      'Built a complete practical project (Calculator App) to solidify core concepts.',
      'Gained practical skills in problem-solving and effective teamwork.'
    ]
},
{
    company: 'D.Pear',
    role: 'Flutter Summer Trainee',
    period: 'Summer 2024 (6 Weeks)',
    tasks: [
      'Gained extensive hands-on experience with core and advanced Flutter widgets.',
      'Developed and delivered multiple projects, including a BMI Calculator and a Food App UI and bookly app with api integration.',    
      'Integrated RESTful APIs for fetching live data and Firebase for backend services.',
      'Implemented local data persistence using the Hive database.',
      'Learned and applied the foundational principles of Clean Architecture for scalable project structure.',
      'Utilized various Flutter packages, such as image_picker, to add native device functionality.',
      'Demonstrated strong performance and collaboration skills in team-based projects.'
    ]
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