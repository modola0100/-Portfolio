/**
 * Experience by ID API
 * GET /api/experiences/[id] - Get single experience (public)
 * PUT /api/experiences/[id] - Update experience (admin)
 * DELETE /api/experiences/[id] - Delete experience (admin)
 */

import connectDB from '../../server/lib/db.js';
import Experience from '../../server/models/Experience.js';
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
        return res.status(400).json({ error: 'Experience ID is required' });
    }

    // Connect to database
    await connectDB();

    // Handle GET - Get single experience (public)
    if (req.method === 'GET') {
        try {
            const experience = await Experience.findById(id).select('-__v');

            if (!experience) {
                return res.status(404).json({ error: 'Experience not found' });
            }

            return res.json(experience);
        } catch (error) {
            console.error('Get experience error:', error);
            return res.status(500).json({ error: 'Failed to fetch experience' });
        }
    }

    // Handle PUT - Update experience (admin only)
    if (req.method === 'PUT') {
        try {
            // Authenticate
            await runMiddleware(req, res, authenticateToken);
            await runMiddleware(req, res, isAdmin);

            const experience = await Experience.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true, runValidators: true }
            );

            if (!experience) {
                return res.status(404).json({ error: 'Experience not found' });
            }

            return res.json(experience);
        } catch (error) {
            console.error('Update experience error:', error);
            return res.status(500).json({ error: 'Failed to update experience' });
        }
    }

    // Handle DELETE - Delete experience (admin only)
    if (req.method === 'DELETE') {
        try {
            // Authenticate
            await runMiddleware(req, res, authenticateToken);
            await runMiddleware(req, res, isAdmin);

            const experience = await Experience.findByIdAndDelete(id);

            if (!experience) {
                return res.status(404).json({ error: 'Experience not found' });
            }

            return res.json({ message: 'Experience deleted successfully' });
        } catch (error) {
            console.error('Delete experience error:', error);
            return res.status(500).json({ error: 'Failed to delete experience' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
