# threat/loiter.py
import time

POSITION_TOLERANCE: int   = 60    # pixels — max distance to match same object
STALE_TIMEOUT:      float = 5.0   # seconds before removing a lost track


class LoiterTracker:
    """
    Tracks how long each detected object has been in the scene.
    Uses bounding box center proximity to match objects across frames.
    No external tracking library needed.
    """

    def __init__(self):
        self._tracks:  dict[int, dict] = {}
        self._next_id: int             = 0

    def update(self, bbox: list, label: str) -> float:
        """
        Register or update a detection.

        Returns:
            Dwell time in seconds. 0.0 if newly seen.
        """
        center = _center(bbox)
        now    = time.time()
        track  = self._find(center, label)

        if track is None:
            self._tracks[self._next_id] = {
                "center":     center,
                "label":      label,
                "first_seen": now,
                "last_seen":  now,
            }
            self._next_id += 1
            return 0.0

        track["center"]    = center
        track["last_seen"] = now
        return now - track["first_seen"]

    def purge_stale(self, active_bboxes: list):
        """
        Remove tracks for objects no longer in frame.
        Call once per frame after all detections are processed.
        """
        now            = time.time()
        active_centers = [_center(b) for b in active_bboxes]

        stale = [
            tid for tid, track in self._tracks.items()
            if (now - track["last_seen"]) > STALE_TIMEOUT
            and not any(
                _distance(track["center"], c) < POSITION_TOLERANCE
                for c in active_centers
            )
        ]

        for tid in stale:
            del self._tracks[tid]

    def _find(self, center: tuple, label: str) -> dict | None:
        """Return closest matching track or None."""
        best      = None
        best_dist = float("inf")

        for track in self._tracks.values():
            if track["label"] != label:
                continue
            dist = _distance(track["center"], center)
            if dist < POSITION_TOLERANCE and dist < best_dist:
                best      = track
                best_dist = dist

        return best


# ------------------------------------------------------------------
# Module-level helpers
# ------------------------------------------------------------------

def _center(bbox: list) -> tuple:
    x1, y1, x2, y2 = bbox
    return ((x1 + x2) // 2, (y1 + y2) // 2)


def _distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5