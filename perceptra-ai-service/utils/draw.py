# utils/draw.py
import cv2
import numpy as np
from datetime import datetime

# ---------------------------------------------------------------------------
# Frame overlay helpers used across the engine.
# Keeps all raw cv2 drawing calls out of business logic modules.
# ---------------------------------------------------------------------------

# HUD text style
_FONT       = cv2.FONT_HERSHEY_SIMPLEX
_FONT_SCALE = 0.50
_THICKNESS  = 1
_LINE       = cv2.LINE_AA
_WHITE      = (255, 255, 255)
_BLACK      = (0,   0,   0)
_RED        = (0,   0,   255)
_GREEN      = (0,   200, 80)
_GREY       = (160, 160, 160)


def draw_hud(frame: np.ndarray, frame_count: int, fps: float, detection_count: int) -> np.ndarray:
    """
    Draw a heads-up display bar at the top of the frame showing:
      - Current timestamp
      - Frame counter
      - FPS
      - Active detection count

    Args:
        frame:           BGR numpy array
        frame_count:     total frames processed
        fps:             current inference FPS
        detection_count: number of detections in this frame

    Returns:
        Frame with HUD drawn (modified in place)
    """
    h, w = frame.shape[:2]
    bar_height = 28

    # Semi-transparent dark bar
    overlay = frame.copy()
    cv2.rectangle(overlay, (0, 0), (w, bar_height), _BLACK, cv2.FILLED)
    cv2.addWeighted(overlay, 0.6, frame, 0.4, 0, frame)

    timestamp = datetime.now().strftime("%Y-%m-%d  %H:%M:%S")
    left_text  = f"PERCEPTRA  |  {timestamp}"
    right_text = f"Frame: {frame_count}   FPS: {fps:.1f}   Detections: {detection_count}"

    cv2.putText(frame, left_text,  (8, 18),      _FONT, _FONT_SCALE, _WHITE, _THICKNESS, _LINE)
    cv2.putText(frame, right_text, (_right_x(frame, right_text), 18),
                _FONT, _FONT_SCALE, _GREEN, _THICKNESS, _LINE)

    return frame


def draw_zone(frame: np.ndarray, polygon: list, label: str = "", color=(80, 80, 200), alpha=0.25) -> np.ndarray:
    """
    Draw a semi-transparent zone polygon on the frame.
    Used to visualize restricted areas tracked by loiter.py.

    Args:
        frame:   BGR numpy array
        polygon: list of (x, y) tuples defining the zone boundary
        label:   optional zone name drawn at centroid
        color:   BGR color tuple for the zone fill
        alpha:   transparency of the fill (0.0 fully transparent, 1.0 opaque)

    Returns:
        Annotated frame
    """
    pts = np.array(polygon, dtype=np.int32)
    overlay = frame.copy()
    cv2.fillPoly(overlay, [pts], color)
    cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0, frame)
    cv2.polylines(frame, [pts], isClosed=True, color=color, thickness=2)

    if label:
        cx = int(np.mean([p[0] for p in polygon]))
        cy = int(np.mean([p[1] for p in polygon]))
        _draw_label_pill(frame, label, cx, cy, color)

    return frame


def draw_alert_flash(frame: np.ndarray, severity: str) -> np.ndarray:
    """
    Draw a colored border flash around the frame for critical/high alerts.
    Gives operators an immediate peripheral visual cue.

    Args:
        frame:    BGR numpy array
        severity: "low" | "medium" | "high" | "critical"

    Returns:
        Frame with border drawn (modified in place)
    """
    border_colors = {
        "critical": (0,   0,   255),   # red
        "high":     (0,   140, 255),   # orange
        "medium":   (0,   220, 255),   # yellow
    }

    color = border_colors.get(severity)
    if color is None:
        return frame  # no border for low

    thickness = 6 if severity == "critical" else 4
    h, w = frame.shape[:2]
    cv2.rectangle(frame, (0, 0), (w - 1, h - 1), color, thickness)

    return frame


def draw_no_signal(frame: np.ndarray) -> np.ndarray:
    """
    Draw a 'NO SIGNAL' overlay when the camera feed is unavailable.

    Args:
        frame: BGR numpy array (may be blank/black)

    Returns:
        Frame with overlay
    """
    h, w = frame.shape[:2]
    cv2.rectangle(frame, (0, 0), (w, h), _BLACK, cv2.FILLED)

    text = "NO SIGNAL"
    (tw, th), _ = cv2.getTextSize(text, _FONT, 1.4, 2)
    cx, cy = (w - tw) // 2, (h + th) // 2

    cv2.putText(frame, text, (cx, cy), _FONT, 1.4, _RED, 2, _LINE)
    cv2.putText(frame, "Camera feed unavailable", (cx + 10, cy + 34),
                _FONT, 0.5, _GREY, 1, _LINE)

    return frame


# ------------------------------------------------------------------
# Internal helpers
# ------------------------------------------------------------------

def _right_x(frame: np.ndarray, text: str) -> int:
    """Calculate x position to right-align text with 8px padding."""
    (tw, _), _ = cv2.getTextSize(text, _FONT, _FONT_SCALE, _THICKNESS)
    return frame.shape[1] - tw - 8


def _draw_label_pill(frame: np.ndarray, text: str, cx: int, cy: int, color: tuple):
    """Draw a small filled label pill centered at (cx, cy)."""
    (tw, th), _ = cv2.getTextSize(text, _FONT, _FONT_SCALE, _THICKNESS)
    pad = 4
    x1, y1 = cx - tw // 2 - pad, cy - th - pad
    x2, y2 = cx + tw // 2 + pad, cy + pad
    cv2.rectangle(frame, (x1, y1), (x2, y2), color, cv2.FILLED)
    cv2.putText(frame, text, (x1 + pad, cy), _FONT, _FONT_SCALE, _WHITE, _THICKNESS, _LINE)