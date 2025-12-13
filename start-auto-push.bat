@echo off
REM Start Auto Git Push Script
echo.
echo ========================================
echo   Auto Git Push - Portfolio
echo ========================================
echo.
echo Starting auto-push monitoring...
echo.

REM Run PowerShell script with execution policy bypass
powershell -ExecutionPolicy Bypass -File "%~dp0auto-push.ps1"

REM If script exits, show message
echo.
echo Auto-push script stopped.
pause
