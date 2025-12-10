/**
 * API Service for Admin Panel
 * Handles all API communication with the backend
 */

const API_URL = window.location.origin + '/api';

// =============== Token Management ===============

function getAccessToken() {
    return localStorage.getItem('accessToken');
}

function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

function setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }
}

function clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
    return !!getAccessToken();
}

// =============== Token Refresh ===============

async function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();
        setTokens(data.accessToken, data.refreshToken);
        return data.accessToken;
    } catch (error) {
        clearTokens();
        throw error;
    }
}

// =============== API Request Helper ===============

async function apiRequest(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    // Add auth header if token exists
    const token = getAccessToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        let response = await fetch(url, config);

        // If token expired, try to refresh
        if (response.status === 401) {
            const data = await response.json();

            if (data.code === 'TOKEN_EXPIRED') {
                try {
                    const newToken = await refreshAccessToken();
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    response = await fetch(url, config);
                } catch (refreshError) {
                    // Redirect to login if refresh fails
                    window.location.href = '/admin/login.html';
                    throw new Error('Session expired. Please log in again.');
                }
            } else {
                // Redirect to login for other auth errors
                clearTokens();
                window.location.href = '/admin/login.html';
                throw new Error('Authentication failed');
            }
        }

        // Parse response
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// =============== Auth API ===============

export const authAPI = {
    async login(email, password) {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        setTokens(data.accessToken, data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    },

    async register(name, email, password) {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
    },

    async forgotPassword(email) {
        return apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },

    async resetPassword(token, newPassword) {
        return apiRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword })
        });
    },

    async getCurrentUser() {
        return apiRequest('/auth/me');
    },

    logout() {
        clearTokens();
        window.location.href = '/admin/login.html';
    },

    isLoggedIn,
    getUser,
    getAccessToken
};

// =============== Projects API ===============

export const projectsAPI = {
    async getAll(options = {}) {
        const params = new URLSearchParams();
        if (options.featured) params.append('featured', 'true');
        if (options.limit) params.append('limit', options.limit);
        if (options.sort) params.append('sort', options.sort);

        const query = params.toString() ? `?${params.toString()}` : '';
        return apiRequest(`/projects${query}`);
    },

    async getById(id) {
        return apiRequest(`/projects/${id}`);
    },

    async create(project) {
        return apiRequest('/projects', {
            method: 'POST',
            body: JSON.stringify(project)
        });
    },

    async update(id, project) {
        return apiRequest(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(project)
        });
    },

    async delete(id) {
        return apiRequest(`/projects/${id}`, {
            method: 'DELETE'
        });
    }
};

// =============== Skills API ===============

export const skillsAPI = {
    async getAll(category = null) {
        const query = category ? `?category=${category}` : '';
        return apiRequest(`/skills${query}`);
    },

    async getById(id) {
        return apiRequest(`/skills/${id}`);
    },

    async create(skill) {
        return apiRequest('/skills', {
            method: 'POST',
            body: JSON.stringify(skill)
        });
    },

    async update(id, skill) {
        return apiRequest(`/skills/${id}`, {
            method: 'PUT',
            body: JSON.stringify(skill)
        });
    },

    async delete(id) {
        return apiRequest(`/skills/${id}`, {
            method: 'DELETE'
        });
    }
};

// =============== Experiences API ===============

export const experiencesAPI = {
    async getAll() {
        return apiRequest('/experiences');
    },

    async getById(id) {
        return apiRequest(`/experiences/${id}`);
    },

    async create(experience) {
        return apiRequest('/experiences', {
            method: 'POST',
            body: JSON.stringify(experience)
        });
    },

    async update(id, experience) {
        return apiRequest(`/experiences/${id}`, {
            method: 'PUT',
            body: JSON.stringify(experience)
        });
    },

    async delete(id) {
        return apiRequest(`/experiences/${id}`, {
            method: 'DELETE'
        });
    }
};

// =============== General Settings API ===============

export const generalAPI = {
    async get() {
        return apiRequest('/general');
    },

    async update(settings) {
        return apiRequest('/general', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }
};

// =============== Messages API ===============

export const messagesAPI = {
    async getAll(unreadOnly = false) {
        const query = unreadOnly ? '?unread=true' : '';
        return apiRequest(`/messages${query}`);
    },

    async getById(id) {
        return apiRequest(`/messages/${id}`);
    },

    async markAsRead(id) {
        return apiRequest(`/messages/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ read: true })
        });
    },

    async markAsReplied(id) {
        return apiRequest(`/messages/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ replied: true })
        });
    },

    async delete(id) {
        return apiRequest(`/messages/${id}`, {
            method: 'DELETE'
        });
    }
};

// =============== Upload API ===============

export const uploadAPI = {
    async uploadImage(base64Image, folder = 'portfolio') {
        return apiRequest('/upload', {
            method: 'POST',
            body: JSON.stringify({ image: base64Image, folder })
        });
    },

    // Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
};

// =============== Contact Form API (Public) ===============

export const contactAPI = {
    async sendMessage(name, email, subject, message) {
        return apiRequest('/messages', {
            method: 'POST',
            body: JSON.stringify({ name, email, subject, message })
        });
    }
};

// =============== Data Migration Helper ===============

export const migrationAPI = {
    // Migrate existing static data to database
    async migrateData(data) {
        const results = {
            projects: [],
            skills: [],
            experiences: [],
            general: null
        };

        try {
            // Migrate projects
            if (data.projects && Array.isArray(data.projects)) {
                for (const project of data.projects) {
                    try {
                        const created = await projectsAPI.create(project);
                        results.projects.push({ success: true, id: created._id });
                    } catch (error) {
                        results.projects.push({ success: false, error: error.message });
                    }
                }
            }

            // Migrate skills
            if (data.skills && Array.isArray(data.skills)) {
                for (const skill of data.skills) {
                    try {
                        const created = await skillsAPI.create(skill);
                        results.skills.push({ success: true, id: created._id });
                    } catch (error) {
                        results.skills.push({ success: false, error: error.message });
                    }
                }
            }

            // Migrate experiences
            if (data.experiences && Array.isArray(data.experiences)) {
                for (const exp of data.experiences) {
                    try {
                        const created = await experiencesAPI.create(exp);
                        results.experiences.push({ success: true, id: created._id });
                    } catch (error) {
                        results.experiences.push({ success: false, error: error.message });
                    }
                }
            }

            // Migrate general settings
            if (data.general) {
                try {
                    results.general = await generalAPI.update(data.general);
                } catch (error) {
                    results.general = { error: error.message };
                }
            }

            return results;
        } catch (error) {
            throw new Error(`Migration failed: ${error.message}`);
        }
    }
};

// Export default API object
export default {
    auth: authAPI,
    projects: projectsAPI,
    skills: skillsAPI,
    experiences: experiencesAPI,
    general: generalAPI,
    messages: messagesAPI,
    upload: uploadAPI,
    contact: contactAPI,
    migration: migrationAPI
};
