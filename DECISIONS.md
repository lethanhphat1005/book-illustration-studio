# Architectural Decisions

## 1. Two-Dimensional State Machine
* **Decision**: Split the project state into `currentStep` (business logic progress) and `status` (execution state).
* **Reasoning**: Fulfills the resumability constraint. It allows the UI to easily detect if a step is currently in-flight (`RUNNING`), successfully finished (`COMPLETED`), or crashed (`FAILED`), decoupling the pipeline step from the execution lifecycle.

## 2. Optimistic Concurrency Control (OCC)
* **Decision**: Added a `version` integer field to the `Project` model.
* **Reasoning**: A strict server-side defense against race conditions (e.g., double-clicks, duplicate tabs). When the backend attempts to start a Gemini job, it increments the version. If two concurrent requests attempt to start the job, the Prisma update will fail for the second request, preventing duplicate API calls.

## 3. Gemini File API Reference
* **Decision**: Added `geminiFileUri` and `geminiFileName` to the `Project` schema.
* **Reasoning**: Enforces the "Cost Discipline" constraint. The book's content is uploaded to Gemini's servers exactly once. Subsequent pipeline steps will pass this URI in their prompts instead of the raw text payload.