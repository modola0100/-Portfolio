/**
 * Git Sync - Auto commit and push changes to GitHub
 * Called automatically when Admin saves changes
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');

/**
 * Auto-commit and push changes to GitHub
 * @param {string} action - 'add', 'edit', or 'delete'
 * @param {string} itemType - 'skill', 'project', 'experience', or 'general'
 * @param {string} itemName - name of the item (optional)
 * @returns {object} - result of the operation
 */
async function syncToGitHub(action, itemType, itemName = '') {
    try {
        process.chdir(projectRoot);

        // Check if there are changes
        const status = execSync('git status --porcelain', { encoding: 'utf-8' });
        
        if (!status.trim()) {
            return {
                success: true,
                message: 'No changes to commit',
                skipped: true
            };
        }

        // Add all changes
        execSync('git add -A', { encoding: 'utf-8' });

        // Create commit message
        let commitMessage = `Admin Update: ${action} ${itemType}`;
        if (itemName) {
            commitMessage += ` - ${itemName}`;
        }
        commitMessage += ` (${new Date().toISOString().split('T')[0]})`;

        // Commit changes
        execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf-8' });

        // Push to GitHub
        execSync('git push', { encoding: 'utf-8' });

        console.log(`✅ Synced to GitHub: ${commitMessage}`);

        return {
            success: true,
            message: commitMessage,
            action,
            itemType,
            itemName
        };

    } catch (error) {
        console.error('Git sync error:', error.message);
        
        // Don't fail the admin operation if git fails
        // Just log it
        return {
            success: false,
            message: 'Could not push to GitHub: ' + error.message,
            error: error.message,
            action,
            itemType,
            itemName
        };
    }
}

module.exports = { syncToGitHub };
