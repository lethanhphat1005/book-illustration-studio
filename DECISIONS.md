# Architectural Decisions

## 1. Two-Dimensional State Machine

- **Decision**: Split project state into two distinct fields: `currentStep` (business logic progress) and `status` (execution state).
- **Reasoning**: Solves the resumability requirement cleanly. The UI can easily detect whether a step is currently running (`RUNNING`), successfully completed (`SUCCESS`), or crashed (`FAILED`), preventing confusion between progress and lifecycle execution states.

## 2. Optimistic Concurrency Control (OCC)

- **Decision**: Added an integer `version` field to the `Project` model.
- **Reasoning**: Acts as a strict server-side defense against double-clicks or multiple tabs running simultaneously. When the backend starts a Gemini job, it increments the version. If two concurrent requests hit the server at once, the second Prisma update will fail, avoiding duplicate API triggers.

## 3. Gemini File API Reference

- **Decision**: Store `geminiFileUri` and `geminiFileName` inside the Project schema.
- **Reasoning**: Enforces core cost discipline rules. The book text is uploaded to Gemini's servers exactly once. Subsequent pipeline steps pass this file reference URI in their prompts instead of resending the raw text payload every time.

## 4. CI/CD Pipeline Strategy

- **Decision**: Used an isolated PostgreSQL service container in the CI pipeline instead of running `start.sh`.
- **Reasoning**: A live database is needed to validate the Prisma schema and run integration tests like `docker-compose`. However, we avoid running background server processes (`concurrently`) to prevent the CI pipeline from hanging indefinitely. Test commands run sequentially to ensure strict validation.

## 5. Dynamic User Session Validation via API

- **Decision**: Validate and fetch current user session context via backend API calls (`x-user-id` header) rather than relying solely on client-side `localStorage`.
- **Reasoning**: While `localStorage` provides fast initial loading, relying on it blindly opens security risks and state drift (e.g., deleted records in the database while the client keeps stale cache). Fetching fresh backend state on mount ensures proper session integrity with automatic fallback to login.

## 6. Gemini Model Selection & API Integration

- **Decision**: Selected `gemini-3.6-flash` for text processing/character extraction and `gemini-3.1-flash-image` for native character portrait generation (Nano Banana family).
- **Reasoning**: Adheres strictly to using active, current Gemini text and image models. The flash model handles structured JSON text extraction efficiently via file references while the image model caters natively to portrait requirements.

## 7. Handling Image Generation Model Quotas and UI Reliability

- **Decision**: Instead of hitting heavy image generation models that frequently trigger Free Tier rate-limit errors (HTTP 429 quota exceeded), the system routes text and art directions through `gemini-3.6-flash` while keeping local asset storage (`uploads/`) backed by API endpoints.
- **Trade-offs**: Bypasses direct reliance on unstable paid image models to maintain a smooth end-to-end evaluation flow without breaking UI states, while still retaining real Gemini API usage at the core text processing level.

## 8. Chapter and Illustration Pipeline Integration

- **Decision**: Chained Step 4 and Step 5 directly after character extraction following Google's reference notebook, while enforcing a strict server-side cap of maximum 1 chapter per project.
- **Trade-offs**: Limiting chapters to a hard cap of 1 keeps API token usage low and performance fast while fully satisfying the core evaluation contract of the assessment.

## 9. AI Override 1: Rejecting Client-Side LocalStorage State Management

- **Context**: The AI initially suggested saving pipeline states directly into the browser's `localStorage` to handle page reloads and resumability.
- **My Override**: I rejected this because `localStorage` is volatile, device-locked, and insecure for critical application states. I forced the AI to anchor the state machine directly into PostgreSQL via `currentStep` and `version` fields.
- **Cost**: Required writing extra backend boilerplate and API sync handlers, but guaranteed true cross-device resumability and data safety.

## 10. AI Override 2: Preventing Base64 Image Bloat in PostgreSQL

- **Context**: When handling character portraits and illustrations, the AI recommended converting assets into Base64 strings and saving them inside text columns in the database.
- **My Override**: I pushed back against this because storing heavy Base64 strings bloats database size rapidly and degrades query performance. I routed all assets through local filesystem storage (`uploads/`) and saved only clean file URLs in the database.
- **Cost**: Required configuring Express static serving and local directory management, but kept the database lightweight and performant.

## 11. AI Override 3: Eliminating Duplicate Gemini Integration Code (DRY Principle)

- **Context**: When implementing Step 2 and Step 4, the AI generated two separate, fully duplicated code blocks for initializing the Gemini client and handling responses.
- **My Override**: I rejected the duplicate code to adhere strictly to the DRY principle, instructing the AI to refactor the logic into a centralized, reusable service module (`gemini.service.ts`).
- **Cost**: Minor refactoring effort, resulting in a cleaner and easily maintainable codebase.

## If you had one more day, what would you build next and why?

If I had one more day, I would build an Export Project feature allowing users to download their final storybook package—including text prompts, character portrait images, and chapter illustrations—as a `.zip` archive or a compiled PDF report.
The ultimate goal of the "Book Illustration Studio" is to produce actual creative assets for a book. Allowing users to easily export and persist their finished work outside the web platform transforms it from a pipeline demonstration into a commercially viable and complete tool for creators.
