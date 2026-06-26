# core/stream.py
import cv2
import threading
import logging
from config import get_stream_source, STREAM_WIDTH, STREAM_HEIGHT

log = logging.getLogger("perceptra")


class VideoStream:
    """
    Captures frames from a camera or RTSP/HTTP stream in a background thread.
    Provides the latest frame on demand without blocking the inference loop.
    """

    def __init__(self):
        self._source  = get_stream_source()
        self._cap     = None
        self._frame   = None
        self._ret     = False
        self._lock    = threading.Lock()
        self._running = False
        self._thread  = None
        self.width    = STREAM_WIDTH
        self.height   = STREAM_HEIGHT
        self.fps      = 25.0

    def start(self):
        """Open the stream and start the background capture thread."""
        self._cap = cv2.VideoCapture(self._source)

        if not self._cap.isOpened():
            raise RuntimeError(f"[stream] Could not open source: {self._source}")

        # Apply resolution settings
        self._cap.set(cv2.CAP_PROP_FRAME_WIDTH,  self.width)
        self._cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)

        # Read actual values back
        self.width  = int(self._cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.height = int(self._cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        self.fps    = self._cap.get(cv2.CAP_PROP_FPS) or 25.0

        self._running = True
        self._thread  = threading.Thread(target=self._capture_loop, daemon=True)
        self._thread.start()

        log.info(f"[stream] Started — {self.width}x{self.height} @ {self.fps:.0f}fps — source: {self._source}")
        return self

    def _capture_loop(self):
        """Continuously read frames into memory."""
        while self._running:
            ret, frame = self._cap.read()
            if not ret:
                log.warning("[stream] Frame read failed — retrying...")
                continue
            with self._lock:
                self._ret   = ret
                self._frame = frame

    def read(self):
        """
        Return the latest (ret, frame) pair.
        Returns (False, None) if no frame has been captured yet.
        """
        with self._lock:
            if self._frame is None:
                return False, None
            return self._ret, self._frame.copy()

    def is_running(self) -> bool:
        return self._running and self._cap is not None and self._cap.isOpened()

    def stop(self):
        """Stop the capture thread and release the camera."""
        self._running = False
        if self._thread:
            self._thread.join(timeout=3)
        if self._cap:
            self._cap.release()
        log.info("[stream] Stopped.")