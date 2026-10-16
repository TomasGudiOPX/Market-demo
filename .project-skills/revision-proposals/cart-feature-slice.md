---
skill_id: cart-feature-slice
current_version: 1.0.0
proposed_version: 1.0.1
proposed_at: 2026-08-06T12:30:00Z
proposed_by: project-skill-revise
evidence:
  - type: source-drift
    source: docs/DESIGN.md
    recorded: a8d6bbd
    current: 543efb6
    commit: feat(reviews): implement add-product-reviews OpenSpec change
  - type: source-drift
    source: apps/api/src/modules
    recorded: 6163fc9
    current: 543efb6
    commit: feat(reviews): implement add-product-reviews OpenSpec change
  - type: source-drift
    source: packages/contracts
    recorded: 08ad0bb
    current: 543efb6
    commit: feat(reviews): implement add-product-reviews OpenSpec change
  - type: completion-reports
    count: 0
    note: No guided runs completed since last_reviewed (2026-08-05). No learning patterns to aggregate.
---

# Revision Proposal — cart-feature-slice

## What changed

Three of five authoritative sources drifted forward in commit `543efb6` (`feat(reviews): implement add-product-reviews OpenSpec change`):

1. **docs/DESIGN.md** — `a8d6bbd` → `543efb6`
   - Added `reviews` to the `src/modules/` line in the architecture section.
   - Added commerce decision: "Reviews as standalone module — Keeps customer feedback separate from catalog ownership."
   - Diff: +2/-1, trivial content addition. No architectural redesign.

2. **apps/api/src/modules** — `6163fc9` → `543efb6`
   - New `reviews/` module added alongside existing `auth/`, `products/`, `cart/`, `orders/`.
   - Controller, service, repository, module, types, integration tests — standard NestJS module shape.
   - +363 lines across 7 new files. No changes to existing modules.

3. **packages/contracts** — `08ad0bb` → `543efb6`
   - New `src/reviews.ts` with Zod schemas (`reviewSchema`, `reviewMutationSchema`, `reviewListResponseSchema`, `reviewResponseSchema`) and TypeScript types.
   - Exported from `package.json` as `@vps-template/contracts/reviews`.
   - +33 lines across 2 files. No changes to existing contracts.

No completion reports exist — no guided runs have been completed since the skill was installed on 2026-08-05. No learning patterns to aggregate from runs.

## Proposed updates

### metadata.yaml — source revision bumps only

```diff
-   - path: docs/DESIGN.md
-     revision: a8d6bbd
+   - path: docs/DESIGN.md
+     revision: 543efb6
      locator: architecture and module boundaries
-   - path: apps/api/src/modules
-     revision: 6163fc9
+   - path: apps/api/src/modules
+     revision: 543efb6
      locator: owning module code
-   - path: packages/contracts
-     revision: 08ad0bb
+   - path: packages/contracts
+     revision: 543efb6
      locator: shared schemas
```

```diff
- version: 1.0.0
+ version: 1.0.1
```

```diff
- last_reviewed: 2026-08-05
+ last_reviewed: 2026-08-06
```

### SKILL.md §3 — revision hash updates only

```diff
- 1. `AGENT.md` @ `a8d6bbd` - architecture, working rules, validation, documentation ownership.
- 2. `docs/DESIGN.md` @ `a8d6bbd` - architecture and module boundaries.
- 3. `openspec/specs/` @ `6163fc9` - accepted behavior.
- 4. `apps/api/src/modules/` @ `6163fc9` - owning module code.
- 5. `packages/contracts/` @ `08ad0bb` - shared API/web schemas.
+ 1. `AGENT.md` @ `a8d6bbd` - architecture, working rules, validation, documentation ownership.
+ 2. `docs/DESIGN.md` @ `543efb6` - architecture and module boundaries.
+ 3. `openspec/specs/` @ `6163fc9` - accepted behavior.
+ 4. `apps/api/src/modules/` @ `543efb6` - owning module code.
+ 5. `packages/contracts/` @ `543efb6` - shared API/web schemas.
```

### SKILL.md — no procedural changes

All remaining sections (§1, §2, §4, §5, §6, §7, §8, §9, §10) are unchanged. The skill's 12-step workflow, boundaries, gates, and validation commands remain valid against the current source revisions.

### index.yaml — replicate revision bumps

```diff
  sources_revision_summary:
    ...
-   - path: docs/DESIGN.md
-     revision: a8d6bbd
+   - path: docs/DESIGN.md
+     revision: 543efb6
-   - path: apps/api/src/modules
-     revision: 6163fc9
+   - path: apps/api/src/modules
+     revision: 543efb6
-   - path: packages/contracts
-     revision: 08ad0bb
+   - path: packages/contracts
+     revision: 543efb6
```

## Evidence

- **Source drift**: 3/5 sources stale (confirmed by `git log -1 --format=%h` against each path).
- **Commit**: `543efb6` — `feat(reviews): implement add-product-reviews OpenSpec change`.
- **OpenSpec change**: `cart/openspec/changes/add-product-reviews/` (fully completed, all 28 tasks checked off).
- **Completion reports**: 0 — no guided runs since installation (reports directory does not exist).
- **Cross-reference**: `.project-knowledge/stale-report.md` is empty — no compound drift.

## Risk assessment

- **Current**: `medium`
- **Proposed**: `medium` (unchanged)
- **Reasoning**: The change is purely additive (new `reviews` module alongside existing modules). No existing module code was modified. No new gates or boundaries needed. The skill's procedure, boundaries, and approval gates all remain valid. Risk level stays at `medium` because new feature implementation inherently carries medium risk per the category-feature template defaults.

## Recommended route

`project-skill-review` → `project-skill-install` (on approval)

PATCH version bump to 1.0.1: source revision hashes only; no procedural content change.
