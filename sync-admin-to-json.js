#!/usr/bin/env node

/**
 * 🔄 Sync Admin Panel Data to portfolio-config.json
 * 
 * Usage:
 * 1. Make changes in Admin Panel (admin.html)
 * 2. Export Data from Admin (or copy from browser console)
 * 3. Run: node sync-admin-to-json.js
 * 4. Auto-Push will detect changes and push to GitHub
 * 
 * This script reads a JSON file and updates portfolio-config.json
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, 'src/shared/data/portfolio-config.json');
const BACKUP_PATH = path.join(__dirname, 'src/shared/data/portfolio-config.backup.json');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     Portfolio Data Sync Tool - Admin to JSON          ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
        // Check if portfolio-config.json exists
        if (!fs.existsSync(CONFIG_PATH)) {
            console.error('❌ Error: portfolio-config.json not found at:', CONFIG_PATH);
            rl.close();
            process.exit(1);
        }

        console.log('📄 Current portfolio-config.json found\n');

        // Ask user for JSON file or paste data
        console.log('Choose an option:');
        console.log('1. Select a JSON file to import');
        console.log('2. Paste JSON data directly');
        console.log('3. Use default (for testing)\n');

        const choice = await askQuestion('Enter your choice (1-3): ');

        let newData = null;

        if (choice === '1') {
            // File import
            const filePath = await askQuestion('Enter the path to JSON file: ');
            if (!fs.existsSync(filePath)) {
                console.error('❌ File not found:', filePath);
                rl.close();
                process.exit(1);
            }
            newData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            console.log('✅ File loaded successfully');
        } else if (choice === '2') {
            // Paste data
            console.log('\n📋 Paste your JSON data (press Enter twice when done):\n');
            let jsonString = '';
            let emptyLines = 0;

            while (emptyLines < 2) {
                const line = await askQuestion('');
                if (line === '') {
                    emptyLines++;
                } else {
                    emptyLines = 0;
                    jsonString += line + '\n';
                }
            }

            try {
                newData = JSON.parse(jsonString);
                console.log('✅ JSON parsed successfully');
            } catch (e) {
                console.error('❌ Invalid JSON:', e.message);
                rl.close();
                process.exit(1);
            }
        } else {
            console.log('Using default test data...');
            newData = {
                general: { heroName: 'Mohamed Adel' },
                projects: [],
                skills: [],
                experiences: []
            };
        }

        // Validate structure
        if (!newData.general || !newData.projects || !newData.skills || !newData.experiences) {
            console.error('❌ Invalid data structure. Missing required fields.');
            console.error('Required: general, projects, skills, experiences');
            rl.close();
            process.exit(1);
        }

        // Create backup
        const currentConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        fs.writeFileSync(BACKUP_PATH, JSON.stringify(currentConfig, null, 2));
        console.log('✅ Backup created:', BACKUP_PATH);

        // Write new data
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(newData, null, 2));
        console.log('✅ portfolio-config.json updated successfully!\n');

        // Show summary
        console.log('📊 Update Summary:');
        console.log('  • Projects:', newData.projects.length);
        console.log('  • Skills categories:', newData.skills.length);
        console.log('  • Experiences:', newData.experiences.length);
        console.log('  • General info:', Object.keys(newData.general).length, 'fields\n');

        console.log('🚀 Next steps:');
        console.log('  1. Auto-Push will detect this change');
        console.log('  2. Git commit will be created automatically');
        console.log('  3. Changes will be pushed to GitHub');
        console.log('  4. Vercel will deploy the new version\n');

        console.log('✨ Sync completed successfully!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        rl.close();
        process.exit(1);
    }

    rl.close();
}

// Run
main();
