/**
 * Admin Panel - Main JavaScript
 * Handles all admin functionality for the portfolio
 * Uses localStorage for data persistence
 */

import { initParticles } from '../src/shared/ui/particles.js';

// ===== State =====
let state = {
    general: null,
    skills: [],
    projects: [],
    experiences: [],
    messages: [],
    currentEditId: null,
    currentSection: 'dashboard',
    isLoading: false,
    isOnline: true // Track API availability
};

// ===== DOM Elements =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== Check Authentication =====
function checkAuth() {
    // Skip authentication check - allow direct access
    return true;
}

// ===== Path Normalization =====
function normalizePath(path) {
    if (!path) return path;
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
        return path;
    }
    if (path.startsWith('src/')) {
        return '../' + path;
    }
    return path;
}

// ===== Generate ID (fallback for offline mode) =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Starting admin initialization...');

        // Check authentication first
        if (!checkAuth()) return;

        // Initialize particles
        initParticles();
        console.log('Particles initialized');

        // Show loading state
        showLoading(true);

        // Load data from API
        await loadAllData();
        console.log('Data loaded');

        // Hide loading
        showLoading(false);

        // Initialize UI components
        initNavigation();
        initDashboard();
        initGeneralSettings();
        initSkillsManager();
        initProjectsManager();
        initExperienceManager();
        initMessagesSection();
        initSettings();
        initModals();

        // Display user info
        displayUserInfo();

        // Ensure dashboard is visible
        const dashboardBtn = $('[data-section="dashboard"]');
        if (dashboardBtn) dashboardBtn.classList.add('active');
        const dashboardSection = $('#section-dashboard');
        if (dashboardSection) dashboardSection.classList.add('active');

        console.log('Admin panel initialized successfully');
    } catch (error) {
        console.error('Admin initialization error:', error);
        showToast('Failed to initialize admin panel: ' + error.message, 'error');
        showLoading(false);
    }
});

// ===== Helper Functions =====
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// ===== Display User Info =====
function displayUserInfo() {
    // No authentication needed
    console.log('Admin panel loaded');
}

// ===== Loading Indicator =====
function showLoading(show) {
    state.isLoading = show;
    let loader = $('#global-loader');

    if (!loader && show) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = `
            <div class="loader-backdrop">
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <span>Loading...</span>
                </div>
            </div>
        `;
        loader.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(10, 15, 24, 0.9); z-index: 9999;
            display: flex; align-items: center; justify-content: center;
        `;
        loader.querySelector('.loader-content').style.cssText = `
            display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #01b5f8;
        `;
        loader.querySelector('.loader-spinner').style.cssText = `
            width: 40px; height: 40px; border: 3px solid rgba(1, 181, 248, 0.3);
            border-top-color: #01b5f8; border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        document.body.appendChild(loader);
    }

    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// ===== Load Data from LocalStorage =====
async function loadAllData() {
    try {
        // Load all data from localStorage
        const savedGeneral = localStorage.getItem('portfolio_general');
        const savedSkills = localStorage.getItem('portfolio_skills');
        const savedProjects = localStorage.getItem('portfolio_projects');
        const savedExperiences = localStorage.getItem('portfolio_experiences');

        state.general = savedGeneral ? JSON.parse(savedGeneral) : getDefaultGeneral();
        state.skills = savedSkills ? JSON.parse(savedSkills) : [];
        state.projects = savedProjects ? JSON.parse(savedProjects) : [];
        state.experiences = savedExperiences ? JSON.parse(savedExperiences) : [];
        state.isOnline = true;

        // Update all displays
        updateDashboardStats();
        renderGeneralSettings();
        renderSkills();
        renderProjects();
        renderExperiences();

    } catch (error) {
        console.error('Error loading data:', error);
        state.isOnline = false;
        showToast('Failed to load data', 'error');
    }
}

