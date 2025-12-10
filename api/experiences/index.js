/**
 * Experiences API
 * GET /api/experiences - List all experiences (public)
 * POST /api/experiences - Create experience (admin)
 */

import connectDB from '../../server/lib/db.js';
import Experience from '../../server/models/Experience.js';
import { authenticateToken, isAdmin } from '../../server/middleware/auth.js';
import { validateExperience } from '../../server/middleware/validation.js';

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Connect to database
    await connectDB();

    // Handle GET - List all experiences (public)
    if (req.method === 'GET') {
        try {
            const experiences = await Experience.find()
                .sort({ current: -1, order: 1, createdAt: -1 })
                .select('-__v')
                .exec();

            return res.json(experiences);
        } catch (error) {
            console.error('Get experiences error:', error);
            return res.status(500).json({ error: 'Failed to fetch experiences' });
        }
    }

    // Handle POST - Create experience (admin only)
    if (req.method === 'POST') {
        try {
            // Authenticate
            await runMiddleware(req, res, authenticateToken);
            await runMiddleware(req, res, isAdmin);

            // Validate
            await runMiddleware(req, res, validateExperience);

            const { company, location, role, period, logo, tasks, current, order } = req.body;

            const experience = new Experience({
                company,
                location: location || '',
                role,
                period,
                logo: logo || '',
                tasks: tasks || [],
                current: current || false,
                order: order || 0
            });

            await experience.save();

            return res.status(201).json(experience);
        } catch (error) {
            console.error('Create experience error:', error);
            return res.status(500).json({ error: 'Failed to create experience' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
