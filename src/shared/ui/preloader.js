export function initPreloader() {
    // --- 1. Select all elements ---
    const preloader = document.getElementById('preloader');
    const loadingText = document.querySelector('.loading-text');
    const readyText = document.querySelector('.ready-text');
    const spinner = document.querySelector('.spinner-small');
    const progressBar = document.querySelector('.progress-bar');
    const maCircle = document.querySelector('.preloader-ma-circle');
    
    // --- *** الإضافة الأولى هنا *** ---
    const main = document.querySelector('main'); // الإمساك بالمحتوى الرئيسي

    // Safety check
    if (!preloader || !loadingText || !readyText || !progressBar || !spinner || !maCircle) {
        console.error("One or more preloader elements are missing!");
        if (preloader) preloader.style.display = 'none';
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
            
            // --- *** الإضافة الثانية هنا *** ---
            // 2. ابدأ إظهار المحتوى بالأنيميشن
            if (main) {
                main.classList.add('loaded');
            }

            // 3. احذف الـ preloader من الشاشة بعد انتهاء التلاشي
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500); // مدة التلاشي
            
        }, 2000); // مدة الانتظار عند "Ready!"
    };

    // --- 4. Start the loading simulation ---
    const intervalDuration = 75; // 1.5 ثانية
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