/**
 * Skills API
 * GET /api/skills - List all skills (public)
 * POST /api/skills - Create skill (admin)
 */

import connectDB from '../../server/lib/db.js';
import Skill from '../../server/models/Skill.js';
import { authenticateToken, isAdmin } from '../../server/middleware/auth.js';
import { validateSkill } from '../../server/middleware/validation.js';

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

    // Handle GET - List all skills (public)
    if (req.method === 'GET') {
        try {
            const { category } = req.query;

            let query = Skill.find();

            // Filter by category
            if (category) {
                query = query.where('category').equals(category);
            }

            const skills = await query.sort({ order: 1, name: 1 }).select('-__v').exec();

            return res.json(skills);
        } catch (error) {
            console.error('Get skills error:', error);
            return res.status(500).json({ error: 'Failed to fetch skills' });
        }
    }

    // Handle POST - Create skill (admin only)
    if (req.method === 'POST') {
        try {
            // Authenticate
            await runMiddleware(req, res, authenticateToken);
            await runMiddleware(req, res, isAdmin);

            // Validate
            await runMiddleware(req, res, validateSkill);

            const { name, icon, category, proficiency, order } = req.body;

            const skill = new Skill({
                name,
                icon,
                category: category || 'other',
                proficiency: proficiency || 80,
                order: order || 0
            });

            await skill.save();

            return res.status(201).json(skill);
        } catch (error) {
            console.error('Create skill error:', error);
            return res.status(500).json({ error: 'Failed to create skill' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
