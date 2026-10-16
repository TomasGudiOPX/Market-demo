## Contract for cart-mcp-tool

- **Outcome:** Add a safe cart MCP capability that exposes one narrow authenticated module-service action.
- **Category:** mcp-tool
- **Trigger phrases:** add an MCP tool; add an MCP capability; expose application data to an agent
- **Non-trigger:** generic database browsing; direct SQL; filesystem/network tools; deployment tools; non-MCP API features
- **Inputs:** client action; module owner; input schema; output bound; OpenSpec change slug
- **Non-goals:** source-linked in `.codex/skills/cart-mcp-tool/SKILL.md` section 2
- **Authoritative sources:** `AGENT.md`; `docs/DESIGN.md`; `openspec/specs/telegram-db-bridge/spec.md`; `apps/api/src/engine/mcp/`; `apps/api/src/modules/`
- **Affected modules:** `apps/api/src/engine/mcp/`; `apps/api/src/modules/`
- **Approval gates:** MCP tool design review; MCP write-action approval; code review
- **Risk level:** high
- **Validation commands:** copied from `AGENT.md` Validation
