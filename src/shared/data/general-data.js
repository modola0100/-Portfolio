/**
 * General Data - Default portfolio settings
 * Now loads from portfolio-config.json for easy editing
 */

import { getGeneralDataFromConfig } from './config-loader.js';

const defaultGeneralData = {
    heroName: 'Mohamed Adel',
    subtitle: 'Flutter Developer | Cross-Platform Mobile Applications',
    aboutText: `A Flutter Developer with +2 years of experience building high-performance cross-platform mobile applications. 
Proficient in state management, Firebase integration, and applying clean architecture principles. 
Committed to delivering intuitive user experiences and collaborating effectively to achieve project goals.`,
    profilePicture: 'src/assets/images/100.jpg',
    stats: {
        projectsCount: 3,
        yearsExperience: 1,
        happyClients: 2
    },
    contact: {
        location: 'Qaliobia, Benha, Egypt',
        phone: '+20 106 412 0753',
        email: 'mahmedadel973@gmail.com',
        linkedin: 'https://www.linkedin.com/in/mohamed-adel-051ba4256'
    },
    socialLinks: {
        github: 'https://github.com/MohamedAdel743',
        linkedin: 'https://www.linkedin.com/in/mohamed-adel-051ba4256',
        facebook: 'https://web.facebook.com/modola123',
        whatsapp: 'https://wa.me/qr/LY6KWYEYKHNPF1'
    }
};

/**
 * Fetch general data from portfolio config JSON
 */
export async function getGeneralData() {
    try {
        // Try to load from portfolio config
        const configData = await getGeneralDataFromConfig();
        if (configData) {
            return configData;
        }
        
        // Try to get from localStorage
        const savedData = localStorage.getItem('portfolio_general');
        if (savedData) {
            return JSON.parse(savedData);
        }
        
        // Fallback to API
        const response = await fetch('/api/general');
        if (response.ok) {
            const data = await response.json();
            return data || defaultGeneralData;
        }
        return defaultGeneralData;
    } catch (error) {
        console.error('Error fetching general data:', error);
        return defaultGeneralData;
    }
}

/**
 * Default navigation items
 */
const navItems = [
    { id: 1, label: 'Home', href: '#home', order: 1 },
    { id: 2, label: 'About', href: '#about', order: 2 },
    { id: 3, label: 'Skills', href: '#skills', order: 3 },
    { id: 4, label: 'Projects', href: '#work', order: 4 },
    { id: 5, label: 'Experience', href: '#experience', order: 5 },
    { id: 6, label: 'Contact', href: '#contact', order: 6 }
];

export { defaultGeneralData as generalData, navItems };
