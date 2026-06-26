# identity/recognizer.py
import numpy as np
import threading
import queue
import logging
from config import FACE_RECOGNITION_ENABLED, FACE_MATCH_THRESHOLD
from identity.embeddings import get_known_faces

log = logging.getLogger("perceptra")


class FaceRecognizer:
    """
    Runs FaceNet in a dedicated background worker thread.
    Never blocks the inference loop.
    Disabled entirely if FACE_RECOGNITION_ENABLED=false.
    """

    def __init__(self):
        self._enabled      = FACE_RECOGNITION_ENABLED
        self._input_queue  = queue.Queue(maxsize=1)
        self._results:     dict = {}
        self._results_lock = threading.Lock()

        if self._enabled:
            self._thread = threading.Thread(target=self._worker, daemon=True)
            self._thread.start()
            log.info("[recognizer] Background worker started.")
        else:
            log.info("[recognizer] Face recognition disabled.")

    # ------------------------------------------------------------------
    # Public API — called from inference loop
    # ------------------------------------------------------------------

    def submit(self, frame, detections: list[dict]):
        """Submit frame for background recognition. Non-blocking."""
        if not self._enabled:
            return
        try:
            self._input_queue.put_nowait((frame.copy(), detections))
        except queue.Full:
            pass  # worker busy — skip frame

    def apply(self, detections: list[dict]) -> list[dict]:
        """
        Apply latest known identities to detections using proximity matching.
        Always fast — never calls FaceNet directly.
        """
        if not self._enabled:
            for det in detections:
                if det["label"] == "person":
                    det["identity"] = "unknown"
                    det["name"]     = None
                else:
                    det["identity"] = None
                    det["name"]     = None
            return detections

        results = self._get_results()

        for det in detections:
            if det["label"] != "person":
                det["identity"] = None
                det["name"]     = None
                continue

            best_key  = None
            best_dist = float("inf")
            det_center = _center(det["bbox"])

            for key in results:
                dist = _distance(det_center, _center(list(key)))
                if dist < best_dist:
                    best_dist = dist
                    best_key  = key

            if best_key and best_dist < 80:
                det.update(results[best_key])
            else:
                det["identity"] = "unknown"
                det["name"]     = None

        return detections

    # ------------------------------------------------------------------
    # Background worker
    # ------------------------------------------------------------------

    def _worker(self):
        """Continuously pulls frames and runs FaceNet."""
        while True:
            try:
                frame, detections = self._input_queue.get(timeout=1.0)
                new_results = {}

                for det in detections:
                    if det["label"] != "person":
                        continue

                    crop = _crop(frame, det["bbox"])
                    if crop is None:
                        continue

                    name, score = self._match(crop)
                    bbox_key    = tuple(det["bbox"])
                    new_results[bbox_key] = {
                        "identity": "registered" if name else "unknown",
                        "name":     name,
                    }

                with self._results_lock:
                    self._results.update(new_results)

            except queue.Empty:
                continue
            except Exception as e:
                log.warning(f"[recognizer] Worker error: {e}")

    def _match(self, face_crop) -> tuple[str | None, float]:
        known_faces = get_known_faces()
        if not known_faces:
            return None, 0.0

        try:
            from deepface import DeepFace
            result = DeepFace.represent(
                face_crop,
                model_name        = "Facenet",
                enforce_detection = False,
            )
            query = np.array(result[0]["embedding"])
        except Exception as e:
            log.warning(f"[recognizer] Embedding failed: {e}")
            return None, 0.0

        best_name  = None
        best_score = 0.0

        for name, known_embedding in known_faces.items():
            score = _cosine_similarity(query, known_embedding)
            if score > best_score:
                best_score = score
                best_name  = name

        log.debug(
            f"[recognizer] Best: {best_name} "
            f"score={best_score:.4f} "
            f"threshold={1 - FACE_MATCH_THRESHOLD:.4f}"
        )

        if best_score >= (1 - FACE_MATCH_THRESHOLD):
            log.info(f"[recognizer] Recognised: {best_name} ({best_score:.2f})")
            return best_name, best_score

        return None, best_score

    def _get_results(self) -> dict:
        with self._results_lock:
            return dict(self._results)


# ------------------------------------------------------------------
# Module helpers
# ------------------------------------------------------------------

def _crop(frame, bbox: list):
    x1, y1, x2, y2 = bbox
    crop = frame[y1:y2, x1:x2]
    return crop if crop.size > 0 else None


def _center(bbox) -> tuple:
    return ((bbox[0] + bbox[2]) // 2, (bbox[1] + bbox[3]) // 2)


def _distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def _cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-10))