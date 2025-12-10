/**
 * Authentication API - Forgot Password
 * POST /api/auth/forgot-password
 */

import crypto from 'crypto';
import connectDB from '../../server/lib/db.js';
import User from '../../server/models/User.js';
import { sendPasswordResetEmail } from '../../server/lib/email.js';
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
        // Apply strict rate limiting
        await runMiddleware(req, res, rateLimit(3, 60000)); // 3 attempts per minute

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Connect to database
        await connectDB();

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        // Always return success to prevent email enumeration
        const successMessage = 'If an account with that email exists, a password reset link has been sent.';

        if (!user) {
            return res.json({ message: successMessage });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save hashed token to user
        user.passwordResetToken = resetTokenHash;
        user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        // Send reset email
        try {
            await sendPasswordResetEmail(email, resetToken);
        } catch (emailError) {
            console.error('Failed to send reset email:', emailError);
        }

        res.json({ message: successMessage });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Password reset request failed' });
    }
}
