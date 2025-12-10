/**
 * General Settings API
 */

import connectDB from '../server/lib/db.js';
import GeneralSettings from '../server/models/GeneralSettings.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
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

        switch (req.method) {
            case 'GET':
                const settings = await GeneralSettings.getSettings();
                return res.json(settings);

            case 'PUT':
                if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
                const updated = await GeneralSettings.findOneAndUpdate({}, req.body, {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                });
                return res.json(updated);

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('General API error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
