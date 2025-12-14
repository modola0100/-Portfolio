/**
 * Data Service - Central data management for portfolio admin
 * Handles localStorage operations, data validation, and export/import
 */

const STORAGE_KEYS = {
    PROJECTS: 'portfolio-projects',
    EXPERIENCES: 'portfolio-experiences',
    SKILLS: 'portfolio-skills',
    GENERAL: 'portfolio-general',
    MESSAGES: 'portfolio-messages',
    NAV_ITEMS: 'portfolio-navItems'
};

/**
 * Default general settings
 */
const defaultGeneral = {
    heroName: 'Mohamed Adel',
    aboutText: `A Flutter Developer with +2 years of experience building high-performance cross-platform mobile applications. 
Proficient in state management, Firebase integration, and applying clean architecture principles. 
Committed to delivering intuitive user experiences and collaborating effectively to achieve project goals.`,
    profilePicture: 'src/assets/images/100.jpg',
    stats: {
        projects: 3,
        yearsExperience: 1,
        happyClients: 2
    }
};

/**
 * Get data from localStorage or return default
 */
export function getData(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

/**
 * Save data to localStorage
 */
export function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
        // Check if it's a quota exceeded error
        if (error.name === 'QuotaExceededError') {
            alert('Storage limit exceeded. Please remove some images or export your data.');
        }
        return false;
    }
}

/**
 * Get all portfolio data
 */
export function getPortfolioData() {
    return {
        general: getData(STORAGE_KEYS.GENERAL, defaultGeneral),
        projects: getData(STORAGE_KEYS.PROJECTS, null),
        experiences: getData(STORAGE_KEYS.EXPERIENCES, null),
        skills: getData(STORAGE_KEYS.SKILLS, null),
        navItems: getData(STORAGE_KEYS.NAV_ITEMS, null),
        messages: getData(STORAGE_KEYS.MESSAGES, [])
    };
}

/**
 * Save specific section data
 */
export function saveSection(section, data) {
    const keyMap = {
        general: STORAGE_KEYS.GENERAL,
        projects: STORAGE_KEYS.PROJECTS,
        experiences: STORAGE_KEYS.EXPERIENCES,
        skills: STORAGE_KEYS.SKILLS,
        navItems: STORAGE_KEYS.NAV_ITEMS,
        messages: STORAGE_KEYS.MESSAGES
    };
    
    const key = keyMap[section];
    if (key) {
        return saveData(key, data);
    }
    console.error(`Unknown section: ${section}`);
    return false;
}

/**
 * Export all data as JSON file
 */
export function exportAllData() {
    const data = getPortfolioData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Import data from JSON file
 */
export function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validate and save each section
                if (data.general) saveSection('general', data.general);
                if (data.projects) saveSection('projects', data.projects);
                if (data.experiences) saveSection('experiences', data.experiences);
                if (data.skills) saveSection('skills', data.skills);
                if (data.navItems) saveSection('navItems', data.navItems);
                if (data.messages) saveSection('messages', data.messages);
                
                resolve(data);
            } catch (error) {
                reject(new Error('Invalid JSON file'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

/**
 * Compress image to reduce localStorage usage
 */
export function compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Scale down if too large
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Generate unique ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Clear all portfolio data (with confirmation)
 */
export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}

export { STORAGE_KEYS, defaultGeneral };
