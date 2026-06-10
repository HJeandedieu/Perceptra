# PERCEPTRA — Frontend Dashboard

Real-time threat detection dashboard. Part of the PERCEPTRA system — ingests video streams, runs YOLOv8 inference, and pushes detection alerts to operators in real time.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| State | React hooks (local) |

## Repository Structure

```
perceptra-frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # Auth: email/password login flow
│   │   └── Analytics.jsx      # Stats, charts, incident history table
│   ├── data/
│   │   └── mockData.js        # Mock incidents, stats, timeline
│   ├── components/            # Shared UI components (WIP - shared by all team members)
│   ├── App.jsx                # Auth state, sidebar layout, navigation
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind v4 config + PERCEPTRA design tokens
├── docs/
│   ├── api.md                 # API contract documentation
│   ├── user-manual.md         # Operator walkthrough
│   └── pitch-deck.md          # Competition pitch outline
├── index.html
├── vite.config.js
└── package.json
```

## Getting Started

### Prerequisites

- **Node.js** 20+ (22 LTS recommended)
- **pnpm** 9+ (or npm 10+)

### Install

```bash
pnpm install
```

### Development

```bash
pnpm run dev -- --port 5174
```

Opens at `http://localhost:5174`. The Login page loads first — enter any email/password and click **Sign In** to access the Analytics dashboard.

### Production Build

```bash
pnpm run build
pnpm run preview
```

Serves the optimised build on `http://localhost:4173`.

## Feature Branches

Per the [team workflow](../../wiki), all frontend work goes through feature branches:

| Branch | Owner | Page |
|---|---|---|
| `Dorcas/live-feed` | Dorcas | Live camera grid |
| `Dorcas/alerts-panel` | Dorcas | Alert list with severities |
| `Niel/login` | Niel | Login + auth |
| `Niel/analytics` | Niel | Analytics + reports |
| `integrate/api` | Dorcas (integration) | All pages wired to backend |

Merge to `main` only after PR review from the other frontend contributor.

## Design Tokens

### Severity Colours (from Team Doc §4.2)

| Level | Hex | Badge |
|---|---|---|
| Low | `#22C55E` | Green |
| Medium | `#F59E0B` | Amber |
| High | `#EF4444` | Red |
| Critical | `#7C3AED` | Purple |

### Surface Palette

- **950** `#0a0b10` — page background
- **900** `#111218` — cards, sidebar
- **800** `#191b24` — inputs, table rows
- **700** `#22252f` — borders
- **600** `#2c2f3a` — hover states

Accent: `#6366f1` (Indigo) — primary buttons, active nav.

## API Endpoints Used

The frontend connects to the `perceptra-backend` service. See [API docs](./docs/api.md) for full contracts.

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/login` | POST | Operator login |
| `/api/auth/logout` | POST | Session invalidation |
| `/api/reports` | GET | Aggregated stats (`?range=7d\|30d\|90d`) |
| `/api/events` | GET | Detection events (paginated) |
| `WS /ws/detections` | WebSocket | Real-time event push |

## Contributors

- **Dorcas** — Live Feed Dashboard + Alerts Panel + Integration
- **Niel** — Login/Auth + Analytics/Reports + Documentation
