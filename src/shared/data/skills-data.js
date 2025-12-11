/**
 * Skills Data - Fetches from /api/skills endpoint
 */
const defaultSkills = [
    {
        id: 1,
        name: 'Flutter & Dart',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
        type: 'url'
    },
    {
        id: 2,
        name: 'Firebase',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
        type: 'url'
    },
    {
        id: 3,
        name: 'State Management',
        icon: 'src/assets/images/icons/icons8-library-50.png',
        type: 'local'
    },
    {
        id: 4,
        name: 'REST APIs',
        icon: 'src/assets/images/icons/api.png',
        type: 'local'
    },
    {
        id: 5,
        name: 'Clean Architecture',
        icon: 'src/assets/images/icons/clean-code.png',
        type: 'local'
    },
    {
        id: 6,
        name: 'Git & GitHub',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
        type: 'url'
    },
    {
        id: 7,
        name: 'Responsive Design',
        icon: 'src/assets/images/icons/responsive-app.png',
        type: 'local'
    },
    {
        id: 8,
        name: 'Localization (i18n)',
        icon: 'src/assets/images/icons/translate_5739218.png',
        type: 'local'
    },
    {
        id: 9,
        name: 'Testing',
        icon: 'src/assets/images/icons/testing.png',
        type: 'local'
    }
];

/**
 * Fetch skills from API
 */
export async function getSkills() {
    try {
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
