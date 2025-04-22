#!/bin/bash

# Test script for Agent Creation Platform

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Agent Creation Platform Test Suite${NC}"
echo "=================================="

# Check if MongoDB is running
echo -e "\n${YELLOW}Testing MongoDB Connection${NC}"
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.runCommand({ ping: 1 })" &> /dev/null; then
        echo -e "${GREEN}✓ MongoDB is running${NC}"
    else
        echo -e "${RED}✗ MongoDB is not running. Please start MongoDB.${NC}"
        echo "  Run: sudo systemctl start mongod"
    fi
else
    echo -e "${YELLOW}! MongoDB shell not found. Skipping MongoDB connection test.${NC}"
fi

# Check if Redis is running
echo -e "\n${YELLOW}Testing Redis Connection${NC}"
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✓ Redis is running${NC}"
    else
        echo -e "${RED}✗ Redis is not running. Please start Redis.${NC}"
        echo "  Run: sudo systemctl start redis"
    fi
else
    echo -e "${YELLOW}! Redis CLI not found. Skipping Redis connection test.${NC}"
fi

# Check if .env files exist
echo -e "\n${YELLOW}Checking Environment Files${NC}"
if [ -f "./backend/.env" ]; then
    echo -e "${GREEN}✓ Backend .env file exists${NC}"
else
    echo -e "${RED}✗ Backend .env file not found${NC}"
    echo "  Creating from example..."
    cp ./backend/.env.example ./backend/.env
    echo -e "${YELLOW}! Created backend/.env from example. Please update with your actual credentials.${NC}"
fi

if [ -f "./frontend/.env.local" ]; then
    echo -e "${GREEN}✓ Frontend .env.local file exists${NC}"
else
    echo -e "${RED}✗ Frontend .env.local file not found${NC}"
    echo "  Creating from example..."
    cp ./frontend/.env.example ./frontend/.env.local
    echo -e "${YELLOW}! Created frontend/.env.local from example. Please update if needed.${NC}"
fi

# Check if node_modules exist
echo -e "\n${YELLOW}Checking Dependencies${NC}"
if [ -d "./backend/node_modules" ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Backend dependencies not installed${NC}"
    echo "  Installing dependencies..."
    (cd backend && npm install)
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
fi

if [ -d "./frontend/node_modules" ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Frontend dependencies not installed${NC}"
    echo "  Installing dependencies..."
    (cd frontend && npm install)
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
fi

# Start backend server for testing
echo -e "\n${YELLOW}Starting Backend Server${NC}"
echo "  This will run in the background for testing purposes"
(cd backend && npm run dev > backend_test.log 2>&1 & echo $! > backend.pid)
echo -e "${GREEN}✓ Backend server started${NC}"

# Wait for backend to initialize
echo "  Waiting for backend to initialize..."
sleep 5

# Test backend health endpoint
echo -e "\n${YELLOW}Testing Backend API${NC}"
if curl -s http://localhost:5000/api/health | grep -q "Server is running"; then
    echo -e "${GREEN}✓ Backend API is responding${NC}"
else
    echo -e "${RED}✗ Backend API is not responding${NC}"
    echo "  Check backend_test.log for errors"
fi

# Start frontend for testing
echo -e "\n${YELLOW}Starting Frontend Server${NC}"
echo "  This will run in the background for testing purposes"
(cd frontend && npm run dev > frontend_test.log 2>&1 & echo $! > frontend.pid)
echo -e "${GREEN}✓ Frontend server started${NC}"

# Wait for frontend to initialize
echo "  Waiting for frontend to initialize..."
sleep 5

# Test frontend
echo -e "\n${YELLOW}Testing Frontend${NC}"
if curl -s http://localhost:3000 | grep -q "<html"; then
    echo -e "${GREEN}✓ Frontend is responding${NC}"
else
    echo -e "${RED}✗ Frontend is not responding${NC}"
    echo "  Check frontend_test.log for errors"
fi

echo -e "\n${YELLOW}Test Summary${NC}"
echo "=================================="
echo "Backend log: backend_test.log"
echo "Frontend log: frontend_test.log"
echo "Backend running on: http://localhost:5000"
echo "Frontend running on: http://localhost:3000"
echo -e "${GREEN}Tests completed${NC}"
echo ""
echo "To stop test servers:"
echo "  kill \$(cat backend.pid) && rm backend.pid"
echo "  kill \$(cat frontend.pid) && rm frontend.pid"
