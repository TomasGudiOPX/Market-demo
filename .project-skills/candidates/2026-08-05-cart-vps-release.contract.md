## Contract for cart-vps-release

- **Outcome:** Prepare or perform an approved cart VPS release to a named isolated environment with health verification and rollback.
- **Category:** vps-release
- **Trigger phrases:** deploy to staging; deploy to production; prepare a release; roll out; rollback
- **Non-trigger:** local-only feature work; docs-only updates; schema design before deployment approval
- **Inputs:** target environment; branch; commit; env file; Compose project name; rollback revision
- **Non-goals:** source-linked in `.codex/skills/cart-vps-release/SKILL.md` section 2
- **Authoritative sources:** `AGENT.md`; `docs/VPS-DOC.md`; `docs/ENVIRONMENTS.md`; `docker-compose.yml`
- **Affected modules:** `docker-compose.yml`; `nginx/default.conf`
- **Approval gates:** pre-deploy review; production deployment
- **Risk level:** high
- **Validation commands:** copied from `AGENT.md` Validation
