## Context

The cart application already uses a modular-monolith shape: each backend domain owns controller/service/repository/types files under `apps/api/src/modules`, shared request/response contracts live in `packages/contracts/src`, and Prisma owns persistence. Public reads use storefront routes such as `api/products`, while admin writes use `api/admin/...` routes guarded by JWT and admin role checks.

`proj-mono-work` routes OpenSpec authoring through standalone specify work and expects handoff-ready artifacts when work moves to implementation, testing, or learning routes. This change therefore keeps the ads module bounded and records checkpoints for downstream handoff.

## Goals / Non-Goals

**Goals:**
- Add a standalone ads domain module instead of overloading products.
- Support admin-managed internal promotions for storefront placements.
- Keep public ad reads safe, cacheable in shape, and independent from checkout/order state.
- Make implementation, test, and learning handoffs explicit.

**Non-Goals:**
- Third-party ad network integration.
- Impression/click analytics, billing, auctions, targeting, personalization, or A/B testing.
- Changing product ownership, cart pricing, checkout totals, or order behavior.
- User-specific advertising decisions.

## Decisions

1. Create a standalone `AdsModule`.
   - Rationale: ads have lifecycle, placement, schedule, and target rules that are different from product catalog rules.
   - Alternative considered: add `featured` fields to `Product`. That is simpler but collapses campaigns into product data and does not scale past one placement.

2. Model ads as internal promotions with optional product target.
   - Proposed fields: `id`, `title`, `imageUrl`, `placement`, `targetUrl`, `productId`, `priority`, `isActive`, `startsAt`, `endsAt`, `createdAt`, `updatedAt`.
   - Rationale: supports both product promotions and generic campaign links while keeping v1 small.
   - Constraint: exactly one target style should be valid at a time: either `productId` or `targetUrl`.

3. Use public placement reads and admin CRUD routes.
   - Public: `GET /api/ads?placement=<placement>`.
   - Admin: `POST /api/admin/ads`, `PATCH /api/admin/ads/:id`, `DELETE /api/admin/ads/:id`.
   - Rationale: mirrors the product route split and keeps RBAC expectations obvious.

4. Keep storefront rendering resilient.
   - Ad fetching should not block catalog/detail/cart/checkout/order flows.
   - Empty or failed ad reads should collapse the placement without surfacing disruptive errors.

5. Treat handoff as an explicit artifact trail.
   - Implementation handoff input: this OpenSpec change plus task list.
   - Test handoff output: backend/frontend test evidence and smoke QA notes.
   - Learning handoff output: vault/docs update candidates summarizing the new ads capability and evidence.

## Risks / Trade-offs

- Schedule logic can drift between database queries and service code -> centralize eligibility in the ads service/repository and cover edge cases with tests.
- External `targetUrl` values can create unsafe redirects -> validate URLs and consider limiting to allowed schemes.
- Ads can make the storefront visually noisy -> start with limited placements and reusable ad slot components.
- Product-linked ads can point to retired products -> public eligibility should exclude ads linked to inactive/missing products.
- Future analytics needs may require event tables -> keep v1 schema extensible but do not add event capture until required.

## Migration Plan

1. Add Prisma enum/model and migration for ads.
2. Add shared contracts before backend/controller work so both API and UI compile against one shape.
3. Register the module after service/repository tests pass.
4. Add seed ads after schema and contracts are stable.
5. Add frontend rendering and admin management UI.
6. Run backend tests, frontend build/tests, and smoke QA.

Rollback: remove UI usage first, unregister the backend module, and reverse the Prisma migration before any production data depends on ads.

## Handoff Checkpoints

- Specify -> Execute: OpenSpec `add-ads-module` artifacts complete and validated.
- Execute -> Test: implementation summary, changed files, migrations, seed behavior, and local test commands.
- Test -> Learn: QA evidence, capability summary, known gaps, and docs/vault update candidates.
