# Design

## Context

`apps/api/src/engine/mcp/mcp.controller.ts` builds one `McpServer` per request and registers three product read tools inline. Authentication is a single bearer token from `MCP_API_TOKEN`, compared with a constant-time equality check in `mcp-auth.ts`; there is no principal, no per-client scope, no audit persistence, and no OpenSpec capability describing this surface. Rate limiting is global and per-IP through the throttler guard. Writes already exist as module services used by the administrator HTTP routes (`ProductService.create/update/retire`, ad service create/update/retire) with shared Zod contracts, and project rules forbid database access from MCP handlers. See `proposal.md` for motivation and `specs/mcp-catalog/spec.md` for the required behavior.

Constraints that shape this design:

- The MCP is optional: a blank token keeps the endpoint unavailable.
- The server is re-created per request, so any per-client state must be resolved per request or held at module scope.
- `docs/DEVELOPMENT.md` requires scoped credentials, an audit log, and a policy test before the first write tool.

## Goals / Non-Goals

**Goals:**

- Identify the calling client and enforce least privilege per tool.
- Make every tool call auditable, including denials.
- Add the write surface without duplicating validation or business rules.
- Keep today's read-only clients working unchanged.
- Make the access policy testable as a token-by-tool matrix.

**Non-Goals:**

- User-level identity or delegated authorization (the MCP client is the principal).
- Cart or checkout tools, which need shopper identity and idempotent order semantics.
- Managing clients from the admin UI or an admin API; registration is an operations step.
- Changing the HTTP administrator routes or the Telegram database bridge.

## Decisions

### 1. Client registry in a table, not configuration

A `mcp_clients` table (name, token hash, scopes, active flag, last-used timestamp) replaces the single configured token as the source of identity.

- **Why:** the user chose a database registry; it allows rotating or disabling one client without restarting the API, keeps scopes queryable, and gives audit records a stable client name.
- **Alternatives:** environment JSON (no migration, but restarting to rotate and no `is_active`), mounted secret file (same rotation problem plus mount management on the VPS).

### 2. Deterministic lookup hash (sha256) instead of a password hash

The registry stores `sha256(token)` and resolves a request by an indexed equality lookup on that digest.

- **Why:** resolution requires finding the row for an unknown presented value, which rules out a per-row salted password hash. Tokens are machine-generated with high entropy, so a fast digest does not weaken them the way it would a human password.
- **Alternatives:** bcrypt/argon2 with a scan over all clients (O(n) comparisons on every request) — rejected for cost and complexity; a token id prefix plus a slow hash — extra protocol surface for no measured gain here.

### 3. Two enforcement points: filtered tool list and per-call check

`tools/list` registers only the tools whose scope the client holds, and `tools/call` independently re-checks the required scope.

- **Why:** the list is discovery and least-surprise; the call check is the security boundary. Filtering alone is bypassable by a hand-crafted call; checking alone leaks the write surface to read-only agents.
- **Consequence:** tool registration becomes a function of the resolved client rather than a fixed list, which fits the existing per-request `McpServer` construction.

### 4. Scope grammar `resource:action`, with roles as presets

Scopes are `products:read`, `products:write`, `ads:read`, `ads:write`. A "role" is only a preset list of scopes; there is no second authorization mechanism.

- **Why:** it covers the user's requirement to differ by area and by read/write while staying small enough to test exhaustively. The grammar extends to `resource:action:detail` later without breaking existing rows.
- **Alternatives:** role-only checks (too coarse: a catalog role would grant ads writes), per-operation scopes now (a larger matrix than the first cut needs).

### 5. Legacy environment token becomes a read-only principal

When `MCP_API_TOKEN` is set, the resolver synthesizes a client named for the environment token with read scopes only, without a registry row.

- **Why:** the current token has already circulated in plaintext; treating it as read-only preserves existing clients while ensuring the exposed value cannot mutate data. Seeding it as a registry row would risk someone later widening it.

### 6. Audit in a table, reused for idempotency

Every call writes one row in `mcp_tool_calls`: client name, tool, required scope, outcome, target id, idempotency key, timestamp. `create_product` accepts an idempotency key and, on a repeated key from the same client, returns the previously recorded result instead of creating a second product.

- **Why:** a table is queryable and directly assertable by the policy test, which the quality gate requires. Reusing it for idempotency avoids a second table for the same concern; a unique index on (client, tool, key) plus a re-read on conflict handles the retry race. Postgres treats null keys as distinct, so unkeyed calls are unaffected.
- **Alternatives:** structured logs (not queryable, no dedupe), a separate idempotency table (duplicate state, more schema).

### 7. Write tools delegate to existing services

Tools call `ProductService.create/update/retire`, the ad service equivalents, and the public ad listing; validation comes from the shared Zod contracts. No tool touches Prisma.

- **Why:** project rules require the MCP to reach the same service as the API route, and it keeps one source of truth for validation and for logical retirement.

### 8. Fail closed

If the registry lookup or the audit insert fails, the call is rejected.

- **Why:** the audit record is part of the policy the project requires; silently dropping it would make denials and mutations unverifiable. The cost is availability when the database is unavailable, accepted for this deployment.

### 9. Write throttling per client

Write tools get a small per-client budget held at module scope, in addition to the global per-IP limit.

- **Why:** the existing limiter is per IP and shared with the storefront; an agent loop creating products needs its own ceiling. A module-scope counter is enough for the single-instance deployment and is explicitly not cluster-wide.

## Risks / Trade-offs

- **Leaked write token** → distinct tokens per client, hashes at rest, `is_active` to disable without redeploy, an audit trail per call, and write scopes granted only where needed.
- **Agent retries duplicating products** → idempotency key with a unique index and re-read on conflict.
- **A new tool added without a scope** → a test that fails when a registered tool declares no scope, plus the call-time check.
- **Per-instance throttle is bypassable across replicas** → documented as a single-instance limitation; revisit if the API is scaled out.
- **Registry administration is manual** → rotate/disable via SQL is documented in the operations doc; an admin surface is deferred.
- **The ads module is still an in-flight change (`add-ads-module`, 22/24)** → order the work products-first and land the ad tools after that change is complete and archived.
- **Audit grows unbounded** → retention is out of scope for this change; the table is indexed on creation time so a retention job can be added later.

## Migration Plan

1. Add both tables in one additive migration; no existing table or column changes and no backfill (the registry starts empty).
2. Deploy with the environment token still set: read-only behavior is unchanged for every existing client.
3. Insert the first write-scoped client row, then verify with the policy matrix (token × tool) and inspect the audit rows.
4. Rollback: revert the API image; the two tables are inert for the previous version and can be dropped when convenient. No data written by the tools is lost by a rollback (products and ads remain as normal records).

## Open Questions

- Retention policy for audit records (row count or age) and whether it runs as a scheduled job.
- Whether `retire` eventually deserves its own scope separate from `write`, if approvals for removal become stricter than for edits.
- Client management surface (admin endpoint or UI) and token expiry fields; both can be added without changing the specs.
- Concrete write budget per client; start with a conservative default and tune with real agent usage.
