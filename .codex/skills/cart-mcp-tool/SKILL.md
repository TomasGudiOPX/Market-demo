# cart-mcp-tool - Add a safe cart MCP capability that exposes one narrow authenticated module-service action.

## 1. Purpose and trigger conditions

Use this project-local skill to add a safe cart MCP capability that exposes one narrow authenticated module-service action.

Use when the user says: `add an MCP tool`, `add an MCP capability`, `expose application data to an agent`.
Do NOT trigger when: the request is generic database browsing, direct SQL, filesystem/network tooling, deployment tooling, or a non-MCP API feature.

## 2. Expected inputs and explicit non-goals

**Inputs:**
- Client action name and read/write classification.
- Owning module service under `apps/api/src/modules/`.
- Narrow input schema and bounded output policy.
- OpenSpec change slug when behavior changes.

**Non-goals:**
- MUST NOT provide generic database tools such as select-any-table or execute-SQL. Source: `openspec/specs/telegram-db-bridge/spec.md`.
- MUST NOT query the database directly from MCP. Source: `AGENT.md` -> Working Rules.
- MUST NOT expose secrets, env values, or token values. Source: `AGENT.md` -> Working Rules.
- MUST NOT deploy, restart services, or modify Compose. Source: `AGENT.md` -> Architecture.

## 3. Authoritative sources and their precedence

1. `AGENT.md` @ `a8d6bbd` - architecture and working rules.
2. `docs/DESIGN.md` @ `a8d6bbd` - source boundaries.
3. `openspec/specs/telegram-db-bridge/spec.md` @ `6163fc9` - accepted MCP bridge behavior.
4. `apps/api/src/engine/mcp/` @ `6163fc9` - MCP controller and module wiring.
5. `apps/api/src/modules/` @ `6163fc9` - module services.

When sources conflict, higher-precedence wins; record the conflict in the completion report.

## 4. Step-by-step workflow

1. Name the client action and module owner; exit with read/write classification.
2. PAUSE at Gate: MCP tool design review.
3. Read the owning module service and identify the public method to call; exit with method name.
4. Define a narrow Zod input schema and bounded sanitized output; exit with schema and limits.
5. Register the tool in `apps/api/src/engine/mcp/`; exit with service-call path, not database access.
6. Verify auth requires `MCP_API_TOKEN` and no token value is hardcoded; exit with auth path.
7. Add audit and sanitized failure handling; exit with redaction notes.
8. If the tool writes real data, PAUSE at Gate: MCP write-action approval.
9. Write handler and auth tests; exit with test names.
10. PAUSE at Gate: Code review.
11. Run validation commands and record each result honestly.
12. Update docs and OpenSpec if behavior changed.
13. Write the completion report.

## 5. Project boundaries and prohibited actions

- MUST NOT import Prisma or raw database clients in MCP handlers. Source: `AGENT.md` -> Working Rules.
- MUST NOT expose `/mcp` without token-controlled configuration. Source: `openspec/specs/telegram-db-bridge/spec.md`.
- MUST NOT return unbounded data to an agent. Source: `openspec/specs/telegram-db-bridge/spec.md`.
- MUST NOT log tokens or secret values. Source: `AGENT.md` -> Working Rules.

## 6. Documentation and OpenSpec requirements

- OpenSpec must be consulted when the MCP behavior changes.
- Docs that may need updating: `docs/DESIGN.md`, `docs/DEVELOPMENT.md`, `openspec/specs/telegram-db-bridge/spec.md`.
- Evidence: write `.project-skills/reports/cart-mcp-tool/<run-id>.md`.
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

### Gate: MCP tool design review
**Trigger:** tool name, client action, module owner, input schema, output bound, and auth scope are defined.
**Approver:** architecture-reviewer plus security-reviewer or project owner.
**On approval:** proceed to implementation.
**On rejection:** redesign or stop; record the reason.

### Gate: MCP write-action approval
**Trigger:** the MCP tool writes real data.
**Approver:** module owner reviewer or project owner.
**On approval:** proceed only within the approved write scope.
**On rejection:** keep the tool read-only or stop.

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
- [ ] Completion report written to `.project-skills/reports/cart-mcp-tool/<run-id>.md`.

## 10. Links to generated references and examples

- `references/architecture.md` - compact snapshot of architecture sources.
- `references/validation.md` - validation commands and expected outputs.
- `references/documentation-map.md` - which docs own which domains.
- `templates/change-brief.md` - per-run change brief.
- `templates/completion-report.md` - per-run completion report.
