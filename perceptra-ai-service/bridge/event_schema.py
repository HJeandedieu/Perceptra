# bridge/event_schema.py
import uuid
from datetime import datetime, timezone

VALID_SEVERITIES = {"low", "medium", "high", "critical"}


def build_event_payload(detection: dict, frame_id: int = 0) -> dict:
    """
    Build a standardized event payload from a classified detection.
    Shape must match the backend EventSchema exactly.

    Args:
        detection: classified dict from ThreatClassifier.classify()
        frame_id:  current frame counter

    Returns:
        Dict ready to POST to /api/events
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
        "identity":       detection.get("identity"),
        "person_name":    detection.get("name"),
    }


def _validate(detection: dict):
    required = {"label", "confidence", "bbox", "severity", "threat_score", "loiter_seconds"}
    missing  = required - detection.keys()
    if missing:
        raise ValueError(f"[event_schema] Missing keys: {missing}")

    if detection["severity"] not in VALID_SEVERITIES:
        raise ValueError(f"[event_schema] Invalid severity: {detection['severity']}")

    if not isinstance(detection["bbox"], (list, tuple)) or len(detection["bbox"]) != 4:
        raise ValueError("[event_schema] bbox must be [x1, y1, x2, y2]")

    if not 0.0 <= detection["confidence"] <= 1.0:
        raise ValueError("[event_schema] confidence must be 0.0 – 1.0")