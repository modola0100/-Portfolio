/**
 * Git Sync API Endpoint
 * Handles automatic git push when admin makes changes
 */

const express = require('express');
const { syncToGitHub } = require('./git-sync');

const router = express.Router();

/**
 * POST /api/git-sync
 * Auto-commit and push changes
 * 
 * Body:
 * {
 *   action: 'add' | 'edit' | 'delete',
 *   itemType: 'skill' | 'project' | 'experience' | 'general',
 *   itemName: 'optional name'
 * }
 */
router.post('/git-sync', async (req, res) => {
    try {
        const { action, itemType, itemName } = req.body;

        // Validate input
        if (!action || !itemType) {
            return res.status(400).json({
                error: 'Missing required fields: action, itemType'
            });
        }

        // Sync to GitHub
        const result = await syncToGitHub(action, itemType, itemName);

        if (result.skipped) {
            return res.status(200).json({
                success: true,
                message: 'No changes to commit',
                skipped: true
            });
        }

        res.status(200).json(result);

    } catch (error) {
        console.error('Git sync API error:', error);
        res.status(500).json({
            error: 'Failed to sync to GitHub',
            message: error.message
        });
    }
});

module.exports = router;
