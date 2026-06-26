# config.py
import os
from dotenv import load_dotenv

load_dotenv()

# ------------------------------------------------------------------
# Stream source
# ------------------------------------------------------------------
# Set STREAM_URL to any RTSP, HTTP, or webcam index.
# Examples:
#   rtsp://admin:pass@192.168.1.64/stream1
#   http://192.168.1.64:8080/video
#   0  (default webcam)
STREAM_URL: str = os.getenv("STREAM_URL", "0")

# Convert "0", "1" etc to int for OpenCV webcam index
def get_stream_source():
    if STREAM_URL.isdigit():
        return int(STREAM_URL)
    return STREAM_URL

# ------------------------------------------------------------------
# Model
# ------------------------------------------------------------------
MODEL_PATH:           str   = os.getenv("MODEL_PATH",           "models/yolov8n.pt")
CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.45"))

_raw_classes = os.getenv("TARGET_CLASSES", "")
TARGET_CLASSES = (
    [int(c) for c in _raw_classes.split(",") if c.strip().isdigit()]
    if _raw_classes else None
)

# ------------------------------------------------------------------
# Backend
# ------------------------------------------------------------------
BACKEND_REST_URL: str = os.getenv("BACKEND_REST_URL", "http://localhost:5000")
BACKEND_WS_URL:   str = os.getenv("BACKEND_WS_URL",   "ws://localhost:5000/ws/events")

# ------------------------------------------------------------------
# Face recognition
# ------------------------------------------------------------------
FACE_RECOGNITION_ENABLED:  bool = os.getenv("FACE_RECOGNITION_ENABLED", "false").lower() == "true"
FACE_RECOGNITION_INTERVAL: int  = int(os.getenv("FACE_RECOGNITION_INTERVAL", "15"))
FACE_MATCH_THRESHOLD:      float = float(os.getenv("FACE_MATCH_THRESHOLD", "0.15"))

# ------------------------------------------------------------------
# Stream output
# ------------------------------------------------------------------
MJPEG_QUALITY:   int = int(os.getenv("MJPEG_QUALITY",   "80"))   # JPEG quality 1-100
MJPEG_MAX_FPS:   int = int(os.getenv("MJPEG_MAX_FPS",   "25"))   # cap stream FPS
STREAM_WIDTH:    int = int(os.getenv("STREAM_WIDTH",    "640"))
STREAM_HEIGHT:   int = int(os.getenv("STREAM_HEIGHT",   "480"))

# ------------------------------------------------------------------
# Severity colors (BGR for OpenCV)
# ------------------------------------------------------------------
SEVERITY_COLORS: dict = {
    "low":      (200, 200, 200),
    "medium":   (0,   220, 255),
    "high":     (0,   140, 255),
    "critical": (0,   0,   255),
}

# ------------------------------------------------------------------
# Alert thresholds
# ------------------------------------------------------------------
LOITER_THRESHOLD_SECONDS: int = int(os.getenv("LOITER_THRESHOLD_SECONDS", "30"))

# ------------------------------------------------------------------
# Validate required vars at startup
# ------------------------------------------------------------------
REQUIRED = ["BACKEND_REST_URL"]
missing = [k for k in REQUIRED if not os.getenv(k)]
if missing:
    raise RuntimeError(f"[config] Missing required environment variables: {missing}")