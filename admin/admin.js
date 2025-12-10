/**
 * Admin Panel - Main JavaScript
 * Handles all admin functionality for the portfolio
 */

import { projects } from '../src/shared/data/projects-data.js';
import { experiences } from '../src/shared/data/experience-data.js';
import { skills as defaultSkills } from '../src/shared/data/skills-data.js';
import { generalData, navItems as defaultNavItems } from '../src/shared/data/general-data.js';
import {
    getData,
    saveData,
    getPortfolioData,
    saveSection,
    exportAllData,
    importData,
    compressImage,
    generateId,
    clearAllData,
    STORAGE_KEYS
} from '../src/shared/data/data-service.js';
import { initParticles } from '../src/shared/ui/particles.js';

// ===== State =====
let state = {
    general: null,
    skills: [],
    projects: [],
    experiences: [],
    currentEditId: null,
    currentSection: 'dashboard'
};

// ===== DOM Elements =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== Path Normalization =====
// Fix paths that are relative to root when running from /admin/ folder
function normalizePath(path) {
    if (!path) return path;
    // If it's a URL or data URI, don't modify
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
        return path;
    }
    // If path starts with src/, prepend ../ to go up from admin folder
    if (path.startsWith('src/')) {
        return '../' + path;
    }
    return path;
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Starting admin initialization...');
        initParticles();
        console.log('Particles initialized');
        
        loadAllData();
        console.log('Data loaded');
        
        initNavigation();
        console.log('Navigation initialized');
        
        initDashboard();
        console.log('Dashboard initialized');
        
        initGeneralSettings();
        initSkillsManager();
        initProjectsManager();
        initExperienceManager();
        initSettings();
        initModals();
        
        // Ensure dashboard is visible
        const dashboardBtn = $('[data-section="dashboard"]');
        if (dashboardBtn) {
            dashboardBtn.classList.add('active');
            console.log('Dashboard button active set');
        }
        const dashboardSection = $('#section-dashboard');
        if (dashboardSection) {
            dashboardSection.classList.add('active');
            console.log('Dashboard section active set');
        }
    } catch (error) {
        console.error('Admin initialization error:', error);
    }
});

// ===== Load Data =====
function loadAllData() {
    // Load from localStorage or use defaults
    state.general = getData(STORAGE_KEYS.GENERAL, generalData);
    state.skills = getData(STORAGE_KEYS.SKILLS, defaultSkills);
    state.projects = getData(STORAGE_KEYS.PROJECTS, projects);
    state.experiences = getData(STORAGE_KEYS.EXPERIENCES, experiences);

    // Update all displays
    updateDashboardStats();
    renderGeneralSettings();
    renderSkills();
    renderProjects();
    renderExperiences();
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const toast = $('#toast');
    const toastMessage = $('#toast-message');

    toast.classList.remove('hidden', 'show', 'error');
    toastMessage.textContent = message;

    if (type === 'error') {
        toast.classList.add('error');
    }

    // Trigger reflow
    toast.offsetHeight;
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

            // Update active button
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active section
            sections.forEach(sec => sec.classList.remove('active'));
            $(`#section-${sectionId}`).classList.add('active');

            // Update page title
            pageTitle.textContent = btn.querySelector('span').textContent;

            // Close mobile menu
            sidebar.classList.remove('open');

            state.currentSection = sectionId;
        });
    });

    // Mobile menu toggle
    mobileMenuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Quick actions
    $$('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'goto-general') {
                $('[data-section="general"]').click();
            } else if (action === 'goto-projects') {
                $('[data-section="projects"]').click();
                setTimeout(() => $('#add-project-btn').click(), 100);
            } else if (action === 'export') {
                exportAllData();
                showToast('Data exported successfully!');
            }
        });
    });
}

// ===== Dashboard =====
function initDashboard() {
    // Counter buttons
    $$('.counter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = $(`#${targetId}`);
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
        $(`#${id}`).addEventListener('change', updateStatsFromInputs);
    });

    // Save All button
    $('#save-all-btn').addEventListener('click', saveAllData);
}

function updateStatsFromInputs() {
    state.general.stats = {
        projects: parseInt($('#projects-count').value) || 0,
        yearsExperience: parseInt($('#years-count').value) || 0,
        happyClients: parseInt($('#clients-count').value) || 0
    };
    updateDashboardStats();
}

function updateDashboardStats() {
    $('#stat-projects').textContent = state.general.stats?.projects || 0;
    $('#stat-years').textContent = state.general.stats?.yearsExperience || 0;
    $('#stat-clients').textContent = state.general.stats?.happyClients || 0;
    $('#stat-skills').textContent = state.skills.length;

    // Update counter inputs
    $('#projects-count').value = state.general.stats?.projects || 0;
    $('#years-count').value = state.general.stats?.yearsExperience || 0;
    $('#clients-count').value = state.general.stats?.happyClients || 0;
}

