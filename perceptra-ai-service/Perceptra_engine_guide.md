# Perceptra AI Engine — Usage & Testing Guide

---

## 1. Project Structure

```
ai_engine/
├── main.py               # Entry point
├── config.py             # All settings (env-overridable)
├── requirements.txt
├── core/
│   ├── stream.py         # Camera capture loop
│   ├── detector.py       # YOLOv8 inference
│   └── annotator.py      # Draws bounding boxes on frames
├── threat/
│   ├── classifier.py     # Attaches severity to detections
│   ├── rules.py          # Scoring thresholds and label weights
│   └── loiter.py         # Tracks dwell time per object
├── bridge/
│   ├── publisher.py      # POSTs events to backend (REST + WebSocket)
│   ├── event_schema.py   # Shared payload contract
│   └── health.py         # GET /health heartbeat server
├── models/
│   └── loader.py         # Loads yolov8n.pt once at startup
├── utils/
│   ├── logger.py         # Shared structured logger
│   └── draw.py           # HUD, zone overlays, alert borders
└── tests/
    ├── test_detector.py
    ├── test_classifier.py
    └── test_publisher.py
```

---

## 2. Setup

### Install dependencies

```bash
pip install -r requirements.txt
```

### Download YOLOv8 weights

```bash
# Automatically downloads on first run, or manually:
yolo download model=yolov8n.pt
# Move to models/
mv yolov8n.pt models/
```

### Create logs directory

```bash
mkdir logs
```

---

## 3. Configuration

All settings live in `config.py` and can be overridden with environment variables — no code changes needed.

| Variable | Default | Description |
|---|---|---|
| `CAM_INDEX` | `0` | Local webcam index |
| `RTSP_URL` | `""` | IP camera stream (overrides CAM_INDEX) |
| `MODEL_PATH` | `models/yolov8n.pt` | Path to YOLOv8 weights |
| `CONFIDENCE_THRESHOLD` | `0.45` | Min detection confidence |
| `TARGET_CLASSES` | `None` (all) | Comma-separated YOLO class indices |
| `BACKEND_REST_URL` | `http://localhost:5000` | Backend API base URL |
| `BACKEND_WS_URL` | `ws://localhost:5000/ws/events` | WebSocket endpoint |
| `HEALTH_PORT` | `8080` | Port for `/health` endpoint |
| `SHOW_PREVIEW` | `true` | Show OpenCV preview window |

### Example — use an IP camera, hide preview window

```bash
RTSP_URL="rtsp://admin:pass@192.168.1.64/stream1" SHOW_PREVIEW=false python main.py
```

---

## 4. Running the Engine

```bash
python main.py
```

What happens on startup:

1. Model weights loaded from `models/yolov8n.pt`
2. Heartbeat server starts on `http://localhost:8080/health`
3. Camera stream opens
4. Inference loop begins — detect → classify → publish → annotate

**Stop the engine:** press `q` in the preview window, or `Ctrl+C` in the terminal.

---

## 5. Data Flow

```
Camera frame
    │
    ▼
core/stream.py        — captures frame in background thread
    │
    ▼
core/detector.py      — YOLOv8 inference → list of { label, confidence, bbox }
    │
    ▼
threat/classifier.py  — adds { severity, threat_score, loiter_seconds }
    │
    ├── threat/rules.py    — scores label + confidence
    └── threat/loiter.py   — tracks dwell time per bbox
    │
    ▼
bridge/publisher.py   — skips "low"; POSTs medium/high/critical to backend
    │
    ├── REST  →  POST /api/events
    └── WS    →  ws://backend/ws/events
    │
    ▼
core/annotator.py     — draws colored boxes + severity labels on frame
utils/draw.py         — draws HUD bar, alert border, zone overlays
```

---

## 6. Severity Levels

| Severity | Color | Trigger |
|---|---|---|
| `low` | Grey | Person, vehicle — low confidence, no loiter |
| `medium` | Yellow | Elevated score from confidence or dwell time |
| `high` | Orange | Knife, or high-confidence person loitering |
| `critical` | Red | Gun detected, or score ≥ 0.80 |

Only `medium`, `high`, and `critical` events are sent to the backend.

---

## 7. Health Check

While the engine is running, the backend can ping:

```bash
curl http://localhost:8080/health
```

**Response when healthy:**

```json
{
  "status": "running",
  "started_at": "2025-06-11T08:00:00+00:00",
  "last_frame": "2025-06-11T08:05:32+00:00",
  "frame_count": 4820,
  "error": null
}
```

Returns `200` when running, `503` on error or during startup.

---

## 8. Event Payload (sent to backend)

Every published event matches this shape:

```json
{
  "event_id":       "a3f2c1d4-...",
  "timestamp":      "2025-06-11T08:05:32.410Z",
  "label":          "knife",
  "confidence":     0.87,
  "bbox":           { "x1": 100, "y1": 150, "x2": 200, "y2": 400 },
  "severity":       "high",
  "threat_score":   0.696,
  "loiter_seconds": 12.5,
  "frame_id":       1042,
  "source":         "ai_engine"
}
```

---

## 9. Running Tests

### Run all tests

```bash
python -m pytest tests/ -v
```

### Run a specific test file

```bash
python -m pytest tests/test_detector.py -v
python -m pytest tests/test_classifier.py -v
python -m pytest tests/test_publisher.py -v
```

### What each test file covers

| File | What it tests |
|---|---|
| `test_detector.py` | YOLOv8 output parsing, confidence rounding, empty frames |
| `test_classifier.py` | Severity assignment, threat scoring, loiter accumulation, edge cases |
| `test_publisher.py` | Payload structure, validation errors, REST POST behaviour, low severity skipping |

All tests mock YOLO, HTTP, and WebSocket — **no camera, GPU, or backend server needed.**

---

## 10. Logs

Logs are written to both the console and a daily file:

```
logs/perceptra_20250611.log
```

Log format:

```
[INFO] 2025-06-11 08:05:32 | [main] Frame 1000 | FPS: 28.4 | Detections: 2
[INFO] 2025-06-11 08:05:32 | [publisher] Event posted: knife [high]
[WARNING] 2025-06-11 08:05:40 | [publisher] WebSocket send failed: ...
```

---

## 11. Common Issues

| Problem | Fix |
|---|---|
| `FileNotFoundError: models/yolov8n.pt` | Run `yolo download model=yolov8n.pt` and move to `models/` |
| `RuntimeError: Could not open video source` | Check `CAM_INDEX` or `RTSP_URL` in config |
| Backend POST returning 4xx | Verify `BACKEND_REST_URL` and that the backend is running |
| WebSocket not connecting | Check `BACKEND_WS_URL`; engine continues without WS |
| Preview window not opening | Set `SHOW_PREVIEW=true` and ensure a display is available |
| Low FPS | Switch to a GPU build of PyTorch; reduce frame resolution |