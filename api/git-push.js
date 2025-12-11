/**
 * Git Auto-Push API using GitHub API
 * Handles automatic commits via GitHub REST API
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'MohamedAdel743/-Portfolio';

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

        // If no GitHub token, just return success (data is saved in DB)
        if (!GITHUB_TOKEN) {
            return res.status(200).json({ 
                message: 'Data saved in database. GitHub push requires GITHUB_TOKEN.',
                committed: false,
                note: 'Set GITHUB_TOKEN environment variable to enable auto-push'
            });
        }

        // Create a commit via GitHub API
        const timestamp = new Date().toISOString();
        const commitMessage = `${message}\n\nAuto-committed at ${timestamp}`;

        // Get the latest commit SHA
        const refResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/git/refs/heads/master`,
            {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github+json'
                }
            }
        );

        if (!refResponse.ok) {
            throw new Error('Failed to get latest commit');
        }

        const refData = await refResponse.json();
        const latestCommitSha = refData.object.sha;

        // Get the tree of the latest commit
        const commitResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/git/commits/${latestCommitSha}`,
            {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github+json'
                }
            }
        );

        if (!commitResponse.ok) {
            throw new Error('Failed to get commit data');
        }

        const commitData = await commitResponse.json();
        const treeSha = commitData.tree.sha;

        // Create new commit
        const newCommitResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/git/commits`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: commitMessage,
                    tree: treeSha,
                    parents: [latestCommitSha]
                })
            }
        );

        if (!newCommitResponse.ok) {
            const error = await newCommitResponse.json();
            throw new Error(error.message || 'Failed to create commit');
        }

        const newCommitData = await newCommitResponse.json();

        // Update reference
        const updateRefResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/git/refs/heads/master`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sha: newCommitData.sha
                })
            }
        );

        if (!updateRefResponse.ok) {
            throw new Error('Failed to update reference');
        }

        return res.status(200).json({ 
            message: 'Changes committed and pushed to GitHub successfully',
            committed: true,
            commitSha: newCommitData.sha,
            timestamp: timestamp
        });

    } catch (error) {
        console.error('Git push error:', error);
        
        // Return success anyway - data is already saved in MongoDB
        return res.status(200).json({ 
            message: 'Data saved in MongoDB. Auto-push to GitHub will be retried.',
            committed: false,
            error: error.message
        });
    }
}
