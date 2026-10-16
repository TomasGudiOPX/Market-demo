## Purpose

Ads management lets administrators publish internal promotional placements while visitors only see active, eligible storefront ads.

## ADDED Requirements

### Requirement: Public ad placement listing
The system SHALL expose a public way to list ads for a storefront placement and SHALL return only ads that are active, within their optional schedule window, and eligible for that placement.

#### Scenario: Visitor lists eligible placement ads
- **GIVEN** active ads exist for the requested placement
- **AND** the ads are within their configured schedule window
- **WHEN** a visitor requests ads for that placement
- **THEN** the response includes those ads ordered by priority
- **AND** each ad includes id, title, image URL, placement, target, priority, and schedule metadata

#### Scenario: Visitor does not see inactive or out-of-window ads
- **GIVEN** inactive ads or ads outside their configured schedule window exist
- **WHEN** a visitor requests ads for their placement
- **THEN** the response excludes those ads

### Requirement: Administrator ad creation
The system SHALL allow only administrators to create ads with valid content, placement, target, priority, and optional schedule fields.

#### Scenario: Admin creates a product-linked ad
- **GIVEN** an authenticated administrator submits valid ad data linked to an active product
- **WHEN** the create request is processed
- **THEN** the system stores an active ad
- **AND** the response includes the created ad

#### Scenario: Customer attempts ad creation
- **GIVEN** an authenticated customer submits ad data
- **WHEN** the create request is processed
- **THEN** the response is forbidden with the stable RBAC error code

### Requirement: Administrator ad update
The system SHALL allow only administrators to update ad content, placement, target, priority, active state, and schedule fields.

#### Scenario: Admin updates an ad
- **GIVEN** an existing ad
- **AND** an authenticated administrator submits valid updates
- **WHEN** the update request is processed
- **THEN** the ad reflects the submitted changes

#### Scenario: Invalid ad update
- **GIVEN** an authenticated administrator submits invalid ad data
- **WHEN** the update request is processed
- **THEN** the response uses `VALIDATION_ERROR`
- **AND** includes field-level validation details

### Requirement: Administrator ad retirement
The system SHALL allow only administrators to retire ads without hard deletion.

#### Scenario: Admin retires an ad
- **GIVEN** an active ad exists
- **WHEN** an authenticated administrator retires the ad
- **THEN** the ad remains stored
- **AND** it no longer appears in public placement results

### Requirement: Storefront ad rendering
The storefront SHALL render public ads in supported placement slots without blocking catalog, product detail, cart, checkout, or order flows when ads are unavailable.

#### Scenario: Placement has ads
- **GIVEN** the storefront loads a view with a supported ad placement
- **AND** the public ad response includes eligible ads
- **WHEN** the view renders
- **THEN** the ads are displayed in the placement slot

#### Scenario: Placement has no ads
- **GIVEN** the storefront loads a view with a supported ad placement
- **AND** the public ad response is empty or unavailable
- **WHEN** the view renders
- **THEN** the primary storefront flow remains usable
- **AND** no empty ad error state blocks the user

### Requirement: Deterministic seed ads
The system SHALL provide deterministic seed ads for local demo and evaluation.

#### Scenario: Seed runs with an empty ads table
- **GIVEN** the database has no ads
- **WHEN** the seed runs
- **THEN** demo ads exist for supported storefront placements
- **AND** the seeded ads have deterministic titles, targets, image URLs, priorities, and active state
