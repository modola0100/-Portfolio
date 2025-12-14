# Auto Git Push Script - Portfolio
# This script monitors changes and automatically pushes to GitHub

$repoPath = "c:\Users\DOLA\OneDrive\سطح المكتب\New folder\-Portfolio"
$checkInterval = 2  # Check every 2 seconds

# Change to project directory
Set-Location $repoPath

# Color output function
function Print-Status {
    param([string]$message, [string]$color = "Cyan")
    Write-Host $message -ForegroundColor $color
}

# Get current git status
function Get-GitStatus {
    $status = git status --porcelain
    return $status
}

# Commit and push changes
function Push-Changes {
    param([string]$files)
    
    try {
        # Add all modified files
        git add .
        
        # Create commit message with timestamp
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $commitMessage = "Auto Update - $timestamp"
        
        # Create commit
        git commit -m $commitMessage
        
        # Push to GitHub
        git push origin master
        
        Print-Status "Pushed successfully to GitHub!" "Green"
        return $true
    }
    catch {
        Print-Status "Error pushing: $_" "Red"
        return $false
    }
}

# Start monitoring
Print-Status "`nStarting to monitor changes..." "Yellow"
Print-Status "Folder: $repoPath" "Cyan"
Print-Status "Waiting for changes..." "Cyan"
Print-Status "`n" "White"

$lastStatus = ""
$debounceTimer = $null
$debounceWait = 3  # Wait 3 seconds from last change before pushing

while ($true) {
    try {
        $currentStatus = Get-GitStatus
        
        if ($currentStatus -and $currentStatus -ne $lastStatus) {
            # Changes detected
            Print-Status "Changes detected:" "Yellow"
            Print-Status $currentStatus "Magenta"
            
            # Cancel previous timer if exists
            if ($debounceTimer) {
                $debounceTimer.Stop()
                $debounceTimer.Dispose()
            }
            
            # Create new timer
            $debounceTimer = New-Object System.Timers.Timer
            $debounceTimer.Interval = $debounceWait * 1000
            $debounceTimer.AutoReset = $false
            
            # Save current changes
            $filesChanged = $currentStatus
            
            # Add handler for when timer ends
            $timerAction = {
                Print-Status "`nWaiting for changes to finish..." "Cyan"
                Push-Changes $filesChanged
                $lastStatus = ""
            }
            
            $null = Register-ObjectEvent -InputObject $debounceTimer -EventName Elapsed -Action $timerAction -SourceIdentifier "DebounceTimer"
            $debounceTimer.Start()
            
            $lastStatus = $currentStatus
        }
        
        Start-Sleep -Seconds $checkInterval
    }
    catch {
        Print-Status "Error in monitoring: $_" "Red"
        Start-Sleep -Seconds $checkInterval
    }
}
