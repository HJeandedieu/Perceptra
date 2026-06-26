# routes/health.py
import time
import logging
from fastapi import APIRouter
from pydantic import BaseModel

log = logging.getLogger("perceptra")

router = APIRouter()

# ------------------------------------------------------------------
# Engine state — updated from main.py
# ------------------------------------------------------------------

_state: dict = {
    "status":      "starting",
    "started_at":  None,
    "stream_url":  None,
    "frame_count": 0,
    "last_frame":  None,
    "fps":         0.0,
    "error":       None,
}


def mark_running(stream_url: str):
    _state["status"]     = "running"
    _state["started_at"] = _now()
    _state["stream_url"] = stream_url
    _state["error"]      = None


def mark_error(message: str):
    _state["status"] = "error"
    _state["error"]  = message


def tick(frame_count: int, fps: float):
    _state["frame_count"] = frame_count
    _state["last_frame"]  = _now()
    _state["fps"]         = round(fps, 1)


# ------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------

@router.get("/health")
async def health():
    """
    Health check endpoint.
    Returns 200 when running, 503 when starting or in error state.
    Called by backend to verify AI engine is alive.
    """
    status_code = 200 if _state["status"] == "running" else 503

    return {
        "service":     "perceptra-ai-engine",
        "status":      _state["status"],
        "started_at":  _state["started_at"],
        "stream_url":  _state["stream_url"],
        "frame_count": _state["frame_count"],
        "last_frame":  _state["last_frame"],
        "fps":         _state["fps"],
        "error":       _state["error"],
    }


@router.get("/")
async def root():
    """Root endpoint — confirms service is up."""
    return {
        "service": "Perceptra AI Engine",
        "status":  _state["status"],
        "docs":    "/docs",
        "stream":  "/stream",
        "health":  "/health",
    }


# ------------------------------------------------------------------
# Internal
# ------------------------------------------------------------------

def _now() -> str:
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat()