---
generated_at: 2026-08-06T12:30:00Z
generated_by: project-skill-revise
run_trigger: "add this change to the current project skills: @cart\\openspec\\changes\\add-product-reviews"
---

# Stale Skills — cart-feature-slice

## Summary

- Skills checked: 1 (cart-feature-slice)
- Stale skills detected: 1
- Sources stale: 3 out of 5
- Completion reports available: 0 (reports directory does not exist — no guided runs since install)
- Cross-referenced with `.project-knowledge/stale-report.md`: no compound drift (stale-report was empty)

## Stale skills

| Skill ID | Version | Category | Stale source | Recorded revision | Current revision | Commit | Risk | Suggested action |
|---|---|---|---|---|---|---|---|---|
| cart-feature-slice | 1.0.0 | feature | docs/DESIGN.md | a8d6bbd | 543efb6 | feat(reviews): implement add-product-reviews OpenSpec change | low | bump revision in metadata.yaml |
| cart-feature-slice | 1.0.0 | feature | apps/api/src/modules | 6163fc9 | 543efb6 | feat(reviews): implement add-product-reviews OpenSpec change | low | bump revision in metadata.yaml |
| cart-feature-slice | 1.0.0 | feature | packages/contracts | 08ad0bb | 543efb6 | feat(reviews): implement add-product-reviews OpenSpec change | low | bump revision in metadata.yaml |

## Drift analysis

All three stale sources changed in a single commit (`543efb6`) implementing the `add-product-reviews` OpenSpec change:

- **docs/DESIGN.md** (+2/-1): Added `reviews` to the module listing in architecture section; added commerce decision row for "Reviews as standalone module."
- **apps/api/src/modules** (+363 lines, 7 new files): Added full `reviews/` domain module (controller, service, repository, module, types, integration tests).
- **packages/contracts** (+33 lines, 2 files): Added `src/reviews.ts` with Zod schemas and TypeScript types; exported from `package.json`.

## Impact on skill procedure

The `add-product-reviews` change followed the skill's existing 12-step workflow exactly (contracts → module → tests → docs → validation). No procedural change is needed. The skill boundaries (§5), gates (§8), and documentation requirements (§6) all remain valid. Only source revision hashes need updating.

## Suggested actions cheat sheet

- **revision-bump**: Update `metadata.yaml` source revisions to current hashes; bump `last_reviewed`. No procedure change required.
- **review-required**: Even a revision-bump routes through `review` → `install` per guardrail §10 (approval gates are never advisory) and schema §6 (source-revision tracking).

## Reconciliation log

_(Append resolved rows here. One row per resolved revision.)_
