---
run_id: n/a
generated_at: 2026-08-05T00:00:00Z
task: cart docs session context
modules:
  - docs/
  - docs/obsidian-vault/
environments:
  - n/a
stale_as_of: 2026-08-05
---

# Context pack - cart docs session context

## In scope

- **Task:** Session-start context for documentation and evidence work under `docs/` in the cart project.
- **Modules touched:** `docs/`, `docs/obsidian-vault/`
- **Environments touched:** `n/a`

## Invariants (accepted facts, scope-filtered)

- `delivery.docs-ci-ui-polish-traceability` - Final delivery documentation must describe the actual Vite React, NestJS, PostgreSQL, Prisma, Docker Compose, GitHub workflow, Swagger, CI, and commerce module handoff consistently - `source: openspec/specs/delivery-docs-ci-polish/spec.md#Honest delivery documentation` @ working-tree-2026-08-05
- `architecture.module-cart-ownership` - The cart module owns the authenticated user's Cart and CartItem state - `source: docs/obsidian-vault/02 Arquitectura/Modulos de Dominio.md#Cart` @ working-tree-2026-08-05
- `architecture.module-orders-ownership` - The orders module owns Order, OrderItem, and checkout idempotency - `source: docs/obsidian-vault/02 Arquitectura/Modulos de Dominio.md#Orders` @ working-tree-2026-08-05
- `contracts.cart-checkout-orders-behavior` - Cart, checkout, idempotency, stock safety, and order history behavior are governed by the cart-checkout-orders OpenSpec capability - `source: openspec/specs/cart-checkout-orders/spec.md#Cart, Checkout, and Orders Specification` @ working-tree-2026-08-05

## Ownership map

- `README.md` -> delivery -> authoritative doc: `AGENT.md` (anchor: `Documentation Ownership`)
- `docs/DESIGN.md` -> architecture -> authoritative doc: `AGENT.md` (anchor: `Documentation Ownership`)
- `docs/DEVELOPMENT.md` -> delivery -> authoritative doc: `AGENT.md` (anchor: `Documentation Ownership`)
- `docs/ENVIRONMENTS.md` -> operations -> authoritative doc: `AGENT.md` (anchor: `Documentation Ownership`)
- `docs/VPS-DOC.md` -> operations -> authoritative doc: `AGENT.md` (anchor: `Documentation Ownership`)
- `docs/obsidian-vault/` -> delivery -> authoritative doc: `AGENT.md` (anchor: `Documentation Ownership`)

## Current specs

- `openspec/specs/delivery-docs-ci-polish/spec.md` - accepted docs, CI, Swagger, UI polish, and delivery evidence expectations.
- `openspec/specs/cart-checkout-orders/spec.md` - accepted cart, checkout idempotency, stock safety, and order-history behavior.
- `openspec/changes/archive/2026-08-03-finalize-delivery-docs-ci-polish/` - archived implementation change for final delivery documentation and polish.
- `openspec/changes/archive/2026-08-03-add-cart-checkout-orders/` - archived implementation change for cart, checkout, and orders.

## Runbook references

- `docs/VPS-DOC.md` - commands, ports, env vars, backups, deployment steps
- `docs/DEVELOPMENT.md` - dev / CI / quality / release workflow
- `docs/ENVIRONMENTS.md` - branch flow / environment isolation / rollback

## Unresolved decisions

- None found in `docs/obsidian-vault/04 Gestion/Registro de Decisiones.md`; ADR-001 through ADR-010 are marked updated or approved.

## Staleness warnings

- `.project-knowledge/stale-report.md` - 0 stale facts flagged as of 2026-08-05.

## Pendiente de revision (for the next run)

- None for this scope. `.project-knowledge/candidates/2026-08-05-proactive-001-cover-gaps.yaml` has matching facts already present in `accepted/`.

## Context budget

- Total inlined words: 356 (target: < 600)
- Out-of-pack links: 14
