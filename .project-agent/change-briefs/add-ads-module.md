# Change Brief: add-ads-module

## Scope

- Contracts: `packages/contracts/src/ads.ts`, `packages/contracts/package.json`.
- Data: `apps/api/prisma/schema.prisma`, `apps/api/prisma/migrations/20260810190000_add_ads_module/migration.sql` (pending authorization), `apps/api/prisma/seed.ts`.
- Backend: `apps/api/src/modules/ads/`, `apps/api/src/app.ts`.
- Frontend: `apps/web/src/components/AdSlot.tsx`, storefront views, admin view/state/types/formatters/styles.
- QA/docs: `tests/qa-commerce-smoke.mjs`, `docs/`, `docs/obsidian-vault/`, `.project-agent/runs/`.

## Acceptance Criteria

- Public `GET /api/ads?placement=<placement>` returns active, in-window ads for the placement ordered by priority.
- Public ads exclude inactive, retired, out-of-window, and inactive-product-linked ads.
- Admin-only routes create, update, list, and retire ads through JWT plus admin RBAC.
- Ads target exactly one active product or URL.
- Storefront ad slots collapse on empty or failed reads without blocking catalog, detail, cart, checkout, or orders.
- Seed creates deterministic demo ads for supported placements.

## Validation Commands

```powershell
corepack enable
yarn install --immutable
yarn lint
yarn workspace @vps-template/contracts build
yarn workspace @vps-template/api prisma:generate
yarn workspace @vps-template/api build
yarn workspace @vps-template/api test
yarn workspace @vps-template/web build
yarn build
docker compose --env-file .env.example config
```

## Capability Authorizations

- Required: create/edit `apps/api/prisma/migrations/20260810190000_add_ads_module/migration.sql`.
- Not required: local repository edits, local build/type/test commands.
- Not requested: applying migrations to staging/production, deployments, secret reads, network access.

## Rollback

Remove the ad UI references, unregister `AdsModule`, remove `apps/api/src/modules/ads/`, remove `packages/contracts/src/ads.ts` and export entry, revert the Prisma schema/seed changes, and drop the pending migration before applying it to any database.
