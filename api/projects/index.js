/**
 * Projects API
 * GET /api/projects - List all projects (public)
 * POST /api/projects - Create project (admin)
 */

import connectDB from '../../server/lib/db.js';
import Project from '../../server/models/Project.js';
import { authenticateToken, isAdmin } from '../../server/middleware/auth.js';
import { validateProject } from '../../server/middleware/validation.js';

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

    // Handle GET - List all projects (public)
    if (req.method === 'GET') {
        try {
            const { featured, limit, sort } = req.query;

            let query = Project.find();

            // Filter by featured
            if (featured === 'true') {
                query = query.where('featured').equals(true);
            }

            // Sort
            if (sort === 'newest') {
                query = query.sort({ createdAt: -1 });
            } else if (sort === 'oldest') {
                query = query.sort({ createdAt: 1 });
            } else {
                query = query.sort({ order: 1, createdAt: -1 });
            }

            // Limit
            if (limit) {
                query = query.limit(parseInt(limit));
            }

            const projects = await query.select('-__v').exec();

            return res.json(projects);
        } catch (error) {
            console.error('Get projects error:', error);
            return res.status(500).json({ error: 'Failed to fetch projects' });
        }
    }

    // Handle POST - Create project (admin only)
    if (req.method === 'POST') {
        try {
            // Authenticate
            await runMiddleware(req, res, authenticateToken);
            await runMiddleware(req, res, isAdmin);

            // Validate
            await runMiddleware(req, res, validateProject);

            const { title, shortDesc, longDesc, github, liveDemo, tags, cover, gallery, featured, order } = req.body;

            const project = new Project({
                title,
                shortDesc,
                longDesc,
                github: github || '',
                liveDemo: liveDemo || '',
                tags: tags || [],
                cover,
                gallery: gallery || [],
                featured: featured || false,
                order: order || 0
            });

            await project.save();

            return res.status(201).json(project);
        } catch (error) {
            console.error('Create project error:', error);
            return res.status(500).json({ error: 'Failed to create project' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
