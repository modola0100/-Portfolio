/**
 * Authentication Middleware
 * JWT token verification and role-based access control
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import connectDB from '../lib/db.js';

/**
 * Authenticate JWT token from Authorization header
 */
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                error: 'Access token required',
                code: 'NO_TOKEN'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Connect to database and get user
        await connectDB();
        const user = await User.findById(decoded.userId).select('-password -refreshToken');

        if (!user) {
            return res.status(401).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                error: 'Email not verified',
                code: 'EMAIL_NOT_VERIFIED'
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                error: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
};

/**
 * Check if user has admin role
 */
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Admin access required',
            code: 'NOT_ADMIN'
        });
    }

    next();
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await connectDB();
            const user = await User.findById(decoded.userId).select('-password -refreshToken');
            if (user && user.isVerified) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Ignore errors, just continue without user
        next();
    }
};

/**
 * Rate limiting middleware
 * Simple in-memory rate limiting for serverless
 */
const requestCounts = new Map();

export const rateLimit = (maxRequests = 100, windowMs = 60000) => {
    return (req, res, next) => {
        const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
        const key = `${ip}-${req.url}`;
        const now = Date.now();

        const data = requestCounts.get(key);

        if (!data || now > data.resetTime) {
            requestCounts.set(key, { count: 1, resetTime: now + windowMs });
            return next();
        }

        data.count++;

        if (data.count > maxRequests) {
            return res.status(429).json({
                error: 'Too many requests, please try again later',
                code: 'RATE_LIMITED',
                retryAfter: Math.ceil((data.resetTime - now) / 1000)
            });
        }

        next();
    };
};

/**
 * Clean up old rate limit entries (call periodically)
 */
export const cleanupRateLimits = () => {
    const now = Date.now();
    for (const [key, data] of requestCounts.entries()) {
        if (now > data.resetTime) {
            requestCounts.delete(key);
        }
    }
};

// Clean up every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);

export default { authenticateToken, isAdmin, optionalAuth, rateLimit };
