const projects = [
   
    {
        id: 1,
title: 'Tasketi',
shortDescription: 'A clean and modern Flutter notes app with offline storage, image support, and elegant UI design.',

longDescription: 'Tasketi is a beautifully crafted Flutter application designed for creating and organizing notes effortlessly. Built with clean architecture principles, it leverages the Hive database for fast and secure offline storage. The app features both Light and Dark themes, allows users to attach images to their notes, and integrates Lottie animations for a smooth and engaging experience. With support for date selection, internationalization (Intl), and the Poppins font family, Tasketi delivers a refined, user-friendly interface focused on productivity and simplicity.',

coverImage: 'src/assets/images/3.png',
detailImages: ['src/assets/images/2.png'],
tags: ['Flutter', 'Hive', 'Clean Architecture', 'Lottie', 'Image Picker', 'Intl', 'Date Picker Timeline', 'Dark Mode'],

githubUrl: 'https://github.com/modola0100/taskati',
liveUrl: 'https://appetize.io/app/b_ymghlex5c44ec3haxusngxr5t4'


    },
     {
  id: 2,
  title: 'BMI Calculator',
  shortDescription: 'A simple and intuitive Flutter app to calculate your Body Mass Index (BMI) and track your health.',

  longDescription: 'BMI Calculator is a user-friendly application built with Flutter, designed to help you monitor your Body Mass Index effortlessly. By simply inputting your height and weight, the app instantly computes your BMI and categorizes the result (e.g., Underweight, Normal, Overweight), providing you with essential insights into your health. The app features a clean interface and smooth performance, making health tracking simple and accessible for everyone.',

  coverImage: 'src/assets/images/bmi.jpg',
  detailImages: ['src/assets/images/bm2.webp'],
  "tags": ["Flutter", "Dart", "Material Design", "Responsive UI", "BMI Calculator", "Health & Fitness"],

  githubUrl: 'https://github.com/modola0100/bmi_app',
  liveUrl: 'https://appetize.io/app/b_l2hd46lgyp2oysxidsubrb2wtu'
}

  



];

const modal = document.getElementById('project-modal');
const modalContent = document.getElementById('project-modal-content');

function openModal(project) {
    if (!modal || !modalContent) return;
    
    modalContent.innerHTML = `
        <div class="p-4 sm:p-8">
            <div class="flex justify-between items-start mb-4">
                 <h2 class="text-3xl font-bold text-white">${project.title}</h2>
                 <button id="close-modal-btn" class="text-gray-500 hover:text-white transition-colors text-4xl leading-none">&times;</button>
            </div>
            <div class="w-full h-56 sm:h-80 bg-gray-700 rounded-lg overflow-hidden mb-6 shadow-lg">
                 <img src="${project.detailImages && project.detailImages.length > 0 ? project.detailImages[0] : project.coverImage}" alt="${project.title}" class="w-full h-full object-cover">
            </div>
            <div class="flex flex-wrap gap-2 mb-6">
                ${project.tags.map(tag => `<span class="bg-blue-900/50 text-blue-300 text-sm font-medium px-3 py-1 rounded-full">${tag}</span>`).join('')}
            </div>
            <p class="text-gray-300 leading-relaxed mb-6">${project.longDescription || project.shortDescription}</p>
            <div class="flex items-center gap-6">
                 <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-gray-300 hover:text-flutter-blue font-semibold transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                     GitHub
                 </a>
                 <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-gray-300 hover:text-flutter-blue font-semibold transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                     Live Demo
                 </a>
            </div>
        </div>`;
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-95');
    document.body.classList.add('overflow-hidden');

    document.getElementById('close-modal-btn').onclick = closeModal;
}

function closeModal() {
    if (!modal || !modalContent) return;
    modal.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('pointer-events-none');
        document.body.classList.remove('overflow-hidden');
    }, 300); // Wait for animation to finish
}

export function initWorkFeature() {
    const projectsWrapper = document.getElementById('projects-wrapper');
    if (!projectsWrapper) return;

    projects.forEach(project => {
        const projectSlide = `
            <div class="swiper-slide">
                <div class="project-card" data-project-id="${project.id}">
                    <div class="project-card__top" style="background-image: url('${project.coverImage}')"></div>
                    <div class="project-card__content">
                        <h3 class="project-card__title">${project.title}</h3>
                        <p class="project-card__description">${project.shortDescription}</p>
                        <div class="project-card__footer">
                            <div class="project-card__tech">
                                <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M78.042 128 32.22 82.178 12.012 102.388 0 90.375 32.22 58.155 12.012 37.945 32.22 17.735 78.042 63.558l17.735-17.735L128 14.265 90.375 0 32.22 58.155 78.042 104 90.375 116.333l-12.333 11.667z" fill="#01b5f8"></path><path d="m78.042 104 37.625-37.625L90.375 41.083 78.042 53.417 32.22 9.625 19.833 22.012l58.209 58.21 17.735-17.735L128 90.375 90.375 128 78.042 115.667v-11.667z" fill="#02569B"></path></svg>
                                <span>Flutter</span>
                            </div>
                            <div class="project-card__links">
                                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
        `;
        projectsWrapper.innerHTML += projectSlide;
    });

    new Swiper('.swiper-container', {
        effect: 'slide',
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        breakpoints: { 768: { slidesPerView: 2, spaceBetween: 30 }, },
        autoplay: { delay: 3000, disableOnInteraction: false, },
        grabCursor: true,
    });
    
    // Modal event listeners
    const workSection = document.getElementById('work');
    if (workSection) {
        workSection.addEventListener('click', (e) => {
            const card = e.target.closest('[data-project-id]');
            if (card) {
                const projectId = parseInt(card.dataset.projectId);
                const project = projects.find(p => p.id === projectId);
                if (project) openModal(project);
            }
        });
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}