/**
 * Authentication API - Reset Password
 * POST /api/auth/reset-password
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import connectDB from '../../server/lib/db.js';
import User from '../../server/models/User.js';
import { isValidPassword } from '../../server/middleware/validation.js';
import { rateLimit } from '../../server/middleware/auth.js';

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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Apply rate limiting
        await runMiddleware(req, res, rateLimit(5, 60000));

        const { token, newPassword } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Reset token is required' });
        }

        if (!newPassword) {
            return res.status(400).json({ error: 'New password is required' });
        }

        if (!isValidPassword(newPassword)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters with uppercase, lowercase, and number'
            });
        }

        // Connect to database
        await connectDB();

        // Hash the token to compare with stored hash
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid reset token
        const user = await User.findOne({
            passwordResetToken: resetTokenHash,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.refreshToken = undefined; // Invalidate all sessions
        await user.save();

        res.json({
            message: 'Password reset successful. You can now login with your new password.',
            redirect: '/admin/login.html'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Password reset failed' });
    }
}
