/**
 * Projects Data - Fetches from /api/projects endpoint
 */

const defaultProjects = [
   
    {
        id: 1,
        title: 'Tasketi',
        shortDescription: 'A clean and modern Flutter notes app with offline storage, image support, and elegant UI design.',
        longDescription: [
            'A beautifully crafted Flutter application for effortless note-taking.',
            'Built with Clean Architecture principles for scalability.',
            'Leverages Hive database for fast, secure offline storage.',
            'Features both Light and Dark themes for user comfort.',
            'Integrates Lottie animations for a smooth, engaging experience.'
        ],
        coverImage: 'src/assets/images/3.png',
        detailImages: ['src/assets/images/2.png'],
        tags: ['Flutter', 'Hive', 'Clean Architecture', 'Lottie', 'Image Picker', 'Intl', 'Dark Mode'],
        githubUrl: 'https://github.com/modola0100/taskati',
        liveUrl: 'https://appetize.io/app/b_ymghlex5c44ec3haxusngxr5t4'
    },
    {
        id: 2,
        title: 'BMI Calculator',
        shortDescription: 'A simple and intuitive Flutter app to calculate your Body Mass Index (BMI) and track your health.',
        longDescription: [
            'A user-friendly application built with Flutter to monitor your Body Mass Index.',
            'Instantly computes BMI and categorizes the result (e.g., Underweight, Normal, Overweight).',
            'Provides essential insights into your health with a clean interface.',
            'Features smooth performance, making health tracking simple and accessible.'
        ],
        coverImage: 'src/assets/images/bmi.jpg',
        detailImages: ['src/assets/images/bm2.webp'],
        "tags": ["Flutter", "Dart", "Material Design", "Responsive UI", "BMI Calculator", "Health & Fitness"],
        githubUrl: 'https://github.com/modola0100/bmi_app',
        liveUrl: 'https://appetize.io/app/b_l2hd46lgyp2oysxidsubrb2wtu'
    },
    {
        id: 3, 
        title: 'Bookia App',
        shortDescription: 'A complete Flutter bookstore app with live APIs, Cubit state management, and a clean, modern UI.',
        longDescription: [
            'A comprehensive bookstore application built from scratch using Flutter.',
            'Connects to real-world APIs to explore, buy, and save favorite books.',
            'Features a secure login/signup system, shopping cart, and wishlist functionality.',
            'State management is handled efficiently using Cubit.',
            'Uses SharedPreferences for local data persistence in a clean, user-friendly interface.'
        ],
        coverImage: 'src/assets/images/welcome.png', 
        detailImages: [ 'src/assets/images/welcome.png'], 
        tags: ['Flutter', 'Cubit', 'REST API', 'State Management', 'SharedPreferences', 'Authentication', 'E-commerce'],
        githubUrl: 'https://github.com/modola0100/bookiaaaaa',
        liveUrl: 'https://appetize.io/apps/android/com.example.bookiaaa',
    }
];

/**
 * Fetch projects from API
 */
export async function getProjects() {
    try {
        const response = await fetch('/api/projects');
        if (response.ok) {
            const data = await response.json();
            return data.data || defaultProjects;
        }
        return defaultProjects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return defaultProjects;
    }
}

export { defaultProjects as projects };
