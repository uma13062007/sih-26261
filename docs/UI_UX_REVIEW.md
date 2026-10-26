# Niyantran UI/UX Review and Handoff

**Review status:** Source-level review completed; browser build could not be verified in this environment.

## What was improved

- Shifted the default theme to a readable light-neutral regulatory workbench with navy text, slate borders, restrained blue actions, accessible focus styles and an optional dark theme.
- Standardised the application workspace width, brand language, status colours, input/select styling and common feedback patterns.
- Clarified that the current application data, configured rules, OCR confidence values, registry signals and replay results are synthetic/demo fixtures where applicable.
- Removed unsupported claims that demonstrate simulated reference checks, signature indicators or hash-like values as real official verification.
- Updated application, upload, extraction, rules, review, audit and report copy to distinguish a demo check from an official approval or verified document.
- Made the Reports export action download a CSV and made Print / Save as PDF use the browser print flow.
- Connected demo reviewer-profile saving to localStorage and synced the profile in the navigation.
- Connected the mock/live mode control to the shared service configuration and clarified that switching modes requires a compatible backend for live calls.
- Made manual document review record a session event in the mock store and audit trail; it does not verify authenticity.
- Added saved in-session replay history and retrieval, corrected the replay-summary data shape, and made the supported capacity demo use selected numeric threshold versions instead of fixed hard-coded thresholds.
- Added explicit feedback for unsupported replay-rule/version combinations and restricted the replay UI to the demo rule whose evaluator is implemented.
- Replaced hard-coded dashboard severity fallback counts with counts computed from the mock findings.
- Added a README with setup, demo-mode and security instructions.

## Existing frontend structure

- React 18 + Vite, Tailwind CSS 3, React Router, Lucide React, Recharts, and Axios.
- Existing application includes 18 registered routes/pages and a mock service/store layer.
- Existing routes were preserved rather than replacing the app wholesale.

## Important limitations

- The FastAPI backend is not included in this frontend ZIP.
- Default mock mode does not send uploaded file contents to a backend and does not run live PyMuPDF/Tesseract processing. Extraction values and confidence scores in mock mode are examples.
- Official AICTE or issuing-authority services are not contacted by mock mode.
- Rule checks and Regulatory Change Replay operate on synthetic example data. Only the capacity threshold demo rule currently has an explicit replay evaluator.
- Manual review events and replay history are stored in the in-memory mock store for the current demo session; they are not a durable backend audit record. The reviewer profile is stored separately in browser localStorage.
- The “live API” option requires a backend matching the frontend service endpoints and response schemas. Older files in `docs/` use a `/api` prefix, while `.env.example` uses `/api/v1`; reconcile this before backend integration.
- Export currently provides CSV. Print / Save as PDF uses the browser print dialog, not a generated signed PDF report.
- This review is not a full security audit or claim of production readiness.

## Verification performed

- Parsed the 67 JavaScript/JSX source files with Babel parser: no syntax errors were found during that check.
- Exercised the mock replay store directly: it saved a replay, returned it by replay ID, and rejected identical or unsupported versions with a clear error.
- A production Vite build could not be completed here because the supplied `node_modules` tree contained Windows-specific Rollup/esbuild binaries, while this environment is Linux. A fresh platform-native dependency install is required to build. The delivery ZIP excludes `node_modules`, `.env`, and build output.

## Before using live backend mode

1. Align all API routes and response shapes between `API.md`, the older docs in `docs/`, and the FastAPI implementation.
2. Validate every route with the actual backend and test unauthorised requests.
3. Confirm upload limits, storage protection, real OCR processing, data retention, and role permissions.
4. Run `npm install`, `npm run build`, and the end-to-end user journey on the target machine.
5. Do not describe the prototype as an official AICTE verification system or claim a check establishes authenticity unless independently verified and implemented.
