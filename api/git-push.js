/**
 * Git Auto-Push API
 * Handles automatic git commit and push operations
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const execPromise = promisify(exec);
const JWT_SECRET = process.env.JWT_SECRET;

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
        // Verify admin authorization
        if (!verifyAdmin(req)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Commit message required' });
        }

        // Configure git user
        await execPromise('git config user.email "admin@portfolio.local"');
        await execPromise('git config user.name "Admin Panel"');

        // Add all changes
        await execPromise('git add -A');

        // Check if there are changes to commit
        const { stdout: status } = await execPromise('git status --porcelain');
        
        if (!status.trim()) {
            return res.status(200).json({ 
                message: 'No changes to commit',
                committed: false 
            });
        }

        // Commit changes
        await execPromise(`git commit -m "${message.replace(/"/g, '\\"')}"`);

        // Push to remote
        await execPromise('git push origin master');

        return res.status(200).json({ 
            message: 'Changes committed and pushed successfully',
            committed: true,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Git push error:', error);
        
        // Return error but don't fail - data is already saved in MongoDB
        return res.status(200).json({ 
            message: 'Data saved but auto-push failed. Will retry on next deployment.',
            committed: false,
            error: error.message
        });
    }
}
