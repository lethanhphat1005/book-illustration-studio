#!/bin/bash
echo "Running Backend Tests..."
cd backend && npm test
echo "Running Frontend Tests..."
cd frontend && npm test