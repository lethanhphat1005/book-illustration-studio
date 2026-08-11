# Architecture Overview

## Backend State Machine

To fulfill the requirement that a refresh mid-step reads the state correctly, the pipeline progress is tracked using two Enums:

- `PipelineStep`: INIT, STYLE, CHARACTERS, PORTRAITS, CHAPTERS, ILLUSTRATIONS.
- `JobStatus`: IDLE, RUNNING, COMPLETED, FAILED.

## Safe Concurrency

We implemented Optimistic Concurrency Control (OCC) using a `version` token on the `Project` model.

- Before triggering a Gemini call, the backend attempts to increment the project version.
- If successful, the job runs. If a duplicate request arrives (e.g., from a double-click), the version mismatch will reject the update, preventing multiple expensive AI calls.

## Cost Discipline

The application uploads the `.txt` book content to the Gemini API exactly once. The resulting `geminiFileUri` is stored in the database and reused for all subsequent prompts.
