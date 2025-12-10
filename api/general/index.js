/**
 * General Settings API
 * GET /api/general - Get settings (public)
 * PUT /api/general - Update settings (admin)
 */

import connectDB from '../../server/lib/db.js';
import GeneralSettings from '../../server/models/GeneralSettings.js';
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
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Connect to database
    await connectDB();

    // Handle GET - Get settings (public)
    if (req.method === 'GET') {
        try {
            const settings = await GeneralSettings.getSettings();
            return res.json(settings);
        } catch (error) {
            console.error('Get settings error:', error);
            return res.status(500).json({ error: 'Failed to fetch settings' });
        }
    }

    // Handle PUT - Update settings (admin only)
    if (req.method === 'PUT') {
        try {
            // Authenticate
            await runMiddleware(req, res, authenticateToken);
            await runMiddleware(req, res, isAdmin);

            // Get current settings or create if not exists
            let settings = await GeneralSettings.findOne();

            if (!settings) {
                settings = new GeneralSettings(req.body);
                await settings.save();
            } else {
                // Update settings
                const updateData = req.body;

                // Handle nested objects properly
                if (updateData.contact) {
                    settings.contact = { ...settings.contact?.toObject?.() || {}, ...updateData.contact };
                }
                if (updateData.stats) {
                    settings.stats = { ...settings.stats?.toObject?.() || {}, ...updateData.stats };
                }
                if (updateData.seo) {
                    settings.seo = { ...settings.seo?.toObject?.() || {}, ...updateData.seo };
                }

                // Update other fields
                const simpleFields = ['heroName', 'subtitle', 'profilePicture', 'aboutText', 'resumeUrl'];
                simpleFields.forEach(field => {
                    if (updateData[field] !== undefined) {
                        settings[field] = updateData[field];
                    }
                });

                await settings.save();
            }

            return res.json(settings);
        } catch (error) {
            console.error('Update settings error:', error);
            return res.status(500).json({ error: 'Failed to update settings' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
