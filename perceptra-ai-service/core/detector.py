# core/detector.py
from ultralytics import YOLO
from config import MODEL_PATH, CONFIDENCE_THRESHOLD, TARGET_CLASSES

class Detector:
    """
    Runs YOLOv8 inference on a single frame.
    Returns a list of detection dicts for threat/classifier.py to consume.
    """

    def __init__(self):
        self.model = YOLO(MODEL_PATH)
        self.confidence = CONFIDENCE_THRESHOLD
        self.target_classes = TARGET_CLASSES  # None means detect all classes

    def detect(self, frame):
        """
        Run inference on a frame.

        Args:
            frame: BGR numpy array from stream.py

        Returns:
            List of dicts:
            [
                {
                    "label": "person",
                    "confidence": 0.91,
                    "bbox": [x1, y1, x2, y2]   # pixel coords, ints
                },
                ...
            ]
        """
        results = self.model(
            frame,
            conf=self.confidence,
            classes=self.target_classes,
            verbose=False
        )[0]

        detections = []

        for box in results.boxes:
            label = self.model.names[int(box.cls)]
            confidence = float(box.conf)
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())

            detections.append({
                "label": label,
                "confidence": round(confidence, 3),
                "bbox": [x1, y1, x2, y2]
            })

        return detections