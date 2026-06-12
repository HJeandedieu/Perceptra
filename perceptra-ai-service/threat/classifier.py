# threat/classifier.py
from threat.rules import get_severity
from threat.loiter import LoiterTracker

class ThreatClassifier:
    """
    Takes raw detections from detector.py, scores them,
    and adds a 'severity' field to each detection dict.
    """

    def __init__(self):
        self.loiter_tracker = LoiterTracker()

    def classify(self, detections, zone_map=None):
        """
        Classify each detection and attach severity.

        Args:
            detections: list of dicts from detector.py
                [{ "label", "confidence", "bbox" }, ...]
            zone_map: optional dict mapping zone_id -> polygon coords
                      used by loiter tracker for zone-aware dwell time

        Returns:
            Same list, each dict now includes:
                "severity": "low" | "medium" | "high" | "critical"
                "loiter_seconds": float (0 if not loitering)
                "threat_score": float 0.0 – 1.0
        """
        classified = []

        for det in detections:
            label = det["label"]
            confidence = det["confidence"]
            bbox = det["bbox"]

            # Check dwell time for this object
            loiter_seconds = self.loiter_tracker.update(bbox, label)

            # Get base severity from rules
            severity, threat_score = get_severity(
                label=label,
                confidence=confidence,
                loiter_seconds=loiter_seconds,
                identity=det.get("identity")
            )

            classified.append({
                **det,
                "severity": severity,
                "threat_score": round(threat_score, 3),
                "loiter_seconds": round(loiter_seconds, 1)
            })

        # Clean up stale tracks (objects no longer in frame)
        active_bboxes = [d["bbox"] for d in detections]
        self.loiter_tracker.purge_stale(active_bboxes)

        return classified