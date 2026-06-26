# routes/control.py
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

log = logging.getLogger("perceptra")

router = APIRouter()

# Injected from main.py
_engine_ref = None


def set_engine(engine):
    """Inject the running InferenceEngine instance from main.py."""
    global _engine_ref
    _engine_ref = engine


# ------------------------------------------------------------------
# Request schemas
# ------------------------------------------------------------------

class StartRequest(BaseModel):
    stream_url: str | None = None  # override STREAM_URL from .env


# ------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------

@router.get("/status")
async def get_status():
    """
    Returns current engine status.
    """
    if not _engine_ref:
        return { "running": False, "stream_url": None, "frame_count": 0 }

    return {
        "running":     _engine_ref.is_running(),
        "stream_url":  _engine_ref.stream_url,
        "frame_count": _engine_ref.frame_count,
        "fps":         round(_engine_ref.fps, 1),
    }


@router.post("/start")
async def start_engine(body: StartRequest = StartRequest()):
    """
    Start or restart the inference engine.
    Optionally override the stream URL.
    """
    if not _engine_ref:
        raise HTTPException(status_code=503, detail="Engine not initialized")

    if _engine_ref.is_running():
        return { "message": "Engine already running", "stream_url": _engine_ref.stream_url }

    try:
        url = body.stream_url or None
        await _engine_ref.start(stream_url=url)
        return { "message": "Engine started", "stream_url": _engine_ref.stream_url }

    except Exception as e:
        log.error(f"[control] Start failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stop")
async def stop_engine():
    """
    Stop the inference engine.
    Stream endpoint will show placeholder until restarted.
    """
    if not _engine_ref:
        raise HTTPException(status_code=503, detail="Engine not initialized")

    if not _engine_ref.is_running():
        return { "message": "Engine already stopped" }

    try:
        await _engine_ref.stop()
        return { "message": "Engine stopped" }

    except Exception as e:
        log.error(f"[control] Stop failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/restart")
async def restart_engine(body: StartRequest = StartRequest()):
    """
    Stop and restart the inference engine.
    Useful for switching stream URLs without redeploying.
    """
    if not _engine_ref:
        raise HTTPException(status_code=503, detail="Engine not initialized")

    try:
        if _engine_ref.is_running():
            await _engine_ref.stop()

        url = body.stream_url or None
        await _engine_ref.start(stream_url=url)
        return { "message": "Engine restarted", "stream_url": _engine_ref.stream_url }

    except Exception as e:
        log.error(f"[control] Restart failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))