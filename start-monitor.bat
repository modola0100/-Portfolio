@echo off
REM Auto Git Push Script for Portfolio
setlocal enabledelayedexpansion

REM Get current directory (should be the portfolio folder)
cd /d "%~dp0"

echo.
echo ========================================
echo   Auto Git Push - Portfolio v1.0
echo ========================================
echo.
echo Repository: %CD%
echo Monitoring enabled...
echo.
echo Press Ctrl+C to stop
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Create a VBScript to monitor folder for changes
set "vbscript=%temp%\git_monitor.vbs"

(
echo ' Auto Git Push Monitor Script
echo Dim fso, folder, lastStatus, debounceTimer
echo Set fso = CreateObject("Scripting.FileSystemObject"^)
echo Set folder = fso.GetFolder("%CD%"^)
echo lastStatus = ""
echo debounceTimer = 0
echo checkInterval = 2000 ' 2 seconds
echo debounceWait = 3000   ' 3 seconds
echo.
echo Function GetGitStatus(^)
echo     Dim shell, exec
echo     Set shell = CreateObject("WScript.Shell"^)
echo     Set exec = shell.Exec("cmd /c cd /d ""%CD%"" ^&^& git status --porcelain"^)
echo     GetGitStatus = exec.StdOut.ReadAll(^)
echo End Function
echo.
echo Function PushToGithub(^)
echo     Dim shell, exec
echo     Set shell = CreateObject("WScript.Shell"^)
echo     WScript.Echo vbCrLf ^& "Pushing to GitHub..."
echo     Set exec = shell.Exec("cmd /c cd /d ""%CD%"" ^&^& git add . ^&^& git commit -m ""Auto Update"" ^&^& git push origin master"^)
echo     Dim output
echo     output = exec.StdOut.ReadAll(^)
echo     if exec.Status = 0 Then
echo         WScript.Echo "Successfully pushed!"
echo     Else
echo         WScript.Echo "Push failed!"
echo         WScript.Echo output
echo     End If
echo End Function
echo.
echo ' Main loop
echo Do
echo     Dim currentStatus
echo     currentStatus = GetGitStatus(^)
echo.
echo     if currentStatus ^<^> lastStatus Then
echo         WScript.Echo Now ^& " - Changes detected"
echo         lastStatus = currentStatus
echo         debounceTimer = GetTickCount(^)
echo     End If
echo.
echo     if debounceTimer ^> 0 Then
echo         if (GetTickCount(^) - debounceTimer^) ^> debounceWait Then
echo             PushToGithub(^)
echo             debounceTimer = 0
echo             lastStatus = ""
echo         End If
echo     End If
echo.
echo     WScript.Sleep checkInterval
echo Loop
) > "%vbscript%"

REM Alternative simpler batch-based solution
echo.
echo Starting simplified auto-push monitor...
echo.

:monitor_loop
echo [%date% %time%] Checking for changes...

REM Get git status
git status --porcelain > "%temp%\git_status.tmp" 2>nul

REM Check if there are changes
if exist "%temp%\git_status.tmp" (
    for /F %%A in ('find /c /v "" ^< "%temp%\git_status.tmp"') do set "linecount=%%A"
    
    if !linecount! GTR 0 (
        echo.
        echo [%date% %time%] Changes detected!
        type "%temp%\git_status.tmp"
        echo.
        echo [%date% %time%] Waiting 3 seconds before push...
        timeout /t 3 /nobreak
        
        echo [%date% %time%] Pushing to GitHub...
        git add .
        git commit -m "Auto Update - %date% %time%"
        git push origin master
        
        if errorlevel 1 (
            echo [%date% %time%] ERROR: Push failed!
        ) else (
            echo [%date% %time%] Success! Pushed to GitHub
        )
        echo.
    )
)

REM Wait 2 seconds before checking again
timeout /t 2 /nobreak

REM Loop back
goto monitor_loop

pause
