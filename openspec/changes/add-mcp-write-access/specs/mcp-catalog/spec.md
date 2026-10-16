# Spec Delta

## Purpose

Exposes the commerce catalog to MCP clients under per-client scoped credentials, with read-only access by default, audited tool calls, and a gated write surface limited to logical product and ad administration.

## ADDED Requirements

### Requirement: Registered MCP clients

The MCP endpoint SHALL authenticate every request with a bearer token that resolves to a registered, active client. The client registry SHALL store only a cryptographic hash of each client token together with the client name and scope list; token values MUST NOT be stored or returned.

#### Scenario: Registered active client

- **WHEN** a client presents the token of a registered and active client
- **THEN** the request is processed and attributed to that client name

#### Scenario: Unknown token

- **WHEN** a client presents a token that matches no registration
- **THEN** the endpoint responds unauthorized and performs no tool work

#### Scenario: Inactive client

- **WHEN** a client presents the token of a client marked inactive
- **THEN** the endpoint responds unauthorized

#### Scenario: No plaintext token at rest

- **WHEN** the client registry is inspected
- **THEN** it contains no readable token values, only hashes

### Requirement: Environment token stays read-only

When the environment token is configured, requests carrying it SHALL be accepted with catalog read scopes only. The environment token MUST NOT grant write scopes.

#### Scenario: Environment token reads the catalog

- **WHEN** a request uses the environment token to call a catalog read tool
- **THEN** the tool executes

#### Scenario: Environment token cannot write

- **WHEN** a request uses the environment token to call a write tool
- **THEN** the call is denied and no data changes

#### Scenario: Endpoint unavailable by default

- **WHEN** no client is registered and no environment token is configured
- **THEN** the endpoint rejects every request

### Requirement: Scope grammar and per-tool mapping

Every MCP tool SHALL require exactly one scope written as `<resource>:<action>`, with resources limited to `products` and `ads` and actions limited to `read` and `write`. A client's scope list SHALL be the only source of that client's permissions.

#### Scenario: Read scope grants read tools

- **WHEN** a client holds `products:read`
- **THEN** it may call the product read tools

#### Scenario: Scope does not cross resources

- **WHEN** a client holds only `ads:read`
- **THEN** a call to a product read tool is denied

#### Scenario: Write requires the write scope

- **WHEN** a client holds `products:read` but not `products:write`
- **THEN** a product write call is denied

### Requirement: Tool list is filtered by client scopes

The endpoint SHALL advertise in `tools/list` only the tools whose required scope the calling client holds, so a read-only client never discovers write tools.

#### Scenario: Read-only client lists tools

- **WHEN** a client holding only read scopes lists tools
- **THEN** only the read tools it may call appear

#### Scenario: Write client lists tools

- **WHEN** a client holds a write scope
- **THEN** the matching write tools appear in addition to its read tools

#### Scenario: Client without scopes

- **WHEN** a registered client holds no scopes
- **THEN** the tool list is empty

### Requirement: Calls are authorized independently of the tool list

`tools/call` SHALL verify the required scope independently of `tools/list` and SHALL deny any call the calling client is not scoped for, returning a bounded error that changes no data.

#### Scenario: Direct call outside the client scopes

- **WHEN** a client calls a tool whose scope it does not hold
- **THEN** the response is a tool error and no data changes

#### Scenario: Denial is recorded

- **WHEN** such a call is denied
- **THEN** an audit record with the denial outcome exists for that client and tool

### Requirement: Catalog read tools

The endpoint SHALL expose `list_products` (optional category, maximum price, and active-only filters), `get_product` (one active product by id), and `search_products` (partial name match). Returned collections SHALL be bounded.

#### Scenario: Filtered product list

- **WHEN** a client lists products with a category and a maximum price
- **THEN** only matching active products are returned

#### Scenario: Partial name search

- **WHEN** a client searches for a partial product name
- **THEN** matching products are returned

#### Scenario: Unknown product

- **WHEN** a client requests an id that does not exist or is retired
- **THEN** the tool returns a bounded not-found error

### Requirement: Product write tools

Clients holding `products:write` SHALL be able to create, update, and retire products through tools that reuse the administrator product validation and service behavior. Retirement SHALL be logical: the product row is preserved with `isActive` false, and no tool removes a product record.

#### Scenario: Create product

- **WHEN** a write-scoped client submits valid product data
- **THEN** an active product is stored and the created product is returned

#### Scenario: Update product

- **WHEN** a write-scoped client submits valid changes for an existing product
- **THEN** the stored product reflects those changes

#### Scenario: Invalid product input

- **WHEN** a write-scoped client submits invalid product data
- **THEN** the call fails with a bounded validation error and no product changes

#### Scenario: Retire product

- **WHEN** a write-scoped client retires an existing product
- **THEN** the product remains stored, its active flag is false, and it no longer appears in public catalog results

### Requirement: Ad write tools

Clients holding `ads:write` SHALL be able to create, update, and retire ads through tools that reuse the storefront ad service and its validation. Retirement SHALL be logical, preserving the ad record.

#### Scenario: Create ad

- **WHEN** an ad-write client submits valid ad data
- **THEN** an active ad is stored and returned

#### Scenario: Update ad

- **WHEN** an ad-write client changes an ad's placement, priority, or schedule
- **THEN** the stored ad reflects the change

#### Scenario: Retire ad

- **WHEN** an ad-write client retires an ad
- **THEN** the ad record is preserved, marked retired, and excluded from public placement listings

### Requirement: Ad read tool

Clients holding `ads:read` SHALL be able to list the active storefront ads for a placement, receiving only the bounded public ad fields already served by the public listing.

#### Scenario: List ads for a placement

- **WHEN** an ad-read client lists ads for a placement
- **THEN** the active ads for that placement are returned with the public listing shape

#### Scenario: Placement without ads

- **WHEN** no active ad exists for the requested placement
- **THEN** the tool returns an empty list instead of an error

### Requirement: Idempotent product creation

`create_product` SHALL accept an idempotency key. When the same client repeats a create with a key that was already used, the endpoint SHALL return the product created by the first call and MUST NOT create another.

#### Scenario: Repeated key

- **WHEN** a client repeats a create with the same idempotency key
- **THEN** exactly one product exists for that request and the same product is returned

#### Scenario: Distinct keys

- **WHEN** a client creates two products with different keys and identical data
- **THEN** both products are created

### Requirement: Tool call audit records

Every tool call SHALL produce one audit record with the client name, tool name, required scope, outcome, affected entity id when applicable, idempotency key when provided, and a timestamp. Records MUST NOT contain token values or secret material.

#### Scenario: Successful call is recorded

- **WHEN** a scoped call succeeds
- **THEN** an audit record with the success outcome and the affected entity id exists

#### Scenario: Failed call is recorded

- **WHEN** a call fails validation or a tool returns an error
- **THEN** an audit record with the failure outcome exists

#### Scenario: No secrets in audit records

- **WHEN** audit records are inspected
- **THEN** no bearer token or secret value appears
