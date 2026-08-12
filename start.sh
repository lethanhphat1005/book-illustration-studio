#!/bin/bash
set -e

echo "1. Starting PostgreSQL..."
docker compose up -d

echo "2. Installing dependencies..."
(cd backend && npm ci)
(cd frontend && npm ci)

echo "3. Pushing Prisma schema and generating client..."
(cd backend && npx prisma db push)
(cd backend && npx prisma generate) 

echo "4. Starting application..."

npx concurrently \
  "cd backend && npm run dev" \
  "cd frontend && npm run dev"