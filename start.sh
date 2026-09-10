#!/usr/bin/env bash
set -e

echo "============================================================"
echo " Starting VitalAI — Health Monitoring & Early Warning System"
echo "============================================================"

if [ "$1" == "--docker" ]; then
    echo "[+] Starting via Docker Compose..."
    docker-compose up --build
    exit 0
fi

echo "[1/2] Starting FastAPI Backend on http://localhost:8000..."
export PYTHONPATH=$(pwd)
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "[2/2] Starting Vite React Frontend on http://localhost:3000..."
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

echo ""
echo " VitalAI is operational!"
echo " Web UI:     http://localhost:3000"
echo " REST API:   http://localhost:8000"
echo " Swagger UI: http://localhost:8000/docs"
echo "============================================================"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
