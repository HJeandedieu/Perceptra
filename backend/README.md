# PERCEPTRA Backend

**REST API + WebSocket Server**  
Built with: Node.js, Express, WebSocket, JWT

---

## ✅ Completed Features

1. ✅ **Auth System**
   - JWT login/logout
   - Role-based middleware (admin vs operator)
   - Password hashing with bcrypt

2. ✅ **REST API Endpoints**
   - CRUD routes for users (admin only)
   - CRUD routes for detections
   - CRUD routes for alerts
   - Input validation on all endpoints
   - Comprehensive error handling
   - CORS configuration

3. ✅ **WebSocket Server**
   - Real-time event push to connected dashboards
   - Broadcasts detection results as they arrive from AI engine

---

## 📁 Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── auth.js         # Auth endpoints & JWT middleware (Albert)
│   │   ├── detections.js   # Detections API (Albert)
│   │   ├── alerts.js       # Alerts API (Albert)
│   │   └── reports.js      # Reports API (Albert)
│   ├── db/
│   │   └── schema.sql      # DB schema placeholder (Isabelle to implement)
│   ├── alerts/             # SMS/Email modules placeholder (Isabelle to implement)
│   └── index.js            # Server entry point
├── tests/
├── package.json
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### Run Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on http://localhost:8000

---

## 🔌 API Endpoints

### Auth

- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout (invalidates token)
- `GET /api/auth/users` - Get all users (admin only)
- `GET /api/auth/users/:id` - Get single user (admin only)
- `POST /api/auth/users` - Create user (admin only)
- `PUT /api/auth/users/:id` - Update user (admin only)
- `DELETE /api/auth/users/:id` - Delete user (admin only)

### Detections

- `POST /api/detections` - Receive detection from AI engine
- `GET /api/detections` - Get paginated detections (protected)
- `GET /api/detections/:id` - Get single detection (protected)
- `PUT /api/detections/:id` - Update detection (protected)
- `DELETE /api/detections/:id` - Delete detection (protected)

### Alerts

- `GET /api/alerts` - Get alerts list (protected)
- `GET /api/alerts/:id` - Get single alert (protected)
- `POST /api/alerts` - Create alert (protected)
- `PATCH /api/alerts/:id/dismiss` - Dismiss an alert (protected)
- `DELETE /api/alerts/:id` - Delete alert (protected)

### Reports

- `GET /api/reports` - Get aggregated stats for analytics

### WebSocket

- `WS /ws/detections` - Real-time detection events

---

## 👤 Test Credentials

```
Admin:
Email: admin@perceptra.ai
Password: password123

Operator:
Email: operator@perceptra.ai
Password: password123
```

---

## 📝 Note to Isabelle

- Placeholder directories for DB and alerts modules are ready in `/backend/src/db/` and `/backend/src/alerts/`
- Schema file exists at `/backend/src/db/schema.sql`
