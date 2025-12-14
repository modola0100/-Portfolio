/**
 * Portfolio Config Loader
 * Centralized data loading from portfolio-config.json
 * Makes it easy to update projects, skills, and experiences without touching code
 * 
 * Priority: localStorage (updated by Admin Panel) → portfolio-config.json (fallback)
 */

let portfolioConfig = null;

/**
 * Load the portfolio configuration from localStorage first, then from JSON file
 * This ensures admin panel changes are immediately reflected
 */
async function loadPortfolioConfig() {
    if (portfolioConfig) {
        return portfolioConfig;
    }

    // Try to load from localStorage first (Admin Panel updates)
    try {
        const hasLocalStorage = localStorage.getItem('portfolio_general') && 
                                localStorage.getItem('portfolio_projects') &&
                                localStorage.getItem('portfolio_skills') &&
                                localStorage.getItem('portfolio_experiences');
        
        if (hasLocalStorage) {
            portfolioConfig = {
                general: JSON.parse(localStorage.getItem('portfolio_general') || '{}'),
                projects: JSON.parse(localStorage.getItem('portfolio_projects') || '[]'),
                skills: JSON.parse(localStorage.getItem('portfolio_skills') || '[]'),
                experiences: JSON.parse(localStorage.getItem('portfolio_experiences') || '[]')
            };
            console.log('📱 Loaded portfolio from localStorage (Admin changes)');
            return portfolioConfig;
        }
    } catch (error) {
        console.warn('⚠️ Error reading localStorage:', error);
    }

    // Fallback to JSON file if localStorage is empty
    try {
        const response = await fetch('./src/shared/data/portfolio-config.json');
        if (!response.ok) {
            throw new Error(`Failed to load config: ${response.statusText}`);
        }
        portfolioConfig = await response.json();
        console.log('📄 Loaded portfolio from portfolio-config.json');
        return portfolioConfig;
    } catch (error) {
        console.error('❌ Error loading portfolio config:', error);
        return null;
    }
}

/**
 * Get general portfolio data
 */
export async function getGeneralDataFromConfig() {
    const config = await loadPortfolioConfig();
    if (!config) return null;
    return config.general;
}

/**
 * Get all projects
 */
export async function getProjectsFromConfig() {
    const config = await loadPortfolioConfig();
    if (!config) return [];
    return config.projects || [];
}

/**
 * Get all skills
 */
export async function getSkillsFromConfig() {
    const config = await loadPortfolioConfig();
    if (!config) return [];
    return config.skills || [];
}

/**
 * Get all experiences
 */
export async function getExperiencesFromConfig() {
    const config = await loadPortfolioConfig();
    if (!config) return [];
    return config.experiences || [];
}

/**
 * Get project by ID
 */
export async function getProjectById(id) {
    const projects = await getProjectsFromConfig();
    return projects.find(p => p.id === id);
}

/**
 * Get the raw config object (for advanced usage)
 */
export async function getPortfolioConfig() {
    return await loadPortfolioConfig();
}

/**
 * Refresh the cached config (call this after Admin Panel makes changes)
 */
export function refreshConfig() {
    portfolioConfig = null;
    console.log('🔄 Config cache cleared, will reload on next request');
}

/**
 * Clear cache and reload from localStorage/JSON
 */
export async function reloadConfig() {
    portfolioConfig = null;
    return await loadPortfolioConfig();
}

export default {
    loadPortfolioConfig,
    getGeneralDataFromConfig,
    getProjectsFromConfig,
    getSkillsFromConfig,
    getExperiencesFromConfig,
    getProjectById,
    getPortfolioConfig,
    refreshConfig,
    reloadConfig
};
