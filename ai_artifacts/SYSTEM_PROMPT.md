# Book Illustration Studio - System Prompt for Gemini / ChatGPT

## Tech Stack

- Frontend: React, Vite, TypeScript, TailwindCSS, React Hook Form, Zod.
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL.

## Core Rules & Constraints

1. **Strict Scope**: The pipeline is exactly 5 steps (Style -> Characters -> Portraits -> Chapters -> Illustrations).
2. **API Constraints**: Enforce maximum 2 characters and 1 chapter strictly on the server-side to limit Gemini API costs.
3. **State Management**: Separate `currentStep` from `status` to ensure safe reloads mid-pipeline.
4. **Concurrency**: Use Optimistic Concurrency Control (OCC) with a `version` field to block duplicate API calls on rapid clicks.
5. **Data Handling**: Use Gemini File API to upload the book `.txt` exactly once and reference `geminiFileUri` in prompts.
6. **Language**: Keep all UI text, console logs, and error messages strictly in English.
