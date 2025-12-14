#!/usr/bin/env node

/**
 * 🔄 Auto-Sync Local Server
 * 
 * Runs on: http://localhost:5000
 * 
 * Listens for data from Admin Panel
 * Automatically syncs to portfolio-config.json
 * No manual intervention needed!
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

const CONFIG_PATH = path.join(__dirname, 'src/shared/data/portfolio-config.json');
const BACKUP_PATH = path.join(__dirname, 'src/shared/data/portfolio-config.backup.json');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

/**
 * Health Check Endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: '✅ Auto-Sync Server Running',
        timestamp: new Date().toISOString()
    });
});

/**
 * Main Sync Endpoint
 * Receives data from Admin Panel and writes to JSON
 */
app.post('/api/sync', async (req, res) => {
    try {
        const { general, projects, skills, experiences } = req.body;

        // Validate
        if (!general || !projects || !skills || !experiences) {
            return res.status(400).json({ 
                error: 'Missing required fields: general, projects, skills, experiences' 
            });
        }

        // Create backup
        if (fs.existsSync(CONFIG_PATH)) {
            const currentConfig = fs.readFileSync(CONFIG_PATH, 'utf8');
            fs.writeFileSync(BACKUP_PATH, currentConfig);
            console.log('✅ Backup created');
        }

        // Write new config
        const newConfig = { general, projects, skills, experiences };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
        console.log('✅ portfolio-config.json updated');

        // Auto-commit and push
        exec(`cd "${__dirname}" && git add . && git commit -m "Auto-Sync: ${new Date().toLocaleString()}" && git push origin master`, 
            (error, stdout, stderr) => {
                if (error) {
                    console.error('Git error:', error.message);
                } else {
                    console.log('✅ Git sync completed');
                    console.log(stdout);
                }
            }
        );

        res.json({ 
            success: true,
            message: '✅ Data synced successfully!',
            stats: {
                projects: projects.length,
                skills: skills.length,
                experiences: experiences.length,
                timestamp: new Date().toISOString()
            }
        });

        console.log('📊 Sync completed:', {
            projects: projects.length,
            skills: skills.length,
            experiences: experiences.length
        });

    } catch (error) {
        console.error('❌ Sync error:', error.message);
        res.status(500).json({ 
            error: 'Sync failed: ' + error.message 
        });
    }
});

/**
 * Get Current Config
 */
app.get('/api/config', (req, res) => {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            return res.status(404).json({ error: 'Config file not found' });
        }
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Start Server
 */
app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║   🚀 Auto-Sync Local Server Running            ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log(`✅ Server running on: http://localhost:${PORT}`);
    console.log(`📡 API Endpoint: http://localhost:${PORT}/api/sync`);
    console.log(`💾 Config File: ${CONFIG_PATH}\n`);
    console.log('Waiting for Admin Panel to send data...\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n✅ Server stopped');
    process.exit(0);
});
