# cart-data-change - Make a cart schema or data lifecycle change with migration review, rollback planning, and environment coordination.

## 1. Purpose and trigger conditions

Use this project-local skill to make a cart schema or data lifecycle change with migration review, rollback planning, and environment coordination.

Use when the user says: `change the schema`, `add a table`, `add a model`, `create a migration`, `change data lifecycle`.
Do NOT trigger when: the task is feature work with no Prisma schema change, documentation-only updates, or deployment-only work.

## 2. Expected inputs and explicit non-goals

**Inputs:**
- Schema/data change description and affected model names.
- Migration name.
- Target environment, if applying beyond local development.
- Rollback plan or approval to draft one.

**Non-goals:**
- MUST NOT deploy a migration to production without a documented rollback plan. Source: `AGENT.md` -> Working Rules.
- MUST NOT mutate production data without explicit approval. Source: `AGENT.md` -> Working Rules.
- MUST NOT edit an existing migration after it has been applied. Source: `apps/api/prisma/migrations/` and `AGENT.md` -> Architecture.
- MUST NOT change Compose topology for data-only work. Source: `AGENT.md` -> Architecture.

## 3. Authoritative sources and their precedence

1. `AGENT.md` @ `a8d6bbd` - architecture, working rules, validation.
2. `docs/DEVELOPMENT.md` @ `401f1be` - development and data-change workflow.
3. `apps/api/prisma/schema.prisma` @ `7c3d86d` - current schema.
4. `apps/api/prisma/migrations/` @ `7c3d86d` - versioned migrations.
5. `docs/VPS-DOC.md` @ `401f1be` - backups and recovery.
6. `docs/ENVIRONMENTS.md` @ `401f1be` - environment isolation and rollback.

When sources conflict, higher-precedence wins; record the conflict in the completion report.

## 4. Step-by-step workflow

1. Read `apps/api/prisma/schema.prisma` and affected models; exit with current schema notes.
2. Design the schema change and rollback approach; exit with migration name and rollback plan draft.
3. Update `schema.prisma`; exit with diff limited to intended models.
4. Create a new timestamped migration with `yarn workspace @vps-template/api prisma:migrate dev --name <migration-name>`; exit with migration SQL reviewed.
5. Update deterministic seed when needed; exit with seed impact recorded.
6. Write a disposable verification test or manual verification note; exit with validation plan.
7. PAUSE at Gate: Migration review.
8. Run validation commands and record each result honestly.
9. Apply to staging before production when deployment is in scope; exit with staging result.
10. PAUSE at Gate: Production data approval when production data is touched.
11. Update data and operations docs.
12. Write the completion report.

## 5. Project boundaries and prohibited actions

- MUST NOT expose PostgreSQL directly; deployment topology stays behind the proxy. Source: `AGENT.md` -> Architecture.
- MUST NOT edit applied migrations in place; create a new migration. Source: `apps/api/prisma/migrations/`.
- MUST NOT access production credentials or production data from staging or local context. Source: `AGENT.md` -> Working Rules.
- MUST NOT skip rollback planning for non-trivial data changes. Source: `docs/ENVIRONMENTS.md` and `docs/VPS-DOC.md`.

## 6. Documentation and OpenSpec requirements

- OpenSpec must be consulted when accepted behavior or data contracts change.
- Docs that may need updating: `docs/DEVELOPMENT.md`, `docs/VPS-DOC.md`, `docs/ENVIRONMENTS.md`.
- Evidence: write `.project-skills/reports/cart-data-change/<run-id>.md`.
- Completion reports may emit `.project-knowledge` candidates, but this skill does not promote facts directly.

## 7. Validation commands and honest reporting rules

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

Record each command's status as exactly one of: `requested | run | passed | failed | blocked`.

## 8. Approval gates

### Gate: Migration review
**Trigger:** migration SQL is written or schema changes are ready.
**Approver:** data-reviewer or project owner.
**On approval:** proceed to validation and environment application.
**On rejection:** stop, record the reason, and do not apply the migration.

### Gate: Production data approval
**Trigger:** production data or production database is touched.
**Approver:** operations-reviewer plus data-reviewer or project owner.
**On approval:** proceed only within the approved scope.
**On rejection:** stop, record the reason, and do not touch production.

### Gate: Deployment
**Trigger:** applying the data change outside local development.
**Approver:** operations-reviewer or project owner.
**On approval:** proceed with the named environment plan.
**On rejection:** stop and keep changes local.

## 9. Completion criteria

- [ ] All workflow steps executed or explicitly skipped with a reason.
- [ ] All approval gates passed, or the run stopped at a gate.
- [ ] All validation commands run and their results recorded honestly.
- [ ] Documentation updates done or explicitly deferred with a reason.
- [ ] OpenSpec change referenced or created when behavior changed.
- [ ] Completion report written to `.project-skills/reports/cart-data-change/<run-id>.md`.

## 10. Links to generated references and examples

- `references/architecture.md` - compact snapshot of architecture sources.
- `references/validation.md` - validation commands and expected outputs.
- `references/documentation-map.md` - which docs own which domains.
- `templates/change-brief.md` - per-run change brief.
- `templates/completion-report.md` - per-run completion report.
