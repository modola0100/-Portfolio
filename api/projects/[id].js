/**
 * Project by ID API
 * GET /api/projects/[id] - Get single project (public)
 * PUT /api/projects/[id] - Update project (admin)
 * DELETE /api/projects/[id] - Delete project (admin)
 */

import connectDB from '../../server/lib/db.js';
import Project from '../../server/models/Project.js';
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
        return res.status(400).json({ error: 'Project ID is required' });
    }

    // Connect to database
    await connectDB();

    // Handle GET - Get single project (public)
    if (req.method === 'GET') {
        try {
            const project = await Project.findById(id).select('-__v');

            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            return res.json(project);
        } catch (error) {
            console.error('Get project error:', error);
            return res.status(500).json({ error: 'Failed to fetch project' });
        }
    }

    // Handle PUT - Update project (admin only)
    if (req.method === 'PUT') {
        try {
            // Authenticate
            await runMiddleware(req, res, authenticateToken);
            await runMiddleware(req, res, isAdmin);

            const project = await Project.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true, runValidators: true }
            );

            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            return res.json(project);
        } catch (error) {
            console.error('Update project error:', error);
            return res.status(500).json({ error: 'Failed to update project' });
        }
    }

    // Handle DELETE - Delete project (admin only)
    if (req.method === 'DELETE') {
        try {
            // Authenticate
            await runMiddleware(req, res, authenticateToken);
            await runMiddleware(req, res, isAdmin);

            const project = await Project.findByIdAndDelete(id);

            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            return res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            console.error('Delete project error:', error);
            return res.status(500).json({ error: 'Failed to delete project' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
