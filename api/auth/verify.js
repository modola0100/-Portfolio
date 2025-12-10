/**
 * Authentication API - Verify Email
 * GET /api/auth/verify?token=xxx
 */

import connectDB from '../../server/lib/db.js';
import User from '../../server/models/User.js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ error: 'Verification token is required' });
        }

        // Connect to database
        await connectDB();

        // Find user by verification token
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Verify user
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({
            message: 'Email verified successfully. You can now login.',
            redirect: '/admin/login.html'
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
}