function getDefaultGeneral() {
    return {
        heroName: 'Mohamed Adel',
        subtitle: 'Flutter Developer',
        aboutText: '',
        contact: {},
        stats: { projectsCount: 0, yearsExperience: 0, happyClients: 0 }
    };
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const toast = $('#toast');
    const toastMessage = $('#toast-message');

    if (!toast || !toastMessage) return;

    toast.classList.remove('hidden', 'show', 'error');
    toastMessage.textContent = message;

    if (type === 'error') {
        toast.classList.add('error');
    }

    toast.offsetHeight; // Trigger reflow
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Navigation =====
function initNavigation() {
    const navBtns = $$('.nav-btn');
    const sections = $$('.content-section');
    const pageTitle = $('#page-title');
    const mobileMenuToggle = $('#mobile-menu-toggle');
    const sidebar = $('#sidebar');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;

            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(sec => sec.classList.remove('active'));
            const targetSection = $(`#section-${sectionId}`);
            if (targetSection) targetSection.classList.add('active');

            if (pageTitle) pageTitle.textContent = btn.querySelector('span').textContent;

            sidebar?.classList.remove('open');
            state.currentSection = sectionId;
        });
    });

    mobileMenuToggle?.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
    });

    // Quick actions
    $$('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'goto-general') {
                $('[data-section="general"]')?.click();
            } else if (action === 'goto-projects') {
                $('[data-section="projects"]')?.click();
                setTimeout(() => $('#add-project-btn')?.click(), 100);
            } else if (action === 'export') {
                exportAllData();
            }
        });
    });

    // Remove logout button or hide it
    const logoutBtn = $('#logout-btn');
    if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }
}

// ===== Dashboard =====
function initDashboard() {
    // Counter buttons
    $$('.counter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = $(`#${targetId}`);
            if (!input) return;

            let value = parseInt(input.value) || 0;

            if (btn.classList.contains('plus')) {
                value++;
            } else if (btn.classList.contains('minus') && value > 0) {
                value--;
            }

            input.value = value;
            updateStatsFromInputs();
        });
    });

    // Counter inputs
    ['projects-count', 'years-count', 'clients-count'].forEach(id => {
        const input = $(`#${id}`);
        if (input) {
            input.addEventListener('change', updateStatsFromInputs);
        }
    });

    // Save All button
    const saveAllBtn = $('#save-all-btn');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveAllData);
    }
}

function updateStatsFromInputs() {
    if (!state.general.stats) state.general.stats = {};

    state.general.stats.projectsCount = parseInt($('#projects-count')?.value) || 0;
    state.general.stats.yearsExperience = parseInt($('#years-count')?.value) || 0;
    state.general.stats.happyClients = parseInt($('#clients-count')?.value) || 0;

    updateDashboardStats();
}

function updateDashboardStats() {
    const stats = state.general?.stats || {};

    const statProjects = $('#stat-projects');
    const statYears = $('#stat-years');
    const statClients = $('#stat-clients');
    const statSkills = $('#stat-skills');

    if (statProjects) statProjects.textContent = stats.projectsCount || state.projects.length || 0;
    if (statYears) statYears.textContent = stats.yearsExperience || 0;
    if (statClients) statClients.textContent = stats.happyClients || 0;
    if (statSkills) statSkills.textContent = state.skills.length;

    // Update counter inputs
    const projectsCount = $('#projects-count');
    const yearsCount = $('#years-count');
    const clientsCount = $('#clients-count');

    if (projectsCount) projectsCount.value = stats.projectsCount || 0;
    if (yearsCount) yearsCount.value = stats.yearsExperience || 0;
    if (clientsCount) clientsCount.value = stats.happyClients || 0;
}

// ===== General Settings =====
function initGeneralSettings() {
    // Profile picture upload
    const profileUpload = $('#profile-upload-area');
    const profileInput = $('#profile-picture');
    const profilePreview = $('#profile-preview');

    profileUpload?.addEventListener('click', () => profileInput?.click());
    profileInput?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                showLoading(true);
                const base64 = await fileToBase64(file);
                
                // Store as base64 in localStorage
                profilePreview.src = base64;
                state.general.profilePicture = base64;

                profilePreview.classList.remove('hidden');
                profileUpload.querySelector('.upload-placeholder').style.display = 'none';
                showLoading(false);
            } catch (error) {
                showLoading(false);
                showToast('Error processing image', 'error');
            }
        }
    });

    // Input change handlers
    $('#hero-name')?.addEventListener('input', (e) => state.general.heroName = e.target.value);
    $('#hero-subtitle')?.addEventListener('input', (e) => state.general.subtitle = e.target.value);
    $('#about-text')?.addEventListener('input', (e) => state.general.aboutText = e.target.value);

    $('#contact-location')?.addEventListener('input', (e) => {
        if (!state.general.contact) state.general.contact = {};
        state.general.contact.location = e.target.value;
    });
    $('#contact-phone')?.addEventListener('input', (e) => {
        if (!state.general.contact) state.general.contact = {};
        state.general.contact.phone = e.target.value;
    });
    $('#contact-email')?.addEventListener('input', (e) => {
        if (!state.general.contact) state.general.contact = {};
        state.general.contact.email = e.target.value;
    });
    $('#contact-linkedin')?.addEventListener('input', (e) => {
        if (!state.general.contact) state.general.contact = {};
        state.general.contact.linkedin = e.target.value;
    });
}

