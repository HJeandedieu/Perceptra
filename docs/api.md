# PERCEPTRA API Documentation

Version 1.0 · June 2026
Base URL: `http://localhost:8000` (development)

---

## Authentication

### POST /api/auth/login

Authenticates an operator and returns a JWT session token.

**Request Body:**

```json
{
  "email": "operator@perceptra.io",
  "password": "your-password"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "operator",
  "expires_at": "2026-06-10T14:00:00Z"
}
```

**Error Responses:**

| Status | Description |
|---|---|
| 401 | Invalid email or password |
| 422 | Validation error (missing fields) |

**Frontend:** `src/pages/Login.jsx` calls this endpoint on form submit. On success, stores token in app state and renders Analytics.

---

### POST /api/auth/logout

Invalidates the current session token.

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "message": "Session invalidated"
}
```

---

## Detection Events

### POST /api/detections

Receives a detection result from the AI engine after each inference frame.

**Request Body:**

```json
{
  "timestamp": "2026-06-09T14:23:12.000Z",
  "label": "Weapon",
  "confidence": 0.94,
  "severity": "Critical",
  "camera_id": "CAM-12"
}
```

**Validation Rules:**

| Field | Type | Constraints |
|---|---|---|
| `timestamp` | ISO8601 string | Required |
| `label` | string | 1–100 chars |
| `confidence` | float | 0.0–1.0 |
| `severity` | string | One of: `Low`, `Medium`, `High`, `Critical` |
| `camera_id` | string | 1–20 chars |

**Severity Mapping (AI Engine → Backend):**

| Level | Condition |
|---|---|
| Low | Person detected in monitored zone |
| Medium | Unusual activity / loitering |
| High | Aggressive behaviour / restricted area breach |
| Critical | Weapon detected or direct attack |

**Success Response (201):**

```json
{
  "id": "INC-2026-1842",
  "status": "recorded"
}
```

**Error Responses:**

| Status | Description |
|---|---|
| 422 | Validation error |
| 500 | Internal server error |

---

### GET /api/events

Returns a paginated list of detection events from the database.

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `from` | ISO8601 | — | Start of time range |
| `to` | ISO8601 | — | End of time range |
| `severity` | string | — | Filter by severity level |
| `page` | integer | 1 | Page number |
| `limit` | integer | 50 | Items per page (max 100) |

**Example Request:**

```
GET /api/events?from=2026-06-01T00:00:00Z&to=2026-06-09T23:59:59Z&severity=Critical&page=1&limit=10
```

**Success Response (200):**

```json
{
  "data": [
    {
      "id": "INC-2026-1841",
      "timestamp": "2026-06-09T14:21:05.000Z",
      "camera_id": "CAM-12",
      "label": "Weapon",
      "confidence": 0.94,
      "severity": "Critical",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12847,
    "pages": 1285
  }
}
```

---

### GET /api/reports

Returns aggregated statistics for the Analytics dashboard. Called from `Analytics.jsx`.

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `range` | string | `7d` | Time range: `7d`, `30d`, or `90d` |

**Success Response (200):**

```json
{
  "summary": {
    "total_detections": 12847,
    "critical_alerts": 47,
    "avg_confidence": 0.943,
    "active_cameras": 16
  },
  "timeline": [
    {
      "date": "2026-06-09",
      "incidents": 29,
      "critical": 2
    }
  ],
  "trends": {
    "total_change": "+12.5%",
    "critical_change": "-3.2%",
    "confidence_change": "+2.1%"
  }
}
```

**Frontend:** `src/pages/Analytics.jsx` maps `summary` to stat cards and `timeline` to the Recharts bar chart.

---

## Alerts

### GET /api/alerts

Returns a list of active or dismissed alerts.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `severity` | string | Filter by severity level |

**Success Response (200):**

```json
{
  "data": [
    {
      "id": "ALR-2026-001",
      "timestamp": "2026-06-09T14:21:05.000Z",
      "incident_id": "INC-2026-1841",
      "severity": "Critical",
      "message": "Weapon detected - CAM-12",
      "status": "active"
    }
  ]
}
```

---

### PATCH /api/alerts/:id/dismiss

Marks an alert as dismissed (called from the Alerts Panel).

**Success Response (200):**

```json
{
  "id": "ALR-2026-001",
  "status": "dismissed"
}
```

---

## WebSocket

### WS /ws/detections

Real-time event stream. Pushes detection events to all connected dashboard clients as they arrive from the AI engine.

**Message Format (Server → Client):**

```json
{
  "type": "detection",
  "payload": {
    "id": "INC-2026-1841",
    "timestamp": "2026-06-09T14:21:05.000Z",
    "camera_id": "CAM-12",
    "label": "Weapon",
    "confidence": 0.94,
    "severity": "Critical"
  }
}
```

**Connection:**

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/detections');
ws.onmessage = (event) => {
  const { type, payload } = JSON.parse(event.data);
  // Update dashboard
};
```

---

## Internal Alert Triggers

These are not REST endpoints — they are internal event listeners in the backend:

| Trigger | Severity Threshold | Channel |
|---|---|---|
| SMS alert | >= Medium (`#F59E0B`) | Twilio API |
| Email alert | >= High (`#EF4444`) | SendGrid / Gmail SMTP |

Message format includes: location (camera_id), threat type (label), and timestamp.

---

## Severity Reference

| Level | Hex | UI Badge | Alert Action |
|---|---|---|---|
| Low | `#22C55E` | Green | Log only |
| Medium | `#F59E0B` | Amber | SMS triggered |
| High | `#EF4444` | Red | SMS + Email |
| Critical | `#7C3AED` | Purple | All alerts |
