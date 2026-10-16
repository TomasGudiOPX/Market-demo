---
run_id: 2026-08-06-product-reviews-01
generated_at: 2026-08-06
facts_index_revision: "543efb6"
source_run_ids: [2026-08-06-product-reviews-01]
generated_from_snapshot: null
task: "product reviews module — understanding reviews boundaries, contracts, data model, and delivery evidence"
modules:
  - apps/api/src/modules/reviews/
  - packages/contracts/src/reviews.ts
environments: []
stale_as_of: 2026-08-06
---

# Context Pack — Product Reviews

## In scope

The reviews module (`apps/api/src/modules/reviews/`) was introduced by commit `543efb6` as a standalone NestJS domain module implementing `openspec/changes/add-product-reviews`. It does **not** embed review state into the Product model; it references Product and User via foreign keys.

## Invariants (accepted facts, scope-filtered)

- `architecture.module-reviews-ownership` — Reviews is a standalone NestJS domain module at `apps/api/src/modules/reviews/` with controller, service, repository, and types; references Product and User via FKs without embedding into Product.
  source: `apps/api/src/modules/reviews/review.module.ts`#ReviewsModule @ 543efb6
- `contracts.reviews-data-shapes` — Shared contract exports reviewSchema (id, productId, userId, rating 1-10, comment, timestamps) and reviewMutationSchema (rating int 1-10, comment trimmed string 1-100).
  source: `packages/contracts/src/reviews.ts`#reviewSchema @ 543efb6
- `contracts.reviews-api-routes` — Three endpoints: GET /api/products/:productId/reviews (public), POST (auth create), PATCH /api/reviews/:reviewId (auth update own).
  source: `apps/api/src/modules/reviews/review.controller.ts`#ProductReviewController @ 543efb6
- `data.reviews-table-schema` — Review table: UUID PK, FK→products (RESTRICT), FK→users (CASCADE), rating CHECK 1-10, comment VARCHAR(100) CHECK, unique(product_id,user_id), index(product_id,created_at).
  source: `apps/api/prisma/migrations/20260806120000_add_product_reviews/migration.sql` @ 543efb6
- `data.reviews-constraints-and-indexes` — UNIQUE(product_id,user_id) enforces one review per customer; ON DELETE RESTRICT preserves reviews on retired products; CASCADE on user FK; sorted listing index.
  source: `apps/api/prisma/schema.prisma`#Review @ 543efb6
- `delivery.reviews-fr09-requirement` — FR-09 defines reviews: visitors list unauthenticated, customers create one per active product, update only own.
  source: `docs/obsidian-vault/01 Requisitos/Requisitos Funcionales.md`#FR-09 @ 543efb6
- `delivery.reviews-vault-evidence-slice` — Evidencia - Product Reviews with complete Eslabon chain: requisitos, OpenSpec, decision, arquitectura, AI, implementacion, pruebas.
  source: `docs/obsidian-vault/03 Evidencia/Evidencia - Product Reviews.md` @ 543efb6
- `delivery.reviews-ai-session` — AI session AI-2026-08-06-01 implemented via Codex with openspec-apply-change; human confirmed consumer = authenticated customer.
  source: `docs/obsidian-vault/03 Evidencia/Registro de Evidencia IA.md`#AI-2026-08-06-01 @ 543efb6

## Ownership map

| Path | Domain | Authoritative doc |
| --- | --- | --- |
| `apps/api/src/modules/reviews/` | architecture, contracts | `AGENT.md`#Architecture, `docs/DESIGN.md`#Module Structure |
| `packages/contracts/src/reviews.ts` | contracts | `docs/DESIGN.md` |
| `apps/api/prisma/schema.prisma` (Review model) | data | `docs/DEVELOPMENT.md`#Data Changes |
| `openspec/changes/add-product-reviews/` | delivery | self |
| `docs/obsidian-vault/` | delivery | self (evidence store) |

## Current specs

- `openspec/changes/add-product-reviews/specs/product-reviews/spec.md` — Product Reviews spec: 4 requirements (public listing, creation, update, data ownership) with 13 scenarios.
- `openspec/changes/add-product-reviews/proposal.md` — What/Why/Non-Goals/Impact of the reviews module.
- Not yet archived to `openspec/specs/product-reviews/`.

## Unresolved decisions

- `openspec/changes/add-product-reviews` — Estado: implementado pero no archivado a specs.

## Staleness warnings

- Pre-existing architecture facts (auth, products, cart, orders, projects) reference vault files at `working-tree-2026-08-05` — now at `543efb6`. Bump `last_verified` on next run.
- `delivery.docs-ci-ui-polish-traceability` references `openspec/specs/delivery-docs-ci-polish/spec.md` at `working-tree-2026-08-05` — check current revision.

## Pendiente de revision

None — all 8 candidates from this run were accepted.

## Context budget

8 invariants inlined (~250 words). Out-of-pack links: `..\openspec\changes\add-product-reviews\`, `..\docs\obsidian-vault\03 Evidencia\Evidencia - Product Reviews.md`, `..\docs\obsidian-vault\03 Evidencia\Registro de Evidencia IA.md`, `.project-knowledge\accepted\{architecture,contracts,data,delivery}.yaml`.
