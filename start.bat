@echo off
setlocal EnableExtensions

title Stocky - Start Application

REM Always run from the project directory, regardless of where this file is launched.
set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

echo.
echo ========================================
echo          STOCKY - STARTING
echo ========================================
echo.

REM ----------------------------------------
REM Check Node.js and npm
REM ----------------------------------------
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js was not found.
    echo Run setup.bat after installing Node.js LTS.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm was not found.
    echo Run setup.bat after installing Node.js LTS.
    echo.
    pause
    exit /b 1
)

REM ----------------------------------------
REM Check required project files
REM ----------------------------------------
if not exist "%BACKEND%\src\server.js" (
    echo [ERROR] Backend server file not found:
    echo %BACKEND%\src\server.js
    echo.
    pause
    exit /b 1
)

if not exist "%FRONTEND%\package.json" (
    echo [ERROR] Frontend package.json was not found.
    echo.
    pause
    exit /b 1
)

REM ----------------------------------------
REM Check dependencies
REM ----------------------------------------
if not exist "%BACKEND%\node_modules" (
    echo [ERROR] Backend dependencies are not installed.
    echo Run setup.bat first.
    echo.
    pause
    exit /b 1
)

if not exist "%FRONTEND%\node_modules" (
    echo [ERROR] Frontend dependencies are not installed.
    echo Run setup.bat first.
    echo.
    pause
    exit /b 1
)

REM ----------------------------------------
REM Check .env
REM ----------------------------------------
if not exist "%BACKEND%\.env" (
    echo [ERROR] backend\.env was not found.
    echo Run setup.bat first, then configure backend\.env.
    echo.
    pause
    exit /b 1
)

echo [OK] Project checks passed.
echo.
echo Starting backend and frontend in separate windows...
echo.

REM Backend
start "Stocky Backend" cmd /k "cd /d ""%BACKEND%"" && node src/server.js"

REM Frontend
start "Stocky Frontend" cmd /k "cd /d ""%FRONTEND%"" && npm run dev"

echo [OK] Startup commands sent.
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Keep both terminal windows open while using Stocky.
echo Close those windows to stop the application.
echo.
timeout /t 3 /nobreak >nul
exit /b 0
