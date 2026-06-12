# threat/loiter.py
import time

# How close two bounding box centers must be (in pixels)
# to be considered the same object across frames
POSITION_TOLERANCE = 60  # pixels

# Seconds before a stale track is removed (object left frame)
STALE_TIMEOUT = 5.0


class LoiterTracker:
    """
    Tracks how long each detected object has been stationary in the scene.
    Uses bounding box center proximity to match objects across frames.
    No external tracking library needed — lightweight and self-contained.
    """

    def __init__(self):
        # track_id -> { "center", "label", "first_seen", "last_seen" }
        self._tracks = {}
        self._next_id = 0

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def update(self, bbox: list, label: str) -> float:
        """
        Register or update a detection and return its dwell time in seconds.

        Args:
            bbox:  [x1, y1, x2, y2]
            label: YOLO class label

        Returns:
            Dwell time in seconds (float). 0.0 if newly seen.
        """
        center = self._center(bbox)
        now = time.time()

        track = self._find_matching_track(center, label)

        if track is None:
            # New object — create a fresh track
            self._tracks[self._next_id] = {
                "center": center,
                "label": label,
                "first_seen": now,
                "last_seen": now,
            }
            self._next_id += 1
            return 0.0
        else:
            # Existing object — update and return dwell time
            track["center"] = center
            track["last_seen"] = now
            return now - track["first_seen"]

    def purge_stale(self, active_bboxes: list):
        """
        Remove tracks for objects no longer appearing in the frame.
        Call once per frame after all detections are processed.

        Args:
            active_bboxes: list of [x1, y1, x2, y2] from current detections
        """
        now = time.time()
        active_centers = [self._center(b) for b in active_bboxes]

        stale_ids = []
        for track_id, track in self._tracks.items():
            last_seen_ago = now - track["last_seen"]
            still_visible = any(
                self._distance(track["center"], c) < POSITION_TOLERANCE
                for c in active_centers
            )
            if not still_visible and last_seen_ago > STALE_TIMEOUT:
                stale_ids.append(track_id)

        for track_id in stale_ids:
            del self._tracks[track_id]

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _find_matching_track(self, center: tuple, label: str):
        """Return the closest matching track dict, or None if no match."""
        best = None
        best_dist = float("inf")

        for track in self._tracks.values():
            if track["label"] != label:
                continue
            dist = self._distance(track["center"], center)
            if dist < POSITION_TOLERANCE and dist < best_dist:
                best = track
                best_dist = dist

        return best

    @staticmethod
    def _center(bbox: list) -> tuple:
        """Return (cx, cy) from [x1, y1, x2, y2]."""
        x1, y1, x2, y2 = bbox
        return ((x1 + x2) // 2, (y1 + y2) // 2)

    @staticmethod
    def _distance(a: tuple, b: tuple) -> float:
        """Euclidean distance between two (x, y) points."""
        return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5