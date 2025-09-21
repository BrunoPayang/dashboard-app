@echo off
echo ========================================
echo      QUICK VALIDATION CHECK
echo ========================================
echo.
echo This will validate your app is ready for deployment
echo.

echo Running npm run pre-push...
call npm run pre-push

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ VALIDATION SUCCESSFUL!
    echo Your app is ready for deployment
    echo ========================================
    echo.
    echo To deploy:
    echo 1. Run: deploy.bat
    echo 2. Or manually: git add . && git commit -m "message" && git push
) else (
    echo.
    echo ========================================
    echo ❌ VALIDATION FAILED!
    echo Fix the errors above before deploying
    echo ========================================
)

echo.
pause