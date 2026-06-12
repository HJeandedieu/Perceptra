# tests/test_publisher.py
import unittest
from unittest.mock import patch, MagicMock, AsyncMock
from bridge.event_schema import build_event_payload, _validate


class TestEventSchema(unittest.TestCase):
    """
    Tests for bridge/event_schema.py — the payload contract.
    Validates structure, required fields, and edge cases.
    """

    def _make_detection(self, overrides=None):
        """Helper — build a valid classified detection dict."""
        base = {
            "label":          "person",
            "confidence":     0.88,
            "bbox":           [100, 150, 200, 400],
            "severity":       "high",
            "threat_score":   0.72,
            "loiter_seconds": 15.0,
        }
        if overrides:
            base.update(overrides)
        return base

    # ------------------------------------------------------------------
    # Payload structure
    # ------------------------------------------------------------------

    def test_payload_has_all_required_keys(self):
        """build_event_payload() must return all required backend keys."""
        required = {
            "event_id", "timestamp", "label", "confidence",
            "bbox", "severity", "threat_score", "loiter_seconds",
            "frame_id", "source"
        }
        payload = build_event_payload(self._make_detection(), frame_id=1)
        self.assertTrue(required.issubset(payload.keys()))

    def test_bbox_is_dict_with_four_keys(self):
        """bbox in payload must be a dict with x1, y1, x2, y2."""
        payload = build_event_payload(self._make_detection())
        bbox = payload["bbox"]
        self.assertIsInstance(bbox, dict)
        for key in ("x1", "y1", "x2", "y2"):
            self.assertIn(key, bbox)

    def test_bbox_values_match_input(self):
        """bbox values in payload must match the input detection."""
        det = self._make_detection({"bbox": [10, 20, 300, 400]})
        payload = build_event_payload(det)
        self.assertEqual(payload["bbox"]["x1"], 10)
        self.assertEqual(payload["bbox"]["y1"], 20)
        self.assertEqual(payload["bbox"]["x2"], 300)
        self.assertEqual(payload["bbox"]["y2"], 400)

    def test_source_is_ai_engine(self):
        """source field must always be 'ai_engine'."""
        payload = build_event_payload(self._make_detection())
        self.assertEqual(payload["source"], "ai_engine")

    def test_event_id_is_unique(self):
        """Each call must produce a unique event_id (UUID4)."""
        det = self._make_detection()
        id1 = build_event_payload(det)["event_id"]
        id2 = build_event_payload(det)["event_id"]
        self.assertNotEqual(id1, id2)

    def test_timestamp_is_iso_format(self):
        """timestamp must be a valid ISO 8601 string."""
        from datetime import datetime
        payload = build_event_payload(self._make_detection())
        ts = payload["timestamp"]
        # Should not raise
        parsed = datetime.fromisoformat(ts)
        self.assertIsNotNone(parsed)

    def test_frame_id_passed_through(self):
        """frame_id must match the value passed in."""
        payload = build_event_payload(self._make_detection(), frame_id=42)
        self.assertEqual(payload["frame_id"], 42)

    def test_frame_id_defaults_to_zero(self):
        """frame_id defaults to 0 when not provided."""
        payload = build_event_payload(self._make_detection())
        self.assertEqual(payload["frame_id"], 0)

    # ------------------------------------------------------------------
    # Validation — _validate()
    # ------------------------------------------------------------------

    def test_validate_raises_on_missing_key(self):
        """_validate() must raise ValueError if a required key is missing."""
        det = self._make_detection()
        del det["severity"]
        with self.assertRaises(ValueError):
            _validate(det)

    def test_validate_raises_on_invalid_severity(self):
        """_validate() must raise ValueError for unknown severity strings."""
        det = self._make_detection({"severity": "catastrophic"})
        with self.assertRaises(ValueError):
            _validate(det)

    def test_validate_raises_on_bad_bbox(self):
        """_validate() must raise ValueError if bbox is not 4 elements."""
        det = self._make_detection({"bbox": [100, 200]})
        with self.assertRaises(ValueError):
            _validate(det)

    def test_validate_raises_on_confidence_out_of_range(self):
        """_validate() must raise ValueError if confidence > 1.0."""
        det = self._make_detection({"confidence": 1.5})
        with self.assertRaises(ValueError):
            _validate(det)

    def test_validate_passes_on_valid_detection(self):
        """_validate() must not raise on a fully valid detection dict."""
        det = self._make_detection()
        try:
            _validate(det)
        except ValueError:
            self.fail("_validate() raised ValueError on a valid detection")


