/**
 * Authentication API - Refresh Token
 * POST /api/auth/refresh
 */

import jwt from 'jsonwebtoken';
import connectDB from '../../server/lib/db.js';
import User from '../../server/models/User.js';

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
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Connect to database
        await connectDB();

        // Find user
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Optionally rotate refresh token
        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Token refresh failed' });
    }
}
