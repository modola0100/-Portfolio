export function initPreloader() {
    // --- 1. Select all elements ---
    const preloader = document.getElementById('preloader');
    const loadingText = document.querySelector('.loading-text');
    const readyText = document.querySelector('.ready-text');
    const spinner = document.querySelector('.spinner-small');
    const progressBar = document.querySelector('.progress-bar');
    const maCircle = document.querySelector('.preloader-ma-circle');
    
    const main = document.querySelector('main');
    // === ✨ الإضافة الجديدة: نمسك الناف بار ===
    const header = document.getElementById('header'); 

    // Safety check
    if (!preloader || !loadingText || !readyText || !progressBar || !spinner || !maCircle) {
        console.error("One or more preloader elements are missing!");
        if (preloader) preloader.style.display = 'none';
        // في حالة حدوث خطأ، أظهر الناف بار والمحتوى فوراً
        if (header) header.classList.add('visible');
        if (main) main.classList.add('loaded');
        return;
    }

    // --- 2. Define loading messages ---
    const messages = [
        "Processing content...",
        "Loading assets...",
        "Building interfaces...",
        "Finalizing setup..."
    ];
    let messageIndex = 0;
    let progress = 0;

    // --- 3. Define the final action ---
    const finishLoading = () => {
        loadingText.classList.add('hidden');
        spinner.style.display = ('none');
        readyText.classList.remove('hidden');
        maCircle.style.animation = 'none';
        maCircle.style.transform = 'scale(1.1)';

        // الانتظار ثانيتين عند كلمة "Ready!"
        setTimeout(() => {
            
            // 1. ابدأ إخفاء الـ preloader
            preloader.style.opacity = '0';
            
            // 2. ابدأ إظهار المحتوى
            if (main) {
                main.classList.add('loaded');
            }

            // === ✨ الإضافة الجديدة: أظهر الناف بار الآن فقط ===
            if (header) {
                header.classList.add('visible');
            }

            // 3. احذف الـ preloader من الشاشة
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500); 
            
        }, 2000); 
    };

    // --- 4. Start the loading simulation ---
    const intervalDuration = 75; 
    const progressStep = 5;

    const interval = setInterval(() => {
        progress += progressStep; 
        progressBar.style.width = `${progress}%`;

        if (progress % 20 === 0 && progress < 100 && messageIndex < messages.length) {
            loadingText.textContent = messages[messageIndex];
            messageIndex++;
        }

        if (progress >= 100) {
            clearInterval(interval);
            finishLoading();
        }
    }, intervalDuration);
}
