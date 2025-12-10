/**
 * Authentication API - All Auth Endpoints
 * Handles: login, register, verify, forgot-password, reset-password, refresh, me
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import connectDB from '../server/lib/db.js';
import User from '../server/models/User.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../server/lib/email.js';
import { authenticateToken } from '../server/middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Helper to generate tokens
function generateTokens(user) {
    const accessToken = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { userId: user._id },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
}

// CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Get the action from query parameter
    const action = req.query.action;

    try {
        await connectDB();

        switch (action) {
            case 'login':
                return handleLogin(req, res);
            case 'register':
                return handleRegister(req, res);
            case 'verify':
                return handleVerify(req, res);
            case 'forgot-password':
                return handleForgotPassword(req, res);
            case 'reset-password':
                return handleResetPassword(req, res);
            case 'refresh':
                return handleRefresh(req, res);
            case 'me':
                return handleMe(req, res);
            default:
                return res.status(404).json({ error: 'Unknown auth action' });
        }
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}

// Login handler
async function handleLogin(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
        return res.status(401).json({ error: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    });
}

// Register handler
async function handleRegister(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
        email,
        password: hashedPassword,
        name,
        verificationToken,
        isVerified: isFirstUser, // First user auto-verified
        role: isFirstUser ? 'admin' : 'viewer'
    });

    await user.save();

    try {
        if (!isFirstUser) {
            await sendVerificationEmail(email, verificationToken);
        }
    } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
    }

    res.status(201).json({
        message: isFirstUser
            ? 'Admin account created! You can login now.'
            : 'Registration successful. Please check your email to verify.',
        isFirstUser
    });
}

// Verify handler
async function handleVerify(req, res) {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now login.' });
}

// Forgot password handler
async function handleForgotPassword(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    // Always return success to prevent email enumeration
    const successMessage = 'If an account with that email exists, a reset link has been sent.';

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: successMessage });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    try {
        await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
        console.error('Failed to send reset email:', emailError);
    }

    res.json({ message: successMessage });
}

// Reset password handler
async function handleResetPassword(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ error: 'Token and password are required' });
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshToken = undefined;
    await user.save();

    res.json({ message: 'Password reset successful! You can now login.' });
}

// Refresh token handler
async function handleRefresh(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json(tokens);
    } catch (error) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
}

// Me handler
async function handleMe(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
