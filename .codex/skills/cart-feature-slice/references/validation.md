---
source_path: AGENT.md
source_revision: a8d6bbd
snapshot_date: 2026-08-05
---

# Validation Snapshot

Commands copied from `AGENT.md` -> Validation:

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

Restricted Windows sandboxes may fail Yarn, Vite, Vitest, or Prisma with helper-process `spawn EPERM`; rerun the same command in an approved context before recording verification.