// ===== General Settings =====
function initGeneralSettings() {
    // Profile picture upload
    const profileUpload = $('#profile-upload-area');
    const profileInput = $('#profile-picture');
    const profilePreview = $('#profile-preview');

    profileUpload.addEventListener('click', () => profileInput.click());
    profileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const dataUrl = await compressImage(file);
                profilePreview.src = dataUrl;
                profilePreview.classList.remove('hidden');
                profileUpload.querySelector('.upload-placeholder').style.display = 'none';
                state.general.profilePicture = dataUrl;
            } catch (error) {
                showToast('Error processing image', 'error');
            }
        }
    });

    // Input change handlers
    $('#hero-name').addEventListener('input', (e) => state.general.heroName = e.target.value);
    $('#hero-subtitle').addEventListener('input', (e) => state.general.subtitle = e.target.value);
    $('#about-text').addEventListener('input', (e) => state.general.aboutText = e.target.value);
    $('#contact-location').addEventListener('input', (e) => {
        if (!state.general.contact) state.general.contact = {};
        state.general.contact.location = e.target.value;
    });
    $('#contact-phone').addEventListener('input', (e) => {
        if (!state.general.contact) state.general.contact = {};
        state.general.contact.phone = e.target.value;
    });
    $('#contact-email').addEventListener('input', (e) => {
        if (!state.general.contact) state.general.contact = {};
        state.general.contact.email = e.target.value;
    });
    $('#contact-linkedin').addEventListener('input', (e) => {
        if (!state.general.contact) state.general.contact = {};
        state.general.contact.linkedin = e.target.value;
    });
}

function renderGeneralSettings() {
    const g = state.general;

    $('#hero-name').value = g.heroName || '';
    $('#hero-subtitle').value = g.subtitle || '';
    $('#about-text').value = g.aboutText || '';

    if (g.contact) {
        $('#contact-location').value = g.contact.location || '';
        $('#contact-phone').value = g.contact.phone || '';
        $('#contact-email').value = g.contact.email || '';
        $('#contact-linkedin').value = g.contact.linkedin || '';
    }

    if (g.profilePicture) {
        const preview = $('#profile-preview');
        preview.src = normalizePath(g.profilePicture);
        preview.classList.remove('hidden');
        $('#profile-upload-area .upload-placeholder').style.display = 'none';
    }
}

// ===== Skills Manager =====
function initSkillsManager() {
    const modal = $('#skill-modal');
    const addBtn = $('#add-skill-btn');
    const saveBtn = $('#save-skill-btn');
    const iconInput = $('#skill-icon');
    const iconPreview = $('#skill-icon-preview');

    addBtn.addEventListener('click', () => {
        state.currentEditId = null;
        $('#skill-modal-title').textContent = 'Add New Skill';
        $('#skill-name').value = '';
        $('#skill-icon').value = '';
        iconPreview.src = '';
        modal.classList.remove('hidden');
    });

    // Preview icon on input change
    iconInput.addEventListener('input', (e) => {
        iconPreview.src = e.target.value;
    });

    saveBtn.addEventListener('click', () => {
        const name = $('#skill-name').value.trim();
        const icon = $('#skill-icon').value.trim();

        if (!name || !icon) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        if (state.currentEditId) {
            // Edit existing
            const index = state.skills.findIndex(s => s.id === state.currentEditId);
            if (index !== -1) {
                state.skills[index].name = name;
                state.skills[index].icon = icon;
            }
        } else {
            // Add new
            state.skills.push({
                id: generateId(),
                name,
                icon,
                type: icon.startsWith('http') ? 'url' : 'local'
            });
        }

        renderSkills();
        updateDashboardStats();
        modal.classList.add('hidden');
        showToast('Skill saved!');
    });
}

