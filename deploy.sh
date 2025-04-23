#!/bin/bash
# Deployment script for Agent Creation Platform (Backend & Frontend) in a virtual environment

set -e

# Colors for output
green='\033[0;32m'
yellow='\033[1;33m'
red='\033[0;31m'
nc='\033[0m'

# Backend deployment
printf "${yellow}Setting up backend virtual environment...${nc}\n"
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
printf "${green}✓ Backend virtual environment ready${nc}\n"

# Set environment variables for backend
if [ -f .env ]; then
  printf "${green}✓ Backend .env file found${nc}\n"
else
  printf "${red}✗ Backend .env file not found. Please create it before deploying.${nc}\n"
  exit 1
fi

# Start backend server
echo "Starting backend server..."
npm install
echo "Running backend in background..."
npm run dev > ../backend.log 2>&1 &
echo $! > ../backend.pid
cd ..

# Frontend deployment
printf "${yellow}Setting up frontend virtual environment...${nc}\n"
cd frontend
npm install

# Set environment variables for frontend
if [ -f .env.local ]; then
  printf "${green}✓ Frontend .env.local file found${nc}\n"
else
  printf "${red}✗ Frontend .env.local file not found. Please create it before deploying.${nc}\n"
  exit 1
fi

# Start frontend server
echo "Starting frontend server..."
npm run dev > ../frontend.log 2>&1 &
echo $! > ../frontend.pid
cd ..

printf "${green}✓ Both backend and frontend are running in virtual environments.${nc}\n"
echo "Backend log: backend.log"
echo "Frontend log: frontend.log"
echo "Backend PID: $(cat backend.pid)"
echo "Frontend PID: $(cat frontend.pid)"
