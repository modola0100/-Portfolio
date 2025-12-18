@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
color 0A
cls

:: ==========================================
:: Git Hub Batch Manager
:: Comprehensive tool for managing Git projects
:: ==========================================

set "VERSION=1.0"
set "CONFIG_FILE=%~dp0git_config.txt"

:START
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo           Git Hub Batch Manager v%VERSION%
echo ════════════════════════════════════════════════════════════════
echo.
echo   Choose the operation you want to perform:
echo.
echo   1. ⚙️  Git Configuration (Email and Name)
echo   2. 📁 Clone Repository
echo   3. 📤 Push Changes
echo   4. 📥 Pull Changes
echo   5. 💾 Create Commit
echo   6. 🌿 Manage Branches
echo   7. 🔀 Merge Branches
echo   8. 📊 Repository Status
echo   9. 📝 View Log
echo  10. 🔄 Advanced Options
echo  11. ✗ Exit
echo.
echo ════════════════════════════════════════════════════════════════
set /p choice="Enter choice number: "

if "%choice%"=="1" goto CONFIG
if "%choice%"=="2" goto CLONE
if "%choice%"=="3" goto PUSH
if "%choice%"=="4" goto PULL
if "%choice%"=="5" goto COMMIT
if "%choice%"=="6" goto BRANCH
if "%choice%"=="7" goto MERGE
if "%choice%"=="8" goto STATUS
if "%choice%"=="9" goto LOG
if "%choice%"=="10" goto ADVANCED
if "%choice%"=="11" goto EXIT_MENU
goto START

:: ==========================================
:: CONFIG - Git Configuration
:: ==========================================
:CONFIG
cls
echo ════════════════════════════════════════════════════════════════
echo              ⚙️  Git Configuration
echo ════════════════════════════════════════════════════════════════
echo.

:: Display current settings
echo Current Configuration:
git config --global user.name >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo User Name: 
    git config --global user.name
) else (
    echo User Name: Not configured
)

git config --global user.email >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo Email: 
    git config --global user.email
) else (
    echo Email: Not configured
)

echo.
set /p name="Enter your name (leave empty to skip): "
if not "!name!"=="" (
    git config --global user.name "!name!"
    echo ✓ Name saved successfully
)

set /p email="Enter your email (leave empty to skip): "
if not "!email!"=="" (
    git config --global user.email "!email!"
    echo ✓ Email saved successfully
)

set /p token="Enter Personal Access Token (leave empty to skip): "
if not "!token!"=="" (
    git config --global credential.helper wincred >nul 2>&1
    echo ✓ Credential storage enabled
)

echo.
pause
goto START

:: ==========================================
:: CLONE - Clone Repository
:: ==========================================
:CLONE
cls
echo ════════════════════════════════════════════════════════════════
echo              📁 Clone Repository
echo ════════════════════════════════════════════════════════════════
echo.

set /p repo_url="Enter repository URL: "
if "!repo_url!"=="" (
    echo ❌ Error: No URL provided
    pause
    goto START
)

set /p folder_name="Enter folder name (leave empty for default): "

if "!folder_name!"=="" (
    git clone "!repo_url!"
) else (
    git clone "!repo_url!" "!folder_name!"
)

if !ERRORLEVEL! EQU 0 (
    echo ✓ Repository cloned successfully
) else (
    echo ❌ Error cloning repository
)

echo.
pause
goto START

:: ==========================================
:: PUSH - Push Changes
:: ==========================================
:PUSH
cls
echo ════════════════════════════════════════════════════════════════
echo              📤 Push Changes
echo ════════════════════════════════════════════════════════════════
echo.

set /p branch="Enter branch name (default: main): "
if "!branch!"=="" set "branch=main"

set /p commit_msg="Enter commit message: "
if "!commit_msg!"=="" (
    echo ❌ Error: No commit message provided
    pause
    goto START
)

echo.
echo Processing...
echo.

git add .
git commit -m "!commit_msg!"
git push origin !branch!

if !ERRORLEVEL! EQU 0 (
    echo ✓ Changes pushed successfully
) else (
    echo ❌ Error pushing changes
)

echo.
pause
goto START

:: ==========================================
:: PULL - Pull Changes
:: ==========================================
:PULL
cls
echo ════════════════════════════════════════════════════════════════
echo              📥 Pull Changes
echo ════════════════════════════════════════════════════════════════
echo.

set /p branch="Enter branch name (default: main): "
if "!branch!"=="" set "branch=main"

echo Pulling changes...
git pull origin !branch!

