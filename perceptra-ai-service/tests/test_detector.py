# tests/test_detector.py
import unittest
import numpy as np
from unittest.mock import MagicMock, patch


class TestDetector(unittest.TestCase):
    """
    Tests for core/detector.py
    Mocks the YOLO model so no GPU or weights file is needed.
    """

    def _make_mock_box(self, label_idx, confidence, bbox):
        """Helper — builds a fake YOLO result box."""
        box = MagicMock()
        box.cls = MagicMock()
        box.cls.__int__ = lambda self: label_idx
        box.conf = MagicMock()
        box.conf.__float__ = lambda self: confidence
        box.xyxy = [MagicMock()]
        box.xyxy[0].tolist.return_value = bbox
        return box

    def _make_mock_result(self, boxes):
        """Helper — wraps boxes in a fake YOLO results object."""
        result = MagicMock()
        result.boxes = boxes
        return result

    @patch("core.detector.YOLO")
    def test_detect_returns_list(self, MockYOLO):
        """detect() always returns a list."""
        mock_model = MagicMock()
        mock_model.return_value = [self._make_mock_result([])]
        mock_model.names = {}
        MockYOLO.return_value = mock_model

        from core.detector import Detector
        detector = Detector()
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        result = detector.detect(frame)

        self.assertIsInstance(result, list)

    @patch("core.detector.YOLO")
    def test_detect_single_person(self, MockYOLO):
        """detect() correctly parses a single person detection."""
        box = self._make_mock_box(
            label_idx=0,
            confidence=0.91,
            bbox=[100, 150, 200, 400]
        )
        mock_model = MagicMock()
        mock_model.return_value = [self._make_mock_result([box])]
        mock_model.names = {0: "person"}
        MockYOLO.return_value = mock_model

        from core.detector import Detector
        detector = Detector()
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        result = detector.detect(frame)

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["label"], "person")
        self.assertAlmostEqual(result[0]["confidence"], 0.91, places=2)
        self.assertEqual(result[0]["bbox"], [100, 150, 200, 400])

    @patch("core.detector.YOLO")
    def test_detect_multiple_objects(self, MockYOLO):
        """detect() returns one dict per detected object."""
        boxes = [
            self._make_mock_box(0, 0.88, [10, 20, 100, 200]),
            self._make_mock_box(1, 0.76, [200, 50, 300, 180]),
        ]
        mock_model = MagicMock()
        mock_model.return_value = [self._make_mock_result(boxes)]
        mock_model.names = {0: "person", 1: "knife"}
        MockYOLO.return_value = mock_model

        from core.detector import Detector
        detector = Detector()
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        result = detector.detect(frame)

        self.assertEqual(len(result), 2)
        labels = [d["label"] for d in result]
        self.assertIn("person", labels)
        self.assertIn("knife", labels)

    @patch("core.detector.YOLO")
    def test_detect_empty_frame(self, MockYOLO):
        """detect() returns empty list when nothing is detected."""
        mock_model = MagicMock()
        mock_model.return_value = [self._make_mock_result([])]
        mock_model.names = {}
        MockYOLO.return_value = mock_model

        from core.detector import Detector
        detector = Detector()
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        result = detector.detect(frame)

        self.assertEqual(result, [])

    @patch("core.detector.YOLO")
    def test_confidence_rounded_to_3dp(self, MockYOLO):
        """confidence values are rounded to 3 decimal places."""
        box = self._make_mock_box(0, 0.912345, [0, 0, 100, 100])
        mock_model = MagicMock()
        mock_model.return_value = [self._make_mock_result([box])]
        mock_model.names = {0: "person"}
        MockYOLO.return_value = mock_model

        from core.detector import Detector
        detector = Detector()
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        result = detector.detect(frame)

        self.assertEqual(result[0]["confidence"], round(0.912345, 3))


if __name__ == "__main__":
    unittest.main()