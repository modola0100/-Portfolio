/**
 * Authentication API - Register
 * POST /api/auth/register
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import connectDB from '../../server/lib/db.js';
import User from '../../server/models/User.js';
import { sendVerificationEmail } from '../../server/lib/email.js';
import { rateLimit } from '../../server/middleware/auth.js';
import { validateRegister } from '../../server/middleware/validation.js';

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
        await runMiddleware(req, res, rateLimit(5, 60000)); // 5 attempts per minute

        // Validate input
        await runMiddleware(req, res, validateRegister);

        const { email, password, name } = req.body;

        // Connect to database
        await connectDB();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Check if this is the first user (will be admin)
        const userCount = await User.countDocuments();
        const isFirstUser = userCount === 0;

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        // First user (admin) is auto-verified for easier setup
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            isVerified: isFirstUser, // First user is auto-verified!
            role: isFirstUser ? 'admin' : 'viewer' // First user is admin
        });

        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Don't fail registration if email fails
        }

        res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.',
            isFirstUser
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
}
