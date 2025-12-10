/**
 * Skills API - All Skill Endpoints
 */

import connectDB from '../server/lib/db.js';
import Skill from '../server/models/Skill.js';
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
            switch (req.method) {
                case 'GET':
                    const skill = await Skill.findById(id);
                    if (!skill) return res.status(404).json({ error: 'Skill not found' });
                    return res.json(skill);

                case 'PUT':
                    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
                    const updated = await Skill.findByIdAndUpdate(id, req.body, { new: true });
                    if (!updated) return res.status(404).json({ error: 'Skill not found' });
                    return res.json(updated);

                case 'DELETE':
                    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
                    const deleted = await Skill.findByIdAndDelete(id);
                    if (!deleted) return res.status(404).json({ error: 'Skill not found' });
                    return res.json({ message: 'Skill deleted' });

                default:
                    return res.status(405).json({ error: 'Method not allowed' });
            }
        } else {
            switch (req.method) {
                case 'GET':
                    const skills = await Skill.find().sort({ order: 1 });
                    return res.json(skills);

                case 'POST':
                    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
                    const skill = new Skill(req.body);
                    await skill.save();
                    return res.status(201).json(skill);

                default:
                    return res.status(405).json({ error: 'Method not allowed' });
            }
        }
    } catch (error) {
        console.error('Skills API error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
