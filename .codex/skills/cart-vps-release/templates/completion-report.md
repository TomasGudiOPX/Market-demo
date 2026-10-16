# Completion report template
---
skill_id: <skill-id>
skill_version: <version>
run_id: YYYY-MM-DD-<short-slug>-NN
generated_at: YYYY-MM-DDTHH:MM:SSZ
task: <one-sentence task description>
scope:
  modules: []
  contracts: []
  docs: []
status: succeeded
approval_gates: []
checks:
  - command: "<command>"
    status: requested
changed_artifacts: []
openspec_change: <slug-or-na>
knowledge_candidates: []
known_gaps: []
consumed_by_proj_auto_learn: false
---

## Skill run

- **Skill/version:** `<skill-id>` `<version>`
- **Request:** <task as given>
- **Checks requested and actually run:** record `requested | run | passed | failed | blocked` only.
