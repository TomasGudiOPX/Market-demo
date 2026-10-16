# Implementation Handoff: add-ads-module

## Changed Files

- Contracts: `packages/contracts/src/ads.ts`, `packages/contracts/package.json`.
- Data: `apps/api/prisma/schema.prisma`, `apps/api/prisma/seed.ts`.
- Backend: `apps/api/src/modules/ads/`, `apps/api/src/app.ts`.
- Frontend: `apps/web/src/components/AdSlot.tsx`, storefront views, admin app/view/state/types/formatters/styles.
- Evidence: `docs/DESIGN.md`, `INFORME_IA.md`, `docs/obsidian-vault/03 Evidencia/Evidencia - Ads Module.md`, `docs/obsidian-vault/03 Evidencia/Registro de Evidencia IA.md`.
- QA: `tests/qa-commerce-smoke.mjs`.

## Migration

- Planned migration name: `20260810190000_add_ads_module`.
- Status: pending explicit authorization to create the protected migration file.

## Seed Behavior

- Seed upserts deterministic ads by unique title.
- Demo ads cover `catalog_hero`, `product_detail`, and `cart_summary`.
- Product-linked demo ads resolve active seeded products by product name.

## Validation Results

- `yarn workspace @vps-template/contracts build`: pass.
- `yarn workspace @vps-template/api prisma:generate`: pass.
- `yarn workspace @vps-template/api build`: pass.
- `yarn workspace @vps-template/web lint`: pass.
- `yarn workspace @vps-template/api test -- ad`: pass, 3 files, 10 tests.
- `yarn lint`: pass.
- `yarn workspace @vps-template/api test`: pass, 14 files, 52 tests.
- `yarn workspace @vps-template/web build`: pass.
- `yarn build`: pass.
- `docker compose --env-file .env.example config`: pass.
- `openspec validate add-ads-module --strict`: pass.

## Remaining Gaps

- Create migration file after authorization.
- Run live smoke QA against a migrated database.
