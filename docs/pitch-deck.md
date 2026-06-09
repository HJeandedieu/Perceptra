# PERCEPTRA — Competition Pitch Deck

**Team:** Dorcas, Albert, Jean de Dieu, Isabelle, Niel
**Date:** June 2026

---

## Slide 1: Title

**PERCEPTRA**
*Real-Time Physical Threat Detection*

Tagline: *See threats before they unfold.*

---

## Slide 2: The Problem

**Security teams are blind in the critical seconds.**

- Traditional CCTV requires a human to watch every feed
- By the time an operator spots a threat, it's too late
- False alarms desensitise responders
- No centralised, real-time intelligence across camera networks

**The cost:** Delayed responses to weapons, restricted area breaches, and aggressive behaviour.

---

## Slide 3: The Solution

**PERCEPTRA — AI-powered detection that never blinks.**

| Capability | Detail |
|---|---|
| Ingestion | Live video from any IP camera or stream |
| Inference | YOLOv8 AI per-frame — 30 FPS+ on standard hardware |
| Dispatch | REST + WebSocket — results arrive in milliseconds |
| Alerting | SMS, Email, Dashboard — severity-gated notifications |

---

## Slide 4: Architecture

```
┌──────────────┐     POST /api/detections     ┌──────────────────┐
│  PERCEPTRA   │ ────────────────────────────▶ │  PERCEPTRA       │
│  AI Engine   │                               │  Backend API     │
│  (Python)    │                               │  (Node.js)       │
│  YOLOv8      │                               │  JWT Auth        │
│  OpenCV      │                               │  PostgreSQL      │
└──────────────┘                               └────────┬─────────┘
                                                         │
                                            ┌────────────┴────────────┐
                                            │                         │
                                    WS /ws/detections       Internal Events
                                            │                         │
                                            ▼                         ▼
                                   ┌──────────────────┐    ┌─────────────────┐
                                   │  PERCEPTRA       │    │  SMS (Twilio)   │
                                   │  Dashboard       │    │  Email (S/G)    │
                                   │  (React + Vite)  │    │                 │
                                   └──────────────────┘    └─────────────────┘
```

---

## Slide 5: Key Features

### Live Dashboard
- Real-time camera grid
- Severity overlays per feed
- Instant WebSocket push

### Smart Alerting
- **Low:** Log + dashboard badge
- **Medium:** + SMS notification
- **High:** + Email alert
- **Critical:** All channels + loudest UI indicator

### Analytics & Forensics
- Incident history with full-text search
- Severity-filtered views
- Exportable logs (CSV)
- Time-series trends (7d/30d/90d)

### Secure by Design
- JWT-based role authentication (Admin/Operator)
- bcrypt password hashing
- 256-bit encrypted sessions

---

## Slide 6: Technology Stack

```
Frontend:    React 19 + Vite 8 + Tailwind CSS v4 + Recharts
Backend:     Node.js / FastAPI + JWT + PostgreSQL
AI Engine:   Python + OpenCV + PyTorch + Ultralytics YOLOv8
Alerts:      Twilio (SMS) + SendGrid / Gmail SMTP (Email)
```

---

## Slide 7: Demo Flow

1. **Camera streams** feed into the AI Engine
2. **YOLOv8** runs per-frame detection — identifies persons, weapons, aggressive behaviour
3. **Inference results** POST to backend at `/api/detections`
4. **Backend** stores the event, broadcasts via WebSocket, and triggers alerts
5. **Dashboard** updates instantly — operator sees the incident in the table, severity badge, and timeline chart
6. **SMS/Email** sent to operator for Medium+ / High+ events

---

## Slide 8: Team

| Role | Name | Focus |
|---|---|---|
| Frontend (Live Feed + Alerts) | **Dorcas** | Camera grid, alert list, integration |
| Backend API Developer | **Albert** | REST endpoints, WebSocket, auth |
| AI Engine Developer | **Jean de Dieu** | YOLOv8, OpenCV, inference pipeline |
| Database + Alert System | **Isabelle** | PostgreSQL schema, Twilio, SendGrid |
| Frontend (Auth + Analytics) + Docs | **Niel** | Login, analytics, documentation |

---

## Slide 9: Roadmap

| Sprint | Deliverable | Status |
|---|---|---|
| S1 | DB schema, Auth endpoints, YOLOv8 loads | ✅ Complete |
| S2 | POST /api/detections, WebSocket, Twilio SMS tested | ✅ Complete |
| S3 | All pages wired to backend, Analytics done, Docs drafted | ✅ Complete |
| Post-S3 | Production deployment, load testing, pitch recording | 🔜 Next |

---

## Slide 10: Conclusion

**PERCEPTRA closes the gap between detection and response.**

- From video frame to operator alert in **milliseconds**
- No blind spots — AI monitors every camera, every frame
- Escalation logic ensures the right people are notified at the right time

**The result:** Faster response. Fewer false alarms. Safer environments.

---

### Contact

Team PERCEPTRA
[your-email@example.com]
