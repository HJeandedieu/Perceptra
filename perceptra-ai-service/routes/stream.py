# routes/stream.py
import cv2
import asyncio
import logging
import time
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from config import MJPEG_QUALITY, MJPEG_MAX_FPS

log = logging.getLogger("perceptra")

router = APIRouter()

# These are injected from main.py after engine starts
_get_annotated_frame = None


def set_frame_provider(fn):
    """
    Inject the frame provider function from main.py.
    fn must be a callable that returns the latest annotated BGR frame or None.
    """
    global _get_annotated_frame
    _get_annotated_frame = fn


@router.get("/stream")
async def mjpeg_stream():
    """
    MJPEG stream endpoint.
    Frontend embeds this as:
        <img src="https://your-ai-service.com/stream" />

    Returns a continuous multipart/x-mixed-replace stream of JPEG frames.
    """
    return StreamingResponse(
        _generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame",
        headers={
            "Cache-Control":             "no-cache, no-store, must-revalidate",
            "Pragma":                    "no-cache",
            "Expires":                   "0",
            "Access-Control-Allow-Origin": "*",
        },
    )


async def _generate_frames():
    """
    Async generator that yields MJPEG frames.
    Caps output at MJPEG_MAX_FPS to avoid overwhelming the client.
    """
    min_interval = 1.0 / MJPEG_MAX_FPS
    last_sent    = 0.0

    while True:
        now = time.time()

        # Enforce FPS cap
        elapsed = now - last_sent
        if elapsed < min_interval:
            await asyncio.sleep(min_interval - elapsed)
            continue

        # Get latest annotated frame
        frame = None
        if _get_annotated_frame:
            frame = _get_annotated_frame()

        if frame is None:
            # Send a black placeholder if no frame available yet
            frame = _black_frame()

        # Encode to JPEG
        ok, buffer = cv2.imencode(
            ".jpg",
            frame,
            [cv2.IMWRITE_JPEG_QUALITY, MJPEG_QUALITY],
        )

        if not ok:
            await asyncio.sleep(0.05)
            continue

        jpg_bytes = buffer.tobytes()

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n"
            b"Content-Length: " + str(len(jpg_bytes)).encode() + b"\r\n"
            b"\r\n" + jpg_bytes + b"\r\n"
        )

        last_sent = time.time()


def _black_frame():
    """Return a black 640x480 frame as placeholder."""
    import numpy as np
    frame = np.zeros((480, 640, 3), dtype=np.uint8)
    cv2.putText(
        frame,
        "Connecting to stream...",
        (160, 240),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (100, 100, 100),
        1,
        cv2.LINE_AA,
    )
    return frame