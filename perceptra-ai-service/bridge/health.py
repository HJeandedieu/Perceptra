# bridge/health.py
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from datetime import datetime, timezone
from config import HEALTH_PORT
from utils.logger import log
import os

# ---------------------------------------------------------------------------
# Exposes a lightweight /health endpoint so the backend can verify
# the AI engine is alive without going through the main event pipeline.
# Runs in its own daemon thread — zero impact on inference loop.
# ---------------------------------------------------------------------------

_engine_status = {
    "status":      "starting",   # "starting" | "running" | "error"
    "started_at":  None,
    "last_frame":  None,         # ISO timestamp of last processed frame
    "frame_count": 0,
    "error":       None,
}

_lock = threading.Lock()


# ------------------------------------------------------------------
# Public API — called from main.py
# ------------------------------------------------------------------

def mark_running():
    """Call once the inference loop starts successfully."""
    with _lock:
        _engine_status["status"] = "running"
        _engine_status["started_at"] = datetime.now(timezone.utc).isoformat()
        _engine_status["error"] = None


def mark_error(message: str):
    """Call if the engine crashes or encounters a fatal error."""
    with _lock:
        _engine_status["status"] = "error"
        _engine_status["error"] = message


def tick(frame_count: int):
    """
    Call on every processed frame to keep the heartbeat fresh.

    Args:
        frame_count: total frames processed since engine started
    """
    with _lock:
        _engine_status["last_frame"] = datetime.now(timezone.utc).isoformat()
        _engine_status["frame_count"] = frame_count


# ------------------------------------------------------------------
# HTTP handler
# ------------------------------------------------------------------

class _HealthHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path != "/health":
            self._respond(404, {"error": "Not found"})
            return

        with _lock:
            payload = dict(_engine_status)

        http_code = 200 if payload["status"] == "running" else 503
        self._respond(http_code, payload)

    def _respond(self, code: int, body: dict):
        encoded = json.dumps(body).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def log_message(self, format, *args):
        # Silence default HTTP server stdout noise
        pass


# ------------------------------------------------------------------
# Server bootstrap
# ------------------------------------------------------------------

def start_health_server():
    """
    Start the /health HTTP server in a background daemon thread.
    Call once from main.py before starting the inference loop.
    """
    port = int(os.environ.get("PORT", HEALTH_PORT))
    server = HTTPServer(("0.0.0.0", port), _HealthHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    log.info(f"[health] Heartbeat server running on port {HEALTH_PORT} → GET /health")