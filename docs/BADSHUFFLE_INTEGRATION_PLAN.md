# Badshuffle Integration Plan

Target reference repo: https://github.com/248Tech/Badshuffle

## Goal

Integrate MeasureTent's calculator capabilities into Badshuffle without breaking existing contracts.

## Principles

- Keep engine pure and framework-independent.
- Treat `POST /v1/calculate` as a stable versioned contract.
- Reuse shared tenant and auth context from Badshuffle.
- Avoid duplicate business logic across systems.

## Phased Plan

### Phase 1: Contract Lock + Compatibility Layer

- Freeze MeasureTent request/response contracts in `packages/shared`.
- Add adapter layer in Badshuffle for tenant/auth context translation.
- Add integration tests that call MeasureTent contract from Badshuffle runtime.

### Phase 2: Auth and Tenant Unification

- Align JWT claim shape (`userId`, `tenantId`) and token verification strategy.
- Use Badshuffle auth middleware for calculator routes.
- Ensure strict tenant scoping for all project/snapshot persistence.

### Phase 3: Shared Persistence Strategy

- Map MeasureTent Project and CalculationSnapshot into Badshuffle domain models.
- Define migration scripts and data ownership boundaries.
- Implement backfill for legacy calculator results if needed.

### Phase 4: Frontend Embedding

- Expose calculator module as embeddable React feature.
- Integrate React Query client with Badshuffle API layer.
- Preserve Tailwind design token compatibility.

### Phase 5: Operational Merge

- Monorepo import or package consumption decision:
  - Option A: Keep MeasureTent as deployable subservice.
  - Option B: Merge packages into Badshuffle monorepo.
- Add CI gates: typecheck, endpoint contract tests, smoke tests.

## Success Criteria

- Badshuffle can invoke MeasureTent calculation flow with no contract drift.
- Multi-tenant boundaries remain enforced end-to-end.
- Frontend users can run calculations from within Badshuffle UI.
