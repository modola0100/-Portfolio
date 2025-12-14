// 🧪 اختبر بهذا الملف في console (F12)

async function testPortfolioSystem() {
    console.log('%c🔍 اختبار نظام البورتفليو الجديد', 'color: #01b5f8; font-size: 14px; font-weight: bold;');
    
    // Test 1: Load config
    try {
        console.log('\n1️⃣ اختبار تحميل portfolio-config.json...');
        const response = await fetch('./src/shared/data/portfolio-config.json');
        if (response.ok) {
            const config = await response.json();
            console.log('✅ تم تحميل الملف بنجاح!');
            console.log(`   - المشاريع: ${config.projects.length}`);
            console.log(`   - المهارات: ${config.skills.length}`);
            console.log(`   - الخبرات: ${config.experiences.length}`);
        } else {
            console.error('❌ فشل التحميل:', response.statusText);
        }
    } catch (error) {
        console.error('❌ خطأ:', error.message);
    }
    
    // Test 2: Test config-loader
    try {
        console.log('\n2️⃣ اختبار config-loader.js...');
        const { getProjectsFromConfig, getSkillsFromConfig, getExperiencesFromConfig } = await import('./src/shared/data/config-loader.js');
        
        const projects = await getProjectsFromConfig();
        const skills = await getSkillsFromConfig();
        const experiences = await getExperiencesFromConfig();
        
        console.log('✅ تم تحميل البيانات من config-loader');
        console.log(`   - المشاريع: ${projects?.length || 0}`);
        console.log(`   - المهارات: ${skills?.length || 0}`);
        console.log(`   - الخبرات: ${experiences?.length || 0}`);
        
        if (projects?.length > 0) {
            console.log(`   📋 المشاريع: ${projects.map(p => p.title).join(', ')}`);
        }
    } catch (error) {
        console.error('❌ خطأ في config-loader:', error.message);
    }
}

// استدعِ الاختبار
testPortfolioSystem();
"Auto-push test at $(date)"  
