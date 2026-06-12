# core/stream.py
import cv2
import threading
from config import CAM_INDEX, RTSP_URL

class VideoStream:
    """
    Captures frames from a camera or RTSP stream in a background thread.
    Provides the latest frame to detector.py on demand.
    """

    def __init__(self):
        source = RTSP_URL if RTSP_URL else CAM_INDEX
        self.cap = cv2.VideoCapture(source)

        if not self.cap.isOpened():
            from utils.logger import log
            log.warning(f"[stream] Could not open video source: {source} — will retry on read()")

        self.ret = False
        self.frame = None
        self.running = False
        self._lock = threading.Lock()
        self._thread = None

    def start(self):
        """Start the background capture thread."""
        self.running = True
        self._thread = threading.Thread(target=self._capture_loop, daemon=True)
        self._thread.start()
        return self

    def _capture_loop(self):
        """Continuously read frames into memory."""
        while self.running:
            ret, frame = self.cap.read()
            
            if not ret:
                self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # loop back to start
                continue
            
            with self._lock:
                self.ret = ret
                self.frame = frame

    def read(self):
        """Return the latest (ret, frame) pair."""
        with self._lock:
            if self.frame is None:
                return False, None
            return self.ret, self.frame.copy()

    def stop(self):
        """Stop the capture thread and release the camera."""
        self.running = False
        if self._thread:
            self._thread.join(timeout=2)
        self.cap.release()

    @property
    def width(self):
        return int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))

    @property
    def height(self):
        return int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    @property
    def fps(self):
        return self.cap.get(cv2.CAP_PROP_FPS) or 30