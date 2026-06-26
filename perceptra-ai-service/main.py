# main.py
import asyncio
import logging
import threading
import time
import cv2
import numpy as np
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import (
    FACE_RECOGNITION_ENABLED,
    FACE_RECOGNITION_INTERVAL,
    MJPEG_MAX_FPS,
    get_stream_source,
)
from core.stream import VideoStream
from core.detector import detect, load_model
from core.annotator import annotate
from threat.classifier import ThreatClassifier
from bridge.publisher import Publisher
from identity.embeddings import load_registered_faces
from identity.recognizer import FaceRecognizer
from routes.stream import router as stream_router, set_frame_provider
from routes.health import router as health_router, mark_running, mark_error, tick
from routes.control import router as control_router, set_engine

# ------------------------------------------------------------------
# Logging
# ------------------------------------------------------------------
logging.basicConfig(
    level  = logging.INFO,
    format = "[%(levelname)s] %(asctime)s | %(message)s",
    datefmt= "%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("perceptra")


# ------------------------------------------------------------------
# Inference Engine
# ------------------------------------------------------------------

class InferenceEngine:
    """
    Manages the full inference pipeline:
    stream → detect → identify → classify → publish → annotate
    Runs in a background thread. Exposes latest annotated frame for MJPEG.
    """

    def __init__(self, publisher: Publisher, recognizer: FaceRecognizer):
        self._publisher   = publisher
        self._recognizer  = recognizer
        self._stream:     VideoStream | None = None
        self._thread:     threading.Thread  | None = None
        self._running     = False
        self._classifier  = ThreatClassifier()
        self._loop:       asyncio.AbstractEventLoop | None = None

        # Latest annotated frame — read by MJPEG route
        self._frame_lock    = threading.Lock()
        self._latest_frame: np.ndarray | None = None

        # Public stats
        self.frame_count = 0
        self.fps         = 0.0
        self.stream_url  = None

    async def start(self, stream_url: str | None = None):
        """Start the inference loop in a background thread."""
        if self._running:
            return

        # Allow stream_url override from control route
        if stream_url:
            import os
            os.environ["STREAM_URL"] = stream_url

        self._loop   = asyncio.get_event_loop()
        self._stream = VideoStream()
        self._stream.start()
        self.stream_url = str(get_stream_source())

        self._running = True
        self._thread  = threading.Thread(
            target = self._inference_loop,
            daemon = True,
        )
        self._thread.start()

        mark_running(self.stream_url)
        log.info(f"[engine] Started — stream: {self.stream_url}")

    async def stop(self):
        """Stop the inference loop and release resources."""
        self._running = False
        if self._thread:
            self._thread.join(timeout=5)
        if self._stream:
            self._stream.stop()
        self._stream = None
        log.info("[engine] Stopped.")

    def is_running(self) -> bool:
        return self._running

    def get_latest_frame(self) -> np.ndarray | None:
        """Called by MJPEG route on every frame request."""
        with self._frame_lock:
            return self._latest_frame.copy() if self._latest_frame is not None else None

    # ------------------------------------------------------------------
    # Inference loop — runs in background thread
    # ------------------------------------------------------------------

    def _inference_loop(self):
        fps_timer    = time.time()
        fps_counter  = 0
        min_interval = 1.0 / MJPEG_MAX_FPS

        while self._running:
            loop_start = time.time()

            ret, frame = self._stream.read()

            if not ret or frame is None:
                log.warning("[engine] No frame — waiting...")
                mark_error("Stream unavailable")
                time.sleep(0.5)
                continue

            self.frame_count += 1
            fps_counter      += 1

            # --- Detect ---
            detections = detect(frame)

            # --- Identity ---
            if FACE_RECOGNITION_ENABLED:
                if self.frame_count % FACE_RECOGNITION_INTERVAL == 0:
                    self._recognizer.submit(frame, detections)
                detections = self._recognizer.apply(detections)
            else:
                for det in detections:
                    det["identity"] = None
                    det["name"]     = None

            # --- Classify ---
            detections = self._classifier.classify(detections)

            # --- Publish (non-blocking, fires async task) ---
            if self._loop and self._loop.is_running():
                asyncio.run_coroutine_threadsafe(
                    self._publisher.publish(detections, self.frame_count),
                    self._loop,
                )

            # --- Annotate ---
            annotated = annotate(frame, detections)

            # --- Store latest frame for MJPEG ---
            with self._frame_lock:
                self._latest_frame = annotated

            # --- FPS calculation every 30 frames ---
            if fps_counter >= 30:
                elapsed      = time.time() - fps_timer
                self.fps     = fps_counter / elapsed if elapsed > 0 else 0.0
                fps_timer    = time.time()
                fps_counter  = 0
                tick(self.frame_count, self.fps)
                log.info(
                    f"[engine] Frame {self.frame_count} | "
                    f"FPS: {self.fps:.1f} | "
                    f"Detections: {len(detections)}"
                )

            # --- Cap loop speed ---
            elapsed = time.time() - loop_start
            if elapsed < min_interval:
                time.sleep(min_interval - elapsed)


# ------------------------------------------------------------------
# FastAPI lifespan
# ------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("=" * 55)
    log.info("  PERCEPTRA AI Engine — Starting")
    log.info("=" * 55)

    # Load model
    load_model()

    # Load registered faces
    await load_registered_faces()

    # Init services
    publisher  = Publisher()
    recognizer = FaceRecognizer()
    engine     = InferenceEngine(publisher, recognizer)

    await publisher.start()

    # Inject into routes
    set_frame_provider(engine.get_latest_frame)
    set_engine(engine)

    # Start engine
    await engine.start()

    log.info("[app] All systems running.")
    log.info("=" * 55)

    yield

    # Shutdown
    log.info("[app] Shutting down...")
    await engine.stop()
    await publisher.stop()
    log.info("[app] Shutdown complete.")


# ------------------------------------------------------------------
# FastAPI app
# ------------------------------------------------------------------

app = FastAPI(
    title       = "Perceptra AI Engine",
    description = "YOLOv8 surveillance detection service",
    version     = "2.0.0",
    lifespan    = lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["*"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

app.include_router(health_router)
app.include_router(stream_router)
app.include_router(control_router, prefix="/engine", tags=["Engine Control"])