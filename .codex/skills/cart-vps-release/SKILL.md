# cart-vps-release - Prepare or perform an approved cart VPS release to a named isolated environment with health verification and rollback.

## 1. Purpose and trigger conditions

Use this project-local skill to prepare or perform an approved cart VPS release to a named isolated environment with health verification and rollback.

Use when the user says: `deploy to staging`, `deploy to production`, `prepare a release`, `roll out`, `rollback`.
Do NOT trigger when: the task is local-only feature work, docs-only updates, or schema design before deployment approval.

## 2. Expected inputs and explicit non-goals

**Inputs:**
- Target environment: staging or production.
- Release branch and commit hash.
- Environment file name and Compose project name.
- Rollback revision and health-check route.

**Non-goals:**
- MUST NOT release without staging verification. Source: `docs/ENVIRONMENTS.md`.
- MUST NOT release without a documented rollback revision. Source: `docs/ENVIRONMENTS.md`.
- MUST NOT expose internal API or PostgreSQL ports. Source: `AGENT.md` -> Architecture.
- MUST NOT mix staging and production credentials or data. Source: `AGENT.md` -> Working Rules.

## 3. Authoritative sources and their precedence

1. `AGENT.md` @ `a8d6bbd` - architecture and validation.
2. `docs/VPS-DOC.md` @ `401f1be` - deployment, ports, backups, recovery.
3. `docs/ENVIRONMENTS.md` @ `401f1be` - environment isolation and rollback.
4. `docker-compose.yml` @ `7389013` - deployment topology.

When sources conflict, higher-precedence wins; record the conflict in the completion report.

## 4. Step-by-step workflow

1. Identify target environment, branch, env file, Compose project name, and health route; exit with release target.
2. Verify release branch contains intended changes; exit with commit hash.
3. Run config/build validation for the target context and record results.
4. Confirm backup routine and rollback revision; exit with rollback commit.
5. PAUSE at Gate: Pre-deploy review.
6. Deploy only after approval using the documented VPS procedure; exit with deployment timestamp.
7. Run health verification through the public proxy `/health`; exit with status.
8. If health fails, execute documented rollback and record result.
9. PAUSE at Gate: Production deployment when target is production.
10. Update release evidence in docs or vault.
11. Write the completion report.

## 5. Project boundaries and prohibited actions

- MUST NOT expose services other than the proxy through host ports. Source: `AGENT.md` -> Architecture.
- MUST NOT use Docker profiles as environment isolation. Source: `docs/ENVIRONMENTS.md`.
- MUST NOT deploy production from a staging checkout or env file. Source: `docs/ENVIRONMENTS.md`.
- MUST NOT continue after failed health verification without rollback or explicit owner instruction. Source: `docs/VPS-DOC.md`.

## 6. Documentation and OpenSpec requirements

- OpenSpec deployment-environment requirements must be consulted when release topology changes.
- Docs that may need updating: `docs/VPS-DOC.md`, `docs/ENVIRONMENTS.md`, `docs/obsidian-vault/`.
- Evidence: write `.project-skills/reports/cart-vps-release/<run-id>.md`.
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

### Gate: Pre-deploy review
**Trigger:** release target, validations, rollback revision, and backup status are known.
**Approver:** operations-reviewer or project owner.
**On approval:** proceed to deployment.
**On rejection:** stop, record the reason, and do not deploy.

### Gate: Production deployment
**Trigger:** target environment is production.
**Approver:** operations-reviewer plus project owner.
**On approval:** proceed to production deployment.
**On rejection:** stop, record the reason, and do not deploy to production.

## 9. Completion criteria

- [ ] All workflow steps executed or explicitly skipped with a reason.
- [ ] All approval gates passed, or the run stopped at a gate.
- [ ] All validation commands run and their results recorded honestly.
- [ ] Documentation updates done or explicitly deferred with a reason.
- [ ] OpenSpec change referenced or created when behavior changed.
- [ ] Completion report written to `.project-skills/reports/cart-vps-release/<run-id>.md`.

## 10. Links to generated references and examples

- `references/architecture.md` - compact snapshot of architecture sources.
- `references/validation.md` - validation commands and expected outputs.
- `references/documentation-map.md` - which docs own which domains.
- `templates/change-brief.md` - per-run change brief.
- `templates/completion-report.md` - per-run completion report.
