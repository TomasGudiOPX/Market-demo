# Proposal

## Why

The cart MCP endpoint (`/mcp`) authenticates every request with one shared bearer token that carries no identity, no scopes, and no audit trail, and it exposes only three read-only product tools. Enabling agent writes on that model would turn a token that has already circulated in plaintext into full catalog administration, with no record of which client changed what. The project's own development guide sets the bar before the first MCP write tool ("scoped credentials, audit log, and policy test"), and the catalog MCP surface has no OpenSpec capability today, so its behavior is neither documented nor testable.

## What Changes

- **Scoped MCP clients.** Each MCP token maps to a named client with an explicit scope list (`<resource>:<action>`), an active flag, and a usage timestamp. Unknown, malformed, or inactive tokens are rejected. The legacy environment token (`MCP_API_TOKEN`) keeps working with read-only scopes so existing clients are unaffected.
- **Dual scope enforcement.** `tools/list` advertises only the tools the calling client can invoke, and `tools/call` independently denies any call whose required scope the client lacks.
- **First write tools**, each delegating to the existing module service used by the admin HTTP routes (never direct database access):
  - products (scope `products:write`): `create_product`, `update_product`, `retire_product`
  - ads (scope `ads:write`): `create_ad`, `update_ad`, `retire_ad`
  - ads read (scope `ads:read`): `list_ads`, so an agent can verify what it wrote
- **Logical retirement only.** Product retirement sets `isActive=false`; ad retirement sets the retirement timestamp. No hard deletion is exposed through MCP.
- **Audit records.** Every tool call is recorded with client, tool, required scope, outcome, target id, and idempotency key; secrets and token material are never logged. The same records make `create_product` idempotent per client and key, so an agent retry does not duplicate a product.
- **Still optional.** With no registered client and no environment token, the MCP endpoint stays unavailable. Write scopes are opt-in per client.

Non-goals: cart and checkout tools, OAuth-based third-party clients, the Telegram database bridge MCP surface, hard deletion, and admin UI for client management.

## Capabilities

### New Capabilities

- `mcp-catalog`: token-scoped MCP access for the commerce catalog surface — credential registry, scope grammar, dual enforcement, product and ad read/write tools with logical retirement, per-call audit records, and idempotent creation.

### Modified Capabilities

<!-- None: administrator product behavior over HTTP is unchanged, and the existing
     read-only tools keep their current behavior for read-scoped clients. -->

## Impact

- `apps/api/src/engine/mcp/`: principal resolution from the client registry, per-scope tool registration, audit wrapper, and the new tools; existing product and ad module services are reused unchanged.
- Data: two additive tables (`mcp_clients`, `mcp_tool_calls`) with one migration and no changes to existing tables.
- Documentation and operations: `docs/DEVELOPMENT.md` (MCP tool and permission rules) and `docs/VPS-DOC.md` (client registration, token rotation, disable, and audit inspection). Because the registry lives in the database, no new environment variable and no compose change are required.
- Tests: scope-resolution and policy matrix tests (token × tool), plus audit assertions and an end-to-end probe run.
- Not affected: storefront and admin web UI, nginx routing, cart/checkout behavior, and the Telegram database bridge, which remains read-only through its database role.
