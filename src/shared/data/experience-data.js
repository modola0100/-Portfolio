/**
 * Experience Data - Fetches from portfolio-config.json
 * Edit experiences easily in the portfolio-config.json file without touching code
 */

import { getExperiencesFromConfig } from './config-loader.js';

const defaultExperiences = [];

/**
 * Fetch experiences from portfolio config JSON
 */
export async function getExperiences() {
    try {
        // Try to load from portfolio config JSON
        const configExperiences = await getExperiencesFromConfig();
        if (configExperiences && configExperiences.length > 0) {
            return configExperiences;
        }
        
        // Try to get from localStorage
        const savedData = localStorage.getItem('portfolio_experiences');
        if (savedData) {
            const data = JSON.parse(savedData);
            return Array.isArray(data) ? data : (data.data || defaultExperiences);
        }
        
        // Fallback to API
        const response = await fetch('/api/experiences');
        if (response.ok) {
            const data = await response.json();
            return Array.isArray(data) ? data : (data.data || defaultExperiences);
        }
        return defaultExperiences;
    } catch (error) {
        console.error('Error fetching experiences:', error);
        return defaultExperiences;
    }
}

export { defaultExperiences as experiences };

