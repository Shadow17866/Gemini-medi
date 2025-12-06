#!/bin/bash

echo "Starting Integrated Medical AI System..."
echo ""

# Start Backend
echo "[1/2] Starting Backend Server..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Start Frontend
echo "[2/2] Starting Frontend Server..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "======================================"
echo "System is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "======================================"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
