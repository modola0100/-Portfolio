@echo off
REM Simple Quick Start for Auto-Push
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   AUTO-PUSH SETUP WIZARD
echo ========================================
echo.
echo Choose your option:
echo.
echo 1. START Auto-Push now
echo 2. Setup Auto-Push on Windows Startup
echo 3. Stop and exit
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto start_now
if "%choice%"=="2" goto startup_setup
if "%choice%"=="3" goto exit_script

echo Invalid choice. Please try again.
pause
cls
goto start

:start_now
echo.
echo Starting Auto-Push Monitor...
echo Sit back and relax - all changes will sync automatically!
echo.
pause
call start-monitor.bat
goto exit_script

:startup_setup
echo.
echo Creating startup shortcut...

REM Get current directory
set "current_dir=%CD%"
set "batch_file=%current_dir%\start-monitor.bat"

REM Create shortcut in startup folder
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut($env:APPDATA + '\Microsoft\Windows\Start Menu\Programs\Startup\Portfolio-AutoPush.lnk'); $Shortcut.TargetPath = '%batch_file%'; $Shortcut.Save()"

echo.
echo ✓ Shortcut created!
echo Auto-Push will start automatically when Windows boots up.
echo.
pause
goto exit_script

:exit_script
exit /b
