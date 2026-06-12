# core/annotator.py
import cv2
from config import SEVERITY_COLORS

class Annotator:
    """
    Draws bounding boxes and labels onto a frame.
    Color is driven by threat severity from classifier.py.
    Shows identity name for registered persons.
    """

    FONT            = cv2.FONT_HERSHEY_SIMPLEX
    FONT_SCALE      = 0.55
    FONT_THICKNESS  = 1
    BOX_THICKNESS   = 2
    LABEL_PADDING   = 4

    def draw(self, frame, detections):
        """
        Annotate a frame with bounding boxes and labels.

        Args:
            frame: BGR numpy array
            detections: list of dicts — each must have:
                {
                    "label":      str,
                    "confidence": float,
                    "bbox":       [x1, y1, x2, y2],
                    "severity":   "low" | "medium" | "high" | "critical",
                    "identity":   "registered" | "unknown" | None,
                    "name":       str | None
                }

        Returns:
            Annotated frame (modified in place)
        """
        for det in detections:
            x1, y1, x2, y2 = det["bbox"]
            severity = det.get("severity", "low")
            color    = SEVERITY_COLORS.get(severity, (200, 200, 200))

            # Bounding box
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, self.BOX_THICKNESS)

            # Build label text
            label_text = self._build_label(det, severity)

            # Label background pill
            (text_w, text_h), _ = cv2.getTextSize(
                label_text, self.FONT, self.FONT_SCALE, self.FONT_THICKNESS
            )
            label_y = max(y1 - text_h - self.LABEL_PADDING * 2, 0)
            cv2.rectangle(
                frame,
                (x1, label_y),
                (x1 + text_w + self.LABEL_PADDING * 2, y1),
                color,
                cv2.FILLED
            )

            # Label text
            cv2.putText(
                frame,
                label_text,
                (x1 + self.LABEL_PADDING, y1 - self.LABEL_PADDING),
                self.FONT,
                self.FONT_SCALE,
                (15, 15, 15),
                self.FONT_THICKNESS,
                cv2.LINE_AA
            )

        return frame

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _build_label(self, det: dict, severity: str) -> str:
        """
        Build the label string shown above each bounding box.

        - Registered person  →  "Jean de Dieu [MEDIUM]"
        - Unknown person     →  "UNKNOWN 92% [MEDIUM]"
        - Other objects      →  "laptop 87% [LOW]"
        """
        label      = det["label"]
        confidence = det["confidence"]
        identity   = det.get("identity")
        name       = det.get("name")
        sev        = severity.upper()

        if label == "person":
            if identity == "registered" and name:
                return f"{name} [{sev}]"
            else:
                return f"UNKNOWN {confidence:.0%} [{sev}]"

        return f"{label} {confidence:.0%} [{sev}]"