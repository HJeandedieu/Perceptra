# bridge/publisher.py
import httpx
import asyncio
import json
import time
from bridge.event_schema import build_event_payload
from config import BACKEND_REST_URL, BACKEND_WS_URL
from utils.logger import log

_last_rest_error_log = 0
_last_ws_error_log   = 0
_ERROR_COOLDOWN      = 60  # seconds between repeated error logs


class Publisher:
    """
    The only module that communicates with the outside world.
    Sends threat events to the backend via:
      - REST (POST) for persistent event logging
      - WebSocket for real-time dashboard updates
    """

    def __init__(self):
        self._ws            = None
        self._ws_connected  = False
        self._loop          = asyncio.new_event_loop()
        self._client        = httpx.AsyncClient(timeout=5.0)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def publish(self, detections: list, frame_id: int = 0):
        """
        Publish all medium/high/critical detections from a frame.
        Low severity detections are silently skipped.
        """
        publishable = [
            d for d in detections
            if d.get("severity", "low") != "low"
        ]

        if not publishable:
            return

        for det in publishable:
            payload = build_event_payload(det, frame_id)
            self._loop.run_until_complete(self._send(payload))

    def close(self):
        """Gracefully close HTTP client and WebSocket."""
        if self._loop.is_running():
            self._loop.call_soon_threadsafe(
                lambda: asyncio.ensure_future(self._shutdown(), loop=self._loop)
            )
        else:
            self._loop.run_until_complete(self._shutdown())
            self._loop.close()

    # ------------------------------------------------------------------
    # Internal — REST
    # ------------------------------------------------------------------

    async def _post_event(self, payload: dict):
        """POST a single event to the backend REST endpoint."""
        global _last_rest_error_log

        try:
            response = await self._client.post(
                f"{BACKEND_REST_URL}/api/events",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            if response.status_code not in (200, 201):
                log.warning(
                    f"[publisher] REST POST failed: {response.status_code} — {response.text}"
                )
            else:
                log.info(f"[publisher] Event posted: {payload['label']} [{payload['severity']}]")

        except httpx.RequestError:
            now = time.time()
            if now - _last_rest_error_log > _ERROR_COOLDOWN:
                log.error("[publisher] REST unreachable — backend not running")
                _last_rest_error_log = now

    # ------------------------------------------------------------------
    # Internal — WebSocket
    # ------------------------------------------------------------------

    async def _ensure_ws(self):
        """Open WebSocket connection if not already connected."""
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
        """Send payload over WebSocket. Falls back silently on failure."""
        global _last_ws_error_log

        await self._ensure_ws()
        if not self._ws_connected:
            now = time.time()
            if now - _last_ws_error_log > _ERROR_COOLDOWN:
                log.warning("[publisher] WebSocket unreachable — backend not running")
                _last_ws_error_log = now
            return

        try:
            await self._ws.send(json.dumps(payload))
        except Exception:
            self._ws_connected = False

    # ------------------------------------------------------------------
    # Internal — Combined send
    # ------------------------------------------------------------------

    async def _send(self, payload: dict):
        """Fire both REST and WebSocket sends concurrently."""
        await asyncio.gather(
            self._post_event(payload),
            self._send_ws(payload),
            return_exceptions=True
        )

    async def _shutdown(self):
        await self._client.aclose()
        if self._ws and self._ws_connected:
            await self._ws.close()