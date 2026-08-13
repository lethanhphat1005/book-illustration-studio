# Book Illustration Studio

A full-stack web application that transforms a book's text into character portraits and chapter illustrations through a strict, 5-step automated pipeline using the Gemini API.

## Architecture Overview

- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL
- **AI Integration:** Google Gemini API (`gemini-3.6-flash`) for text analysis, prompting, and fallback generation handling.
- **State Management:** Database-driven state machine with Optimistic Concurrency Control (OCC) (`version` field) to ensure strict resumability, prevent race conditions, and block duplicate API calls.

## Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose (for the PostgreSQL database)
- A valid Google Gemini API Key

## Environment Variables

This project requires environment variables for both the backend and frontend. You can use the provided `.env.example` as a reference.

**1. Backend (`backend/.env`)**
Create a `.env` file in the `backend` directory:
\`\`\`env
PORT=3000
DATABASE_URL="postgresql://admin:password123@localhost:5432/gradion_db?schema=public"
GEMINI_API_KEY="your_actual_api_key_here"
\`\`\`

**2. Frontend (`frontend/.env`)**
Create a `.env` file in the `frontend` directory:
\`\`\`env
VITE_API_URL="http://localhost:3000"
\`\`\`

## Running the Application

Start the entire stack (Database, Backend, Frontend) with a single command:

\`\`\`bash
chmod +x start.sh
./start.sh
\`\`\`
_The frontend will be available at http://localhost:5173 and the backend API at http://localhost:3000._

## Running Tests

Execute the test suites to validate the pipeline state machine and logic:

\`\`\`bash
chmod +x test.sh
./test.sh
\`\`\`

## AI Collaboration & Artifacts

Development was driven actively using AI copilots (ChatGPT/Gemini). Full transcript exports, architecture decisions, and system prompts are explicitly documented in the `ai_artifacts/` directory and `DECISIONS.md` as proof of work.
