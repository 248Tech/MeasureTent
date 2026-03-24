# MeasureTent

![Version](https://img.shields.io/badge/version-v0.0.1-blue)
![License](https://img.shields.io/github/license/248Tech/MeasureTent)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-4.x-000000?logo=fastify&logoColor=white)
![Status](https://img.shields.io/badge/status-beta-orange)

MeasureTent is a **config-driven tent size calculator and event layout platform** for rental companies, planners, and integrators. It combines a pure TypeScript calculation engine, a Fastify API, shared Zod contracts, and a React frontend.

## Quick Description

MeasureTent calculates tent dimensions, seating tables/chairs, and add-on space requirements from a single request:

- Input: guest count, seating style, tent type, add-ons
- Output: required square footage, recommended tent size, geometry, table/chair counts

Primary endpoint:

- `POST /v1/calculate`

## Quickstart

See [QUICKSTART.md](./QUICKSTART.md) for local setup in under 5 minutes.

## Full Install and Setup Guide

### 1) Prerequisites

- Node.js 20+
- pnpm 9+
- Git

### 2) Clone the repository

```bash
git clone https://github.com/248Tech/MeasureTent.git
cd MeasureTent
```

### 3) Install dependencies

```bash
pnpm install
```

### 4) Configure environment (optional)

The API works with defaults out of the box. Optional environment variables:

- `PORT` (default: `3001`)
- `HOST` (default: `0.0.0.0`)
- `TENT_CONFIG_DIR` (directory for tenant override JSON files)

Example local override (bash):

```bash
export PORT=3001
export HOST=0.0.0.0
```

### 5) Start backend API

```bash
pnpm dev:api
```

API endpoints:

- `http://localhost:3001/health`
- `http://localhost:3001/docs`
- `http://localhost:3001/v1/calculate`

### 6) Start frontend web app

Open another terminal:

```bash
pnpm dev:web
```

Web app:

- `http://localhost:5173`

The web dev server proxies `/v1/*` to `http://localhost:3001`.

### 7) Verify with a sample request

```bash
curl -X POST http://localhost:3001/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "guestCount": 120,
    "seatingStyle": "banquet",
    "tentType": "pole",
    "addOns": ["stage", "bar"]
  }'
```

Expected response fields:

- `requiredSqFt`
- `recommendedTentSize`
- `tables`
- `chairs`
- `geometry`

### 8) Useful workspace commands

```bash
pnpm typecheck
pnpm build
```

## Features

- Monorepo (`pnpm` workspace)
- Strict TypeScript across packages
- Config-driven calculation rules (JSON today, DB-ready interface)
- Shared runtime validation via Zod
- Fastify API + Swagger docs
- React + Tailwind + React Query frontend scaffold

## Architecture

- `packages/engine` - Pure TypeScript calculator (framework-agnostic)
- `packages/config` - Config provider layer + defaults
- `packages/shared` - Schemas and shared domain types
- `packages/api` - Fastify routes/plugins/server
- `apps/web` - Vite React client

## API

- `GET /health` -> `{ "status": "ok" }`
- `POST /v1/calculate` -> `CalculationResult`
- Docs available at `/docs`

## SEO & Discovery Keywords

MeasureTent is optimized around discovery terms like:

- tent size calculator
- event rental calculator
- wedding tent calculator
- party seating calculator
- Fastify TypeScript API for event planning

## Release

Current release: **v0.0.1**  
See [CHANGELOG.md](./CHANGELOG.md) for release notes.

## Badshuffle Integration Plan

MeasureTent is designed to be merged into, or mounted alongside, [Badshuffle](https://github.com/248Tech/Badshuffle) in a phased approach:

1. **Phase A - API Contract Stability**
   - Keep `/v1/calculate` stable and versioned.
2. **Phase B - Shared Auth/Tenant Context**
   - Align JWT claims and tenant isolation with Badshuffle middleware.
3. **Phase C - UI Embedding**
   - Embed calculator UI in Badshuffle dashboards as a feature module.
4. **Phase D - Unified Project Storage**
   - Merge project/snapshot persistence into Badshuffle data models.

Detailed execution plan: [docs/BADSHUFFLE_INTEGRATION_PLAN.md](./docs/BADSHUFFLE_INTEGRATION_PLAN.md)

## License

MIT - see [LICENSE](./LICENSE)
