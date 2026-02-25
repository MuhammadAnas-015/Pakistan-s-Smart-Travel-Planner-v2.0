# Pakistan Travel Planner - Start Script
Write-Host "Starting Pakistan Travel Planner..." -ForegroundColor Cyan

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; Write-Host 'Backend starting...' -ForegroundColor Yellow; ..\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 2

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; Write-Host 'Frontend starting...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "Both servers launching in separate windows!" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""

# Open browser after a short delay
Start-Sleep -Seconds 4
Start-Process "http://localhost:3000"
