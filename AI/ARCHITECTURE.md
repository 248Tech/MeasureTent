# ARCHITECTURE.md
**Agent:** Claude (Planner)
**Date:** 2026-03-24

---

## 1. System Layers

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│   React Frontend   │   SDK (embeddable)   │   External API  │
└────────────────────┴──────────────────────┴─────────────────┘
                              │
                     ┌────────▼────────┐
                     │   API LAYER     │
                     │  Fastify + Zod  │
                     │  JWT Middleware │
                     │  /v1/* routes   │
                     └────────┬────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
    ┌────────▼──────┐ ┌───────▼──────┐ ┌──────▼──────┐
    │  CORE ENGINE  │ │  AUTH MODULE │ │  PROJECT DB │
    │  (pure TS)    │ │  JWT+bcrypt  │ │  Prisma ORM │
    │  No deps      │ └──────────────┘ └─────────────┘
    └────────┬──────┘
             │
    ┌────────▼──────┐
    │  CONFIG LAYER │
    │  JSON → DB    │
    │  Overridable  │
    └───────────────┘
             │
    ┌────────▼──────┐
    │  PostgreSQL   │
    └───────────────┘
```

## 2. Module Boundaries

```
measurtent/
├── packages/
│   ├── engine/          # Pure TS — ZERO framework deps
│   ├── config/          # JSON loader + DB config resolver
│   ├── api/             # Fastify server
│   ├── sdk/             # Browser/Node embeddable bundle
│   └── shared/          # Zod schemas, types, constants
├── apps/
│   └── web/             # React frontend
├── prisma/              # Schema + migrations
└── AI/                  # Agent coordination files
```

## 3. Data Flow — Calculation

```
Client Request
  → POST /v1/calculate { guestCount, seatingStyle, tentType, addOns }
  → Zod validation (shared/schemas)
  → Config loaded (JSON or DB by tenantId)
  → engine.calculate(inputs, config) → CalculationResult
  → Response { requiredSqFt, recommendedTentSize, tables, chairs, geometry }
```

## 4. Data Flow — Auth

```
POST /v1/auth/register → hash password → create User → return JWT pair
POST /v1/auth/login    → verify password → return JWT pair
POST /v1/auth/refresh  → verify refresh token → return new access token
```

## 5. Data Flow — Projects

```
POST /v1/projects          → create Project + CalculationSnapshot (userId, tenantId)
GET  /v1/projects          → list user's projects (paginated)
GET  /v1/projects/:id      → get project + snapshots
PUT  /v1/projects/:id      → update project
DELETE /v1/projects/:id    → soft delete
GET  /v1/projects/:id/export?format=json|csv → export
```

## 6. Multi-Tenant Design

- Every user-owned record carries `tenantId`
- `tenantId` defaults to the user's own ID (self-serve SaaS)
- Config rules can be overridden per tenant
- API keys (future) will carry `tenantId` claim in JWT

## 7. External Integration — badshuffle

- The API is designed to be mounted as a sub-router
- No global state, no framework lock-in
- Engine can be imported as a pure function
- badshuffle can import `@measurtent/engine` and `@measurtent/sdk` directly
- Auth tokens are standard JWT — compatible with existing auth middleware
- Integration point: `POST /v1/calculate` can be proxied or embedded

## 8. Config Schema (JSON baseline)

```json
{
  "seatingStyles": {
    "banquet": { "sqftPerPerson": 12, "tableShape": "rectangular", "seatsPerTable": 8 },
    "reception": { "sqftPerPerson": 8, "tableShape": "cocktail", "seatsPerTable": 0 },
    "theater": { "sqftPerPerson": 6, "tableShape": "none", "seatsPerTable": 0 },
    "classroom": { "sqftPerPerson": 10, "tableShape": "rectangular", "seatsPerTable": 3 }
  },
  "tentTypes": {
    "pole": { "widthIncrements": [20, 30, 40, 60, 80], "lengthIncrement": 10, "bufferFactor": 1.1 },
    "frame": { "widthIncrements": [10, 15, 20, 30, 40], "lengthIncrement": 5, "bufferFactor": 1.05 },
    "clearspan": { "widthIncrements": [30, 40, 50, 60, 100], "lengthIncrement": 10, "bufferFactor": 1.0 }
  },
  "addOns": {
    "stage": { "sqft": 200 },
    "danceFloor": { "sqft": 400 },
    "bar": { "sqft": 100 },
    "catering": { "sqft": 300 },
    "buffet": { "sqft": 150 }
  },
  "chairSqft": 2.5,
  "aisleBuffer": 0.15
}
```
