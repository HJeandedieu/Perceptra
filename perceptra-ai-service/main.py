# main.py
from identity.recognizer import FaceRecognizer
from identity.embeddings import load_registered_faces
import cv2
import time
import signal
import sys
from config import SHOW_PREVIEW, PREVIEW_WINDOW_TITLE
from core.stream import VideoStream
from core.detector import Detector
from core.annotator import Annotator
from threat.classifier import ThreatClassifier
from bridge.publisher import Publisher
from bridge.health import start_health_server, mark_running, mark_error, tick
from models.loader import load_model
from utils.logger import log
from utils.draw import draw_hud, draw_alert_flash, draw_no_signal

# ---------------------------------------------------------------------------
# Entry point — starts the Perceptra AI engine.
# Wires all modules together into a single inference loop.
# ---------------------------------------------------------------------------

FACE_RECOGNITION_INTERVAL = 15  # submit frame to worker every N frames


def main():
    log.info("=" * 55)
    log.info("  PERCEPTRA AI Engine — Starting")
    log.info("=" * 55)

    # --- Load model first (fails fast if weights missing) ---
    load_model()
    load_registered_faces()
    recognizer = FaceRecognizer()

    # --- Start heartbeat server ---
    start_health_server()

    # --- Initialize all modules ---
    stream     = VideoStream()
    detector   = Detector()
    annotator  = Annotator()
    classifier = ThreatClassifier()
    publisher  = Publisher()

    # --- Start camera stream ---
    stream.start()
    log.info(f"[main] Stream started — {stream.width}x{stream.height} @ {stream.fps:.0f}fps")

    # --- Graceful shutdown on Ctrl+C or SIGTERM ---
    def shutdown(sig=None, frame=None):
        log.info("[main] Shutting down...")
        stream.stop()
        publisher.close()
        if SHOW_PREVIEW:
            cv2.destroyAllWindows()
        sys.exit(0)

    signal.signal(signal.SIGINT,  shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    # --- Mark engine as running ---
    mark_running()
    log.info("[main] Inference loop starting...")

    frame_count  = 0
    fps_timer    = time.time()
    fps          = 0.0
    FPS_INTERVAL = 30  # recalculate FPS every N frames

    # ---------------------------------------------------------------
    # Main inference loop
    # ---------------------------------------------------------------
    while True:
        ret, frame = stream.read()

        if not ret or frame is None:
            log.warning("[main] No frame received — camera unavailable.")
            mark_error("Camera feed lost")

            if SHOW_PREVIEW:
                blank = _blank_frame(stream.width, stream.height)
                draw_no_signal(blank)
                cv2.imshow(PREVIEW_WINDOW_TITLE, blank)
                if cv2.waitKey(1) & 0xFF == ord("q"):
                    shutdown()

            time.sleep(0.5)
            continue

        frame_count += 1

        # --- Detect ---
        detections = detector.detect(frame)

        # --- Submit frame to recognition worker every N frames ---
        if frame_count % FACE_RECOGNITION_INTERVAL == 0:
            recognizer.submit(frame, detections)

        # --- Apply latest known identities (always fast, never blocks) ---
        detections = recognizer.apply(detections)

        # --- Classify ---
        detections = classifier.classify(detections)

        # --- Publish (medium / high / critical only) ---
        publisher.publish(detections, frame_id=frame_count)

        # --- Annotate ---
        if SHOW_PREVIEW:
            if detections:
                top_severity = _highest_severity(detections)
                draw_alert_flash(frame, top_severity)

            annotator.draw(frame, detections)

            if frame_count % FPS_INTERVAL == 0:
                elapsed   = time.time() - fps_timer
                fps       = FPS_INTERVAL / elapsed if elapsed > 0 else 0.0
                fps_timer = time.time()

            draw_hud(frame, frame_count, fps, len(detections))
            cv2.imshow(PREVIEW_WINDOW_TITLE, frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                shutdown()

        # --- Heartbeat tick ---
        tick(frame_count)

        if frame_count % 100 == 0:
            log.info(
                f"[main] Frame {frame_count} | "
                f"FPS: {fps:.1f} | "
                f"Detections: {len(detections)}"
            )


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------

def _highest_severity(detections: list) -> str:
    """Return the most critical severity level across all detections."""
    order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
    return max(detections, key=lambda d: order.get(d.get("severity", "low"), 0))["severity"]


def _blank_frame(width: int, height: int):
    """Return a black frame of given dimensions."""
    import numpy as np
    return np.zeros((height, width, 3), dtype="uint8")


if __name__ == "__main__":
    main()