function renderGeneralSettings() {
    const g = state.general || {};

    const heroName = $('#hero-name');
    const heroSubtitle = $('#hero-subtitle');
    const aboutText = $('#about-text');

    if (heroName) heroName.value = g.heroName || '';
    if (heroSubtitle) heroSubtitle.value = g.subtitle || '';
    if (aboutText) aboutText.value = g.aboutText || '';

    if (g.contact) {
        const contactLocation = $('#contact-location');
        const contactPhone = $('#contact-phone');
        const contactEmail = $('#contact-email');
        const contactLinkedin = $('#contact-linkedin');

        if (contactLocation) contactLocation.value = g.contact.location || '';
        if (contactPhone) contactPhone.value = g.contact.phone || '';
        if (contactEmail) contactEmail.value = g.contact.email || '';
        if (contactLinkedin) contactLinkedin.value = g.contact.linkedin || '';
    }

    if (g.profilePicture) {
        const preview = $('#profile-preview');
        const uploadArea = $('#profile-upload-area');
        if (preview) {
            preview.src = normalizePath(g.profilePicture);
            preview.classList.remove('hidden');
        }
        if (uploadArea) {
            const placeholder = uploadArea.querySelector('.upload-placeholder');
            if (placeholder) placeholder.style.display = 'none';
        }
    }
}

// ===== Skills Manager =====
function initSkillsManager() {
    const modal = $('#skill-modal');
    const addBtn = $('#add-skill-btn');
    const saveBtn = $('#save-skill-btn');
    const iconInput = $('#skill-icon');
    const iconPreview = $('#skill-icon-preview');

    addBtn?.addEventListener('click', () => {
        state.currentEditId = null;
        const title = $('#skill-modal-title');
        if (title) title.textContent = 'Add New Skill';

        const nameInput = $('#skill-name');
        if (nameInput) nameInput.value = '';
        if (iconInput) iconInput.value = '';
        if (iconPreview) iconPreview.src = '';

        modal?.classList.remove('hidden');
    });

    iconInput?.addEventListener('input', (e) => {
        if (iconPreview) iconPreview.src = e.target.value;
    });

    saveBtn?.addEventListener('click', async () => {
        const name = $('#skill-name')?.value.trim();
        const icon = $('#skill-icon')?.value.trim();

        if (!name || !icon) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            showLoading(true);

            const skillData = { name, icon };

            if (state.currentEditId) {
                // Update existing
                const index = state.skills.findIndex(s => s._id === state.currentEditId);
                if (index !== -1) {
                    state.skills[index] = { ...state.skills[index], ...skillData };
                }
                showToast('Skill updated!');
            } else {
                // Create new
                skillData._id = Date.now().toString();
                state.skills.push(skillData);
                showToast('Skill added!');
            }

            // Save to localStorage
            localStorage.setItem('portfolio_skills', JSON.stringify(state.skills));
            renderSkills();
            updateDashboardStats();

            modal?.classList.add('hidden');
            showLoading(false);
        } catch (error) {
            showLoading(false);
            showToast('Failed to save skill: ' + error.message, 'error');
        }
    });
}

