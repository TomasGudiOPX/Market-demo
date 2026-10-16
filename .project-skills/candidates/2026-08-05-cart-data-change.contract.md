## Contract for cart-data-change

- **Outcome:** Make a cart schema or data lifecycle change with migration review, rollback planning, and environment coordination.
- **Category:** data-change
- **Trigger phrases:** change the schema; add a table; add a model; create a migration; change data lifecycle
- **Non-trigger:** feature work with no Prisma schema change; documentation-only updates; deployment-only work
- **Inputs:** schema change; affected model; migration name; target environment; rollback plan
- **Non-goals:** source-linked in `.codex/skills/cart-data-change/SKILL.md` section 2
- **Authoritative sources:** `AGENT.md`; `docs/DEVELOPMENT.md`; `apps/api/prisma/schema.prisma`; `apps/api/prisma/migrations/`; `docs/VPS-DOC.md`; `docs/ENVIRONMENTS.md`
- **Affected modules:** `apps/api/prisma/`
- **Approval gates:** migration review; production data approval; deployment
- **Risk level:** high
- **Validation commands:** copied from `AGENT.md` Validation
