export function initHeader() {
    const header = document.querySelector('#header'); // الهيدر الرئيسي
    const headerBox = document.querySelector('#header > div'); // الصندوق الداخلي
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }

    // Scroll Logic
    const handleScroll = () => {
        // 1. تحريك الصندوق: عند النزول يلتصق بالأعلى قليلاً
        if (window.scrollY > 50) {
            header.classList.replace('top-4', 'top-2'); // تقليل المسافة العلوية
            headerBox.classList.add('py-2'); // تصغير الحجم
            headerBox.classList.remove('py-3');
        } else {
            header.classList.replace('top-2', 'top-4');
            headerBox.classList.add('py-3');
            headerBox.classList.remove('py-2');
        }

        // 2. Active State Logic (ScrollSpy)
        let current = '';
        
        sections.forEach(section => {
            // حساب المسافة مع مراعاة ارتفاع الهيدر
            const sectionTop = section.offsetTop - 150; 
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // في حالة الوصول لنهاية الصفحة (لضمان تفعيل Contact)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
             current = 'contact';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // تشغيل فوري
}