if !ERRORLEVEL! EQU 0 (
    echo ✓ Changes pulled successfully
) else (
    echo ❌ Error pulling changes
)

echo.
pause
goto START

:: ==========================================
:: COMMIT - Create Commit
:: ==========================================
:COMMIT
cls
echo ════════════════════════════════════════════════════════════════
echo              💾 Create Commit
echo ════════════════════════════════════════════════════════════════
echo.

echo Modified files:
git status --short
echo.

set /p files="Enter files to add (. for all files) [default: .]: "
if "!files!"=="" set "files=."

set /p msg="Enter commit message: "
if "!msg!"=="" (
    echo ❌ Error: No commit message provided
    pause
    goto START
)

git add !files!
git commit -m "!msg!"

if !ERRORLEVEL! EQU 0 (
    echo ✓ Commit created successfully
) else (
    echo ❌ Error creating commit
)

echo.
pause
goto START

:: ==========================================
:: BRANCH - Manage Branches
:: ==========================================
:BRANCH
cls
echo ════════════════════════════════════════════════════════════════
echo              🌿 Manage Branches
echo ════════════════════════════════════════════════════════════════
echo.
echo   1. List all branches
echo   2. Create new branch
echo   3. Switch to branch
echo   4. Delete branch
echo   5. Back to main menu
echo.

set /p branch_choice="Enter choice: "

if "%branch_choice%"=="1" goto LIST_BRANCHES
if "%branch_choice%"=="2" goto CREATE_BRANCH
if "%branch_choice%"=="3" goto SWITCH_BRANCH
if "%branch_choice%"=="4" goto DELETE_BRANCH
if "%branch_choice%"=="5" goto START

:LIST_BRANCHES
echo.
echo Local branches:
git branch
echo.
echo Remote branches:
git branch -r
echo.
pause
goto BRANCH

:CREATE_BRANCH
echo.
set /p new_branch="Enter new branch name: "
if "!new_branch!"=="" (
    echo ❌ Error: No branch name provided
) else (
    git branch "!new_branch!"
    echo ✓ Branch created successfully
)
echo.
pause
goto BRANCH

:SWITCH_BRANCH
echo.
set /p target_branch="Enter branch name to switch to: "
if "!target_branch!"=="" (
    echo ❌ Error: No branch name provided
) else (
    git checkout "!target_branch!"
    echo ✓ Switched to branch successfully
)
echo.
pause
goto BRANCH

:DELETE_BRANCH
echo.
set /p del_branch="Enter branch name to delete: "
if "!del_branch!"=="" (
    echo ❌ Error: No branch name provided
) else (
    git branch -d "!del_branch!"
    echo ✓ Branch deleted successfully
)
echo.
pause
goto BRANCH

:: ==========================================
:: MERGE - Merge Branches
:: ==========================================
:MERGE
cls
echo ════════════════════════════════════════════════════════════════
echo              🔀 Merge Branches
echo ════════════════════════════════════════════════════════════════
echo.

echo Current branch:
git branch --show-current
echo.

set /p merge_branch="Enter branch name to merge with current branch: "
if "!merge_branch!"=="" (
    echo ❌ Error: No branch name provided
    pause
    goto START
)

git merge "!merge_branch!"

if !ERRORLEVEL! EQU 0 (
    echo ✓ Branches merged successfully
) else (
    echo ❌ Error merging branches (there may be conflicts)
)

echo.
pause
goto START

:: ==========================================
:: STATUS - Repository Status
:: ==========================================
:STATUS
cls
echo ════════════════════════════════════════════════════════════════
echo              📊 Repository Status
echo ════════════════════════════════════════════════════════════════
echo.

git status

echo.
echo Additional information:
echo.
echo Current branch:
git branch --show-current
echo.
echo Latest commit:
git log -1 --oneline
echo.

pause
goto START

:: ==========================================
:: LOG - View Logs
:: ==========================================
:LOG
cls
echo ════════════════════════════════════════════════════════════════
echo              📝 Commit History
echo ════════════════════════════════════════════════════════════════
echo.

set /p log_count="Enter number of commits to display [default: 10]: "
if "!log_count!"=="" set "log_count=10"

git log -!log_count! --oneline --graph --all

echo.
pause
goto START

:: ==========================================
:: ADVANCED - Advanced Options
:: ==========================================
:ADVANCED
cls
echo ════════════════════════════════════════════════════════════════
echo              🔄 Advanced Options
echo ════════════════════════════════════════════════════════════════
echo.
echo   1. Rebase
echo   2. Stash
echo   3. Reset
echo   4. Revert
echo   5. Tag
echo   6. Remote
echo   7. Fetch
echo   8. Back to main menu
echo.

