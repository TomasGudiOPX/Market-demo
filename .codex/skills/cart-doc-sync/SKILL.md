# cart-doc-sync - Reconcile cart documentation and vault evidence after accepted project changes without changing code.

## 1. Purpose and trigger conditions

Use this project-local skill to reconcile cart documentation and vault evidence after accepted project changes without changing code.

Use when the user says: `sync docs`, `reconcile documentation`, `update docs after a change`, `documentation drift`.
Do NOT trigger when: the request is code implementation, migration changes, deployments, or `.project-knowledge` fact promotion.

## 2. Expected inputs and explicit non-goals

**Inputs:**
- Accepted change slug, commit, diff, or changed-path list.
- Docs or vault paths suspected to be stale.
- OpenSpec capability names involved in the change.
- `.project-knowledge` recommendation or report when docs audit produced the task.

**Non-goals:**
- MUST NOT change code. Source: `AGENT.md` -> Documentation Ownership.
- MUST NOT change behavior, migrations, config, Compose, or deployment state. Source: `AGENT.md` -> Working Rules.
- MUST NOT change accepted OpenSpec behavior without the OpenSpec workflow. Source: `AGENT.md` -> Documentation Ownership.
- MUST NOT create, promote, supersede, or reject `.project-knowledge` facts directly. Source: `.project-knowledge/accepted/`.

## 3. Authoritative sources and their precedence

1. `AGENT.md` @ `a8d6bbd` - documentation ownership.
2. `docs/` @ `401f1be` - project documentation set.
3. `openspec/specs/` @ `6163fc9` - accepted behavior.
4. `docs/obsidian-vault/` @ `401f1be` - evidence and decisions.
5. `.project-knowledge/accepted/` @ `working-tree-2026-08-05` - reviewed accepted facts.

When sources conflict, higher-precedence wins; record the conflict in the completion report.

## 4. Step-by-step workflow

1. Read the accepted change or changed-path list; exit with paths and behavior/doc impact.
2. Map each path to the doc owner using `AGENT.md`; exit with doc update list.
3. Read each target doc and relevant OpenSpec spec; exit with drift notes.
4. Draft minimal doc edits that cite changed code or accepted facts; exit with edit plan.
5. Do not create or promote `.project-knowledge` facts; exit with candidate notes only if needed.
6. If a vault ADR is invalidated, draft a superseding note; exit with ADR action.
7. PAUSE at Gate: Documentation review.
8. Apply approved doc updates only.
9. Run doc consistency checks and record results honestly.
10. Write the completion report.

## 5. Project boundaries and prohibited actions

- MUST NOT edit source code, migrations, Compose, or environment files. Source: `AGENT.md` -> Documentation Ownership.
- MUST NOT rewrite unrelated docs outside the mapped owner paths. Source: `AGENT.md` -> Documentation Ownership.
- MUST NOT use inferred behavior as accepted fact; cite source paths or record a candidate. Source: `.project-knowledge/accepted/`.
- MUST NOT silently resolve contradictions from `.project-knowledge/recommendations/`; route those through reconcile. Source: `.project-knowledge/recommendations/2026-08-05-proactive-002.md`.

## 6. Documentation and OpenSpec requirements

- OpenSpec specs are read-only unless an OpenSpec change workflow is explicitly invoked.
- Docs that may need updating: `README.md`, `docs/DESIGN.md`, `docs/DEVELOPMENT.md`, `docs/VPS-DOC.md`, `docs/ENVIRONMENTS.md`, `docs/obsidian-vault/`.
- Evidence: write `.project-skills/reports/cart-doc-sync/<run-id>.md`.
- Completion reports may emit `.project-knowledge` candidates, but this skill does not promote facts directly.

## 7. Validation commands and honest reporting rules

No code validation commands are required for documentation-only runs. Record document checks as `requested | run | passed | failed | blocked`, including source-path citation checks, OpenSpec consistency checks, and vault-link checks.

## 8. Approval gates

### Gate: Documentation review
**Trigger:** doc edits are drafted and mapped to owners.
**Approver:** documentation owner or project owner.
**On approval:** apply the doc edits.
**On rejection:** stop, record the reason, and do not apply the doc edits.

## 9. Completion criteria

- [ ] All workflow steps executed or explicitly skipped with a reason.
- [ ] All approval gates passed, or the run stopped at a gate.
- [ ] All validation commands or document checks run and their results recorded honestly.
- [ ] Documentation updates done or explicitly deferred with a reason.
- [ ] OpenSpec change referenced when behavior changed.
- [ ] Completion report written to `.project-skills/reports/cart-doc-sync/<run-id>.md`.

## 10. Links to generated references and examples

- `references/architecture.md` - compact snapshot of architecture sources.
- `references/validation.md` - validation commands and expected outputs.
- `references/documentation-map.md` - which docs own which domains.
- `templates/change-brief.md` - per-run change brief.
- `templates/completion-report.md` - per-run completion report.
