# bridge/publisher.py
import httpx
import asyncio
import json
import time
import logging
from bridge.event_schema import build_event_payload
from config import BACKEND_REST_URL, BACKEND_WS_URL

log = logging.getLogger("perceptra")

_last_rest_error_log: float = 0
_last_ws_error_log:   float = 0
_ERROR_COOLDOWN:      int   = 60  # seconds between repeated error logs


class Publisher:
    """
    Sends threat events to the backend via REST and WebSocket.
    Designed to run inside FastAPI's async context.
    Only publishes medium / high / critical events.
    """

    def __init__(self):
        self._client:       httpx.AsyncClient | None = None
        self._ws                                      = None
        self._ws_connected: bool                      = False

    async def start(self):
        """Call once from FastAPI lifespan startup."""
        self._client = httpx.AsyncClient(timeout=5.0)
        log.info("[publisher] HTTP client ready.")

    async def stop(self):
        """Call once from FastAPI lifespan shutdown."""
        if self._client:
            await self._client.aclose()
        if self._ws and self._ws_connected:
            await self._ws.close()
        log.info("[publisher] Shut down.")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def publish(self, detections: list[dict], frame_id: int = 0):
        """
        Publish all non-low detections from a frame.
        Safe to call from background thread via asyncio.run_coroutine_threadsafe.
        """
        publishable = [
            d for d in detections
            if d.get("severity", "low") != "low"
        ]

        if not publishable:
            return

        for det in publishable:
            try:
                payload = build_event_payload(det, frame_id)
                await asyncio.gather(
                    self._post_event(payload),
                    self._send_ws(payload),
                    return_exceptions=True,
                )
            except Exception as e:
                log.warning(f"[publisher] Publish error: {e}")

    # ------------------------------------------------------------------
    # REST
    # ------------------------------------------------------------------

    async def _post_event(self, payload: dict):
        global _last_rest_error_log

        if not self._client:
            return

        try:
            res = await self._client.post(
                f"{BACKEND_REST_URL}/api/events",
                json=payload,
                headers={"Content-Type": "application/json"},
            )
            if res.status_code in (200, 201):
                log.info(f"[publisher] Event posted: {payload['label']} [{payload['severity']}]")
            else:
                log.warning(f"[publisher] POST failed: {res.status_code} — {res.text}")

        except httpx.RequestError:
            now = time.time()
            if now - _last_rest_error_log > _ERROR_COOLDOWN:
                log.error("[publisher] Backend unreachable — check BACKEND_REST_URL")
                _last_rest_error_log = now

    # ------------------------------------------------------------------
    # WebSocket
    # ------------------------------------------------------------------

    async def _ensure_ws(self):
        if self._ws_connected:
            return
        try:
            import websockets
            self._ws           = await websockets.connect(BACKEND_WS_URL)
            self._ws_connected = True
            log.info(f"[publisher] WebSocket connected: {BACKEND_WS_URL}")
        except Exception:
            self._ws_connected = False

    async def _send_ws(self, payload: dict):
        global _last_ws_error_log

        await self._ensure_ws()

        if not self._ws_connected:
            now = time.time()
            if now - _last_ws_error_log > _ERROR_COOLDOWN:
                log.warning("[publisher] WebSocket unavailable — backend not running")
                _last_ws_error_log = now
            return

        try:
            await self._ws.send(json.dumps(payload))
        except Exception:
            self._ws_connected = False