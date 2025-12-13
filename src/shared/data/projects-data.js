/**
 * Projects Data - Fetches from portfolio-config.json
 * Edit projects easily in the portfolio-config.json file without touching code
 */

import { getProjectsFromConfig } from './config-loader.js';

const defaultProjects = [];

/**
 * Fetch projects from portfolio config JSON
 */
export async function getProjects() {
    try {
        // Try to load from portfolio config JSON
        const configProjects = await getProjectsFromConfig();
        if (configProjects && configProjects.length > 0) {
            return configProjects;
        }
        
        // Try to get from localStorage
        const savedData = localStorage.getItem('portfolio_projects');
        if (savedData) {
            const data = JSON.parse(savedData);
            return Array.isArray(data) ? data : (data.data || defaultProjects);
        }
        
        // Fallback to API
        const response = await fetch('/api/projects');
        if (response.ok) {
            const data = await response.json();
            return Array.isArray(data) ? data : (data.data || defaultProjects);
        }
        return defaultProjects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return defaultProjects;
    }
}

export { defaultProjects as projects };
