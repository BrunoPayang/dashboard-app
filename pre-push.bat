@echo off
echo ========================================
echo        PRE-PUSH VALIDATION
echo ========================================
echo.
echo Running all checks before push...
echo.

echo 1/4 Type checking...
call npm run type-check
if %errorlevel% neq 0 (
    echo ❌ TypeScript errors found!
    exit /b 1
)
echo ✅ Type check passed

echo.
echo 2/4 Linting...
call npm run lint
if %errorlevel% neq 0 (
    echo ❌ Linting errors found!
    exit /b 1
)
echo ✅ Linting passed

echo.
echo 3/4 Testing...
call npm run test:ci
if %errorlevel% neq 0 (
    echo ❌ Tests failed!
    exit /b 1
)
echo ✅ Tests passed

echo.
echo 4/4 Building...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    exit /b 1
)
echo ✅ Build successful

echo.
echo ========================================
echo   ✅ ALL VALIDATIONS PASSED!
echo   Ready to push to GitHub
echo ========================================