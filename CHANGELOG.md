# Changelog

All notable changes to this project are documented in this file.

## [0.0.1] - 2026-03-24

Initial production phase release.

### Added

- Monorepo scaffold for API, engine, config, shared, sdk, and web.
- Shared Zod schemas and TypeScript domain contracts.
- Config provider system with JSON defaults and DB-ready provider interface.
- Core calculation engine (`calculate`) with config-driven sizing logic.
- Fastify API skeleton with:
  - `GET /health`
  - `POST /v1/calculate`
  - Swagger docs at `/docs`
- React/Tailwind/React Query web scaffold and calculator form flow.
- Project documentation:
  - README with badges, SEO-focused description, and roadmap
  - QUICKSTART setup guide
  - Badshuffle integration plan
