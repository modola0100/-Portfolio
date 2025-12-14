// 1. استيراد البيانات من الملف بتاعك
import { getExperiences } from '../../shared/data/experience-data.js';
// 2. استيراد الأداة المساعدة (selector)
import { $ } from '../../shared/utils/dom.js';

/**
 * دالة لإنشاء كود HTML لكل عنصر خبرة
 * @param {object} exp - عنصر الخبرة من ملف experience-data.js
 * @returns {string} - كود HTML
 */
function createExperienceHTML(exp) {
    // 3. تجميع بيانات الشركة والمكان والوقت في سطر واحد
    const meta = `${exp.company} • ${exp.location} • ${exp.period}`;
    
    // 4. إنشاء قائمة المهام (Tasks)
    const tasksHTML = exp.tasks.map(task => `
        <li class="task-item">
            <span>${task}</span>
        </li>
    `).join('');

    // 5. إرجاع كود HTML الكامل للعنصر
    return `
        <div class="experience-item">
            <div class="timeline-dot"></div>
            <div class="experience-card">
                <h3 class="experience-role">${exp.role}</h3>
                <p class="experience-meta">${meta}</p>
                <ul class="experience-tasks">
                    ${tasksHTML}
                </ul>
            </div>
        </div>
    `;
}

// 6. الدالة الرئيسية لتشغيل القسم
export async function initExperienceFeature() {
    const timelineContainer = $('#experience-timeline');
    if (!timelineContainer) {
        console.error('Experience timeline container not found!');
        return;
    }

    const experiencesToRender = await getExperiences();

    // 7. تفريغ الحاوية (احتياطي)
    timelineContainer.innerHTML = '';

    // 8. إنشاء كود HTML لكل الخبرات الموجودة في الملف
    // (ملاحظة: يتم عكس "reverse" المصفوفة عشان أحدث خبرة تظهر في الأول)
    const allExperiencesHTML = experiencesToRender.reverse().map(createExperienceHTML).join('');

    // 9. إضافة الكود النهائي في الحاوية في الـ HTML
    timelineContainer.innerHTML = allExperiencesHTML;
}