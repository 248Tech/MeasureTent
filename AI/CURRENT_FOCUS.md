# CURRENT_FOCUS.md
**Agent:** Claude (Planner)
**Date:** 2026-03-24

---

## Active Work

**Phase:** 1 — Architecture + Initial Planning

**Current Agent:** Claude → handing off to Codex

## What's Being Done Right Now

- [x] System architecture designed
- [x] Risk analysis completed
- [x] Database schema defined (Prisma-level)
- [x] API contract defined (no code)
- [x] Implementation plan phased
- [x] TODO.md populated with Phase 1 tasks
- [ ] Core engine implementation (→ Codex)
- [ ] API skeleton implementation (→ Codex)

## Immediate Next Step

Codex must implement:
1. `packages/engine/` — pure TypeScript calculation engine
2. `packages/api/` — Fastify skeleton with /v1/calculate endpoint
3. Zod schemas shared between engine and API
4. Config loader (JSON-based, DB-ready interface)
