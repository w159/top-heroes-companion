# ExecPlan: Clean Architecture Refactor + Agentic RAG + Analytics

## Purpose / Big Picture

Refactor the Top Heroes Companion into clean architectural layers while adding agentic content updates, a production-ready RAG chat assistant, and purchase analytics. Preserve existing functionality, keep bundle size lean, and maintain the local-first UX.

## Scope

- Introduce Domain → Application → Infrastructure → Presentation layering.
- Consolidate data access into a unified service layer with DI boundaries.
- Replace ChatAssistant keyword matching with real local RAG search + citations.
- Add ContentUpdateAgent with versioning and freshness tracking.
- Add PurchaseTracker + ROI analytics with F2P vs spending comparison.
- Add error boundaries, loading states, service worker, and CSS extraction.
- Update README and add ARCHITECTURE.md.

## Non-Goals

- No backend server or cloud infrastructure.
- No heavy ML dependencies that bloat bundle size.
- No changes to .old.tsx backup files.
- No breaking of lazy-loading or routing.

## Assumptions / Dependencies

- RAG content remains in repo and is served as static assets.
- localStorage remains the source of truth for user data and updates.
- Existing engine/calculator logic remains functional and reusable.

## Task List (with Roles)

1. **Architecture scaffolding + interfaces**
   - Implementer: create domain types and application interfaces
   - Reviewer: validate layering boundaries and DI
   - Tester: smoke-check app boot + basic navigation
   - Success: new folders compile; legacy imports still work via re-exports

2. **Data + content update agent**
   - Implementer: build ContentUpdateAgent + versioned data storage
   - Reviewer: check update metadata + fallback safety
   - Tester: verify update check & reset preserve data
   - Success: updates tracked with version/changelog

3. **RAG assistant overhaul**
   - Implementer: create local semantic index + retrieval pipeline
   - Reviewer: validate source citations + history usage
   - Tester: multi-turn queries produce grounded responses
   - Success: real semantic search replaces simulated responses

4. **Purchase tracking + analytics**
   - Implementer: create PurchaseTracker + ROI analysis service
   - Reviewer: validate formulas + data model
   - Tester: add/inspect purchase history and ROI outputs
   - Success: ROI deltas and spend recommendations visible

5. **Presentation updates**
   - Implementer: move inline styles to design-system.css; add error boundary
   - Reviewer: verify UI consistency and loading states
   - Tester: visual regression spot-checks
   - Success: no inline styles in ChatAssistant; error boundary covers routes

6. **Docs + memory**
   - Implementer: add ARCHITECTURE.md, update README
   - Reviewer: confirm accuracy + completeness
   - Tester: N/A
   - Success: docs reflect new architecture and features

## Risks & Mitigations

- **Bundle bloat**: avoid heavy ML deps; keep custom lightweight indexing.
- **Data loss**: keep existing localStorage keys and migration paths.
- **Routing regressions**: keep lazy imports intact, update paths carefully.

## Validation Plan

- `npm run test` (if configured) or targeted component smoke checks.
- Manual checks: open app, navigate routes, open chat, test updates.

## Rollback Notes

- Keep prior data keys; no destructive migrations.
- Service worker is additive and can be unregistered if needed.
