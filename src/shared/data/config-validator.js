/**
 * Portfolio Config Validator
 * تحقق من صحة ملف portfolio-config.json
 */

async function validatePortfolioConfig() {
    console.log('🔍 جاري التحقق من ملف portfolio-config.json...\n');

    try {
        const response = await fetch('/src/shared/data/portfolio-config.json');
        
        if (!response.ok) {
            console.error('❌ خطأ: لم يتم العثور على ملف portfolio-config.json');
            return false;
        }

        const config = await response.json();
        console.log('✅ تم تحميل الملف بنجاح!\n');

        // Check general section
        if (!config.general) {
            console.error('❌ قسم "general" غير موجود');
            return false;
        }
        console.log('✅ قسم البيانات العامة موجود');
        console.log(`   - الاسم: ${config.general.heroName}`);
        console.log(`   - التخصص: ${config.general.subtitle}`);
        console.log(`   - المشاريع: ${config.general.stats.projectsCount}\n`);

        // Check projects
        if (!Array.isArray(config.projects)) {
            console.error('❌ قسم "projects" يجب أن يكون مصفوفة');
            return false;
        }
        console.log(`✅ عدد المشاريع: ${config.projects.length}`);
        config.projects.forEach((p, i) => {
            console.log(`   ${i + 1}. ${p.title} (id: ${p.id})`);
        });
        console.log();

        // Check skills
        if (!Array.isArray(config.skills)) {
            console.error('❌ قسم "skills" يجب أن يكون مصفوفة');
            return false;
        }
        console.log(`✅ عدد المهارات: ${config.skills.length}`);
        config.skills.forEach((s, i) => {
            console.log(`   ${i + 1}. ${s.name}`);
        });
        console.log();

        // Check experiences
        if (!Array.isArray(config.experiences)) {
            console.error('❌ قسم "experiences" يجب أن يكون مصفوفة');
            return false;
        }
        console.log(`✅ عدد الخبرات: ${config.experiences.length}`);
        config.experiences.forEach((e, i) => {
            console.log(`   ${i + 1}. ${e.role} @ ${e.company}`);
        });
        console.log();

        console.log('✅✅✅ جميع البيانات صحيحة وجاهزة للعمل!');
        return true;

    } catch (error) {
        console.error('❌ خطأ في تحليل JSON:', error);
        return false;
    }
}

// Run validation when you load this script in console
console.log('%c📋 Portfolio Config Validator', 'color: #01b5f8; font-size: 16px; font-weight: bold;');
console.log('%cاستخدم هذا الملف للتحقق من صحة portfolio-config.json', 'color: #gray; font-size: 12px;');
console.log('\n');

validatePortfolioConfig();

// Also make it available globally
window.validatePortfolioConfig = validatePortfolioConfig;
console.log('\n%c💡 يمكنك استدعاء validatePortfolioConfig() في أي وقت للتحقق', 'color: #gray;');