set /p adv_choice="Enter choice: "

if "%adv_choice%"=="1" goto REBASE
if "%adv_choice%"=="2" goto STASH
if "%adv_choice%"=="3" goto RESET
if "%adv_choice%"=="4" goto REVERT
if "%adv_choice%"=="5" goto TAG
if "%adv_choice%"=="6" goto REMOTE
if "%adv_choice%"=="7" goto FETCH
if "%adv_choice%"=="8" goto START

:REBASE
echo.
set /p rebase_branch="Enter branch name to rebase on: "
if not "!rebase_branch!"=="" (
    git rebase "!rebase_branch!"
    echo ✓ Operation completed
) else (
    echo ❌ No branch name provided
)
echo.
pause
goto ADVANCED

:STASH
echo.
echo   1. Save changes
echo   2. Retrieve changes
echo   3. View saved list
echo.
set /p stash_op="Enter choice: "

if "%stash_op%"=="1" (
    set /p stash_msg="Enter stash message (optional): "
    if "!stash_msg!"=="" (
        git stash
    ) else (
        git stash push -m "!stash_msg!"
    )
    echo ✓ Changes saved
) else if "%stash_op%"=="2" (
    git stash list
    set /p stash_id="Enter Stash number to retrieve: "
    if not "!stash_id!"=="" git stash pop stash@{!stash_id!}
) else if "%stash_op%"=="3" (
    git stash list
)

echo.
pause
goto ADVANCED

:RESET
echo.
set /p reset_type="Choose Reset type (soft/mixed/hard) [default: mixed]: "
if "!reset_type!"=="" set "reset_type=mixed"

set /p reset_commit="Enter commit or number (HEAD~1 for previous commit): "
if not "!reset_commit!"=="" (
    git reset --!reset_type! "!reset_commit!"
    echo ✓ Operation completed
)

echo.
pause
goto ADVANCED

:REVERT
echo.
set /p revert_commit="Enter commit to revert: "
if not "!revert_commit!"=="" (
    git revert "!revert_commit!"
    echo ✓ Commit reverted
)

echo.
pause
goto ADVANCED

:TAG
echo.
echo   1. Create Tag
echo   2. View Tags
echo   3. Delete Tag
echo.
set /p tag_op="Enter choice: "

if "%tag_op%"=="1" (
    set /p tag_name="Enter tag name: "
    set /p tag_msg="Enter tag message (optional): "
    if "!tag_msg!"=="" (
        git tag "!tag_name!"
    ) else (
        git tag -a "!tag_name!" -m "!tag_msg!"
    )
    echo ✓ Tag created
) else if "%tag_op%"=="2" (
    git tag
) else if "%tag_op%"=="3" (
    git tag
    set /p tag_del="Enter tag name to delete: "
    if not "!tag_del!"=="" git tag -d "!tag_del!"
)

echo.
pause
goto ADVANCED

:REMOTE
echo.
echo   1. View remote repositories
echo   2. Add remote repository
echo   3. Delete remote repository
echo   4. Change remote URL
echo.
set /p remote_op="Enter choice: "

if "%remote_op%"=="1" (
    git remote -v
) else if "%remote_op%"=="2" (
    set /p remote_name="Enter remote name: "
    set /p remote_url="Enter remote URL: "
    git remote add "!remote_name!" "!remote_url!"
    echo ✓ Remote repository added
) else if "%remote_op%"=="3" (
    git remote
    set /p remote_del="Enter remote name to delete: "
    git remote remove "!remote_del!"
    echo ✓ Remote repository deleted
) else if "%remote_op%"=="4" (
    git remote
    set /p remote_change="Enter remote name: "
    set /p remote_new_url="Enter new URL: "
    git remote set-url "!remote_change!" "!remote_new_url!"
    echo ✓ Remote URL updated
)

echo.
pause
goto ADVANCED

:FETCH
echo.
set /p fetch_remote="Enter remote name [default: origin]: "
if "!fetch_remote!"=="" set "fetch_remote=origin"

git fetch "!fetch_remote!"

echo ✓ Updates fetched
echo.
pause
goto ADVANCED

:: ==========================================
:: EXIT
:: ==========================================
:EXIT_MENU
cls
echo.
echo Thank you for using Git Hub Batch Manager
echo.
exit /b 0
