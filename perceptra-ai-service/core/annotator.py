# core/annotator.py
import cv2
import numpy as np
from datetime import datetime
from config import SEVERITY_COLORS

_FONT       = cv2.FONT_HERSHEY_SIMPLEX
_FONT_SCALE = 0.52
_THICKNESS  = 1
_LINE       = cv2.LINE_AA
_PAD        = 4


def annotate(frame: np.ndarray, detections: list[dict]) -> np.ndarray:
    """
    Draw bounding boxes, labels and HUD onto a frame.

    Args:
        frame:      BGR numpy array
        detections: classified detections from classifier.py

    Returns:
        Annotated frame
    """
    for det in detections:
        _draw_detection(frame, det)

    _draw_hud(frame, len(detections))
    return frame


# ------------------------------------------------------------------
# Internal
# ------------------------------------------------------------------

def _draw_detection(frame: np.ndarray, det: dict):
    x1, y1, x2, y2 = det["bbox"]
    severity = det.get("severity", "low")
    color    = SEVERITY_COLORS.get(severity, (200, 200, 200))

    # Bounding box
    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

    # Label
    label = _build_label(det)
    (tw, th), _ = cv2.getTextSize(label, _FONT, _FONT_SCALE, _THICKNESS)

    label_y = max(y1 - th - _PAD * 2, 0)
    cv2.rectangle(
        frame,
        (x1, label_y),
        (x1 + tw + _PAD * 2, y1),
        color,
        cv2.FILLED,
    )
    cv2.putText(
        frame,
        label,
        (x1 + _PAD, y1 - _PAD),
        _FONT,
        _FONT_SCALE,
        (15, 15, 15),
        _THICKNESS,
        _LINE,
    )

    # Alert border for high/critical
    if severity in ("high", "critical"):
        _draw_alert_border(frame, severity)


def _build_label(det: dict) -> str:
    label      = det["label"]
    confidence = det["confidence"]
    severity   = det.get("severity", "low").upper()
    identity   = det.get("identity")
    name       = det.get("name")

    if label == "person":
        if identity == "registered" and name:
            return f"{name} [{severity}]"
        return f"UNKNOWN {confidence:.0%} [{severity}]"

    return f"{label} {confidence:.0%} [{severity}]"


def _draw_hud(frame: np.ndarray, detection_count: int):
    """Draw a semi-transparent HUD bar at the top of the frame."""
    h, w = frame.shape[:2]
    bar_h = 28

    overlay = frame.copy()
    cv2.rectangle(overlay, (0, 0), (w, bar_h), (0, 0, 0), cv2.FILLED)
    cv2.addWeighted(overlay, 0.55, frame, 0.45, 0, frame)

    timestamp  = datetime.now().strftime("%Y-%m-%d  %H:%M:%S")
    left_text  = f"PERCEPTRA  |  {timestamp}"
    right_text = f"Detections: {detection_count}"

    cv2.putText(frame, left_text,  (8, 18),
                _FONT, 0.48, (255, 255, 255), _THICKNESS, _LINE)

    (rw, _), _ = cv2.getTextSize(right_text, _FONT, 0.48, _THICKNESS)
    cv2.putText(frame, right_text, (w - rw - 8, 18),
                _FONT, 0.48, (0, 200, 80), _THICKNESS, _LINE)


def _draw_alert_border(frame: np.ndarray, severity: str):
    h, w = frame.shape[:2]
    color     = (0, 0, 255) if severity == "critical" else (0, 140, 255)
    thickness = 6           if severity == "critical" else 4
    cv2.rectangle(frame, (0, 0), (w - 1, h - 1), color, thickness)