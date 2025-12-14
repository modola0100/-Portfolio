@echo off
REM ============================================
REM Auto-Sync Local Server Launcher
REM ============================================
echo.
echo ========================================
echo   AUTO-SYNC SERVER - Start
echo ========================================
echo.
echo 🚀 Starting local sync server...
echo.
echo This will:
echo   ✅ Listen on http://localhost:5000
echo   ✅ Auto-sync Admin changes to JSON
echo   ✅ Auto-commit and push to GitHub
echo   ✅ Vercel will auto-deploy
echo.
echo Keep this window OPEN while working!
echo.
echo Closing this window = sync stops!
echo ========================================
echo.

node auto-sync-server.js

pause
