/**
 * Vercel Serverless Function for Git Sync
 * Automatically commits and pushes changes to GitHub
 * 
 * Deploy to: /api/git-sync
 */

const { execSync } = require('child_process');
const path = require('path');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { action, itemType, itemName } = req.body;

        // Validate input
        if (!action || !itemType) {
            return res.status(400).json({
                error: 'Missing required fields: action, itemType'
            });
        }

        // Check for GitHub token
        const githubToken = process.env.GITHUB_TOKEN;
        if (!githubToken) {
            return res.status(500).json({
                error: 'GitHub token not configured',
                message: 'Set GITHUB_TOKEN in Vercel environment variables'
            });
        }

        // Configure git with token
        const repoUrl = `https://${githubToken}@github.com/MohamedAdel743/-Portfolio.git`;
        process.chdir('/tmp');

        // Clone or pull repo
        try {
            execSync(`git clone ${repoUrl} repo`, { encoding: 'utf-8' });
        } catch (e) {
            // Already exists, just pull
            process.chdir('repo');
            execSync('git pull', { encoding: 'utf-8' });
        }

        process.chdir('repo');

        // Check if there are changes
        const status = execSync('git status --porcelain', { encoding: 'utf-8' });
        
        if (!status.trim()) {
            return res.status(200).json({
                success: true,
                message: 'No changes to commit',
                skipped: true
            });
        }

        // Configure git user
        execSync('git config user.email "portfolio-bot@vercel.app"', { encoding: 'utf-8' });
        execSync('git config user.name "Portfolio Bot"', { encoding: 'utf-8' });

        // Add and commit
        execSync('git add -A', { encoding: 'utf-8' });

        const commitMessage = `Admin Update: ${action} ${itemType}${itemName ? ` - ${itemName}` : ''} (${new Date().toISOString().split('T')[0]})`;
        execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf-8' });

        // Push
        execSync('git push', { encoding: 'utf-8' });

        console.log(`✅ Git sync successful: ${commitMessage}`);

        return res.status(200).json({
            success: true,
            message: commitMessage,
            action,
            itemType,
            itemName
        });

    } catch (error) {
        console.error('Git sync error:', error.message);
        
        // Return error but don't fail the admin operation
        return res.status(200).json({
            success: false,
            message: 'Could not push to GitHub',
            error: error.message,
            note: 'Changes are still saved locally'
        });
    }
};
