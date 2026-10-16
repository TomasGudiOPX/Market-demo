## Contract for cart-doc-sync

- **Outcome:** Reconcile cart documentation and vault evidence after accepted project changes without changing code.
- **Category:** doc-sync
- **Trigger phrases:** sync docs; reconcile documentation; update docs after a change; documentation drift
- **Non-trigger:** code implementation; migration changes; deployments; new fact promotion
- **Inputs:** changed paths; accepted change slug; docs or vault paths; `.project-knowledge` report when available
- **Non-goals:** source-linked in `.codex/skills/cart-doc-sync/SKILL.md` section 2
- **Authoritative sources:** `AGENT.md`; `docs/`; `openspec/specs/`; `docs/obsidian-vault/`; `.project-knowledge/accepted/`
- **Affected modules:** `docs/`; `docs/obsidian-vault/`; `.project-knowledge/`
- **Approval gates:** documentation review
- **Risk level:** low
- **Validation commands:** document checks only; no code validation commands for docs-only runs
