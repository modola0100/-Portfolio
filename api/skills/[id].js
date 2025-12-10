/**
 * Skill by ID API
 * GET /api/skills/[id] - Get single skill (public)
 * PUT /api/skills/[id] - Update skill (admin)
 * DELETE /api/skills/[id] - Delete skill (admin)
 */

import connectDB from '../../server/lib/db.js';
import Skill from '../../server/models/Skill.js';
import { authenticateToken, isAdmin } from '../../server/middleware/auth.js';

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Get ID from URL
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Skill ID is required' });
    }

    // Connect to database
    await connectDB();

    // Handle GET - Get single skill (public)
    if (req.method === 'GET') {
        try {
            const skill = await Skill.findById(id).select('-__v');

            if (!skill) {
                return res.status(404).json({ error: 'Skill not found' });
            }

            return res.json(skill);
        } catch (error) {
            console.error('Get skill error:', error);
            return res.status(500).json({ error: 'Failed to fetch skill' });
        }
    }

    // Handle PUT - Update skill (admin only)
    if (req.method === 'PUT') {
        try {
            // Authenticate
            await runMiddleware(req, res, authenticateToken);
            await runMiddleware(req, res, isAdmin);

            const skill = await Skill.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true, runValidators: true }
            );

            if (!skill) {
                return res.status(404).json({ error: 'Skill not found' });
            }

            return res.json(skill);
        } catch (error) {
            console.error('Update skill error:', error);
            return res.status(500).json({ error: 'Failed to update skill' });
        }
    }

    // Handle DELETE - Delete skill (admin only)
    if (req.method === 'DELETE') {
        try {
            // Authenticate
            await runMiddleware(req, res, authenticateToken);
            await runMiddleware(req, res, isAdmin);

            const skill = await Skill.findByIdAndDelete(id);

            if (!skill) {
                return res.status(404).json({ error: 'Skill not found' });
            }

            return res.json({ message: 'Skill deleted successfully' });
        } catch (error) {
            console.error('Delete skill error:', error);
            return res.status(500).json({ error: 'Failed to delete skill' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
