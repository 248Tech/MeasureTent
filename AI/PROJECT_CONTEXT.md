# PROJECT_CONTEXT.md
**Agent:** Claude (Planner)
**Date:** 2026-03-24
**Status:** Architecture Phase Complete

---

## System Purpose

MeasureTent is a SaaS-ready Tent & Event Rental Calculator platform. It allows event planners, rental companies, and end-users to calculate tent sizes, seating arrangements, and equipment requirements based on configurable business rules.

## Stack

| Layer | Technology |
|---|---|
| Core Engine | Pure TypeScript (framework-free) |
| Config | JSON files → PostgreSQL (phase 2) |
| API | Fastify + Zod + JWT |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (access + refresh) + bcrypt |
| Frontend | React + TailwindCSS + React Query |
| SDK | TypeScript ESM bundle (embeddable) |
| Export | csv-stringify + JSON native |
| Docs | Swagger (fastify-swagger) |
| Validation | Zod (shared between API and engine) |

## Business Goals

1. Accurate, config-driven event calculations
2. User account system with named project saving
3. Exportable project data (JSON + CSV)
4. Open, versioned API for third-party integration
5. Future merge readiness with https://github.com/248Tech/badshuffle
6. Multi-tenant architecture ready from day one

## Constraints

- NO hardcoded business logic (sqft per person, table sizes, chair counts)
- Core engine must run in Node, browser, or as imported SDK
- All calculation rules must be overridable via config
- API must be independently deployable and mergeable
- Database schema must support multi-tenancy (tenantId on all user-owned tables)
