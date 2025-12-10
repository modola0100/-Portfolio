/**
 * Upload API
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!verifyAdmin(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { image, folder } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image is required' });
        }

        // Try Cloudinary if configured
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (cloudName && apiKey && apiSecret) {
            const { v2: cloudinary } = await import('cloudinary');
            cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

            const result = await cloudinary.uploader.upload(image, {
                folder: folder || 'portfolio'
            });

            return res.json({ url: result.secure_url, publicId: result.public_id });
        }

        // Fallback: return base64 as-is
        return res.json({ url: image, message: 'Stored as base64 (Cloudinary not configured)' });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Upload failed' });
    }
}
