import { $ } from '../utils/dom.js';

export function initParticles() {
    const canvas = $('#particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particlesArray;

    // خصائص الماوس
    let mouse = {
        x: null,
        y: null,
        radius: 150 // زيادة نصف القطر لتأثير أنعم
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // ألوان مستوحاة من Flutter وشعارك
    const colors = [
        'rgba(1, 181, 248, 0.7)',  // أزرق فلاتر مشرق
        'rgba(2, 86, 155, 0.5)',   // أزرق غامق (الأصلي)
        'rgba(201, 209, 217, 0.3)' // رمادي فاتح شفاف (للعمق)
    ];

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            
            // حفظ السرعة الأصلية للعودة إليها بعد تأثير الماوس
            this.baseDirX = directionX;
            this.baseDirY = directionY;
            
            // الكثافة تحدد مدى ثقل النقطة وسرعة استجابتها للماوس
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            
            // إضافة توهج بسيط للنقط الزرقاء الفاتحة فقط
            if (this.color.includes('248')) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'rgba(1, 181, 248, 0.5)';
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // 1. الحركة العادية والارتداد من الحواف
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
                this.baseDirX = -this.baseDirX; // عكس الاتجاه الأصلي أيضاً
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
                this.baseDirY = -this.baseDirY;
            }

            // 2. فيزياء التفاعل مع الماوس (Smooth Repulsion)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            // إذا كانت النقطة داخل نطاق الماوس
            if (distance < mouse.radius) {
                // حساب قوة الدفع بناءً على القرب
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                
                // دفع النقطة بعيداً بنعومة (كلما كانت أقرب، كان الدفع أقوى)
                const directionX = forceDirectionX * force * this.density * 0.8;
                const directionY = forceDirectionY * force * this.density * 0.8;
                
                this.directionX -= directionX;
                this.directionY -= directionY;
            } else {
                // إذا خرج الماوس، تعود النقطة لسرعتها الأصلية تدريجياً (Friction effect)
                if (this.directionX !== this.baseDirX) {
                    this.directionX -= (this.directionX - this.baseDirX) * 0.05;
                }
                if (this.directionY !== this.baseDirY) {
                    this.directionY -= (this.directionY - this.baseDirY) * 0.05;
                }
            }

            // تحديث الموقع
            this.x += this.directionX;
            this.y += this.directionY;
            
            this.draw();
        }
    }

    function createParticles() {
        particlesArray = [];
        // عدد النقط مناسب لحجم الشاشة
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 3) + 1; // أحجام متنوعة لعمق أكبر
            let x = (Math.random() * (innerWidth - size * 2) + size * 2);
            let y = (Math.random() * (innerHeight - size * 2) + size * 2);
            
            // سرعة هادئة وعشوائية
            let directionX = (Math.random() * 0.8) - 0.4; 
            let directionY = (Math.random() * 0.8) - 0.4;
            
            // اختيار لون عشوائي من القائمة
            let color = colors[Math.floor(Math.random() * colors.length)];
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        // مسح الكانفاس
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    createParticles();
    animateParticles();

    // إعادة ضبط عند تغيير حجم الشاشة
    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        createParticles();
    });

    // إخفاء تأثير الماوس عند خروجه من الصفحة
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });
}