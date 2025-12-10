/**
 * Validation Middleware
 * Request body validation using custom validators
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * - At least 8 characters
 * - Contains uppercase and lowercase
 * - Contains a number
 */
export const isValidPassword = (password) => {
    if (!password || password.length < 8) return false;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasUppercase && hasLowercase && hasNumber;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
    if (!url) return true; // Optional URLs are valid
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Sanitize string input
 */
export const sanitizeString = (str) => {
    if (!str) return '';
    return str.toString().trim();
};

/**
 * Validate registration request
 */
export const validateRegister = (req, res, next) => {
    const errors = [];
    const { email, password, name } = req.body;

    if (!email || !isValidEmail(email)) {
        errors.push({ field: 'email', message: 'Valid email is required' });
    }

    if (!password || !isValidPassword(password)) {
        errors.push({
            field: 'password',
            message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
        });
    }

    if (!name || name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
    }

    if (name && name.trim().length > 50) {
        errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Sanitize inputs
    req.body.email = sanitizeString(email).toLowerCase();
    req.body.name = sanitizeString(name);

    next();
};

/**
 * Validate login request
 */
export const validateLogin = (req, res, next) => {
    const errors = [];
    const { email, password } = req.body;

    if (!email || !isValidEmail(email)) {
        errors.push({ field: 'email', message: 'Valid email is required' });
    }

    if (!password) {
        errors.push({ field: 'password', message: 'Password is required' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    req.body.email = sanitizeString(email).toLowerCase();

    next();
};

/**
 * Validate project request
 */
export const validateProject = (req, res, next) => {
    const errors = [];
    const { title, shortDesc, longDesc, cover, github, liveDemo } = req.body;

    if (!title || title.trim().length < 2) {
        errors.push({ field: 'title', message: 'Title must be at least 2 characters' });
    }

    if (title && title.length > 100) {
        errors.push({ field: 'title', message: 'Title cannot exceed 100 characters' });
    }

    if (!shortDesc || shortDesc.trim().length < 10) {
        errors.push({ field: 'shortDesc', message: 'Short description must be at least 10 characters' });
    }

    if (shortDesc && shortDesc.length > 200) {
        errors.push({ field: 'shortDesc', message: 'Short description cannot exceed 200 characters' });
    }

    if (!longDesc || longDesc.trim().length < 20) {
        errors.push({ field: 'longDesc', message: 'Full description must be at least 20 characters' });
    }

    if (!cover) {
        errors.push({ field: 'cover', message: 'Cover image is required' });
    }

    if (github && !isValidUrl(github)) {
        errors.push({ field: 'github', message: 'Invalid GitHub URL' });
    }

    if (liveDemo && !isValidUrl(liveDemo)) {
        errors.push({ field: 'liveDemo', message: 'Invalid live demo URL' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Sanitize
    req.body.title = sanitizeString(title);
    req.body.shortDesc = sanitizeString(shortDesc);
    req.body.longDesc = sanitizeString(longDesc);

    next();
};

/**
 * Validate skill request
 */
export const validateSkill = (req, res, next) => {
    const errors = [];
    const { name, icon } = req.body;

    if (!name || name.trim().length < 1) {
        errors.push({ field: 'name', message: 'Skill name is required' });
    }

    if (!icon) {
        errors.push({ field: 'icon', message: 'Icon is required' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    req.body.name = sanitizeString(name);

    next();
};

/**
 * Validate experience request
 */
export const validateExperience = (req, res, next) => {
    const errors = [];
    const { company, role, period } = req.body;

    if (!company || company.trim().length < 2) {
        errors.push({ field: 'company', message: 'Company name is required' });
    }

    if (!role || role.trim().length < 2) {
        errors.push({ field: 'role', message: 'Role is required' });
    }

    if (!period) {
        errors.push({ field: 'period', message: 'Time period is required' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    req.body.company = sanitizeString(company);
    req.body.role = sanitizeString(role);
    req.body.period = sanitizeString(period);

    next();
};

/**
 * Validate message request
 */
export const validateMessage = (req, res, next) => {
    const errors = [];
    const { name, email, message } = req.body;

    if (!name || name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Name is required' });
    }

    if (!email || !isValidEmail(email)) {
        errors.push({ field: 'email', message: 'Valid email is required' });
    }

    if (!message || message.trim().length < 10) {
        errors.push({ field: 'message', message: 'Message must be at least 10 characters' });
    }

    if (message && message.length > 5000) {
        errors.push({ field: 'message', message: 'Message cannot exceed 5000 characters' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    req.body.name = sanitizeString(name);
    req.body.email = sanitizeString(email).toLowerCase();
    req.body.message = sanitizeString(message);

    next();
};

export default {
    validateRegister,
    validateLogin,
    validateProject,
    validateSkill,
    validateExperience,
    validateMessage,
    isValidEmail,
    isValidPassword,
    isValidUrl,
    sanitizeString
};
