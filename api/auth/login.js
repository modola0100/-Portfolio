/**
 * Authentication API - Login
 * POST /api/auth/login
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '../../server/lib/db.js';
import User from '../../server/models/User.js';
import { rateLimit } from '../../server/middleware/auth.js';
import { validateLogin } from '../../server/middleware/validation.js';

// Helper to run middleware
const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Apply rate limiting
        await runMiddleware(req, res, rateLimit(10, 60000)); // 10 attempts per minute

        // Validate input
        await runMiddleware(req, res, validateLogin);

        const { email, password } = req.body;

        // Connect to database
        await connectDB();

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if verified
        if (!user.isVerified) {
            return res.status(401).json({
                error: 'Please verify your email first',
                code: 'EMAIL_NOT_VERIFIED'
            });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT tokens
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Update user
        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save();

        res.json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
}
