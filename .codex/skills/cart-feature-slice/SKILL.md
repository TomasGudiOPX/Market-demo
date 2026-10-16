# cart-feature-slice - Implement a cart project feature as a traceable web-to-database vertical slice.

## 1. Purpose and trigger conditions

Use this project-local skill to implement a cart project feature as a traceable web-to-database vertical slice. It applies when a change touches browser workflow and API behavior.

Use when the user says: `add a feature`, `implement a feature`, `add cart capability`, `change browser and API behavior`.
Do NOT trigger when: the task is documentation-only, deployment-only, or a standalone schema migration.

## 2. Expected inputs and explicit non-goals

**Inputs:**
- Task description and intended user-visible behavior.
- OpenSpec change slug, or approval to create one.
- Affected module path under `apps/api/src/modules/` and affected web paths under `apps/web/`.
- Changed-path list when continuing existing work.

**Non-goals:**
- MUST NOT deploy. Source: `AGENT.md` -> Working Rules and Documentation Ownership.
- MUST NOT access production data, credentials, or secret values. Source: `AGENT.md` -> Working Rules.
- MUST NOT bypass owning module services or create competing data paths. Source: `AGENT.md` -> Working Rules.
- MUST NOT change Compose or environment isolation. Source: `AGENT.md` -> Architecture and Working Rules.

## 3. Authoritative sources and their precedence

1. `AGENT.md` @ `a8d6bbd` - architecture, working rules, validation, documentation ownership.
2. `docs/DESIGN.md` @ `543efb6` - architecture and module boundaries.
3. `openspec/specs/` @ `6163fc9` - accepted behavior.
4. `apps/api/src/modules/` @ `543efb6` - owning module code.
5. `packages/contracts/` @ `543efb6` - shared API/web schemas.

When sources conflict, higher-precedence wins; record the conflict in the completion report.

## 4. Step-by-step workflow

1. Read or create the OpenSpec change; exit with acceptance criteria and affected capability.
2. Map the request to the owning API module and web workflow; exit with changed path list.
3. Read current controller, service, repository, contracts, and UI entry points; exit with implementation notes.
4. Update shared contracts only when both API and web consume the schema; exit with contract build passing or blocked.
5. Implement API module changes through controller -> service -> repository; exit with tests identified.
6. If Prisma schema changes, PAUSE at Gate: Schema changes before creating or applying a migration.
7. Implement web changes using relative `/api` calls; exit with reachable workflow.
8. Write or update focused tests; exit with tests named.
9. PAUSE at Gate: Code review.
10. Run validation commands and record each result honestly.
11. Update docs and vault evidence for changed behavior.
12. Write the completion report.

## 5. Project boundaries and prohibited actions

- MUST NOT put feature logic outside the owning module service/repository boundary. Source: `AGENT.md` -> Working Rules.
- MUST NOT add shared contracts unless both API and web consume them. Source: `AGENT.md` -> Architecture.
- MUST NOT use absolute browser API URLs; web calls stay relative to `/api`. Source: `AGENT.md` -> Working Rules.
- MUST NOT expose API or PostgreSQL ports directly in production. Source: `AGENT.md` -> Architecture and Working Rules.
- MUST NOT hard-delete products that can appear in historical orders. Source: `AGENT.md` -> Working Rules.
- MUST NOT skip docs, OpenSpec, or vault evidence updates when behavior, architecture, CI, deployment, or AI-use traceability changes. Source: `AGENT.md` -> Working Rules and Documentation Ownership.

## 6. Documentation and OpenSpec requirements

- OpenSpec must be consulted for accepted behavior, and a change must exist or be created when accepted behavior changes.
- Docs that may need updating: `docs/DESIGN.md`, `openspec/specs/`, `docs/obsidian-vault/`.
- Evidence: write `.project-skills/reports/cart-feature-slice/<run-id>.md`.
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
In restricted Windows sandboxes, record helper-process `spawn EPERM` as blocked and rerun in an approved context before claiming pass/fail.

## 8. Approval gates

### Gate: Schema changes
**Trigger:** `apps/api/prisma/schema.prisma` or migrations change.
**Approver:** data-reviewer or project owner.
**On approval:** proceed with migration generation or review.
**On rejection:** stop, record the reason, and do not proceed.

### Gate: Security changes
**Trigger:** auth, RBAC, token, permission, or public-interface security behavior changes.
**Approver:** security-reviewer or project owner.
**On approval:** proceed to implementation or validation.
**On rejection:** stop, record the reason, and do not proceed.

### Gate: Code review
**Trigger:** code changes and tests are complete.
**Approver:** project owner.
**On approval:** proceed to validation and documentation.
**On rejection:** stop, record the reason, and do not proceed.

## 9. Completion criteria

- [ ] All workflow steps executed or explicitly skipped with a reason.
- [ ] All approval gates passed, or the run stopped at a gate.
- [ ] All validation commands run and their results recorded honestly.
- [ ] Documentation updates done or explicitly deferred with a reason.
- [ ] OpenSpec change referenced or created when behavior changed.
- [ ] Completion report written to `.project-skills/reports/cart-feature-slice/<run-id>.md`.

## 10. Links to generated references and examples

- `references/architecture.md` - compact snapshot of architecture sources.
- `references/validation.md` - validation commands and expected outputs.
- `references/documentation-map.md` - which docs own which domains.
- `templates/change-brief.md` - per-run change brief.
- `templates/completion-report.md` - per-run completion report.
