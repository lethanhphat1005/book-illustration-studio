#!/bin/bash

echo "1. Starting PostgreSQL Database..."
docker-compose up -d

echo "2. Installing dependencies..."
(cd backend && npm install)
(cd frontend && npm install)

echo "3. Pushing Database Schema..."
(cd backend && npx prisma db push)

echo "4. Starting Backend & Frontend..."
# Run 2 servers at the same time
npx concurrently "cd backend && npm run dev" "cd frontend && npm run dev"