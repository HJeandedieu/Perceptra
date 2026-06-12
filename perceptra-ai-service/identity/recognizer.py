# identity/recognizer.py
import numpy as np
import threading
import queue
from deepface import DeepFace
from identity.embeddings import get_known_faces
from utils.logger import log

MATCH_THRESHOLD = 0.10


class FaceRecognizer:
    """
    Runs FaceNet in a dedicated background worker thread.
    Main loop deposits frames via submit() and reads results via get_results().
    Recognition never blocks inference.
    """

    def __init__(self):
        self._input_queue  = queue.Queue(maxsize=1)
        self._results      = {}
        self._results_lock = threading.Lock()
        self._thread       = threading.Thread(target=self._worker, daemon=True)
        self._thread.start()
        log.info("[recognizer] Background recognition worker started.")

    # ------------------------------------------------------------------
    # Called from main loop — never blocks
    # ------------------------------------------------------------------

    def submit(self, frame, detections):
        """
        Submit a frame for recognition.
        Drops silently if worker is still busy.
        """
        try:
            self._input_queue.put_nowait((frame.copy(), detections))
        except queue.Full:
            pass

    def get_results(self):
        """Return latest identity results dict."""
        with self._results_lock:
            return dict(self._results)

    def apply(self, detections):
        """
        Apply latest known identities using proximity-based bbox matching.
        Handles moving persons whose bbox coordinates shift between frames.
        """
        results = self.get_results()

        for det in detections:
            if det["label"] != "person":
                det["identity"] = None
                det["name"]     = None
                continue

            # Find closest stored bbox to current detection center
            best_key  = None
            best_dist = float("inf")
            det_center = self._center(det["bbox"])

            for key in results:
                dist = self._distance(det_center, self._center(list(key)))
                if dist < best_dist:
                    best_dist = dist
                    best_key  = key

            # Within 80px = same person
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
        """Continuously pulls frames from queue and runs FaceNet."""
        while True:
            try:
                frame, detections = self._input_queue.get(timeout=1.0)
                new_results = {}

                for det in detections:
                    if det["label"] != "person":
                        continue

                    face_crop = self._crop(frame, det["bbox"])
                    if face_crop is None:
                        continue

                    name, score = self._match(face_crop)
                    bbox_key = tuple(det["bbox"])
                    new_results[bbox_key] = {
                        "identity": "registered" if name else "unknown",
                        "name":     name
                    }

                with self._results_lock:
                    self._results.update(new_results)

            except queue.Empty:
                continue
            except Exception as e:
                log.warning(f"[recognizer] Worker error: {e}")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _crop(self, frame, bbox):
        x1, y1, x2, y2 = bbox
        crop = frame[y1:y2, x1:x2]
        return crop if crop.size > 0 else None

    def _match(self, face_crop):
        known_faces = get_known_faces()
        if not known_faces:
            return None, 0.0

        try:
            result = DeepFace.represent(
                face_crop,
                model_name="Facenet",
                enforce_detection=False
            )
            query = np.array(result[0]["embedding"])
        except Exception as e:
            log.warning(f"[recognizer] Embedding failed: {e}")
            return None, 0.0

        best_name  = None
        best_score = 0.0

        for name, known_embedding in known_faces.items():
            score = self._cosine_similarity(query, known_embedding)
            if score > best_score:
                best_score = score
                best_name  = name

        # Debug log — shows actual similarity score
        log.info(
            f"[recognizer] Best match: {best_name} "
            f"score={best_score:.4f} "
            f"threshold={1 - MATCH_THRESHOLD:.4f}"
        )

        if best_score >= (1 - MATCH_THRESHOLD):
            log.info(f"[recognizer] Recognised: {best_name} ({best_score:.2f})")
            return best_name, best_score

        return None, best_score

    @staticmethod
    def _center(bbox):
        return ((bbox[0] + bbox[2]) // 2, (bbox[1] + bbox[3]) // 2)

    @staticmethod
    def _distance(a, b):
        return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5

    @staticmethod
    def _cosine_similarity(a, b):
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-10))