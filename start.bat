@echo off
echo Starting Pakistan Travel Planner...

:: Start Backend in new window
start "Backend - FastAPI" cmd /k "cd /d "%~dp0backend" && ..\\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

:: Wait 2 seconds
timeout /t 2 /nobreak >nul

:: Start Frontend in new window
start "Frontend - Next.js" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting...
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.

:: Wait for servers to be ready then open browser
timeout /t 5 /nobreak >nul
start http://localhost:3000
