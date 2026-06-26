---
title: Perceptra AI Engine
emoji: ⬡
colorFrom: red
colorTo: yellow
sdk: docker
pinned: true
---

# ⬡ Perceptra AI Engine

AI-powered surveillance and threat detection engine built with YOLOv8 and FastAPI.
Streams live annotated video to the Perceptra dashboard and pushes detection events to the backend in real time.

---

## How It Works
Phone camera (IP Webcam app)

│

 ▼

ngrok public URL

│

▼

Perceptra AI Engine (this Space)

├── YOLOv8 object detection

├── Threat classification (low / medium / high / critical)

├── Loiter tracking

├── Face recognition (optional)

├── POST /api/events ──► Backend (Render)

└── GET /stream ───────► Frontend dashboard (live MJPEG feed)
---

## Setup Guide

### Step 1 — Phone Camera (Android)

1. Install **IP Webcam** from the Play Store (free)
2. Open the app → scroll to bottom → tap **Start server**
3. Note the URL shown — e.g. `http://192.168.1.105:8080`
4. Make sure your phone and PC are on the **same WiFi network**

### Step 2 — Expose Camera via ngrok

Install ngrok from [https://ngrok.com/download](https://ngrok.com/download)

```bash
# Sign up at ngrok.com and authenticate
ngrok config add-authtoken YOUR_NGROK_TOKEN

# Expose your phone's camera stream
ngrok http 192.168.1.105:8080
```

ngrok will give you a public URL:
Forwarding  https://abc123.ngrok-free.app -> http://192.168.1.105:8080
Your stream URL is:
https://abc123.ngrok-free.app/video
Test it in your browser — you should see your phone camera feed.

### Step 3 — Configure Hugging Face Space Secrets

Go to your Space → **Settings** → **Repository secrets** and add:

| Secret | Value | Example |
|---|---|---|
| `STREAM_URL` | Your ngrok stream URL | `https://abc123.ngrok-free.app/video` |
| `BACKEND_REST_URL` | Your deployed backend | `https://perceptra-backend.onrender.com` |
| `BACKEND_WS_URL` | Your backend WebSocket | `wss://perceptra-backend.onrender.com/ws/events` |
| `CONFIDENCE_THRESHOLD` | Detection confidence | `0.45` |
| `FACE_RECOGNITION_ENABLED` | Enable face recognition | `false` |

### Step 4 — Embed Stream in Frontend

In your frontend `.env`:
```env
VITE_STREAM_URL=https://your-space-name.hf.space/stream
```

In `LiveFeed.tsx`, use:
```tsx
<img
  src={import.meta.env.VITE_STREAM_URL}
  alt="Live Feed"
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
```

### Step 5 — Enable Face Recognition (Optional)

Once your backend has registered persons via `POST /api/persons`:

1. Set `FACE_RECOGNITION_ENABLED=true` in Space secrets
2. Restart the Space
3. The engine will load registered faces from `GET /api/persons` at startup
4. Recognised persons will show their name on the bounding box

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Service info |
| `GET` | `/health` | Engine health check |
| `GET` | `/stream` | Live MJPEG video stream |
| `GET` | `/engine/status` | Inference engine status |
| `POST` | `/engine/start` | Start inference loop |
| `POST` | `/engine/stop` | Stop inference loop |
| `POST` | `/engine/restart` | Restart with new stream URL |
| `GET` | `/docs` | Interactive API docs (Swagger) |

---

## Severity Levels

| Level | Color | Trigger |
|---|---|---|
| `low` | Grey | Person or vehicle, low confidence |
| `medium` | Yellow | Elevated confidence or short loiter |
| `high` | Orange | Knife detected or extended loitering |
| `critical` | Red | Gun detected or score ≥ 0.80 |

Only `medium`, `high`, and `critical` events are sent to the backend.

---

## Embedding the Stream

The `/stream` endpoint returns a standard MJPEG stream compatible with any `<img>` tag:

```html
<img src="https://your-space-name.hf.space/stream" />
```

```tsx
// React
<img
  src="https://your-space-name.hf.space/stream"
  alt="Perceptra Live Feed"
  className="w-full h-full object-cover"
/>
```

The stream includes:
- Live bounding boxes with labels
- Severity color coding
- Identity name for registered persons
- HUD overlay with timestamp and detection count

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/HJeandedieu/perceptra-ai-service
cd perceptra-ai-service

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env
# Edit .env with your values

# Run locally
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Test stream
open http://localhost:8000/stream

# Check health
curl http://localhost:8000/health
```

---

## Tech Stack

| Component | Technology |
|---|---|
| API server | FastAPI + Uvicorn |
| Object detection | YOLOv8n (Ultralytics) |
| Computer vision | OpenCV (headless) |
| Face recognition | DeepFace + FaceNet (optional) |
| HTTP client | httpx |
| Video streaming | MJPEG over HTTP |
| Deployment | Hugging Face Spaces (Docker) |

---

## Project Links

- **Frontend**: [perceptra.onrender.com](https://perceptra.onrender.com)
- **Backend**: [perceptra-backend.onrender.com](https://perceptra-backend.onrender.com)
- **GitHub**: [github.com/HJeandedieu/SENTRY-AI-Surveillance-System](https://github.com/HJeandedieu/SENTRY-AI-Surveillance-System)

---

*Built for TechRobotics Competition Rwanda by the Perceptra Team*