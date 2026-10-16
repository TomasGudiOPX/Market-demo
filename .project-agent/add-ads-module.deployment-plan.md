# Deployment Plan: add-ads-module

## Target

- Branch: current working branch.
- Directory: `cart`.
- Compose project: unchanged.
- Health URL: `/health`.

## Migration Plan

- Create versioned migration `20260810190000_add_ads_module`.
- Run locally/disposable first with `yarn workspace @vps-template/api prisma:migrate`.
- Regenerate Prisma client with `yarn workspace @vps-template/api prisma:generate`.
- Seed demo ads with `yarn workspace @vps-template/api seed`.

## Rollback

- Before deployment: remove the migration directory and schema/model references.
- After deployment: ship a reverse migration that drops `ads` and `AdPlacement` only after confirming no production data depends on ads.
- Remove UI usage first so public storefront paths no longer request `/api/ads`.

## Post-Deploy Check

- `GET /health` returns `200`.
- `GET /api/ads?placement=catalog_hero` returns `{ "ads": [...] }`.
- Customer token receives `403` from `POST /api/admin/ads`.
- Admin can create, update, and retire one test ad, then public placement output reflects retirement.
