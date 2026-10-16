## 1. Contracts and Data Model

- [x] 1.1 Add shared ads contracts with placement enum, ad schema, create/update schemas, list response, and mutation response types.
- [x] 1.2 Add Prisma ad placement enum, ad model, product relation, indexes, and soft-retirement fields.
- [x] 1.3 Create the ads Prisma migration and regenerate the Prisma client.
- [x] 1.4 Update the deterministic seed to create local demo ads for supported placements.

## 2. Backend Ads Module

- [x] 2.1 Create the ads module structure with controller, service, repository, and type mapper files.
- [x] 2.2 Implement public placement listing with active, schedule-window, priority, and active-product eligibility filtering.
- [x] 2.3 Implement admin create/update/retire service behavior with shared contract validation.
- [x] 2.4 Add public `api/ads` and admin `api/admin/ads` controllers with Swagger metadata.
- [x] 2.5 Guard admin ad routes with JWT authentication and admin RBAC.
- [x] 2.6 Register `AdsModule` in the API app module and update the API description.

## 3. Frontend Storefront and Admin UI

- [x] 3.1 Add frontend ads types/forms using the shared contracts.
- [x] 3.2 Add ad fetching to storefront views through the existing API request helper.
- [x] 3.3 Render resilient ad slots for supported storefront placements.
- [x] 3.4 Add admin ad management UI for create, update, retire, schedule, placement, priority, and target fields.
- [x] 3.5 Ensure empty or failed ad reads do not block catalog, product detail, cart, checkout, or orders.

## 4. Testing and Validation

- [x] 4.1 Add backend service tests for eligibility filtering, schedule windows, target validation, and product-linked ad constraints.
- [x] 4.2 Add backend controller/RBAC tests for public reads and admin-only mutations.
- [x] 4.3 Add frontend tests or focused smoke coverage for ad slot rendering and admin ad management.
- [x] 4.4 Run package tests, type checks, lint/build commands, and record the exact commands/results.
- [ ] 4.5 Run smoke QA for public storefront ads, admin ad CRUD, and non-blocking fallback behavior.

## 5. Handoff and Documentation

- [x] 5.1 Prepare implementation handoff notes with changed files, migration name, seed behavior, and validation results.
- [x] 5.2 Prepare test handoff notes with evidence paths, covered scenarios, and remaining gaps.
- [x] 5.3 Update docs/vault knowledge candidates for the ads capability and admin workflow.
- [ ] 5.4 Capture final OpenSpec status and next-route recommendation for `proj-mono-work`.
