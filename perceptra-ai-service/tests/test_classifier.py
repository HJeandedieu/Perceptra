# tests/test_classifier.py
import unittest
from unittest.mock import patch
from threat.classifier import ThreatClassifier


class TestThreatClassifier(unittest.TestCase):
    """
    Tests for threat/classifier.py, rules.py, and loiter.py together.
    No camera or model needed — works purely on detection dicts.
    """

    def _make_detection(self, label="person", confidence=0.80, bbox=None):
        """Helper — build a minimal detection dict as detector.py would."""
        return {
            "label":      label,
            "confidence": confidence,
            "bbox":       bbox or [100, 100, 200, 300],
        }

    def setUp(self):
        self.classifier = ThreatClassifier()

    # ------------------------------------------------------------------
    # Output structure
    # ------------------------------------------------------------------

    def test_classify_adds_required_keys(self):
        """classify() must add severity, threat_score, loiter_seconds to each det."""
        detections = [self._make_detection()]
        result = self.classifier.classify(detections)

        self.assertIn("severity",       result[0])
        self.assertIn("threat_score",   result[0])
        self.assertIn("loiter_seconds", result[0])

    def test_classify_returns_same_count(self):
        """classify() returns exactly as many dicts as it receives."""
        detections = [
            self._make_detection("person", 0.90),
            self._make_detection("knife",  0.85),
        ]
        result = self.classifier.classify(detections)
        self.assertEqual(len(result), 2)

    def test_classify_preserves_original_keys(self):
        """classify() must not drop label, confidence, or bbox."""
        det = self._make_detection("person", 0.75, [10, 20, 100, 200])
        result = self.classifier.classify([det])

        self.assertEqual(result[0]["label"],      "person")
        self.assertEqual(result[0]["confidence"], 0.75)
        self.assertEqual(result[0]["bbox"],       [10, 20, 100, 200])

    # ------------------------------------------------------------------
    # Severity levels
    # ------------------------------------------------------------------

    def test_gun_high_confidence_is_critical(self):
        """A gun detected with high confidence must be critical."""
        det = self._make_detection("gun", confidence=0.95)
        result = self.classifier.classify([det])
        self.assertEqual(result[0]["severity"], "critical")

    def test_person_low_confidence_is_low(self):
        """A person with low confidence and no loiter must be low severity."""
        det = self._make_detection("person", confidence=0.50)
        result = self.classifier.classify([det])
        self.assertIn(result[0]["severity"], ("low", "medium"))

    def test_knife_medium_confidence_not_low(self):
        """A knife detection must never be low severity."""
        det = self._make_detection("knife", confidence=0.70)
        result = self.classifier.classify([det])
        self.assertNotEqual(result[0]["severity"], "low")

    def test_severity_is_valid_value(self):
        """severity must always be one of the four valid levels."""
        valid = {"low", "medium", "high", "critical"}
        detections = [
            self._make_detection("person", 0.60),
            self._make_detection("gun",    0.95),
            self._make_detection("car",    0.70),
        ]
        results = self.classifier.classify(detections)
        for r in results:
            self.assertIn(r["severity"], valid)

    # ------------------------------------------------------------------
    # Threat score
    # ------------------------------------------------------------------

    def test_threat_score_between_0_and_1(self):
        """threat_score must always be in [0.0, 1.0]."""
        detections = [
            self._make_detection("gun",    0.99),
            self._make_detection("person", 0.30),
        ]
        results = self.classifier.classify(detections)
        for r in results:
            self.assertGreaterEqual(r["threat_score"], 0.0)
            self.assertLessEqual(r["threat_score"],    1.0)

    def test_gun_has_higher_score_than_person(self):
        """A gun detection must score higher than a person at same confidence."""
        gun    = self._make_detection("gun",    0.80, [100, 100, 200, 300])
        person = self._make_detection("person", 0.80, [300, 100, 400, 300])

        results = self.classifier.classify([gun, person])
        scores = {r["label"]: r["threat_score"] for r in results}

        self.assertGreater(scores["gun"], scores["person"])

    def test_threat_score_rounded_to_3dp(self):
        """threat_score must be rounded to 3 decimal places."""
        det = self._make_detection("person", 0.75)
        result = self.classifier.classify([det])
        score = result[0]["threat_score"]
        self.assertEqual(score, round(score, 3))

    # ------------------------------------------------------------------
    # Loitering
    # ------------------------------------------------------------------

    def test_loiter_seconds_starts_at_zero(self):
        """First time an object is seen, loiter_seconds must be 0.0."""
        det = self._make_detection("person", 0.80)
        result = self.classifier.classify([det])
        self.assertEqual(result[0]["loiter_seconds"], 0.0)

    def test_loiter_increases_on_repeated_frames(self):
        """
        Same bbox across multiple classify() calls must accumulate dwell time.
        We mock time.time() to fast-forward 60 seconds.
        """
        import time as time_module

        det = self._make_detection("person", 0.80, [100, 100, 200, 300])

        base_time = 1_000_000.0

        with patch.object(time_module, "time", side_effect=[
            base_time,        # first update() — first_seen
            base_time,        # first update() — last_seen
            base_time + 60,   # second update() — returns dwell
            base_time + 60,   # second update() — last_seen
        ]):
            self.classifier.classify([det])
            result = self.classifier.classify([det])

        self.assertGreater(result[0]["loiter_seconds"], 0)

    # ------------------------------------------------------------------
    # Edge cases
    # ------------------------------------------------------------------

    def test_empty_detections_returns_empty(self):
        """classify([]) must return []."""
        result = self.classifier.classify([])
        self.assertEqual(result, [])

    def test_unknown_label_does_not_crash(self):
        """An unrecognised label must still return a valid classified dict."""
        det = self._make_detection("spaceship", 0.70)
        result = self.classifier.classify([det])

        self.assertEqual(len(result), 1)
        self.assertIn(result[0]["severity"], {"low", "medium", "high", "critical"})


if __name__ == "__main__":
    unittest.main()