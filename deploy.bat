@echo off
echo Starting deployment process...

echo.
echo Step 1: Running type check...
npm run type-check
if %errorlevel% neq 0 (
    echo Type check failed! Please fix TypeScript errors before deploying.
    pause
    exit /b 1
)

echo.
echo Step 2: Running linter...
npm run lint
if %errorlevel% neq 0 (
    echo Linting failed! Please fix linting errors before deploying.
    pause
    exit /b 1
)

echo.
echo Step 3: Building for production...
npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please fix build errors before deploying.
    pause
    exit /b 1
)

echo.
echo Step 4: Build completed successfully!
echo.
echo Next steps:
echo 1. Commit and push your changes to Git
echo 2. Go to Render Dashboard
echo 3. Create new Static Site
echo 4. Connect your repository
echo 5. Deploy!
echo.
echo For detailed instructions, see DEPLOYMENT.md
echo.
pause
