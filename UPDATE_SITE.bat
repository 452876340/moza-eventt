@echo off
setlocal
cd /d "%~dp0"

echo =======================================================
echo  Updating GitHub Repository...
echo =======================================================

:: Add all changes (including deletions)
git add .

:: Commit the changes
git commit -m "Cleanup: remove temporary scripts and unused files"

:: Push to GitHub
echo.
echo  Pushing changes to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =======================================================
    echo  SUCCESS! Site updated successfully.
    echo =======================================================
    timeout /t 5
    exit /b
)

echo.
echo  Push failed. Retrying in 3 seconds...
timeout /t 3 >nul
git push -u origin main

pause
