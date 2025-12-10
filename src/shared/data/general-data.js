/**
 * General Data - Default portfolio settings
 */
const generalData = {
    heroName: 'Mohamed Adel',
    subtitle: 'Flutter Developer | Cross-Platform Mobile Applications',
    aboutText: `A Flutter Developer with +2 years of experience building high-performance cross-platform mobile applications. 
Proficient in state management, Firebase integration, and applying clean architecture principles. 
Committed to delivering intuitive user experiences and collaborating effectively to achieve project goals.`,
    profilePicture: 'src/assets/images/100.jpg',
    stats: {
        projects: 3,
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

export { generalData, navItems };
