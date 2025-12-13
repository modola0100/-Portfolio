@echo off
REM Manual Sync: Export Admin Data to portfolio-config.json
REM
REM This script helps sync Admin Panel changes to the JSON file
REM 
REM STEPS:
REM 1. Open admin.html in your browser
REM 2. Open Developer Console (F12)
REM 3. Copy-paste the localStorage data
REM 4. Paste into portfolio-config.json
REM
REM OR use the simpler method:
REM Open admin.html → Click "Export Data" button → Replace portfolio-config.json content

echo.
echo ================================================
echo   MANUAL DATA SYNC - Admin to JSON
echo ================================================
echo.
echo AUTOMATED METHOD (if export button exists):
echo 1. Open admin.html in browser
echo 2. Find "Export Data" button in settings
echo 3. Save the downloaded JSON file
echo 4. Copy content to portfolio-config.json
echo.
echo MANUAL METHOD (for advanced users):
echo 1. Open admin.html
echo 2. Press F12 to open console
echo 3. Paste this command:
echo.
echo     copy(JSON.stringify({
echo       general: JSON.parse(localStorage.getItem('portfolio_general') || '{}'),
echo       projects: JSON.parse(localStorage.getItem('portfolio_projects') || '[]'),
echo       skills: JSON.parse(localStorage.getItem('portfolio_skills') || '[]'),
echo       experiences: JSON.parse(localStorage.getItem('portfolio_experiences') || '[]')
echo     }, null, 2))
echo.
echo 4. Open portfolio-config.json in editor
echo 5. Select all (Ctrl+A)
echo 6. Paste (Ctrl+V)
echo 7. Save (Ctrl+S)
echo 8. Git will detect changes and auto-push!
echo.
echo ================================================
echo.
pause
