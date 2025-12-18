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
cls
echo ════════════════════════════════════════════════════════════════
echo              Create New Branch
echo ════════════════════════════════════════════════════════════════
echo.
echo   1. Create from current branch
echo   2. Create from specific branch
echo   3. Create and switch to new branch
echo.
set /p branch_create_choice="Enter choice: "

if "%branch_create_choice%"=="1" (
    set /p new_branch="Enter new branch name: "
    if "!new_branch!"=="" (
        echo ❌ Error: No branch name provided
    ) else (
        git branch "!new_branch!"
        echo ✓ Branch created successfully
    )
) else if "%branch_create_choice%"=="2" (
    echo.
    echo Available branches:
    git branch -a
    echo.
    set /p source_branch="Enter source branch name: "
    set /p new_branch="Enter new branch name: "
    if "!source_branch!"=="" (
        echo ❌ Error: No source branch provided
    ) else if "!new_branch!"=="" (
        echo ❌ Error: No branch name provided
    ) else (
        git branch "!new_branch!" "!source_branch!"
        echo ✓ Branch created successfully from !source_branch!
    )
) else if "%branch_create_choice%"=="3" (
    set /p new_branch="Enter new branch name: "
    if "!new_branch!"=="" (
        echo ❌ Error: No branch name provided
    ) else (
        git checkout -b "!new_branch!"
        echo ✓ Branch created and switched successfully
    )
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
echo   8. Git Commands Reference (Complete Guide)
echo   9. Back to main menu
echo.

set /p adv_choice="Enter choice: "

if "%adv_choice%"=="1" goto REBASE
if "%adv_choice%"=="2" goto STASH
if "%adv_choice%"=="3" goto RESET
if "%adv_choice%"=="4" goto REVERT
if "%adv_choice%"=="5" goto TAG
if "%adv_choice%"=="6" goto REMOTE
if "%adv_choice%"=="7" goto FETCH
if "%adv_choice%"=="8" goto GIT_COMMANDS
if "%adv_choice%"=="9" goto START

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
:: GIT_COMMANDS - Complete Git Commands Reference
:: ==========================================
:GIT_COMMANDS
cls
echo ════════════════════════════════════════════════════════════════
echo          📖 Complete Git Commands Reference
echo ════════════════════════════════════════════════════════════════
echo.
echo   1. Setup & Configuration Commands
echo   2. Repository Creation Commands
echo   3. Commit & History Commands
echo   4. Branch Commands
echo   5. Merge & Rebase Commands
echo   6. Remote Commands
echo   7. Stash & Clean Commands
echo   8. Tag Commands
echo   9. Undo Changes Commands
echo  10. Status & Diff Commands
echo  11. Back to Advanced Menu
echo.

set /p cmd_choice="Enter choice: "

if "%cmd_choice%"=="1" goto CMD_SETUP
if "%cmd_choice%"=="2" goto CMD_REPO
if "%cmd_choice%"=="3" goto CMD_COMMIT
if "%cmd_choice%"=="4" goto CMD_BRANCH_CMD
if "%cmd_choice%"=="5" goto CMD_MERGE
if "%cmd_choice%"=="6" goto CMD_REMOTE_CMD
if "%cmd_choice%"=="7" goto CMD_STASH_CMD
if "%cmd_choice%"=="8" goto CMD_TAG_CMD
if "%cmd_choice%"=="9" goto CMD_UNDO
if "%cmd_choice%"=="10" goto CMD_STATUS
if "%cmd_choice%"=="11" goto ADVANCED

:CMD_SETUP
cls
echo ════════════════════════════════════════════════════════════════
echo        SETUP AND CONFIGURATION COMMANDS
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. git config --global user.name "name"
echo    - Sets your username globally
echo.
echo 2. git config --global user.email "email@example.com"
echo    - Sets your email globally
echo.
echo 3. git config --list
echo    - Shows all git configuration settings
echo.
echo 4. git config user.name "name"
echo    - Sets username for current repository only
echo.
echo 5. git config --global credential.helper wincred
echo    - Enables Windows credential storage
echo.
echo 6. git config --global core.autocrlf true
echo    - Auto-convert line endings
echo.
echo 7. git config --global alias.co checkout
echo    - Creates a git alias for faster commands
echo.
echo 8. git config --unset --global user.name
echo    - Removes a global configuration
echo.
pause
goto GIT_COMMANDS

:CMD_REPO
cls
echo ════════════════════════════════════════════════════════════════
echo      REPOSITORY CREATION AND CLONING COMMANDS
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. git init
echo    - Initializes a new local repository
echo.
echo 2. git init [project-name]
echo    - Creates new repository with specific name
echo.
echo 3. git clone [url]
echo    - Clones a remote repository to local machine
echo.
echo 4. git clone [url] [directory]
echo    - Clones repository into specific directory
echo.
echo 5. git clone --depth 1 [url]
echo    - Shallow clone (last commit only)
echo.
echo 6. git clone --branch [branch] [url]
echo    - Clones specific branch only
echo.
echo 7. git clone --single-branch [url]
echo    - Clones only one branch
echo.
pause
goto GIT_COMMANDS

:CMD_COMMIT
cls
echo ════════════════════════════════════════════════════════════════
echo        COMMIT AND HISTORY COMMANDS
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. git add [file]
echo    - Stages specific file for commit
echo.
echo 2. git add .
echo    - Stages all changes for commit
echo.
echo 3. git add -A
echo    - Stages all changes including deletions
echo.
echo 4. git commit -m "message"
echo    - Creates a commit with message
echo.
echo 5. git commit -am "message"
echo    - Stages and commits tracked files
echo.
echo 6. git commit --amend
echo    - Modifies the last commit
echo.
echo 7. git commit --amend --no-edit
echo    - Amends last commit without editing message
echo.
echo 8. git log
echo    - Shows commit history
echo.
echo 9. git log --oneline
echo    - Shows compact commit history
echo.
echo 10. git log --graph --all --oneline
echo     - Shows commit graph with branches
echo.
echo 11. git log -p [file]
echo     - Shows commits for specific file with changes
echo.
echo 12. git log --author="name"
echo     - Shows commits by specific author
echo.
echo 13. git log --since="2 weeks ago"
echo     - Shows commits from last 2 weeks
echo.
echo 14. git log -n 5
echo     - Shows last 5 commits
echo.
echo 15. git reflog
echo     - Shows all commits including deleted ones
echo.
pause
goto GIT_COMMANDS

:CMD_BRANCH_CMD
cls
echo ════════════════════════════════════════════════════════════════
echo               BRANCH COMMANDS
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. git branch
echo    - Lists all local branches
echo.
echo 2. git branch -a
echo    - Lists all local and remote branches
echo.
echo 3. git branch -r
echo    - Lists all remote branches
echo.
echo 4. git branch [branch-name]
echo    - Creates new branch
echo.
echo 5. git branch [branch-name] [commit]
echo    - Creates branch from specific commit
echo.
echo 6. git branch -d [branch-name]
echo    - Deletes a branch safely
echo.
echo 7. git branch -D [branch-name]
echo    - Force deletes a branch
echo.
echo 8. git branch -m [old-name] [new-name]
echo    - Renames a branch
echo.
echo 9. git branch -m [new-name]
echo    - Renames current branch
echo.
echo 10. git checkout [branch-name]
echo     - Switches to a branch
echo.
echo 11. git checkout -b [branch-name]
echo     - Creates and switches to new branch
echo.
echo 12. git branch -v
echo     - Shows branches with latest commit
echo.
echo 13. git branch --merged
echo     - Shows merged branches
echo.
echo 14. git branch --no-merged
echo     - Shows unmerged branches
echo.
pause
goto GIT_COMMANDS

:CMD_MERGE
cls
echo ════════════════════════════════════════════════════════════════
echo           MERGE AND REBASE COMMANDS
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. git merge [branch-name]
echo    - Merges branch into current branch
echo.
echo 2. git merge --no-ff [branch-name]
echo    - Merges with merge commit
echo.
echo 3. git merge --squash [branch-name]
echo    - Squashes commits before merging
echo.
echo 4. git merge --abort
echo    - Aborts merge process
echo.
echo 5. git rebase [branch-name]
echo    - Rebases current branch onto another
echo.
echo 6. git rebase -i [commit]
echo    - Interactive rebase (edit, squash, reorder)
echo.
echo 7. git rebase --continue
echo    - Continues rebase after conflict fix
echo.
echo 8. git rebase --abort
echo    - Cancels rebase operation
echo.
echo 9. git rebase --skip
echo    - Skips current commit in rebase
echo.
echo 10. git cherry-pick [commit]
echo     - Applies specific commit to current branch
echo.
pause
goto GIT_COMMANDS

:CMD_REMOTE_CMD
cls
echo ════════════════════════════════════════════════════════════════
echo              REMOTE REPOSITORY COMMANDS
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. git remote
echo    - Lists all remote repositories
echo.
echo 2. git remote -v
echo    - Shows remote URLs
echo.
echo 3. git remote add [name] [url]
echo    - Adds a new remote repository
echo.
echo 4. git remote remove [name]
echo    - Removes a remote repository
echo.
echo 5. git remote rename [old] [new]
echo    - Renames a remote repository
echo.
echo 6. git remote set-url [name] [new-url]
echo    - Changes remote URL
echo.
echo 7. git remote show [name]
echo    - Shows remote information
echo.
echo 8. git push [remote] [branch]
echo    - Pushes branch to remote
echo.
echo 9. git push [remote] --all
echo    - Pushes all branches
echo.
echo 10. git push [remote] --tags
echo     - Pushes all tags
echo.
echo 11. git push [remote] [branch] -f
echo     - Force pushes (dangerous!)
echo.
echo 12. git pull [remote] [branch]
echo     - Pulls and merges changes
echo.
echo 13. git pull --rebase [remote] [branch]
echo     - Pulls with rebase instead of merge
echo.
echo 14. git fetch [remote]
echo     - Downloads remote changes
echo.
echo 15. git fetch --all
echo     - Fetches from all remotes
echo.
pause
goto GIT_COMMANDS

:CMD_STASH_CMD
cls
echo ════════════════════════════════════════════════════════════════
echo           STASH AND CLEAN COMMANDS
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. git stash
echo    - Saves current changes temporarily
echo.
echo 2. git stash push -m "message"
echo    - Stashes with descriptive message
echo.
echo 3. git stash list
echo    - Shows all stashed changes
echo.
echo 4. git stash pop
echo    - Applies last stash and removes it
echo.
echo 5. git stash pop stash@{n}
echo    - Applies specific stash
echo.
echo 6. git stash apply
echo    - Applies stash without removing it
echo.
echo 7. git stash show
echo    - Shows what's in latest stash
echo.
echo 8. git stash show stash@{n} -p
echo    - Shows stash content details
echo.
echo 9. git stash drop
echo    - Deletes latest stash
echo.
echo 10. git stash drop stash@{n}
echo     - Deletes specific stash
echo.
echo 11. git stash clear
echo     - Deletes all stashes
echo.
echo 12. git clean -fd
echo     - Removes untracked files and directories
echo.
echo 13. git clean -fdX
echo     - Also removes ignored files
echo.
pause
goto GIT_COMMANDS

:CMD_TAG_CMD
cls
echo ════════════════════════════════════════════════════════════════
echo                TAG COMMANDS
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. git tag
echo    - Lists all tags
echo.
echo 2. git tag [tag-name]
echo    - Creates lightweight tag on current commit
echo.
echo 3. git tag -a [tag-name] -m "message"
echo    - Creates annotated tag with message
echo.
echo 4. git tag [tag-name] [commit]
echo    - Creates tag on specific commit
echo.
echo 5. git show [tag-name]
echo    - Shows tag information
echo.
echo 6. git tag -d [tag-name]
echo    - Deletes local tag
echo.
echo 7. git push origin [tag-name]
echo    - Pushes specific tag to remote
echo.
echo 8. git push origin --tags
echo    - Pushes all tags to remote
echo.
echo 9. git push origin :refs/tags/[tag-name]
echo    - Deletes remote tag
echo.
echo 10. git checkout [tag-name]
echo     - Checks out specific tag
echo.
pause
goto GIT_COMMANDS

:CMD_UNDO
cls
echo ════════════════════════════════════════════════════════════════
echo            UNDO AND REVERT COMMANDS
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. git restore [file]
echo    - Discards changes in working directory
echo.
echo 2. git restore --staged [file]
echo    - Unstages file
echo.
echo 3. git reset [file]
echo    - Unstages file (older syntax)
echo.
echo 4. git reset --soft HEAD~1
echo    - Undoes last commit, keeps changes staged
echo.
echo 5. git reset --mixed HEAD~1
echo    - Undoes last commit, keeps changes unstaged
echo.
echo 6. git reset --hard HEAD~1
echo    - Undoes last commit, discards changes
echo.
echo 7. git reset --hard [commit]
echo    - Resets to specific commit
echo.
echo 8. git revert [commit]
echo    - Creates new commit undoing changes
echo.
echo 9. git revert HEAD
echo    - Reverts last commit
echo.
echo 10. git clean -fd
echo     - Removes untracked files
echo.
echo 11. git checkout -- [file]
echo     - Discards changes to file
echo.
echo 12. git reflog
echo     - Shows recovery options
echo.
pause
goto GIT_COMMANDS

:CMD_STATUS
cls
echo ════════════════════════════════════════════════════════════════
echo         STATUS AND DIFF COMMANDS
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. git status
echo    - Shows repository status
echo.
echo 2. git status -s
echo    - Short status format
echo.
echo 3. git diff
echo    - Shows unstaged changes
echo.
echo 4. git diff --staged
echo    - Shows staged changes
echo.
echo 5. git diff [branch1] [branch2]
echo    - Compares two branches
echo.
echo 6. git diff [commit1] [commit2]
echo    - Compares two commits
echo.
echo 7. git diff [file]
echo    - Shows changes for specific file
echo.
echo 8. git diff HEAD~1
echo    - Shows changes in last commit
echo.
echo 9. git diff --stat
echo    - Shows summary of changes
echo.
echo 10. git show [commit]
echo     - Shows specific commit details
echo.
echo 11. git show [commit]:[file]
echo     - Shows file at specific commit
echo.
echo 12. git ls-files
echo     - Lists tracked files
echo.
echo 13. git ls-files -o
echo     - Lists untracked files
echo.
echo 14. git blame [file]
echo     - Shows who changed each line
echo.
pause
goto GIT_COMMANDS

:: ==========================================
:: EXIT
:: ==========================================
:EXIT_MENU
cls
echo.
echo Thank you for using Git Hub Batch Manager
echo.
exit /b 0
