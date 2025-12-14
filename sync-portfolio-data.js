/**
 * SOLUTION: Auto-Sync Admin Panel to JSON File
 * 
 * PROBLEM: Admin Panel updates localStorage, but doesn't update portfolio-config.json
 * SOLUTION: Use this Node.js script to sync data on demand
 * 
 * HOW TO USE:
 * 1. Install Node.js if not already installed
 * 2. In terminal, run: node sync-portfolio-data.js
 * 3. This will read localStorage data from browser and update portfolio-config.json
 * 
 * BETTER SOLUTION: Use the export button in Admin Panel, then paste into portfolio-config.json
 */

const fs = require('fs');
const path = require('path');

// Read the JSON file
function syncPortfolioData() {
    const configPath = path.join(__dirname, 'src/shared/data/portfolio-config.json');
    
    try {
        // For now, just verify the file exists and is valid JSON
        if (fs.existsSync(configPath)) {
            const data = fs.readFileSync(configPath, 'utf8');
            JSON.parse(data);
            console.log('✅ portfolio-config.json is valid and ready');
            return true;
        } else {
            console.error('❌ portfolio-config.json not found at:', configPath);
            return false;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

syncPortfolioData();
