@echo off
echo ========================================
echo     SCHOOL DASHBOARD DEPLOYMENT
echo ========================================
echo.

echo Step 1: Running complete validation...
echo ----------------------------------------
npm run validate
if %errorlevel% neq 0 (
    echo.
    echo ❌ VALIDATION FAILED!
    echo Please fix all errors before deploying:
    echo - TypeScript errors
    echo - Linting errors  
    echo - Test failures
    echo - Build errors
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ All validations passed!
echo.
echo Step 2: Deployment Options
echo ----------------------------------------
echo Choose your deployment method:
echo [1] Auto-push to GitHub (triggers auto-deployment)
echo [2] Manual instructions only
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Step 3: Pushing to GitHub...
    echo ----------------------------------------
    git add .
    git status
    echo.
    set /p commit_msg="Enter commit message: "
    git commit -m "%commit_msg%"
    git push origin notifications
    echo.
    echo ✅ Successfully pushed to GitHub!
    echo ✅ Auto-deployment should start on Render/Vercel
    echo.
    echo Monitor deployment at:
    echo - Render: https://dashboard.render.com
    echo - Vercel: https://vercel.com/dashboard
) else (
    echo.
    echo Step 3: Manual Deployment Instructions
    echo ----------------------------------------
    echo Your app is ready for deployment!
    echo.
    echo Next steps:
    echo 1. git add .
    echo 2. git commit -m "Your commit message"
    echo 3. git push origin notifications
    echo 4. Monitor auto-deployment on your platform
    echo.
    echo For detailed instructions, see DEPLOYMENT.md
)

echo.
echo ========================================
echo     DEPLOYMENT PROCESS COMPLETE
echo ========================================
pause
