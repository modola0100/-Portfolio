/**
 * Messages API
 * GET /api/messages - List all messages (admin)
 * POST /api/messages - Create message (public - contact form)
 */

import connectDB from '../../server/lib/db.js';
import Message from '../../server/models/Message.js';
import { authenticateToken, isAdmin, rateLimit } from '../../server/middleware/auth.js';
import { validateMessage } from '../../server/middleware/validation.js';

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

    // Handle GET - List all messages (admin only)
    if (req.method === 'GET') {
        try {
            // Authenticate
            await runMiddleware(req, res, authenticateToken);
            await runMiddleware(req, res, isAdmin);

            const { unread } = req.query;

            let query = Message.find();

            if (unread === 'true') {
                query = query.where('read').equals(false);
            }

            const messages = await query
                .sort({ createdAt: -1 })
                .select('-__v')
                .exec();

            return res.json(messages);
        } catch (error) {
            console.error('Get messages error:', error);
            return res.status(500).json({ error: 'Failed to fetch messages' });
        }
    }

    // Handle POST - Create message (public - contact form)
    if (req.method === 'POST') {
        try {
            // Rate limit - 5 messages per hour per IP
            await runMiddleware(req, res, rateLimit(5, 3600000));

            // Validate
            await runMiddleware(req, res, validateMessage);

            const { name, email, subject, message } = req.body;

            // Get IP for spam protection
            const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';

            const newMessage = new Message({
                name,
                email,
                subject: subject || '',
                message,
                ip,
                read: false,
                replied: false
            });

            await newMessage.save();

            return res.status(201).json({
                message: 'Message sent successfully. We will get back to you soon!'
            });
        } catch (error) {
            console.error('Create message error:', error);
            return res.status(500).json({ error: 'Failed to send message' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
