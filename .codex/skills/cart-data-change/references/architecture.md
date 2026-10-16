---
source_path: AGENT.md
source_revision: a8d6bbd
snapshot_date: 2026-08-05
---

# Architecture Snapshot

- Browser traffic enters through Nginx, which serves the Vite React frontend and routes `/api/` to the NestJS API.
- `apps/web/` owns browser workflows.
- `apps/api/src/modules/` owns business modules: `auth`, `products`, `cart`, and `orders`.
- `packages/contracts/` contains only schemas and types shared by API and web.
- `apps/api/prisma/` owns Prisma schema, migrations, and deterministic seed.
- `docker-compose.yml` is the deployment boundary; only `proxy` publishes a host port.
