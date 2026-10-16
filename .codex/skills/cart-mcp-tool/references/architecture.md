---
source_path: AGENT.md
source_revision: a8d6bbd
snapshot_date: 2026-08-05
---

# Architecture Snapshot

- Browser traffic enters through Nginx, which serves the Vite React frontend and routes `/api/` to the NestJS API.
- `apps/api/src/engine/mcp/` owns MCP integration wiring.
- MCP handlers call module services under `apps/api/src/modules/`; they do not query the database directly.
- `MCP_API_TOKEN` is an env-var name only; no token value belongs in skills, code, logs, or docs.
