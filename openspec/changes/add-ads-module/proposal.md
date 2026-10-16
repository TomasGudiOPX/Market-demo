## Why

The storefront can list products and collect reviews, but administrators do not have a controlled way to promote products or campaigns in visible storefront placements. An ads module adds a narrow merchandising surface without mixing campaign lifecycle rules into the product catalog.

## What Changes

- Add an admin-managed ads capability for creating, updating, retiring, and scheduling internal promotional placements.
- Add public read endpoints that return only currently eligible ads for a requested storefront placement.
- Allow ads to link either to an internal product or to a validated target URL.
- Render active ads in storefront placement slots without changing cart, checkout, or order behavior.
- Add deterministic seed ads for local demo/evaluation.
- Capture implementation, test, and learning handoff checkpoints so the change can move through `proj-mono-work` routes cleanly.

## Capabilities

### New Capabilities
- `ads-management`: Admin-managed internal ads and public storefront ad placements.

### Modified Capabilities

## Impact

- Backend: new NestJS ads module, controller/service/repository/types, app module registration, Swagger description update.
- Contracts: new shared Zod schemas and inferred types for ads.
- Data: new Prisma ad model and migration, optional relation to products, seed data.
- Frontend: storefront ad slot rendering and admin ad management UI.
- Tests: backend service/controller tests, frontend behavior coverage, and smoke/QA updates for public and admin ads flows.
- Documentation/evidence: OpenSpec artifacts, docs/vault updates, and handoff evidence for implementation, testing, and learning workflows.
