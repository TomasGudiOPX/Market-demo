# Test Handoff: add-ads-module

## Automated Evidence

- `apps/api/src/modules/ads/ad.repository.test.ts`
  - Public eligibility query filters placement, active state, retired state, schedule windows, and active linked products.
  - Query orders by priority descending, then newest first.
- `apps/api/src/modules/ads/ad.service.test.ts`
  - Public placement reads map product targets.
  - Invalid placements are rejected.
  - Product-linked create validates active product targets.
  - Invalid target and schedule input are rejected.
  - Update and retire behavior is covered.
- `apps/api/src/modules/ads/ad.controller.test.ts`
  - Public read delegates to service.
  - Admin controller carries `admin` RBAC metadata.
  - `RolesGuard` rejects customer users and allows admins.
- `tests/qa-commerce-smoke.mjs`
  - Adds public ads response-shape check.
  - Adds customer-forbidden admin ad write check.

## Commands Run

- `yarn workspace @vps-template/contracts build`: pass.
- `yarn workspace @vps-template/api prisma:generate`: pass.
- `yarn workspace @vps-template/api build`: pass.
- `yarn workspace @vps-template/web lint`: pass.
- `yarn workspace @vps-template/api test -- ad`: pass outside sandbox after Vitest `spawn EPERM` in restricted context.
- `yarn workspace @vps-template/api test`: pass outside sandbox, 14 files, 52 tests.
- `yarn workspace @vps-template/web build`: pass.
- `yarn build`: pass.
- `docker compose --env-file .env.example config`: pass.
- `openspec validate add-ads-module --strict`: pass.

## Remaining QA

- Live smoke for public storefront ads and admin ad CRUD after the migration exists.
