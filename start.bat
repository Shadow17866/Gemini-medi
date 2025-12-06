@echo off
echo Starting Integrated Medical AI System...
echo.

echo [1/2] Starting Backend Server...
start cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python app.py"

timeout /t 5

echo [2/2] Starting Frontend Server...
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ======================================
echo System is starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo ======================================
echo.
echo Press any key to exit this window...
pause > nul