function renderSkills() {
    const grid = $('#skills-grid');
    if (!grid) return;

    grid.innerHTML = state.skills.map(skill => `
        <div class="skill-admin-card" data-id="${skill._id || skill.id}">
            <img src="${normalizePath(skill.icon)}" alt="${skill.name}" onerror="this.onerror=null;this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22 viewBox=%220 0 48 48%22><rect fill=%22%231a1f2e%22 width=%2248%22 height=%2248%22 rx=%228%22/><text x=%2224%22 y=%2230%22 font-size=%2220%22 text-anchor=%22middle%22 fill=%22%236b7280%22>?</text></svg>'">
            <h4>${skill.name}</h4>
            <div class="actions">
                <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');

    // Add event listeners
    grid.querySelectorAll('.skill-admin-card').forEach(card => {
        const id = card.dataset.id;

        card.querySelector('.edit')?.addEventListener('click', () => {
            const skill = state.skills.find(s => (s._id || s.id) === id);
            if (skill) {
                state.currentEditId = id;
                const title = $('#skill-modal-title');
                if (title) title.textContent = 'Edit Skill';

                const nameInput = $('#skill-name');
                const iconInput = $('#skill-icon');
                const iconPreview = $('#skill-icon-preview');

                if (nameInput) nameInput.value = skill.name;
                if (iconInput) iconInput.value = skill.icon;
                if (iconPreview) iconPreview.src = skill.icon;

                $('#skill-modal')?.classList.remove('hidden');
            }
        });

        card.querySelector('.delete')?.addEventListener('click', () => {
            showConfirm('Delete this skill?', async () => {
                try {
                    showLoading(true);
                    state.skills = state.skills.filter(s => s._id !== id);
                    localStorage.setItem('portfolio_skills', JSON.stringify(state.skills));
                    renderSkills();
                    updateDashboardStats();
                    showLoading(false);
                    showToast('Skill deleted');
                } catch (error) {
                    showLoading(false);
                    showToast('Failed to delete skill: ' + error.message, 'error');
                }
            });
        });
    });
}

// ===== Projects Manager =====
let projectGalleryImages = [];

function initProjectsManager() {
    const modal = $('#project-modal');
    const addBtn = $('#add-project-btn');
    const saveBtn = $('#save-project-btn');

    addBtn?.addEventListener('click', () => {
        state.currentEditId = null;
        projectGalleryImages = [];
        clearProjectForm();
        const title = $('#project-modal-title');
        if (title) title.textContent = 'Add New Project';
        modal?.classList.remove('hidden');
    });

    // Cover image upload
    const coverUpload = $('#cover-upload-area');
    const coverInput = $('#project-cover');
    const coverPreview = $('#cover-preview');

    coverUpload?.addEventListener('click', () => coverInput?.click());
    coverInput?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                if (coverPreview) {
                    coverPreview.src = base64;
                    coverPreview.classList.remove('hidden');
                }
                if (coverUpload) {
                    const placeholder = coverUpload.querySelector('.upload-placeholder');
                    if (placeholder) placeholder.style.display = 'none';
                }
            } catch (error) {
                showToast('Error processing image', 'error');
            }
        }
    });

    // Gallery images
    const galleryInput = $('#project-gallery');
    galleryInput?.addEventListener('change', async (e) => {
        for (const file of e.target.files) {
            const base64 = await fileToBase64(file);
            projectGalleryImages.push(base64);
        }
        renderGalleryPreview();
    });

    saveBtn?.addEventListener('click', async () => {
        const title = $('#project-title')?.value.trim();
        const shortDesc = $('#project-short-desc')?.value.trim();
        const longDesc = $('#project-long-desc')?.value.trim();
        const github = $('#project-github')?.value.trim();
        const live = $('#project-live')?.value.trim();
        const tags = ($('#project-tags')?.value || '').split(',').map(t => t.trim()).filter(t => t);
        const cover = $('#cover-preview')?.src;

        if (!title || !shortDesc) {
            showToast('Please fill in required fields', 'error');
            return;
        }

        try {
            showLoading(true);

            // Keep cover image as base64 if it's a data URL
            let coverUrl = cover;
            if (cover && !cover.startsWith('data:')) {
                coverUrl = cover; // Keep existing URL
            }

            // Keep gallery images as base64
            const galleryUrls = projectGalleryImages.slice();

            const projectData = {
                title,
                shortDesc,
                longDesc,
                github: github || '',
                liveDemo: live || '',
                tags,
                cover: coverUrl || '',
                gallery: galleryUrls
            };

            if (state.currentEditId) {
                const index = state.projects.findIndex(p => p._id === state.currentEditId);
                if (index !== -1) {
                    state.projects[index] = { ...state.projects[index], ...projectData };
                }
                showToast('Project updated!');
            } else {
                projectData._id = Date.now().toString();
                state.projects.push(projectData);
                showToast('Project created!');
            }

            // Save to localStorage
            localStorage.setItem('portfolio_projects', JSON.stringify(state.projects));
            renderProjects();

            modal?.classList.add('hidden');
            showLoading(false);
        } catch (error) {
            showLoading(false);
            showToast('Failed to save project: ' + error.message, 'error');
        }
    });
}

function clearProjectForm() {
    const fields = ['project-title', 'project-short-desc', 'project-long-desc',
        'project-github', 'project-live', 'project-tags'];
    fields.forEach(id => {
        const el = $(`#${id}`);
        if (el) el.value = '';
    });

    const coverPreview = $('#cover-preview');
    if (coverPreview) {
        coverPreview.src = '';
        coverPreview.classList.add('hidden');
    }

    const uploadPlaceholder = $('#cover-upload-area .upload-placeholder');
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'flex';

    const galleryPreview = $('#gallery-preview');
    if (galleryPreview) galleryPreview.innerHTML = '';

    projectGalleryImages = [];
}

