@echo off
setlocal EnableExtensions

title Stocky - First Time Setup

REM Always run from the project directory, regardless of where this file is launched.
set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

echo.
echo ========================================
echo       STOCKY - FIRST TIME SETUP
echo ========================================
echo.

REM ----------------------------------------
REM Check Node.js
REM ----------------------------------------
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js was not found.
    echo.
    echo Install Node.js LTS, then run setup.bat again.
    echo.
    pause
    exit /b 1
)

for /f "delims=" %%V in ('node --version') do set "NODE_VERSION=%%V"
echo [OK] Node.js %NODE_VERSION%

REM ----------------------------------------
REM Check npm
REM ----------------------------------------
where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm was not found.
    echo.
    echo npm is normally installed together with Node.js.
    echo Reinstall Node.js LTS, then run setup.bat again.
    echo.
    pause
    exit /b 1
)

for /f "delims=" %%V in ('npm --version') do set "NPM_VERSION=%%V"
echo [OK] npm %NPM_VERSION%

REM ----------------------------------------
REM Check project folders
REM ----------------------------------------
if not exist "%BACKEND%\package.json" (
    echo [ERROR] backend\package.json was not found.
    echo Make sure setup.bat is inside the Stocky project root.
    echo.
    pause
    exit /b 1
)

if not exist "%FRONTEND%\package.json" (
    echo [ERROR] frontend\package.json was not found.
    echo Make sure setup.bat is inside the Stocky project root.
    echo.
    pause
    exit /b 1
)

REM ----------------------------------------
REM Install backend dependencies
REM ----------------------------------------
echo.
echo [1/3] Installing backend dependencies...
echo       npm install
echo.

pushd "%BACKEND%"
call npm install
if errorlevel 1 (
    echo.
    echo [ERROR] Backend dependency installation failed.
    popd
    pause
    exit /b 1
)
popd

echo [OK] Backend dependencies installed.

REM ----------------------------------------
REM Install frontend dependencies
REM ----------------------------------------
echo.
echo [2/3] Installing frontend dependencies...
echo       npm install
echo.

pushd "%FRONTEND%"
call npm install
if errorlevel 1 (
    echo.
    echo [ERROR] Frontend dependency installation failed.
    popd
    pause
    exit /b 1
)
popd

echo [OK] Frontend dependencies installed.

REM ----------------------------------------
REM Create .env from example if needed
REM ----------------------------------------
echo.
echo [3/3] Checking backend environment configuration...

if exist "%BACKEND%\.env" (
    echo [OK] backend\.env already exists.
) else if exist "%BACKEND%\.env.example" (
    copy /Y "%BACKEND%\.env.example" "%BACKEND%\.env" >nul
    echo [OK] Created backend\.env from backend\.env.example.
    echo.
    echo IMPORTANT: Open backend\.env and replace the placeholder
    echo database password and JWT secret before starting Stocky.
) else (
    echo [WARNING] backend\.env.example was not found.
    echo Create backend\.env manually using the README instructions.
)

echo.
echo ========================================
echo       SETUP COMPLETED
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Set up InventoryDB in SQL Server using:
echo    database\setup.sql
echo.
echo 2. Check backend\.env and enter your SQL Server
echo    password and a JWT secret.
echo.
echo 3. Start Stocky with:
echo    start.bat
echo.
echo The project dependencies are already listed in
echo package.json files, so npm install installs them
echo automatically. You do NOT need to install Axios,
echo React Router, Express, or other libraries manually.
echo.
pause
exit /b 0
