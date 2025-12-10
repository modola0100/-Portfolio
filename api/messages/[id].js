/**
 * Message by ID API
 * GET /api/messages/[id] - Get single message (admin)
 * PUT /api/messages/[id] - Update message (mark as read/replied) (admin)
 * DELETE /api/messages/[id] - Delete message (admin)
 */

import connectDB from '../../server/lib/db.js';
import Message from '../../server/models/Message.js';
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
        return res.status(400).json({ error: 'Message ID is required' });
    }

    // Connect to database
    await connectDB();

    // All operations require admin authentication
    try {
        await runMiddleware(req, res, authenticateToken);
        await runMiddleware(req, res, isAdmin);
    } catch (error) {
        return; // Middleware already sent response
    }

    // Handle GET - Get single message
    if (req.method === 'GET') {
        try {
            const message = await Message.findById(id).select('-__v');

            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }

            // Mark as read when viewed
            if (!message.read) {
                message.read = true;
                await message.save();
            }

            return res.json(message);
        } catch (error) {
            console.error('Get message error:', error);
            return res.status(500).json({ error: 'Failed to fetch message' });
        }
    }

    // Handle PUT - Update message
    if (req.method === 'PUT') {
        try {
            const { read, replied } = req.body;

            const updateData = {};
            if (read !== undefined) updateData.read = read;
            if (replied !== undefined) updateData.replied = replied;

            const message = await Message.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true }
            );

            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }

            return res.json(message);
        } catch (error) {
            console.error('Update message error:', error);
            return res.status(500).json({ error: 'Failed to update message' });
        }
    }

    // Handle DELETE - Delete message
    if (req.method === 'DELETE') {
        try {
            const message = await Message.findByIdAndDelete(id);

            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }

            return res.json({ message: 'Message deleted successfully' });
        } catch (error) {
            console.error('Delete message error:', error);
            return res.status(500).json({ error: 'Failed to delete message' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