function renderSkills() {
    const grid = $('#skills-grid');
    grid.innerHTML = state.skills.map(skill => `
        <div class="skill-admin-card" data-id="${skill.id}">
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

        card.querySelector('.edit').addEventListener('click', () => {
            const skill = state.skills.find(s => s.id === id);
            if (skill) {
                state.currentEditId = id;
                $('#skill-modal-title').textContent = 'Edit Skill';
                $('#skill-name').value = skill.name;
                $('#skill-icon').value = skill.icon;
                $('#skill-icon-preview').src = skill.icon;
                $('#skill-modal').classList.remove('hidden');
            }
        });

        card.querySelector('.delete').addEventListener('click', () => {
            showConfirm('Delete this skill?', () => {
                state.skills = state.skills.filter(s => s.id !== id);
                renderSkills();
                updateDashboardStats();
                showToast('Skill deleted');
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

    addBtn.addEventListener('click', () => {
        state.currentEditId = null;
        projectGalleryImages = [];
        clearProjectForm();
        $('#project-modal-title').textContent = 'Add New Project';
        modal.classList.remove('hidden');
    });

    // Cover image upload
    const coverUpload = $('#cover-upload-area');
    const coverInput = $('#project-cover');
    const coverPreview = $('#cover-preview');

    coverUpload.addEventListener('click', () => coverInput.click());
    coverInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const dataUrl = await compressImage(file);
            coverPreview.src = dataUrl;
            coverPreview.classList.remove('hidden');
            coverUpload.querySelector('.upload-placeholder').style.display = 'none';
        }
    });

    // Gallery images
    const galleryInput = $('#project-gallery');
    galleryInput.addEventListener('change', async (e) => {
        for (const file of e.target.files) {
            const dataUrl = await compressImage(file);
            projectGalleryImages.push(dataUrl);
        }
        renderGalleryPreview();
    });

    saveBtn.addEventListener('click', () => {
        const title = $('#project-title').value.trim();
        const shortDesc = $('#project-short-desc').value.trim();
        const longDesc = $('#project-long-desc').value.trim().split('\n').filter(l => l.trim());
        const github = $('#project-github').value.trim();
        const live = $('#project-live').value.trim();
        const tags = $('#project-tags').value.split(',').map(t => t.trim()).filter(t => t);
        const cover = $('#cover-preview').src;

        if (!title || !shortDesc) {
            showToast('Please fill in required fields', 'error');
            return;
        }

        const projectData = {
            id: state.currentEditId || generateId(),
            title,
            shortDescription: shortDesc,
            longDescription: longDesc,
            coverImage: cover || 'src/assets/images/placeholder.jpg',
            detailImages: projectGalleryImages,
            tags,
            githubUrl: github,
            liveUrl: live
        };

        if (state.currentEditId) {
            const index = state.projects.findIndex(p => p.id === state.currentEditId);
            if (index !== -1) {
                state.projects[index] = projectData;
            }
        } else {
            state.projects.push(projectData);
        }

        renderProjects();
        modal.classList.add('hidden');
        showToast('Project saved!');
    });
}

function clearProjectForm() {
    $('#project-title').value = '';
    $('#project-short-desc').value = '';
    $('#project-long-desc').value = '';
    $('#project-github').value = '';
    $('#project-live').value = '';
    $('#project-tags').value = '';
    $('#cover-preview').src = '';
    $('#cover-preview').classList.add('hidden');
    $('#cover-upload-area .upload-placeholder').style.display = 'flex';
    $('#gallery-preview').innerHTML = '';
    projectGalleryImages = [];
}

function renderGalleryPreview() {
    const container = $('#gallery-preview');
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
    grid.innerHTML = state.projects.map(project => `
        <div class="project-admin-card" data-id="${project.id}">
            <img class="cover" src="${normalizePath(project.coverImage)}" alt="${project.title}" onerror="this.onerror=null;this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22160%22 viewBox=%220 0 300 160%22><rect fill=%22%231a1f2e%22 width=%22300%22 height=%22160%22/><text x=%22150%22 y=%2285%22 font-size=%2214%22 text-anchor=%22middle%22 fill=%22%236b7280%22>No Image</text></svg>'">
            <div class="content">
                <h4>${project.title}</h4>
                <p>${project.shortDescription}</p>
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

        card.querySelector('.edit').addEventListener('click', () => {
            const project = state.projects.find(p => p.id == id);
            if (project) {
                state.currentEditId = project.id;
                $('#project-modal-title').textContent = 'Edit Project';
                $('#project-title').value = project.title;
                $('#project-short-desc').value = project.shortDescription;
                $('#project-long-desc').value = (project.longDescription || []).join('\n');
                $('#project-github').value = project.githubUrl || '';
                $('#project-live').value = project.liveUrl || '';
                $('#project-tags').value = (project.tags || []).join(', ');

                if (project.coverImage) {
                    $('#cover-preview').src = project.coverImage;
                    $('#cover-preview').classList.remove('hidden');
                    $('#cover-upload-area .upload-placeholder').style.display = 'none';
                }

                projectGalleryImages = project.detailImages || [];
                renderGalleryPreview();

                $('#project-modal').classList.remove('hidden');
            }
        });

        card.querySelector('.delete').addEventListener('click', () => {
            showConfirm('Delete this project?', () => {
                state.projects = state.projects.filter(p => p.id != id);
                renderProjects();
                showToast('Project deleted');
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

    addBtn.addEventListener('click', () => {
        state.currentEditId = null;
        experienceTasks = [''];
        clearExperienceForm();
        renderTaskInputs();
        $('#experience-modal-title').textContent = 'Add New Experience';
        modal.classList.remove('hidden');
    });

    // Logo upload
    const logoUpload = $('#exp-logo-upload-area');
    const logoInput = $('#exp-logo');
    const logoPreview = $('#exp-logo-preview');

    logoUpload.addEventListener('click', () => logoInput.click());
    logoInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const dataUrl = await compressImage(file, 200);
            logoPreview.src = dataUrl;
            logoPreview.classList.remove('hidden');
            logoUpload.querySelector('.upload-placeholder').style.display = 'none';
        }
    });

    addTaskBtn.addEventListener('click', () => {
        experienceTasks.push('');
        renderTaskInputs();
    });

    saveBtn.addEventListener('click', () => {
        const company = $('#exp-company').value.trim();
        const location = $('#exp-location').value.trim();
        const role = $('#exp-role').value.trim();
        const period = $('#exp-period').value.trim();
        const logo = $('#exp-logo-preview').src;

        // Collect tasks from inputs
        const taskInputs = $$('.task-input');
        const tasks = Array.from(taskInputs).map(inp => inp.value.trim()).filter(t => t);

        if (!company || !role) {
            showToast('Please fill in company and role', 'error');
            return;
        }

        const expData = {
            id: state.currentEditId || generateId(),
            company,
            location,
            role,
            period,
            logo: logo || 'src/assets/images/logos/default.jpg',
            tasks
        };

        if (state.currentEditId) {
            const index = state.experiences.findIndex(e => e.id === state.currentEditId);
            if (index !== -1) {
                state.experiences[index] = expData;
            }
        } else {
            state.experiences.push(expData);
        }

        renderExperiences();
        modal.classList.add('hidden');
        showToast('Experience saved!');
    });
}

function clearExperienceForm() {
    $('#exp-company').value = '';
    $('#exp-location').value = '';
    $('#exp-role').value = '';
    $('#exp-period').value = '';
    $('#exp-logo-preview').src = '';
    $('#exp-logo-preview').classList.add('hidden');
    $('#exp-logo-upload-area .upload-placeholder').style.display = 'flex';
}

function renderTaskInputs() {
    const container = $('#exp-tasks-container');
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
    grid.innerHTML = state.experiences.map(exp => `
        <div class="experience-admin-card" data-id="${exp.id}">
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

        card.querySelector('.edit').addEventListener('click', () => {
            const exp = state.experiences.find(e => e.id === id);
            if (exp) {
                state.currentEditId = id;
                $('#experience-modal-title').textContent = 'Edit Experience';
                $('#exp-company').value = exp.company;
                $('#exp-location').value = exp.location || '';
                $('#exp-role').value = exp.role;
                $('#exp-period').value = exp.period || '';

                if (exp.logo) {
                    $('#exp-logo-preview').src = exp.logo;
                    $('#exp-logo-preview').classList.remove('hidden');
                    $('#exp-logo-upload-area .upload-placeholder').style.display = 'none';
                }

                experienceTasks = exp.tasks && exp.tasks.length ? [...exp.tasks] : [''];
                renderTaskInputs();

                $('#experience-modal').classList.remove('hidden');
            }
        });

        card.querySelector('.delete').addEventListener('click', () => {
            showConfirm('Delete this experience?', () => {
                state.experiences = state.experiences.filter(e => e.id !== id);
                renderExperiences();
                showToast('Experience deleted');
            });
        });
    });
}

// ===== Settings =====
function initSettings() {
    // Export
    $('#export-data-btn').addEventListener('click', () => {
        exportAllData();
        showToast('Data exported successfully!');
    });

    // Import
    const importBtn = $('#import-data-btn');
    const importInput = $('#import-file');

    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                await importData(file);
                loadAllData();
                showToast('Data imported successfully!');
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });

    // Reset
    $('#reset-data-btn').addEventListener('click', () => {
        showConfirm('This will delete ALL your data and reset to defaults. Are you sure?', () => {
            clearAllData();
            loadAllData();
            showToast('Data reset to defaults');
        });
    });
}

// ===== Modals =====
function initModals() {
    // Close modal on backdrop click or close button
    $$('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    $$('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.add('hidden');
        });
    });
}

// ===== Confirm Dialog =====
let confirmCallback = null;

function showConfirm(message, onConfirm) {
    const modal = $('#confirm-modal');
    $('#confirm-message').textContent = message;
    confirmCallback = onConfirm;
    modal.classList.remove('hidden');
}

$('#confirm-cancel')?.addEventListener('click', () => {
    $('#confirm-modal').classList.add('hidden');
    confirmCallback = null;
});

$('#confirm-ok')?.addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    $('#confirm-modal').classList.add('hidden');
    confirmCallback = null;
});

// ===== Save All Data =====
function saveAllData() {
    saveSection('general', state.general);
    saveSection('skills', state.skills);
    saveSection('projects', state.projects);
    saveSection('experiences', state.experiences);

    showToast('All changes saved!');
}
