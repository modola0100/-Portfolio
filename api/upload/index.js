/**
 * Image Upload API
 * POST /api/upload - Upload image (admin)
 * 
 * Note: For Vercel, we'll use base64 encoding for images
 * and store them in Cloudinary or similar service
 */

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

// Configure Cloudinary if available
let cloudinary = null;
if (process.env.CLOUDINARY_CLOUD_NAME) {
    try {
        const { v2 } = await import('cloudinary');
        v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        cloudinary = v2;
    } catch (e) {
        console.log('Cloudinary not configured');
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
};

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Authenticate
        await runMiddleware(req, res, authenticateToken);
        await runMiddleware(req, res, isAdmin);

        const { image, folder = 'portfolio' } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        // Check if it's a base64 image
        if (!image.startsWith('data:image/')) {
            return res.status(400).json({ error: 'Invalid image format. Use base64 encoded image.' });
        }

        // If Cloudinary is configured, upload there
        if (cloudinary) {
            try {
                const result = await cloudinary.uploader.upload(image, {
                    folder,
                    transformation: [
                        { width: 1200, height: 800, crop: 'limit' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ]
                });

                return res.json({
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height
                });
            } catch (cloudinaryError) {
                console.error('Cloudinary upload error:', cloudinaryError);
                return res.status(500).json({ error: 'Image upload failed' });
            }
        }

        // If no cloud storage, return the base64 image as-is
        // (for development/testing purposes)
        console.warn('No cloud storage configured. Returning base64 image.');
        return res.json({
            url: image,
            warning: 'No cloud storage configured. Image stored as base64.'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Upload failed' });
    }
}
