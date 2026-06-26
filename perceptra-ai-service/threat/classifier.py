# threat/classifier.py
from threat.rules import get_severity
from threat.loiter import LoiterTracker


class ThreatClassifier:
    """
    Attaches severity, threat_score and loiter_seconds to each detection.
    One instance per engine — maintains loiter state across frames.
    """

    def __init__(self):
        self._loiter = LoiterTracker()

    def classify(self, detections: list[dict]) -> list[dict]:
        """
        Args:
            detections: list from detector.detect()
                [{ "label", "confidence", "bbox" }, ...]

        Returns:
            Same list with added fields:
                "severity":       "low" | "medium" | "high" | "critical"
                "threat_score":   float 0.0 – 1.0
                "loiter_seconds": float
                "identity":       str | None  (passthrough if present)
                "name":           str | None  (passthrough if present)
        """
        classified = []

        for det in detections:
            loiter_seconds = self._loiter.update(det["bbox"], det["label"])

            severity, threat_score = get_severity(
                label          = det["label"],
                confidence     = det["confidence"],
                loiter_seconds = loiter_seconds,
                identity       = det.get("identity"),
            )

            classified.append({
                **det,
                "severity":       severity,
                "threat_score":   threat_score,
                "loiter_seconds": round(loiter_seconds, 1),
                "identity":       det.get("identity"),
                "name":           det.get("name"),
            })

        # Clean up objects no longer in frame
        self._loiter.purge_stale([d["bbox"] for d in detections])

        return classified