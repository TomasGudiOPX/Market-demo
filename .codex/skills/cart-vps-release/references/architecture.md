---
source_path: AGENT.md
source_revision: a8d6bbd
snapshot_date: 2026-08-05
---

# Architecture Snapshot

- `docker-compose.yml` is the deployment boundary.
- Only `proxy` publishes a host port.
- Nginx routes `/` to the frontend, `/api/` to the API, and `/health` to the API health check.
- Staging and production stay isolated by checkout/worktree, env file, Compose project name, credentials, volume, port, domain, and release record.
