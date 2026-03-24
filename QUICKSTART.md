# Quickstart

This guide gets MeasureTent running locally with API + web app.

## Prerequisites

- Node.js 20+
- pnpm 9+

## 1) Install dependencies

```bash
pnpm install
```

## 2) Start the API

```bash
pnpm dev:api
```

API defaults:

- Base URL: `http://localhost:3001`
- Health: `http://localhost:3001/health`
- Docs: `http://localhost:3001/docs`

## 3) Start the web app

```bash
pnpm dev:web
```

Web defaults:

- URL: `http://localhost:5173`
- Dev proxy forwards `/v1/*` to `http://localhost:3001`

## 4) Test calculate endpoint

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

## Common commands

```bash
pnpm typecheck
pnpm build
```

## Troubleshooting

- Port conflict: set `PORT` before running API (`PORT=3002 pnpm dev:api`)
- Validation errors: confirm payload matches `CalculationInput` contract in `packages/shared`
