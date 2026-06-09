# PERCEPTRA User Manual

Version 1.0 · June 2026
For Operators and System Administrators

---

## 1. Overview

PERCEPTRA is a real-time physical threat detection system. It ingests video streams from surveillance cameras, runs YOLOv8 AI inference on every frame, and instantly dispatches detection events to a live dashboard. Operators can monitor feeds, review incidents, and respond to threats — all from a single web interface.

### Key Capabilities

| Feature | Description |
|---|---|
| Live Camera Feeds | Real-time video grid with severity overlays |
| AI Detection | YOLOv8 identifies persons, weapons, aggressive behaviour, loitering, and restricted area breaches |
| Instant Alerts | SMS (Medium+) and Email (High+) notifications |
| Incident Log | Searchable history with severity filters and export |
| Analytics | Time-series charts, trends, and aggregated statistics |

---

## 2. Getting Started

### 2.1 Logging In

1. Open `http://<dashboard-url>` in a modern browser (Chrome 120+, Firefox 120+, Edge 120+)
2. Enter your **email** and **password** (credentials provided by your system administrator)
3. Click **Sign In**

   ![Login screen placeholder]

   > If you see _"Invalid credentials"_, contact your administrator to reset your password.

### 2.2 Session Management

- Sessions are secured with JWT tokens
- Tokens expire after 24 hours by default
- Click the **Logout** button in the sidebar to end your session early
- The "Remember me" checkbox extends session duration to 7 days

---

## 3. Dashboard Layout

Once logged in, the interface is divided into three areas:

```
┌──────────────────────┬──────────────────────────────────────────┐
│    SIDEBAR           │          MAIN CONTENT                    │
│                      │                                          │
│  P  PERCEPTRA        │  [Header: Page Title + Date Range]       │
│                      │                                          │
│  📊 Analytics        │  [Content area varies by page]           │
│  📹 Live Feed        │                                          │
│  🔔 Alerts           │                                          │
│  ⚙️ Settings         │                                          │
│                      │                                          │
│  🚪 Logout           │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

### Sidebar Navigation

| Icon | Page | Description |
|---|---|---|
| 📊 | Analytics | Statistics, charts, incident history |
| 📹 | Live Feed | Real-time camera grid (Dorcas's page) |
| 🔔 | Alerts | Active alert management (Dorcas's page) |
| ⚙️ | Settings | System configuration |

---

## 4. Analytics & Reports

### 4.1 Stat Cards

The top row shows four key metrics:

| Metric | Description |
|---|---|
| Total Detections | All detection events in the selected time range |
| Critical Alerts | Detections with Critical severity |
| Avg. Confidence | Mean YOLOv8 confidence score across all detections |
| Active Cameras | Number of cameras currently streaming |

Each card shows a percentage change vs. the previous period (green = improving, red = degrading).

### 4.2 Date Range Selector

Toggle between **7d**, **30d**, and **90d** views to adjust the analytics window.

### 4.3 Detection Timeline

A stacked bar chart shows:
- **Green bars**: Total incidents per day
- **Purple bars**: Critical incidents per day

Hover over any bar to see exact counts.

### 4.4 Incident History

The table lists all detection events with the following columns:

| Column | Description |
|---|---|
| Incident ID | Unique identifier (INC-YYYY-NNNN) |
| Timestamp | Date and time of detection (local) |
| Camera | Camera identifier (CAM-NN) |
| Label | Detected object or behaviour |
| Confidence | AI confidence score (0–100%) with visual bar |
| Severity | Colour-coded badge (see §4.5) |
| Status | Active, Investigating, Monitoring, or Resolved |

**Filtering**: Type in the search box to filter by any field.

**Pagination**: Use the page controls at the bottom to navigate through results.

### 4.5 Severity Badges

| Level | Badge | Meaning |
|---|---|---|
| Low | 🟢 Green | Person detected — no immediate threat |
| Medium | 🟡 Amber | Unusual activity — SMS alert sent |
| High | 🔴 Red | Aggressive behaviour / breach — SMS + email |
| Critical | 🟣 Purple | Weapon detected — all alerts + loudest alert |

### 4.6 Exporting Data

Click **Export** to download the current view as a CSV file. Exports respect the active date range and any search filter applied.

---

## 5. Alerts

[This section covers Dorcas's alerts panel — placeholder for completion.]

- Alerts are shown in a list ordered by severity (Critical first)
- Each alert shows: timestamp, camera, threat type, severity badge
- Click **Dismiss** to acknowledge and remove an alert
- Dismissed alerts remain in the database for audit purposes

### Alert Triggers

| Severity | Notification |
|---|---|
| Low | Dashboard badge only |
| Medium | SMS to operator phone |
| High | SMS + email to operators |
| Critical | SMS + email + urgent UI indicator |

---

## 6. Live Feed

[This section covers Dorcas's live feed — placeholder for completion.]

- Camera grid displays active streams in real time
- Each camera tile shows a severity badge overlay
- Click a tile to expand to full-screen view
- Active detections are highlighted with a coloured border matching severity

---

## 7. Troubleshooting

### 7.1 Dashboard Not Loading

1. Check that `pnpm run dev` is running on the frontend server
2. Verify the backend is running on `localhost:8000`
3. Open browser DevTools (F12) → Console tab for error messages
4. Ensure you are using a supported browser

### 7.2 Login Issues

1. Confirm caps lock is off
2. Use "Forgot password?" to reset (if configured)
3. Contact your administrator to verify your account exists in the database

### 7.3 Missing Detection Events

1. Verify the AI engine is running and sending POST to `/api/detections`
2. Check the WebSocket connection: look for `WS /ws/detections` in browser DevTools Network tab
3. Ensure the camera feed is active and streaming

---

## 8. Glossary

| Term | Definition |
|---|---|
| YOLOv8 | You Only Look Once v8 — real-time object detection AI model |
| WebSocket | Persistent connection for real-time data push |
| JWT | JSON Web Token — session authentication mechanism |
| Twilio | SMS delivery service |
| SendGrid | Email delivery service |
| Severity | Classification of threat level (Low/Medium/High/Critical) |
| Camera ID | Unique identifier for each surveillance camera |
| Confidence | AI model's certainty score (0.0–1.0) |
