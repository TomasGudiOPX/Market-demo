---
run_id: 2026-08-10-add-ads-module-01
status: partial
classes: [data-change, behavior-change]
openspec_change: add-ads-module
changed_paths:
  - packages/contracts/src/ads.ts
  - packages/contracts/package.json
  - apps/api/prisma/schema.prisma
  - apps/api/prisma/seed.ts
  - apps/api/src/modules/ads/
  - apps/api/src/app.ts
  - apps/web/src/
  - tests/qa-commerce-smoke.mjs
validation:
  - command: "yarn workspace @vps-template/contracts build"
    result: pass
  - command: "yarn workspace @vps-template/api prisma:generate"
    result: pass
  - command: "yarn workspace @vps-template/api build"
    result: pass
  - command: "yarn workspace @vps-template/web lint"
    result: pass
  - command: "yarn workspace @vps-template/api test -- ad"
    result: pass
  - command: "yarn lint"
    result: pass
  - command: "yarn workspace @vps-template/api test"
    result: pass
  - command: "yarn workspace @vps-template/web build"
    result: pass
  - command: "yarn build"
    result: pass
  - command: "docker compose --env-file .env.example config"
    result: pass
  - command: "openspec validate add-ads-module --strict"
    result: pass
authorizations:
  - action: "create apps/api/prisma/migrations/20260810190000_add_ads_module/migration.sql"
    granted: pending
---

## What was done

Added ads contracts, Prisma schema and seed updates, an API ads module with public reads and admin mutations, storefront ad slots, admin ad management UI, focused backend tests, and smoke-script coverage for public reads plus customer RBAC.

## Outcomes

- Public eligible placement listing: met in code and focused repository/service tests.
- Admin create/update/retire: met in code and focused service/controller tests.
- Storefront resilient rendering: met in `AdSlot` by collapsing empty or failed reads.
- Deterministic seed ads: met in seed code, pending migration application.

## Gaps

- Migration file creation is pending explicit authorization because `apps/api/prisma/migrations/*` is protected.
- Live smoke QA remains pending until the migration file exists and a migrated database is running.

## Notes

The implementation keeps controllers and storefront UI behind `AdsService`; neither HTTP routes nor UI bypass the module service boundary.
