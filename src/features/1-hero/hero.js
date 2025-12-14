// === الوظيفة 1: أنيميشن حروف الاسم ===
function animateHeroText() {
    const h1 = document.getElementById('hero-name-h1');
    const cursor = document.getElementById('hero-name-cursor');
    if (!h1 || !cursor) return;

    const text = "Mohamed Adel"; // النص الأصلي
    h1.innerHTML = ''; // إفراغ المحتوى لإضافة الحروف

    let totalDelay = 0;
    
    // 1. إضافة الحروف كـ <span>
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char; // التعامل مع المسافات
        const delay = 0.05; // تأخير 50ms لكل حرف
        span.style.animationDelay = `${i * delay}s`;
        h1.appendChild(span);
        totalDelay = (i + 1) * delay; // حساب التأخير الإجمالي
    });

    // 2. إضافة المؤشر بعد آخر حرف
    h1.appendChild(cursor);

    // 3. إظهار المؤشر بعد انتهاء كتابة الاسم
    // سنستخدم totalDelay + تأخير بسيط (مثل 0.5 ثانية)
    setTimeout(() => {
        cursor.style.opacity = '1';
        cursor.style.animation = 'blink 1s step-end infinite'; // بدء أنيميشن الوميض
    }, totalDelay * 1000 + 300); // * 1000 للتحويل إلى ميللي ثانية
}

// === الوظيفة 2: أنيميشن الضغط على الكروت ===
function initStatCardAnimation() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('stat-card-clicked');
        });
        card.addEventListener('animationend', () => {
            card.classList.remove('stat-card-clicked');
        });
    });
}

// === الوظيفة الرئيسية: اللي بتشغل كل حاجة ===
export function initHeroFeature() {
    window.addEventListener('load', () => {
        // لا نحتاج typeEffect() الآن لأننا حذفنا "I build things"
        // typeEffect(); 
        
        // شغل أنيميشن الاسم والمؤشر
        animateHeroText(); 
        
        // شغل أنيميشن كروت الإحصائيات
        initStatCardAnimation(); 
    });
}