# bridge/event_schema.py
from datetime import datetime, timezone
import uuid

# ---------------------------------------------------------------------------
# This file defines the exact payload shape sent to the backend.
# Both the REST POST body and WebSocket message use this same structure.
# It must stay in sync with the backend's event model / database schema.
# ---------------------------------------------------------------------------

SUPPORTED_SEVERITIES = {"low", "medium", "high", "critical"}
SUPPORTED_LABELS = {
    "person", "knife", "gun", "scissors",
    "car", "truck", "motorcycle"
}


def build_event_payload(detection: dict, frame_id: int = 0) -> dict:
    """
    Build a standardized event payload from a classified detection dict.

    Args:
        detection: dict from ThreatClassifier.classify() — must contain:
            {
                "label":           str,
                "confidence":      float,
                "bbox":            [x1, y1, x2, y2],
                "severity":        "low"|"medium"|"high"|"critical",
                "threat_score":    float,
                "loiter_seconds":  float
            }
        frame_id: optional frame counter for tracing / debugging

    Returns:
        Dict matching the backend EventSchema:
        {
            "event_id":        str   — UUID4
            "timestamp":       str   — ISO 8601 UTC
            "label":           str
            "confidence":      float
            "bbox":            { "x1", "y1", "x2", "y2" }
            "severity":        str
            "threat_score":    float
            "loiter_seconds":  float
            "frame_id":        int
            "source":          "ai_engine"
        }
    """
    _validate(detection)

    x1, y1, x2, y2 = detection["bbox"]

    return {
        "event_id":       str(uuid.uuid4()),
        "timestamp":      datetime.now(timezone.utc).isoformat(),
        "label":          detection["label"],
        "confidence":     detection["confidence"],
        "bbox": {
            "x1": x1,
            "y1": y1,
            "x2": x2,
            "y2": y2,
        },
        "severity":       detection["severity"],
        "threat_score":   detection["threat_score"],
        "loiter_seconds": detection["loiter_seconds"],
        "frame_id":       frame_id,
        "source":         "ai_engine",
    }


def _validate(detection: dict):
    """
    Raise ValueError early if a detection is malformed.
    Prevents sending garbage payloads to the backend.
    """
    required_keys = {"label", "confidence", "bbox", "severity", "threat_score", "loiter_seconds"}
    missing = required_keys - detection.keys()
    if missing:
        raise ValueError(f"[event_schema] Detection missing keys: {missing}")

    if detection["severity"] not in SUPPORTED_SEVERITIES:
        raise ValueError(
            f"[event_schema] Invalid severity: '{detection['severity']}'. "
            f"Must be one of {SUPPORTED_SEVERITIES}"
        )

    if not isinstance(detection["bbox"], (list, tuple)) or len(detection["bbox"]) != 4:
        raise ValueError("[event_schema] bbox must be a list/tuple of 4 ints [x1, y1, x2, y2]")

    if not (0.0 <= detection["confidence"] <= 1.0):
        raise ValueError("[event_schema] confidence must be between 0.0 and 1.0")