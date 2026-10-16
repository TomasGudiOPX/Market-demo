# Tasks

## 1. Client registry and audit storage

- [ ] 1.1 Add `McpClient` (name, token hash, scopes, active flag, last-used timestamp) and `McpToolCall` (client, tool, scope, outcome, target id, idempotency key, created at) to `apps/api/prisma/schema.prisma`; verify with `yarn workspace @vps-template/api prisma:generate` and a migration applied against a disposable Postgres.
- [ ] 1.2 Implement client resolution by token digest (indexed lookup, inactive rejected, scopes parsed and validated against the `resource:action` grammar) as a small service under `apps/api/src/engine/mcp/`; verify with unit tests for a registered client, an unknown digest, an inactive client, and a malformed scope list.
- [ ] 1.3 Implement the audit writer that records one row per tool call and marks the client as used; verify with a unit test asserting the persisted row fields for a success and for a denial.
- [ ] 1.4 Document client lifecycle operations in `docs/VPS-DOC.md` (insert a client, rotate a token, disable a client, inspect recent audit rows) and verify each documented SQL statement runs against the disposable database.

## 2. Principal resolution and scope enforcement

- [ ] 2.1 Implement `resolvePrincipal` that maps a presented bearer token to `{ name, scopes }` using the registry, and synthesizes a read-only principal for the environment token; verify with unit tests covering registered, legacy, unknown, and inactive cases.
- [ ] 2.2 Implement the tool-to-scope map plus `requireScope`, failing closed when the registry or the audit write is unavailable; verify with unit tests for granted, denied, and storage-failure paths.
- [ ] 2.3 Wire `mcp.controller.ts` so each request resolves a principal, registers only the tools its scopes allow, rejects unauthorized requests, and records every call through the audit writer; verify with controller tests that a read-scoped client never receives a write tool and that a hand-crafted out-of-scope call is denied and recorded.
- [ ] 2.4 Implement the per-client write budget held at module scope and verify with a test that exceeding the budget returns a bounded error without executing the tool.
- [ ] 2.5 Update the MCP section of `docs/DEVELOPMENT.md` with the client/scope/audit model and the environment-token read-only rule; verify the documented model matches the implemented scopes and error codes.

## 3. Product read tools on the scoped layer

- [ ] 3.1 Re-register `list_products`, `get_product`, and `search_products` under `products:read` with the annotations for read-only tools; verify with tests that responses keep today's shape for a read-scoped client.
- [ ] 3.2 Verify the filtered tool list by asserting that a `products:read` client sees exactly these three tools and no write or ad tool.
- [ ] 3.3 Document the tool inventory, required scopes, and error mapping in the project's MCP documentation and verify it lists every registered tool with its scope.

## 4. Product write tools

- [ ] 4.1 Implement `update_product` reusing `ProductService.update` and `updateProductSchema`; verify with tests for a successful update, an invalid payload, and an unknown product id.
- [ ] 4.2 Implement `retire_product` reusing `ProductService.retire`; verify with tests that the product stays stored, becomes inactive, and disappears from the public catalog listing.
- [ ] 4.3 Implement `create_product` reusing `ProductService.create` and `createProductSchema` with an idempotency key; verify with tests that a repeated key returns the first product without creating a second, and that distinct keys create two products.
- [ ] 4.4 Implement the write-tool annotations (`readOnlyHint=false`, `destructiveHint` on retire) and verify that a write-scoped client sees the write tools while a read-only client does not.
- [ ] 4.5 Document the product write tools, their scope, idempotency behavior, and logical-retirement rule in the project's MCP documentation; verify the documented scopes match the tool-to-scope map.

## 5. Ad surface

Prerequisite: the in-flight `add-ads-module` change is complete and its migration is applied.

- [ ] 5.1 Implement `list_ads` under `ads:read` reusing the public placement listing; verify with tests for a placement with ads and for an empty placement.
- [ ] 5.2 Implement `create_ad` and `update_ad` under `ads:write` reusing the ad service validation; verify with tests for creation, an update to placement, priority, or schedule, and an invalid payload.
- [ ] 5.3 Implement `retire_ad` under `ads:write`; verify with a test that the ad record is preserved, marked retired, and excluded from public placement listings.
- [ ] 5.4 Document the ad tools and their scopes alongside the product tools and verify the inventory lists every ad tool.

## 6. Integration verification

- [ ] 6.1 Run the full policy matrix against a disposable local stack (legacy token, read-only client, product-write client, ad-write client, inactive client, no token) and record the observed outcome per token and tool.
- [ ] 6.2 Inspect `mcp_tool_calls` after the matrix run and verify one record per call with no token or secret material present.
- [ ] 6.3 Run the repository validation commands (`yarn lint`, contracts build, prisma generate, api build, api test, web build, `yarn build`, `docker compose --env-file .env.example config`) and record each result honestly.
- [ ] 6.4 Deploy to staging with the environment token only, insert one write-scoped client, and verify an end-to-end write plus its audit record before enabling that client in production.

## Workflow follow-up

- Stop at the project gates before implementation: `MCP tool design review` and, for the write tools, `MCP write-action approval` from `.codex/skills/cart-mcp-tool`.
- Archive this change after the project's review requirements are satisfied, then sync the `mcp-catalog` capability into the main specs.
- Rotate the environment token once every client uses a registered credential, then remove the read-only fallback in a follow-up change.
