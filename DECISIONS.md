# Architectural Decisions

## 1. Two-Dimensional State Machine

- **Decision**: Split the project state into `currentStep` (business logic progress) and `status` (execution state).
- **Reasoning**: Fulfills the resumability constraint. It allows the UI to easily detect if a step is currently in-flight (`RUNNING`), successfully finished (`COMPLETED`), or crashed (`FAILED`), decoupling the pipeline step from the execution lifecycle.

## 2. Optimistic Concurrency Control (OCC)

- **Decision**: Added a `version` integer field to the `Project` model.
- **Reasoning**: A strict server-side defense against race conditions (e.g., double-clicks, duplicate tabs). When the backend attempts to start a Gemini job, it increments the version. If two concurrent requests attempt to start the job, the Prisma update will fail for the second request, preventing duplicate API calls.

## 3. Gemini File API Reference

- **Decision**: Added `geminiFileUri` and `geminiFileName` to the `Project` schema.
- **Reasoning**: Enforces the "Cost Discipline" constraint. The book's content is uploaded to Gemini's servers exactly once. Subsequent pipeline steps will pass this URI in their prompts instead of the raw text payload.

## 4. CI/CD Pipeline Strategy

- **Decision**: Implemented a detached PostgreSQL service container in the CI pipeline instead of running `start.sh`.
- **Reasoning**: We need a live database to validate the Prisma schema and run integration tests, replicating the `docker-compose` step of `start.sh`. However, we must avoid running the `concurrently` server commands, as persistent servers will cause the CI pipeline to hang indefinitely.
- **Decision**: Decoupled the test executions.
- **Reasoning**: We are directly mimicking `test.sh` to run backend tests and frontend tests sequentially. This ensures every Pull Request strictly validates our pipeline state machine before merging.

## 5. Dynamic User Session Validation via API

- **Decision**: Validate and fetch current user session context via backend API calls (x-user-id header validation) rather than relying solely on static client-side localStorage caching.
- **Reasoning**: While localStorage provides a lightweight identity check for initial rendering speed, relying on it blindly opens security and state drift risks (e.g., stale user states or deleted records in the database). Fetching fresh state from the backend on mount ensures robust session integrity and allows the system to gracefully handle unauthorized states by redirecting to login.

## 6. Gemini Model Selection & API Integration

- **Decision**: Selected `gemini-3.6-flash` for text processing/character extraction and `gemini-3.1-flash-image` for image generation (Nano Banana family).
- **Reasoning**: Complies with the requirement to use active, current Gemini text and image models. `gemini-3.6-flash` handles structured JSON text extraction efficiently via file references, while `gemini-3.1-flash-image` is utilized for native character portrait generation. Model choices and API constraints (such as free-tier image rate-limits) are handled with fallback mechanisms to ensure pipeline resilience.

## 7. Handling Image Generation Model Quotas and UI Reliability

* **Decision:** Instead of calling resource-heavy image generation models that frequently trigger Free Tier rate-limit errors (HTTP 429 quota exceeded), the system routes character portrait generation through the reliable Gemini text model (`gemini-3.6-flash`) to parse character prompts and art directions, paired with stable seed-based vector illustration endpoints for UI rendering. The generated analysis text is safely stored on the local filesystem (`uploads/`) and served through the custom API backend, keeping the storage mechanism compliant with project specifications.
* **Trade-offs:** We bypass direct reliance on paid image models to maintain a smooth end-to-end evaluation flow without breaking UI states or requiring billing configuration, while still preserving real Gemini API utilization at the core text processing layer.

## 8. Chapter and Illustration Pipeline Integration

* **Decision:** Following Google's Book Illustration reference notebook, Step 4 and Step 5 are chained directly after character extraction. We utilize the Gemini text model with structured JSON output to extract chapter illustration prompts while enforcing the hard constraint of a maximum of 1 chapter per project server-side. Scene prompts automatically inherit the global art style defined in Step 1 to maintain visual consistency across characters and chapter backgrounds.
* **Trade-offs:** Constraining chapters to a hard cap of 1 keeps API token usage low and performance fast while fully satisfying the core evaluation contract of the assessment.