class TestPublisher(unittest.TestCase):
    """
    Tests for bridge/publisher.py.
    Mocks HTTP and WebSocket so no backend server is needed.
    """

    def _make_classified(self, severity="high"):
        """Helper — build a classified detection dict."""
        return {
            "label":          "knife",
            "confidence":     0.85,
            "bbox":           [100, 100, 200, 300],
            "severity":       severity,
            "threat_score":   0.75,
            "loiter_seconds": 0.0,
        }

    @patch("bridge.publisher.httpx.AsyncClient")
    def test_low_severity_not_published(self, MockClient):
        """publish() must silently skip low severity detections."""
        mock_client = AsyncMock()
        MockClient.return_value = mock_client

        from bridge.publisher import Publisher
        publisher = Publisher()
        publisher.publish([self._make_classified("low")])

        mock_client.post.assert_not_called()

    @patch("bridge.publisher.httpx.AsyncClient")
    def test_high_severity_triggers_post(self, MockClient):
        """publish() must POST high severity detections to the backend."""
        mock_response = MagicMock()
        mock_response.status_code = 201

        mock_client = MagicMock()
        mock_client.post = AsyncMock(return_value=mock_response)
        mock_client.aclose = AsyncMock()
        MockClient.return_value = mock_client

        from bridge.publisher import Publisher
        publisher = Publisher()
        publisher.publish([self._make_classified("high")])

        mock_client.post.assert_called_once()

    @patch("bridge.publisher.httpx.AsyncClient")
    def test_critical_severity_triggers_post(self, MockClient):
        """publish() must POST critical severity detections."""
        mock_response = MagicMock()
        mock_response.status_code = 201

        mock_client = MagicMock()
        mock_client.post = AsyncMock(return_value=mock_response)
        mock_client.aclose = AsyncMock()
        MockClient.return_value = mock_client

        from bridge.publisher import Publisher
        publisher = Publisher()
        publisher.publish([self._make_classified("critical")])

        mock_client.post.assert_called_once()

    @patch("bridge.publisher.httpx.AsyncClient")
    def test_multiple_publishable_events(self, MockClient):
        """publish() must POST once per publishable detection."""
        mock_response = MagicMock()
        mock_response.status_code = 201

        mock_client = MagicMock()
        mock_client.post = AsyncMock(return_value=mock_response)
        mock_client.aclose = AsyncMock()
        MockClient.return_value = mock_client

        from bridge.publisher import Publisher
        publisher = Publisher()
        publisher.publish([
            self._make_classified("high"),
            self._make_classified("critical"),
            self._make_classified("low"),    # skipped
        ])

        self.assertEqual(mock_client.post.call_count, 2)

    @patch("bridge.publisher.httpx.AsyncClient")
    def test_post_url_contains_events_endpoint(self, MockClient):
        """publisher must POST to the /api/events endpoint."""
        mock_response = MagicMock()
        mock_response.status_code = 201

        mock_client = MagicMock()
        mock_client.post = AsyncMock(return_value=mock_response)
        mock_client.aclose = AsyncMock()
        MockClient.return_value = mock_client

        from bridge.publisher import Publisher
        publisher = Publisher()
        publisher.publish([self._make_classified("high")])

        call_url = mock_client.post.call_args[0][0]
        self.assertIn("/api/events", call_url)


if __name__ == "__main__":
    unittest.main()