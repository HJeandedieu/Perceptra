# config.py
import os

# ---------------------------------------------------------------------------
# Central configuration for the entire ai_engine.
# All modules import their settings from here — never hardcode values elsewhere.
# Override any value via environment variables for deployment flexibility.
# ---------------------------------------------------------------------------


# ------------------------------------------------------------------
# Camera / Stream
# ------------------------------------------------------------------

# Index for local USB/webcam (0 = default camera)
CAM_INDEX: int = int(os.getenv("CAM_INDEX", 0))

# Set RTSP_URL to use an IP camera instead of local webcam
# Example: "rtsp://admin:password@192.168.1.64/stream1"
RTSP_URL: str = os.getenv("RTSP_URL", "test_footage/street.mp4")


# ------------------------------------------------------------------
# YOLOv8 Model
# ------------------------------------------------------------------

# Path to the YOLOv8 weights file
MODEL_PATH: str = os.getenv("MODEL_PATH", "models/yolov8n.pt")

# Minimum confidence to accept a detection (0.0 – 1.0)
CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", 0.45))

# YOLO class indices to detect — None means detect all classes
# Example: [0, 1] detects only person (0) and bicycle (1)
# Full COCO class list: https://docs.ultralytics.com/datasets/detect/coco
_raw_classes = os.getenv("TARGET_CLASSES", "")
TARGET_CLASSES = (
    [int(c) for c in _raw_classes.split(",") if c.strip().isdigit()]
    if _raw_classes else None
)


# ------------------------------------------------------------------
# Backend Integration (bridge/)
# ------------------------------------------------------------------

# REST endpoint — ai_engine POSTs events here
BACKEND_REST_URL: str = os.getenv("BACKEND_REST_URL", "http://localhost:5000")

# WebSocket endpoint — ai_engine streams events here
BACKEND_WS_URL: str = os.getenv("BACKEND_WS_URL", "ws://localhost:5000/ws/events")

# Port for the /health heartbeat server (bridge/health.py)
HEALTH_PORT: int = int(os.getenv("HEALTH_PORT", 8080))


# ------------------------------------------------------------------
# Threat Scoring
# ------------------------------------------------------------------

# Seconds an object must dwell before loiter penalty applies
LOITER_THRESHOLD_SECONDS: int = int(os.getenv("LOITER_THRESHOLD_SECONDS", 30))


# ------------------------------------------------------------------
# Severity → BGR Color Map
# Used by core/annotator.py and utils/draw.py
# ------------------------------------------------------------------

SEVERITY_COLORS: dict = {
    "low":      (200, 200, 200),   # grey
    "medium":   (0,   220, 255),   # yellow
    "high":     (0,   140, 255),   # orange
    "critical": (0,   0,   255),   # red
}


# ------------------------------------------------------------------
# Display
# ------------------------------------------------------------------

# Show annotated OpenCV window during development (set to False in production)
SHOW_PREVIEW: bool = os.getenv("SHOW_PREVIEW", "false").lower() == "true"

# Window title for the preview window
PREVIEW_WINDOW_TITLE: str = "Perceptra — AI Engine"