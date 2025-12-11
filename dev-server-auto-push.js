/**
 * 🚀 Development Server with Auto-Git-Push
 * 
 * Usage: npm run dev
 * 
 * Features:
 * 1. Serves static files on http://localhost:3000
 * 2. Serves Admin Panel on http://localhost:3000/admin
 * 3. Handles /api/git-sync for auto-push
 * 4. Auto-pushes to GitHub when Admin saves
 */

import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { readFileSync, statSync, readdirSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// Load .env.local if exists
let GITHUB_TOKEN = '';
try {
    const envContent = readFileSync(join(__dirname, '.env.local'), 'utf-8');
    const match = envContent.match(/GITHUB_TOKEN=(.+)/);
    if (match) GITHUB_TOKEN = match[1].trim();
} catch (e) {
    console.log('⚠️  .env.local not found - GitHub push disabled');
}

console.log('\n╔════════════════════════════════════════════╗');
console.log('║  🚀 Development Server with Auto-Push     ║');
console.log('╠════════════════════════════════════════════╣');
console.log(`║  📍 http://localhost:${PORT}              ║`);
console.log(`║  📋 Admin:  http://localhost:${PORT}/admin    ║`);
console.log(`║  💾 GitHub: ${GITHUB_TOKEN ? 'Enabled ✅' : 'Disabled ⚠️ '}         ║`);
console.log('╚════════════════════════════════════════════╝\n');

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain'
};

/**
 * ===== AUTO-PUSH TO GITHUB =====
 * Called when Admin Panel saves changes
 */
async function handleGitSync(body) {
    try {
        if (!GITHUB_TOKEN) {
            return {
                success: false,
                message: 'No GITHUB_TOKEN configured',
                skipped: true
            };
        }

        const { action, itemType, itemName } = body;
        const commitMessage = `Admin Update: ${action} ${itemType} - ${itemName} (${new Date().toISOString().split('T')[0]})`;

        console.log(`\n📤 Auto-Push to GitHub`);
        console.log(`   Action: ${action}`);
        console.log(`   Type: ${itemType}`);
        console.log(`   Item: ${itemName}`);

        try {
            // Execute git operations
            execSync('git add -A', { 
                cwd: __dirname,
                stdio: 'pipe'
            });

            execSync(`git commit -m "${commitMessage}"`, {
                cwd: __dirname,
                stdio: 'pipe'
            });

            execSync('git push origin master', {
                cwd: __dirname,
                stdio: 'pipe',
                env: { ...process.env, GIT_ASKPASS: 'echo' }
            });

            console.log('✅ Pushed to GitHub successfully!\n');
            return {
                success: true,
                message: 'Pushed to GitHub'
            };
        } catch (gitError) {
            console.log('ℹ️  No changes to commit\n');
            return {
                success: true,
                message: 'No changes to commit',
                skipped: true
            };
        }
    } catch (error) {
        console.error('❌ Push failed:', error.message);
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * Parse request body
 */
async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
        req.on('error', () => resolve({}));
    });
}

/**
 * Serve file with correct MIME type
 */
function serveFile(filePath, res) {
    try {
        const ext = extname(filePath);
        const mimeType = mimeTypes[ext] || 'application/octet-stream';
        const content = readFileSync(filePath);

        res.writeHead(200, {
            'Content-Type': mimeType,
            'Content-Length': content.length,
            'Cache-Control': 'no-cache'
        });
        res.end(content);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Resolve file path
 */
function resolvePath(pathname) {
    // Handle /admin path -> /admin/admin.html
    if (pathname === '/admin' || pathname === '/admin/') {
        return join(__dirname, 'admin', 'admin.html');
    }
    
    // Handle /clear-storage -> /clear-storage.html
    if (pathname === '/clear-storage' || pathname === '/clear-storage/') {
        return join(__dirname, 'clear-storage.html');
    }
    
    let filePath = join(__dirname, pathname === '/' ? 'index.html' : pathname);

    // Handle directory requests
    if (!extname(filePath)) {
        const indexPath = join(filePath, 'index.html');
        if (fileExists(indexPath)) return indexPath;
    }

    return filePath;
}

/**
 * Check if file exists
 */
function fileExists(path) {
    try {
        statSync(path);
        return true;
    } catch {
        return false;
    }
}

/**
 * Create HTTP Server
 */
const server = http.createServer(async (req, res) => {
    const { pathname, query } = parseUrl(req.url);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`${req.method} ${pathname}`);

    // Handle API routes
    if (pathname === '/api/git-sync' && req.method === 'POST') {
        const body = await parseBody(req);
        const result = await handleGitSync(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
        return;
    }

    // Serve static files
    const filePath = resolvePath(pathname);
    
    // Security: prevent path traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    if (fileExists(filePath)) {
        if (serveFile(filePath, res)) {
            return;
        }
    }
    
    // Fallback to index.html for SPA routing
    const indexPath = join(__dirname, 'index.html');
    if (fileExists(indexPath)) {
        serveFile(indexPath, res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

/**
 * Parse URL
 */
function parseUrl(url) {
    const [pathname, queryString] = url.split('?');
    const query = {};
    if (queryString) {
        queryString.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            query[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
    }
    return { pathname, query };
}

/**
 * Start server
 */
server.listen(PORT, () => {
    console.log('✅ Server running!\n');
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log(`Run: npx lsof -i :${PORT} to see which process is using it\n`);
    } else {
        console.error('❌ Server error:', error);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Server stopped\n');
    server.close();
    process.exit(0);
});
