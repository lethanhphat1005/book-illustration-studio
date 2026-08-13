#!/bin/bash
set -e

echo "========================================"
echo "🧪 STARTING FULL-STACK TEST SUITE"
echo "========================================"

echo -e "\n📦 1. Running Backend Tests (Pipeline State Machine Logic)..."
cd backend
npm run test
cd ..

echo -e "\n🎨 2. Running Frontend Tests (UI Components & Validation)..."
cd frontend
npm run test
cd ..

echo -e "\n✅ ALL FULL-STACK TESTS PASSED SUCCESSFULLY!"
echo "========================================"