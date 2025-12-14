/**
 * Skills Data - Fetches from portfolio-config.json
 * Edit skills easily in the portfolio-config.json file without touching code
 */

import { getSkillsFromConfig } from './config-loader.js';

const defaultSkills = [];

/**
 * Fetch skills from portfolio config JSON
 */
export async function getSkills() {
    try {
        // Try to load from portfolio config JSON
        const configSkills = await getSkillsFromConfig();
        if (configSkills && configSkills.length > 0) {
            return configSkills;
        }
        
        // Try to get from localStorage
        const savedData = localStorage.getItem('portfolio_skills');
        if (savedData) {
            const data = JSON.parse(savedData);
            return Array.isArray(data) ? data : (data.data || defaultSkills);
        }
        
        // Fallback to API
        const response = await fetch('/api/skills');
        if (response.ok) {
            const data = await response.json();
            return Array.isArray(data) ? data : (data.data || defaultSkills);
        }
        return defaultSkills;
    } catch (error) {
        console.error('Error fetching skills:', error);
        return defaultSkills;
    }
}

export { defaultSkills as skills };
