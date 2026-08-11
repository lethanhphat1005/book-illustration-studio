#!/bin/bash
set -e

echo "Running Backend Tests..."
(cd backend && npm test)

echo "Building Frontend..."
(cd frontend && npm run build)

echo "All checks passed!"
```
