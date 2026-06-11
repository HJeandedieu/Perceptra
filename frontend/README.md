# Perceptra Frontend

Real-time threat detection dashboard. Part of the Perceptra security ecosystem — connects to the Perceptra backend API and WebSocket server to display live camera feeds, alerts, and analytics from YOLOv8-powered computer vision inference.

## Tech Stack

- **React 19** + **TypeScript 6**
- **Vite 8** (build tool)
- **Tailwind CSS v4** (styling)
- **React Router v7** (routing)

## Project Structure

```
src/
├── main.tsx              # App entry point + BrowserRouter
├── App.tsx               # Route definitions
├── index.css             # Tailwind v4 @theme + global styles
├── components/
│   ├── Sidebar.tsx       # Dashboard sidebar (navigation + user profile)
│   └── ProtectedRoute.tsx # Auth guard for dashboard routes
├── context/
│   └── AuthContext.tsx    # Login/logout state, localStorage persistence
├── layouts/
│   └── DashboardLayout.tsx  # Shared dashboard shell
└── pages/
    ├── Landing.tsx       # Marketing / hero page
    ├── Login.tsx         # Authentication
    ├── Signup.tsx        # Account creation
    ├── ResetPassword.tsx # Password recovery
    ├── VerifyIdentity.tsx# OTP verification
    ├── LiveFeed.tsx      # Camera grid with severity overlays
    ├── Alerts.tsx        # Alert list with filter + dismiss
    ├── Analytics.tsx     # KPIs, chart, incident table
    └── Settings.tsx      # Account / system settings
```

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Routes

| Path | Page | Auth Required |
|---|---|---|
| `/` | Landing | No |
| `/login` | Login | No |
| `/signup` | Sign Up | No |
| `/reset-password` | Reset Password | No |
| `/verify` | Verify Identity | No |
| `/live-feed` | Live Feed Dashboard | Yes |
| `/alerts` | Alerts Center | Yes |
| `/analytics` | Analytics & Reports | Yes |
| `/settings` | Settings | Yes |

## API Integration

All pages use typed data constants and React state patterns designed for straightforward API wiring. Integration points:

| Page | Endpoint | Method |
|---|---|---|
| Login | `/api/auth/login` | POST |
| Signup | `/api/auth/register` | POST |
| Live Feed | `/api/events` + `WS /ws/detections` | GET + WebSocket |
| Alerts | `/api/alerts` + `/api/alerts/:id/dismiss` | GET + PATCH |
| Analytics | `/api/reports` + `/api/events` | GET |

**Severity colour scale** (matches backend contract):

| Level | Colour | Hex |
|---|---|---|
| Low | Green | `#22C55E` |
| Medium | Amber | `#F59E0B` |
| High | Red | `#EF4444` |
| Critical | Purple | `#7C3AED` |

## Environment Variables

See `.env.example` for all required variables. Never commit `.env` files.

## Contributors

- **Dorcas** — Live Feed Dashboard, Alerts Panel, Frontend↔Backend Integration
- **Niel** — Login/Auth Pages, Analytics & Reports, Documentation

## License

Confidential — Perceptra Threat Intelligence © 2024
