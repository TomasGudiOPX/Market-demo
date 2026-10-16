---
run_id: n/a
generated_at: 2026-08-06
newest_source_revision: "543efb6"
---

# Stale report - 2026-08-06

## Summary

- Facts flagged: 5 (sources changed in 543efb6)
- Domains affected: architecture (5 facts)
- High-impact (need human review before reverify): 5

## Stale facts

| Fact ID | Owner | Source path | Revision at last verify | Revision now | Path delta | High-impact? | Suggested action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| architecture.module-auth-ownership | architecture | docs/obsidian-vault/02 Arquitectura/Modulos de Dominio.md | working-tree-2026-08-05 | 543efb6 | content-changed-same-path | yes | reverify |
| architecture.module-products-ownership | architecture | docs/obsidian-vault/02 Arquitectura/Modulos de Dominio.md | working-tree-2026-08-05 | 543efb6 | content-changed-same-path | yes | reverify |
| architecture.module-cart-ownership | architecture | docs/obsidian-vault/02 Arquitectura/Modulos de Dominio.md | working-tree-2026-08-05 | 543efb6 | content-changed-same-path | yes | reverify |
| architecture.module-orders-ownership | architecture | docs/obsidian-vault/02 Arquitectura/Modulos de Dominio.md | working-tree-2026-08-05 | 543efb6 | content-changed-same-path | yes | reverify |
| architecture.module-projects-empty-scaffold | architecture | docs/obsidian-vault/02 Arquitectura/Modulos de Dominio.md | working-tree-2026-08-05 | 543efb6 | content-changed-same-path | yes | reverify |

## Suggested actions (cheat sheet)

- **reverify** - re-read the source; if the statement still holds, bump `last_verified` and the `revision` fields; keep the fact `accepted`.
- **supersede** - the source now states something materially different; mint a new fact with the new statement, link the old one in `supersedes`.
- **reject** - the source now contradicts the fact and there is no replacement statement.
- **review** - high-impact domain touched; do not auto-promote.

## High-impact domains

A fact is high-impact if its `owner` is `architecture`, `security`, `contracts`, `data`, or `operations` and the path delta is `content-changed-same-path`, `renamed`, or `deleted`.

## Reconciliation log