function renderGalleryPreview() {
    const container = $('#gallery-preview');
    if (!container) return;

    container.innerHTML = projectGalleryImages.map((img, index) => `
        <div class="gallery-item">
            <img src="${img}" alt="Gallery ${index + 1}">
            <button class="remove-btn" data-index="${index}"><i class="fas fa-times"></i></button>
        </div>
    `).join('');

    container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            projectGalleryImages.splice(index, 1);
            renderGalleryPreview();
        });
    });
}

function renderProjects() {
    const grid = $('#projects-admin-grid');
    if (!grid) return;

    grid.innerHTML = state.projects.map(project => `
        <div class="project-admin-card" data-id="${project._id || project.id}">
            <img class="cover" src="${normalizePath(project.cover || project.coverImage)}" alt="${project.title}" onerror="this.onerror=null;this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22160%22 viewBox=%220 0 300 160%22><rect fill=%22%231a1f2e%22 width=%22300%22 height=%22160%22/><text x=%22150%22 y=%2285%22 font-size=%2214%22 text-anchor=%22middle%22 fill=%22%236b7280%22>No Image</text></svg>'">
            <div class="content">
                <h4>${project.title}</h4>
                <p>${project.shortDesc || project.shortDescription || ''}</p>
                <div class="tags">
                    ${(project.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="actions">
                    <button class="btn-secondary edit"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-secondary delete" style="border-color: rgba(239,68,68,0.3); color: #ef4444;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.project-admin-card').forEach(card => {
        const id = card.dataset.id;

        card.querySelector('.edit')?.addEventListener('click', () => {
            const project = state.projects.find(p => (p._id || p.id) == id);
            if (project) {
                state.currentEditId = id;
                const modalTitle = $('#project-modal-title');
                if (modalTitle) modalTitle.textContent = 'Edit Project';

                $('#project-title').value = project.title || '';
                $('#project-short-desc').value = project.shortDesc || project.shortDescription || '';
                $('#project-long-desc').value = project.longDesc || (project.longDescription || []).join('\n') || '';
                $('#project-github').value = project.github || project.githubUrl || '';
                $('#project-live').value = project.liveDemo || project.liveUrl || '';
                $('#project-tags').value = (project.tags || []).join(', ');

                const cover = project.cover || project.coverImage;
                if (cover) {
                    const coverPreview = $('#cover-preview');
                    if (coverPreview) {
                        coverPreview.src = cover;
                        coverPreview.classList.remove('hidden');
                    }
                    const placeholder = $('#cover-upload-area .upload-placeholder');
                    if (placeholder) placeholder.style.display = 'none';
                }

                projectGalleryImages = project.gallery || project.detailImages || [];
                renderGalleryPreview();

                $('#project-modal')?.classList.remove('hidden');
            }
        });

        card.querySelector('.delete')?.addEventListener('click', () => {
            showConfirm('Delete this project?', async () => {
                try {
                    showLoading(true);
                    state.projects = state.projects.filter(p => p._id !== id);
                    localStorage.setItem('portfolio_projects', JSON.stringify(state.projects));
                    renderProjects();
                    showLoading(false);
                    showToast('Project deleted');
                } catch (error) {
                    showLoading(false);
                    showToast('Failed to delete project: ' + error.message, 'error');
                }
            });
        });
    });
}

// ===== Experience Manager =====
let experienceTasks = [];

function initExperienceManager() {
    const modal = $('#experience-modal');
    const addBtn = $('#add-experience-btn');
    const saveBtn = $('#save-experience-btn');
    const addTaskBtn = $('#add-task-btn');

    addBtn?.addEventListener('click', () => {
        state.currentEditId = null;
        experienceTasks = [''];
        clearExperienceForm();
        renderTaskInputs();
        const title = $('#experience-modal-title');
        if (title) title.textContent = 'Add New Experience';
        modal?.classList.remove('hidden');
    });

    // Logo upload
    const logoUpload = $('#exp-logo-upload-area');
    const logoInput = $('#exp-logo');
    const logoPreview = $('#exp-logo-preview');

    logoUpload?.addEventListener('click', () => logoInput?.click());
    logoInput?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await fileToBase64(file);
            if (logoPreview) {
                logoPreview.src = base64;
                logoPreview.classList.remove('hidden');
            }
            if (logoUpload) {
                const placeholder = logoUpload.querySelector('.upload-placeholder');
                if (placeholder) placeholder.style.display = 'none';
            }
        }
    });

    addTaskBtn?.addEventListener('click', () => {
        experienceTasks.push('');
        renderTaskInputs();
    });

    saveBtn?.addEventListener('click', async () => {
        const company = $('#exp-company')?.value.trim();
        const location = $('#exp-location')?.value.trim();
        const role = $('#exp-role')?.value.trim();
        const period = $('#exp-period')?.value.trim();
        const logo = $('#exp-logo-preview')?.src;

        const taskInputs = $$('.task-input');
        const tasks = Array.from(taskInputs).map(inp => inp.value.trim()).filter(t => t);

        if (!company || !role) {
            showToast('Please fill in company and role', 'error');
            return;
        }

        try {
            showLoading(true);

            // Keep logo as base64 if it's a data URL
            let logoUrl = logo;
            if (logo && !logo.startsWith('data:')) {
                logoUrl = logo; // Keep existing URL
            }

            const expData = {
                company,
                location: location || '',
                role,
                period: period || '',
                logo: logoUrl || '',
                tasks
            };

            if (state.currentEditId) {
                const index = state.experiences.findIndex(e => e._id === state.currentEditId);
                if (index !== -1) {
                    state.experiences[index] = { ...state.experiences[index], ...expData };
                }
                showToast('Experience updated!');
            } else {
                expData._id = Date.now().toString();
                state.experiences.push(expData);
                showToast('Experience added!');
            }

            localStorage.setItem('portfolio_experiences', JSON.stringify(state.experiences));
            renderExperiences();

            modal?.classList.add('hidden');
            showLoading(false);
        } catch (error) {
            showLoading(false);
            showToast('Failed to save experience: ' + error.message, 'error');
        }
    });
}

function clearExperienceForm() {
    const fields = ['exp-company', 'exp-location', 'exp-role', 'exp-period'];
    fields.forEach(id => {
        const el = $(`#${id}`);
        if (el) el.value = '';
    });

    const logoPreview = $('#exp-logo-preview');
    if (logoPreview) {
        logoPreview.src = '';
        logoPreview.classList.add('hidden');
    }

    const placeholder = $('#exp-logo-upload-area .upload-placeholder');
    if (placeholder) placeholder.style.display = 'flex';
}

