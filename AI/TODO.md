# TODO.md
**Last Updated:** Claude (Planner) — 2026-03-24

---

## PHASE 1 — Core Engine + API Skeleton

---

### TASK-001: Initialize monorepo structure
- **Description:** Create pnpm workspace with packages/engine, packages/api, packages/shared, packages/sdk, apps/web, prisma/
- **Files:** `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, each package's `package.json` + `tsconfig.json`
- **Acceptance Criteria:**
  - `pnpm install` works at root
  - TypeScript paths resolve across packages
  - Each package has its own tsconfig extending base
- **Next Agent:** Codex
- **Status:** ✅ DONE

---

### TASK-002: Define shared Zod schemas and types
- **Description:** Create shared calculation input/output schemas, auth schemas, project schemas used by both API and engine
- **Files:** `packages/shared/src/schemas/calculation.ts`, `packages/shared/src/schemas/auth.ts`, `packages/shared/src/schemas/project.ts`, `packages/shared/src/types/index.ts`
- **Acceptance Criteria:**
  - `CalculationInput` schema validates guestCount, seatingStyle, tentType, addOns[]
  - `CalculationResult` type defines requiredSqFt, recommendedTentSize, tables, chairs, geometry
  - All schemas exported from `packages/shared/src/index.ts`
- **Next Agent:** Codex
- **Status:** ✅ DONE

---

### TASK-003: Implement config loader
- **Description:** Build a config loader that reads from a JSON file. Must use an interface so it can be swapped to a DB resolver without changing consumers.
- **Files:** `packages/config/src/loader.ts`, `packages/config/src/types.ts`, `packages/config/src/defaults.json`
- **Acceptance Criteria:**
  - `loadConfig(tenantId?: string): Promise<TentConfig>` function exported
  - Falls back to defaults.json if no tenant override found
  - Interface `IConfigProvider` defined — JSON and DB implementations both conform to it
- **Next Agent:** Codex
- **Status:** ✅ DONE

---

### TASK-004: Implement core calculation engine
- **Description:** Pure TypeScript calculation engine. Zero framework dependencies. Takes CalculationInput + TentConfig, returns CalculationResult.
- **Files:** `packages/engine/src/calculator.ts`, `packages/engine/src/geometry.ts`, `packages/engine/src/addons.ts`, `packages/engine/src/index.ts`
- **Acceptance Criteria:**
  - `calculate(input: CalculationInput, config: TentConfig): CalculationResult` is the only public API
  - requiredSqFt = (guestCount × sqftPerPerson) + addOnSqft + aisleBuffer
  - recommendedTentSize picks smallest tent from config that fits requiredSqFt
  - geometry returns { width, length } in feet
  - tables = Math.ceil(guestCount / seatsPerTable) (0 if reception/theater)
  - chairs = guestCount (always)
  - Engine has NO imports from Fastify, React, or Prisma
  - Unit testable with no mocking required
- **Next Agent:** Codex
- **Status:** ✅ DONE

---

### TASK-005: Implement Fastify API skeleton
- **Description:** Fastify server with plugin architecture, Zod validation, Swagger docs, and /v1/calculate endpoint wired to the core engine.
- **Files:** `packages/api/src/server.ts`, `packages/api/src/app.ts`, `packages/api/src/routes/v1/calculate.ts`, `packages/api/src/plugins/swagger.ts`, `packages/api/src/plugins/sensible.ts`
- **Acceptance Criteria:**
  - Server starts on PORT env var (default 3001)
  - `POST /v1/calculate` accepts CalculationInput, returns CalculationResult
  - Request body validated with Zod (400 on invalid)
  - Swagger UI available at `/docs`
  - Health check at `GET /health` returns `{ status: "ok" }`
  - All routes versioned under /v1/
- **Next Agent:** Codex
- **Status:** ✅ DONE

---

## PHASE 2 — Auth + Projects

---

### TASK-006: Set up Prisma schema
- **Description:** Define User, Project, CalculationSnapshot, RefreshToken, and TenantConfig models
- **Files:** `prisma/schema.prisma`
- **Acceptance Criteria:**
  - User: id, email, passwordHash, tenantId, createdAt
  - Project: id, name, userId, tenantId, createdAt, updatedAt, deletedAt
  - CalculationSnapshot: id, projectId, input (Json), result (Json), createdAt
  - RefreshToken: id, userId, token, expiresAt, createdAt
  - TenantConfig: id, tenantId, config (Json), createdAt, updatedAt
  - All foreign keys and indexes defined
  - `pnpm prisma generate` succeeds
- **Next Agent:** Codex
- **Status:** TODO

---

### TASK-007: Implement auth system
- **Description:** JWT auth with register, login, refresh, logout routes. bcrypt for password hashing.
- **Files:** `packages/api/src/routes/v1/auth.ts`, `packages/api/src/services/auth.ts`, `packages/api/src/plugins/jwt.ts`, `packages/api/src/middleware/authenticate.ts`
- **Acceptance Criteria:**
  - POST /v1/auth/register → creates user, returns access + refresh JWT
  - POST /v1/auth/login → verifies credentials, returns token pair
  - POST /v1/auth/refresh → validates refresh token, returns new access token
  - POST /v1/auth/logout → invalidates refresh token
  - Middleware `authenticate` attaches `request.user` with userId + tenantId
  - Passwords hashed with bcrypt (cost factor 12)
  - Access token expires in 15min, refresh in 7 days
- **Next Agent:** Codex
- **Status:** TODO

---

### TASK-008: Implement project CRUD
- **Description:** Full project management: create, list, get, update, soft-delete. Attach calculation snapshots to projects.
- **Files:** `packages/api/src/routes/v1/projects.ts`, `packages/api/src/services/projects.ts`
- **Acceptance Criteria:**
  - POST /v1/projects → create project with optional initial calculation
  - GET /v1/projects → list user projects (paginated, exclude soft-deleted)
  - GET /v1/projects/:id → get project with snapshots
  - PUT /v1/projects/:id → update project name
  - DELETE /v1/projects/:id → soft delete (sets deletedAt)
  - All routes require authentication
  - Users can only access their own projects (tenantId isolation)
- **Next Agent:** Codex
- **Status:** TODO

---

## PHASE 3 — Frontend

---

### TASK-009: React app scaffold
- **Description:** Vite + React + TailwindCSS + React Query + React Router app scaffold
- **Files:** `apps/web/` (full scaffold)
- **Acceptance Criteria:**
  - `pnpm dev` starts the app
  - Routes: /, /login, /register, /dashboard, /projects/:id
  - Auth context with JWT storage (httpOnly cookie or memory+refresh)
  - API client configured to hit localhost:3001
- **Next Agent:** Codex (scaffold) → Cursor (UI polish)
- **Status:** TODO

---

### TASK-010: Calculator UI component
- **Description:** Main calculator form + results display
- **Files:** `apps/web/src/components/Calculator.tsx`, `apps/web/src/components/ResultCard.tsx`
- **Acceptance Criteria:**
  - Inputs: guestCount (number), seatingStyle (select), tentType (select), addOns (checkboxes)
  - Submits to POST /v1/calculate
  - Displays: requiredSqFt, recommendedTentSize, tables, chairs, geometry
  - Can save result as named project
- **Next Agent:** Codex → Cursor
- **Status:** TODO

---

## PHASE 4 — Export + Polish

---

### TASK-011: Export endpoints
- **Description:** Export project data as JSON or CSV
- **Files:** `packages/api/src/routes/v1/export.ts`, `packages/api/src/services/export.ts`
- **Acceptance Criteria:**
  - GET /v1/projects/:id/export?format=json → returns full project + snapshots as JSON
  - GET /v1/projects/:id/export?format=csv → returns CSV with one row per snapshot
  - CSV columns: projectName, date, guestCount, seatingStyle, tentType, addOns, requiredSqFt, recommendedTentSize, tables, chairs
  - Auth required, ownership enforced
- **Next Agent:** Codex
- **Status:** TODO

---

### TASK-012: Embeddable SDK
- **Description:** Bundle the engine as a browser/Node SDK with a simple public API
- **Files:** `packages/sdk/src/index.ts`, `packages/sdk/tsup.config.ts`
- **Acceptance Criteria:**
  - Exports `MeasureTentSDK` class with `calculate(input, config?)` method
  - Works in browser and Node
  - Ships ESM + CJS
  - Zero runtime deps beyond engine + config
- **Next Agent:** Codex → Cursor
- **Status:** TODO
