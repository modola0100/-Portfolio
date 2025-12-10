/**
 * Messages API - All Message Endpoints
 */

import connectDB from '../../server/lib/db.js';
import Message from '../../server/models/Message.js';
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
                    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
                    const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
                    if (!message) return res.status(404).json({ error: 'Message not found' });
                    return res.json(message);

                case 'PUT':
                    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
                    const updated = await Message.findByIdAndUpdate(id, req.body, { new: true });
                    if (!updated) return res.status(404).json({ error: 'Message not found' });
                    return res.json(updated);

                case 'DELETE':
                    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
                    const deleted = await Message.findByIdAndDelete(id);
                    if (!deleted) return res.status(404).json({ error: 'Message not found' });
                    return res.json({ message: 'Message deleted' });

                default:
                    return res.status(405).json({ error: 'Method not allowed' });
            }
        } else {
            switch (req.method) {
                case 'GET':
                    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
                    const messages = await Message.find().sort({ createdAt: -1 });
                    return res.json(messages);

                case 'POST':
                    // Public endpoint for contact form
                    const { name, email, subject, message } = req.body;
                    if (!name || !email || !message) {
                        return res.status(400).json({ error: 'Name, email, and message are required' });
                    }
                    const newMessage = new Message({
                        name, email, subject, message,
                        ipAddress: req.headers['x-forwarded-for'] || 'unknown'
                    });
                    await newMessage.save();
                    return res.status(201).json({ message: 'Message sent successfully' });

                default:
                    return res.status(405).json({ error: 'Method not allowed' });
            }
        }
    } catch (error) {
        console.error('Messages API error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
