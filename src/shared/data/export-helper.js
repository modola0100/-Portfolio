/**
 * Export Portfolio Data to JSON File
 * This file helps sync Admin Panel changes to portfolio-config.json
 * 
 * Usage:
 * 1. Edit data in Admin Panel
 * 2. Click "Export Data" 
 * 3. Downloaded JSON file - paste content into portfolio-config.json
 */

function exportPortfolioData() {
    try {
        // Get data from localStorage (updated by Admin Panel)
        const generalData = JSON.parse(localStorage.getItem('portfolio_general') || '{}');
        const projectsData = JSON.parse(localStorage.getItem('portfolio_projects') || '[]');
        const skillsData = JSON.parse(localStorage.getItem('portfolio_skills') || '[]');
        const experiencesData = JSON.parse(localStorage.getItem('portfolio_experiences') || '[]');

        // Combine into single object
        const portfolioData = {
            general: generalData,
            projects: projectsData,
            skills: skillsData,
            experiences: experiencesData
        };

        // Convert to JSON string
        const jsonString = JSON.stringify(portfolioData, null, 2);

        // Create blob and download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-config-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('✅ Portfolio data exported successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error exporting data:', error);
        return false;
    }
}

// Make available globally
window.exportPortfolioData = exportPortfolioData;

console.log('📤 Export functionality loaded. Call: exportPortfolioData()');
