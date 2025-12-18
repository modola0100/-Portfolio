# 🎨 Mohamed Adel - Professional Portfolio

> A modern, feature-rich portfolio website with a powerful data---driven admin panel and automatic Git synchronization.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [File Directory Guide](#file-directory-guide)
- [Admin Panel Guide](#admin-panel-guide)
- [Auto-Push Setup](#auto-push-setup)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

This is a **professional, production-ready portfolio** featuring:
- **Data-driven architecture** with JSON configuration
- **Advanced Admin Panel** with real-time synchronization
- **Automatic Git workflow** - push changes without manual commands
- **Particle animation effects** - luxury visual experience
- **File upload system** - easily add project images and resume
- **Responsive design** - works perfectly on all devices
- **Dark theme** with accent colors (#01b5f8, #02569B)

### Technology Stack

```
Frontend:
├─ HTML5 / CSS3
├─ JavaScript (ES6 Modules)
├─ Tailwind CSS
├─ Particle.js (animations)
└─ LocalStorage (data persistence)

Data Management:
├─ JSON-based configuration
├─ localStorage (primary storage)
├─ File system sync (fallback)
└─ Dual-storage system for reliability

Build Tools:
├─ Git (version control)
├─ PowerShell / Batch scripts (automation)
└─ Windows Task Scheduler ready
```

---

## ✨ Key Features

### 1. **Data-Driven Portfolio** 📊
```json
- Projects management (add, edit, delete)
- Skills showcase with categories
- Experience timeline
- General info (about, contact)
- All stored in portfolio-config.json
```

### 2. **Professional Admin Panel** 🎛️
- **Sidebar Navigation**: Easy access to all sections
- **Responsive Grids**: Projects, Skills, Experiences cards
- **File Pickers**: Upload images with live preview
- **Real-time Sync**: Changes appear instantly on portfolio
- **Export/Import**: Backup and restore data
- **Toast Notifications**: Get feedback on every action
- **Particle Background**: Luxury animations

### 3. **Automatic Git Synchronization** 🔄
```
Edit file → 2 seconds detection → 3 seconds debounce → Auto-commit → Auto-push
All without touching the command line!
```

### 4. **Design System** 🎨
```
Primary Blue:    #01b5f8
Secondary Blue:  #02569B
Dark Background: #0a0f18
Accent Cyan:     #00d4ff

Animations:
├─ Fade In Up
├─ Slide In Right/Left
├─ Bounce In
├─ Glow Pulse
├─ Neon Glow
├─ Spin Slow
└─ Hover Lift Effects
```

### 5. **Particle System** 🌌
- Interactive canvas animations
- Mouse movement tracking
- Responsive to window size
- Auto-adjusts for performance

---

## 📂 Project Structure

```
Portfolio/
├── 📄 index.html                    # Main portfolio page
├── 📄 admin.html                    # Admin panel (DATA EDITOR)
├── 📄 project-details.html          # Individual project page
├── 📄 README.md                     # This file
│
├── 🤖 AUTOMATION SCRIPTS
├── start-monitor.bat                # Auto-Push launcher (RUN THIS)
├── start-auto-push.bat              # Alternative launcher
├── SETUP-AUTO-PUSH.bat              # Setup wizard
├── auto-push.ps1                    # PowerShell auto-push script
│
├── 📚 DOCUMENTATION
├── AUTO-PUSH-GUIDE.md               # How to use auto-push
├── AUTO-PUSH-SETUP.md               # Detailed setup guide
├── ADMIN_GUIDE.md                   # Admin panel tutorial
├── CONFIG_GUIDE_AR.md               # Config guide (Arabic)
├── PORTFOLIO_CONFIG_GUIDE.md        # JSON structure guide
└── [other documentation files]
│
├── 📦 src/
│   ├── 🎨 assets/
│   │   ├── css/
│   │   │   └── global.css           # Global styles
│   │   ├── images/
│   │   │   ├── icons/               # UI icons
│   │   │   ├── logos/               # Brand logos
│   │   │   └── [project images]
│   │   └── resume/                  # Resume files
│   │
│   ├── 🏗️ features/
│   │   ├── 1-hero/
│   │   │   ├── hero.js              # Hero section logic
│   │   │   ├── hero-animation.js    # Hero animations
│   │   │   └── hero.css             # Hero styling
│   │   │
│   │   ├── 2-work/
│   │   │   ├── work.js              # Projects section
│   │   │   └── work.css             # Projects styling
│   │   │
│   │   ├── 3-experience/
│   │   │   ├── experience.js        # Timeline section
│   │   │   └── experience.css       # Timeline styling
│   │   │
│   │   ├── 4-contact/
│   │   │   ├── contact.js           # Contact section
│   │   │   └── contact.css          # Contact styling
│   │   │
│   │   └── about/
│   │       └── about.css            # About section
│   │
│   └── 🔧 shared/
│       ├── app.js                   # Main application logic
│       │
│       ├── 📊 data/
│       │   ├── config-loader.js     # Load portfolio config
│       │   ├── config-validator.js  # Validate JSON data
│       │   ├── data-service.js      # Data management service
│       │   ├── portfolio-config.json # ⭐ MAIN DATA FILE
│       │   ├── projects-data.js     # Project data handler
│       │   ├── experience-data.js   # Experience data handler
│       │   ├── skills-data.js       # Skills data handler
│       │   └── general-data.js      # General info handler
│       │
│       ├── 🎭 ui/
│       │   ├── header.js            # Header component
│       │   ├── mobile-menu.js       # Mobile navigation
│       │   ├── particles.js         # Particle animations
│       │   ├── animations.js        # Shared animations
│       │   ├── preloader.js         # Loading screen
│       │   └── scroll-to-top.js     # Scroll button
│       │
│       └── 🛠️ utils/
│           └── dom.js               # DOM utilities
│
├── 📋 package.json                  # Project metadata
├── .gitignore                       # Git ignore rules
└── desktop.ini                      # Windows folder settings

```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/MohamedAdel743/-Portfolio.git
cd -Portfolio
```

### Step 2: Install Dependencies (Optional)
```bash
npm install
```

### Step 3: Start the Portfolio
Simply open `index.html` in your browser:
```bash
# Double-click index.html
# OR open with: http://localhost:8000 (if using live server)
```

### Step 4: Access Admin Panel
Open `admin.html` in a new tab:
```
http://localhost:8000/admin.html
```

### Step 5: Enable Auto-Push
Double-click `SETUP-AUTO-PUSH.bat` and choose option 1.

---

## 📖 File Directory Guide

### Core Configuration Files

#### **portfolio-config.json** ⭐ (THE MAIN DATA FILE)
This is where **ALL portfolio data** lives. Edit this to update:

```json
{
  "general": {
    "name": "Mohamed Adel",
    "title": "Full Stack Developer",
    "bio": "...",
    "email": "mahmedadel973@gmail.com",
    "phone": "+201234567890",
    "resume_link": "..."
  },
  
  "projects": [
    {
      "id": 1,
      "title": "Project Name",
      "description": "...",
      "tags": ["React", "Node.js"],
      "image": "url or path",
      "link": "github.com/...",
      "featured": true
    }
  ],
  
  "skills": [
    {
      "category": "Frontend",
      "items": ["React", "Vue", "JavaScript"]
    }
  ],
  
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "duration": "2023-2024",
      "description": "..."
    }
  ]
}
```

### Data Management Files

| File | Purpose |
|------|---------|
| **config-loader.js** | Loads portfolio-config.json + localStorage |
| **config-validator.js** | Validates JSON structure |
| **data-service.js** | Central data management |
| **projects-data.js** | Project operations |
| **skills-data.js** | Skills management |
| **experience-data.js** | Experience timeline |
| **general-data.js** | General info (name, bio, etc) |

### UI Components

| File | Purpose |
|------|---------|
| **particles.js** | Canvas animations with mouse tracking |
| **animations.js** | Shared animation utilities |
| **header.js** | Navigation and header logic |
| **mobile-menu.js** | Mobile navigation drawer |
| **preloader.js** | Loading screen display |
| **scroll-to-top.js** | Scroll-to-top button |

### Feature Modules

| Module | Files | Purpose |
|--------|-------|---------|
| **Hero Section** | hero.js, hero-animation.js | Landing section with animations |
| **Work Section** | work.js | Display projects |
| **Experience** | experience.js | Timeline view |
| **Contact** | contact.js | Contact form/info |
| **About** | Global CSS | About section styling |

---

## 🎛️ Admin Panel Guide

### How to Use

1. **Open Admin Panel**
   ```
   Double-click admin.html
   ```

2. **Navigate Using Sidebar**
   - Projects
   - Skills
   - Experiences
   - General Info

3. **Make Changes**
   - Add/Edit/Delete items
   - Upload images with file picker
   - Get instant notifications

4. **Changes Auto-Sync**
   - Portfolio updates immediately
   - Data saved to localStorage
   - Ready for auto-push to GitHub

### Admin Panel Features

#### Projects Tab
```
✓ Add new project
✓ Edit project details
✓ Upload project image
✓ Add project tags
✓ Set project link
✓ Mark as featured
✓ Delete project
```

#### Skills Tab
```
✓ Add skill categories
✓ Add skills to categories
✓ Upload skill icons
✓ Reorder skills
✓ Delete skills
```

#### Experiences Tab
```
✓ Add work experience
✓ Edit company/position
✓ Add start/end dates
✓ Add description
✓ Delete entry
```

#### General Info Tab
```
✓ Update name & title
✓ Update bio/about
✓ Update email & phone
✓ Upload profile picture
✓ Add social links
✓ Update resume
```

---

## 🔄 Auto-Push Setup

### What is Auto-Push?

Auto-Push automatically:
- ✅ Detects file changes (every 2 seconds)
- ✅ Waits for changes to finish (3-second debounce)
- ✅ Creates a Git commit (with timestamp)
- ✅ Pushes to GitHub (instantly)

**All without typing a single command!**

### How to Activate

**Option 1: Quick Start**
```bash
# Double-click this file:
SETUP-AUTO-PUSH.bat

# Then select: 1 (Start now)
```

**Option 2: Manual Setup**
```bash
# Double-click:
start-monitor.bat

# A black window will appear with live updates
```

**Option 3: Auto-Start with Windows**
```bash
# Double-click:
SETUP-AUTO-PUSH.bat

# Then select: 2 (Setup Windows Startup)
# Next time Windows boots, auto-push starts automatically
```

### Monitoring Screen

You'll see something like:
```
========================================
  Auto Git Push - Portfolio v1.0
========================================

Repository: c:\Users\DOLA\OneDrive\سطح المكتب\New folder\-Portfolio
Monitoring enabled...

[2/22/2025 10:30:15] Checking for changes...
[2/22/2025 10:30:19] Changes detected!
M  admin.html
?? new-image.jpg

[2/22/2025 10:30:22] Waiting 3 seconds before push...
[2/22/2025 10:30:25] Pushing to GitHub...
[2/22/2025 10:30:28] Success! Pushed to GitHub
```

### To Stop Auto-Push

In the black window:
```
Press Ctrl+C
Then press any key
```

### Auto-Push Configuration

Edit `start-monitor.bat` to change:

```batch
REM Current settings:
REM Check interval: 2 seconds (how often to check for changes)
REM Debounce wait: 3 seconds (how long to wait after changes stop)
REM Commit message: "Auto Update - [DATE] [TIME]"
REM Branch: master (where to push)
```

---

## ⚙️ Configuration

### Dual Storage System

The portfolio uses a **smart dual-storage** system:

```javascript
┌─────────────────────────────────────┐
│     Try Load from localStorage      │
│   (Instant, browser-specific)       │
└────────────────────┬────────────────┘
                     │
                  Success? YES → Use it
                     │
                     NO
                     ↓
┌─────────────────────────────────────┐
│   Load from portfolio-config.json    │
│   (Server/File system)              │
└────────────────────┬────────────────┘
                     │
                     ↓
              Save to localStorage
```

**Why two storage?**
- **localStorage**: Ultra-fast, instant updates in admin panel
- **JSON file**: Reliable backup, easily shareable, version controlled

### How to Manually Edit Data

#### Option 1: Admin Panel (Recommended)
```
1. Open admin.html
2. Make changes with UI
3. Auto-syncs to portfolio-config.json
```

#### Option 2: Direct JSON Editing
```
1. Open portfolio-config.json
2. Edit JSON directly
3. Save file
4. Refresh portfolio (F5)
5. Auto-push will sync to GitHub
```

#### Option 3: localStorage (Browser)
```javascript
// In browser console (F12 → Console):
localStorage.setItem('portfolioConfig', JSON.stringify(data));
```

---

## 🌐 Deployment

### Deploy to GitHub Pages

```bash
# Already configured! Just push:
git push origin master

# Then go to: https://github.com/MohamedAdel743/-Portfolio
# Settings → Pages → Select 'master' branch
# Your portfolio goes live at: https://MohamedAdel743.github.io/-Portfolio
```

### Deploy to Vercel

```bash
# 1. Go to vercel.com
# 2. Connect GitHub account
# 3. Import this repository
# 4. Click Deploy
# Your portfolio gets a .vercel.app domain
```

### Deploy to Netlify

```bash
# 1. Go to netlify.com
# 2. Drag & drop the portfolio folder
# OR connect GitHub repository
# Your portfolio gets a netlify domain
```

---

## 🐛 Troubleshooting

### Admin Panel Not Loading

**Problem**: admin.html shows blank screen

**Solutions**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check browser console for errors (F12)
3. Verify portfolio-config.json exists
4. Check localStorage is enabled in browser

### Auto-Push Not Working

**Problem**: Changes not pushing to GitHub

**Solutions**:
1. Check internet connection
2. Verify Git is installed: `git --version`
3. Verify GitHub token/SSH is configured
4. Check start-monitor.bat window for errors
5. Manually push once: `git push origin master`

### Images Not Loading

**Problem**: Project images show as broken

**Solutions**:
1. Verify image paths in portfolio-config.json
2. Check images exist in src/assets/images/
3. Use absolute URLs for external images
4. Clear browser cache

### Portfolio Not Updating

**Problem**: Changes made but portfolio not reflecting them

**Solutions**:
1. Refresh page (Ctrl+F5)
2. Clear localStorage in browser (F12 → Storage)
3. Check portfolio-config.json is valid JSON
4. Verify config-loader.js is loading correctly

### Git Authentication Failed

**Problem**: "Authentication failed" when auto-pushing

**Solutions**:
1. **For HTTPS**: Use Personal Access Token
   ```bash
   git config credential.helper manager-core
   ```
2. **For SSH**: 
   ```bash
   ssh-keygen -t ed25519
   # Add public key to GitHub
   ```
3. **Test connection**:
   ```bash
   git ls-remote origin
   ```

---

## 📞 Support & Contact

**Website**: [Your Portfolio](/)  
**Email**: mahmedadel973@gmail.com  
**GitHub**: [github.com/MohamedAdel743](https://github.com/MohamedAdel743)

---

## 📜 License & Credits

- **Particle.js** - Interactive animations
- **Tailwind CSS** - Utility-first CSS
- **GitHub** - Version control
- **Custom Design System** - Professional branding

---

## 🎯 Quick Command Reference

```bash
# Start monitoring (auto-push)
./SETUP-AUTO-PUSH.bat

# Start monitoring (alternative)
./start-monitor.bat

# Manual push (if needed)
git add .
git commit -m "Your message"
git push origin master

# Check git status
git status

# View recent commits
git log --oneline -n 10

# Undo recent changes
git checkout -- .

# View configuration
git config --list
```

---

## 🚀 What's Next?

1. **Edit portfolio data** using admin.html
2. **Enable auto-push** using SETUP-AUTO-PUSH.bat
3. **Customize design** in src/assets/css/
4. **Add more projects** in admin panel
5. **Deploy** to GitHub Pages / Vercel / Netlify

---

<div align="center">

**Made with ❤️ by Mohamed Adel**

⭐ If you find this helpful, consider starring the repository!

</div>