function renderTaskInputs() {
    const container = $('#exp-tasks-container');
    if (!container) return;

    container.innerHTML = experienceTasks.map((task, index) => `
        <div class="task-input-row">
            <input type="text" class="form-input task-input" value="${task}" placeholder="Task or responsibility">
            <button type="button" class="btn-remove-task" data-index="${index}" title="Remove"><i class="fas fa-times"></i></button>
        </div>
    `).join('');

    container.querySelectorAll('.btn-remove-task').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            experienceTasks.splice(index, 1);
            if (experienceTasks.length === 0) experienceTasks = [''];
            renderTaskInputs();
        });
    });

    container.querySelectorAll('.task-input').forEach((input, index) => {
        input.addEventListener('input', (e) => {
            experienceTasks[index] = e.target.value;
        });
    });
}

function renderExperiences() {
    const grid = $('#experience-admin-grid');
    if (!grid) return;

    grid.innerHTML = state.experiences.map(exp => `
        <div class="experience-admin-card" data-id="${exp._id || exp.id}">
            <img class="logo" src="${normalizePath(exp.logo)}" alt="${exp.company}" onerror="this.onerror=null;this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22><rect fill=%22%231a1f2e%22 width=%2260%22 height=%2260%22 rx=%2210%22/><text x=%2230%22 y=%2238%22 font-size=%2212%22 text-anchor=%22middle%22 fill=%22%236b7280%22>Logo</text></svg>'">
            <div class="info">
                <h4>${exp.company}</h4>
                <div class="role">${exp.role}</div>
                <div class="meta">${exp.location || ''} • ${exp.period || ''}</div>
            </div>
            <div class="actions">
                <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.experience-admin-card').forEach(card => {
        const id = card.dataset.id;

        card.querySelector('.edit')?.addEventListener('click', () => {
            const exp = state.experiences.find(e => (e._id || e.id) === id);
            if (exp) {
                state.currentEditId = id;
                const title = $('#experience-modal-title');
                if (title) title.textContent = 'Edit Experience';

                $('#exp-company').value = exp.company || '';
                $('#exp-location').value = exp.location || '';
                $('#exp-role').value = exp.role || '';
                $('#exp-period').value = exp.period || '';

                if (exp.logo) {
                    const logoPreview = $('#exp-logo-preview');
                    if (logoPreview) {
                        logoPreview.src = exp.logo;
                        logoPreview.classList.remove('hidden');
                    }
                    const placeholder = $('#exp-logo-upload-area .upload-placeholder');
                    if (placeholder) placeholder.style.display = 'none';
                }

                experienceTasks = exp.tasks && exp.tasks.length ? [...exp.tasks] : [''];
                renderTaskInputs();

                $('#experience-modal')?.classList.remove('hidden');
            }
        });

        card.querySelector('.delete')?.addEventListener('click', () => {
            showConfirm('Delete this experience?', async () => {
                try {
                    showLoading(true);
                    state.experiences = state.experiences.filter(e => e._id !== id);
                    localStorage.setItem('portfolio_experiences', JSON.stringify(state.experiences));
                    renderExperiences();
                    showLoading(false);
                    showToast('Experience deleted');
                } catch (error) {
                    showLoading(false);
                    showToast('Failed to delete experience: ' + error.message, 'error');
                }
            });
        });
    });
}

// ===== Messages Section =====
function initMessagesSection() {
    // Load messages if we have access
    loadMessages();
}

async function loadMessages() {
    try {
        const stored = localStorage.getItem('portfolio_messages');
        state.messages = stored ? JSON.parse(stored) : [];
        renderMessages();
        updateMessagesCount();
    } catch (error) {
        console.log('Messages not available:', error.message);
    }
}

function updateMessagesCount() {
    const unreadCount = state.messages.filter(m => !m.read).length;
    const badge = $('#messages-count');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
    }
}

function renderMessages() {
    // Messages are displayed in the messages section
    // This would require adding a messages list to the HTML
    // For now, we just update the count
    updateMessagesCount();
}

// ===== Settings =====
function initSettings() {
    // Export
    $('#export-data-btn')?.addEventListener('click', () => {
        exportAllData();
    });

    // Import
    const importBtn = $('#import-data-btn');
    const importInput = $('#import-file');

    importBtn?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                await importData(data);
                showToast('Data imported successfully!');
            } catch (error) {
                showToast('Import failed: ' + error.message, 'error');
            }
        }
    });

    // Reset
    $('#reset-data-btn')?.addEventListener('click', () => {
        showConfirm('This will delete ALL your data. Are you sure?', async () => {
            try {
                showLoading(true);
                
                // Clear all localStorage data
                localStorage.removeItem('portfolio_general');
                localStorage.removeItem('portfolio_skills');
                localStorage.removeItem('portfolio_projects');
                localStorage.removeItem('portfolio_experiences');
                localStorage.removeItem('portfolio_messages');
                
                // Reset state to defaults
                await loadAllData();
                
                showLoading(false);
                showToast('✅ All data reset to defaults!');
                
                // Reload page after 1 second
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } catch (error) {
                showLoading(false);
                showToast('Failed to reset data: ' + error.message, 'error');
            }
        });
    });
}

// ===== Export Data =====
async function exportAllData() {
    try {
        const data = {
            general: state.general,
            skills: state.skills,
            projects: state.projects,
            experiences: state.experiences,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('Data exported successfully!');
    } catch (error) {
        showToast('Export failed: ' + error.message, 'error');
    }
}

// ===== Import Data =====
async function importData(data) {
    showLoading(true);

    try {
        // Import general settings
        if (data.general) {
            state.general = data.general;
            localStorage.setItem('portfolio_general', JSON.stringify(data.general));
        }

        // Import skills
        if (data.skills && Array.isArray(data.skills)) {
            const skills = data.skills.map((skill, idx) => ({
                _id: skill._id || `skill_${Date.now()}_${idx}`,
                name: skill.name,
                icon: skill.icon
            }));
            localStorage.setItem('portfolio_skills', JSON.stringify(skills));
        }

        // Import projects
        if (data.projects && Array.isArray(data.projects)) {
            const projects = data.projects.map((project, idx) => ({
                _id: project._id || `project_${Date.now()}_${idx}`,
                title: project.title,
                shortDesc: project.shortDesc || project.shortDescription,
                longDesc: project.longDesc || (project.longDescription || []).join('\n'),
                github: project.github || project.githubUrl,
                liveDemo: project.liveDemo || project.liveUrl,
                tags: project.tags,
                cover: project.cover || project.coverImage,
                gallery: project.gallery || project.detailImages
            }));
            localStorage.setItem('portfolio_projects', JSON.stringify(projects));
        }

        // Import experiences
        if (data.experiences && Array.isArray(data.experiences)) {
            const experiences = data.experiences.map((exp, idx) => ({
                _id: exp._id || `exp_${Date.now()}_${idx}`,
                company: exp.company,
                location: exp.location,
                role: exp.role,
                period: exp.period,
                logo: exp.logo,
                tasks: exp.tasks
            }));
            localStorage.setItem('portfolio_experiences', JSON.stringify(experiences));
        }

        // Reload all data
        await loadAllData();
        showLoading(false);

    } catch (error) {
        showLoading(false);
        throw error;
    }
}

// ===== Modals =====
function initModals() {
    $$('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    $$('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal')?.classList.add('hidden');
        });
    });
}

// ===== Confirm Dialog =====
let confirmCallback = null;

function showConfirm(message, onConfirm) {
    const modal = $('#confirm-modal');
    const messageEl = $('#confirm-message');
    if (messageEl) messageEl.textContent = message;
    confirmCallback = onConfirm;
    modal?.classList.remove('hidden');
}

$('#confirm-cancel')?.addEventListener('click', () => {
    $('#confirm-modal')?.classList.add('hidden');
    confirmCallback = null;
});

$('#confirm-ok')?.addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    $('#confirm-modal')?.classList.add('hidden');
    confirmCallback = null;
});

// ===== Save All Data =====
async function saveAllData() {
    try {
        showLoading(true);

        // Save all data to localStorage
        localStorage.setItem('portfolio_general', JSON.stringify(state.general));
        localStorage.setItem('portfolio_skills', JSON.stringify(state.skills));
        localStorage.setItem('portfolio_projects', JSON.stringify(state.projects));
        localStorage.setItem('portfolio_experiences', JSON.stringify(state.experiences));

        showLoading(false);
        showToast('✅ All changes saved locally!');
        
        // Open the main website in a new tab after 1 second
        setTimeout(() => {
            window.open('../index.html', '_blank');
        }, 1000);
    } catch (error) {
        showLoading(false);
        showToast('Failed to save: ' + error.message, 'error');
    }
}
