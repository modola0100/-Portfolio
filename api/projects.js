/**
 * Projects API - All Project Endpoints
 * Handles: list, get, create, update, delete
 */

import connectDB from '../../server/lib/db.js';
import Project from '../../server/models/Project.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function verifyAdmin(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        return decoded.role === 'admin';
    } catch {
        return false;
    }
}

export default async function handler(req, res) {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await connectDB();
        const id = req.query.id;

        if (id) {
            // Single project operations
            switch (req.method) {
                case 'GET':
                    const project = await Project.findById(id);
                    if (!project) return res.status(404).json({ error: 'Project not found' });
                    return res.json(project);

                case 'PUT':
                    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
                    const updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
                    if (!updated) return res.status(404).json({ error: 'Project not found' });
                    return res.json(updated);

                case 'DELETE':
                    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
                    const deleted = await Project.findByIdAndDelete(id);
                    if (!deleted) return res.status(404).json({ error: 'Project not found' });
                    return res.json({ message: 'Project deleted' });

                default:
                    return res.status(405).json({ error: 'Method not allowed' });
            }
        } else {
            // Collection operations
            switch (req.method) {
                case 'GET':
                    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
                    return res.json(projects);

                case 'POST':
                    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
                    const project = new Project(req.body);
                    await project.save();
                    return res.status(201).json(project);

                default:
                    return res.status(405).json({ error: 'Method not allowed' });
            }
        }
    } catch (error) {
        console.error('Projects API error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
