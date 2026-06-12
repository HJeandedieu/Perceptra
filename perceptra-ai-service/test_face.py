# test_face.py
import cv2
from identity.recognizer import FaceRecognizer

recognizer = FaceRecognizer()
cap = cv2.VideoCapture(1)

ret, frame = cap.read()
cap.release()

if not ret:
    print("Could not read frame")
else:
    # Fake a person detection covering the whole frame
    h, w = frame.shape[:2]
    detections = [{
        "label": "person",
        "confidence": 0.90,
        "bbox": [0, 0, w, h]
    }]

    result = recognizer.identify(frame, detections)
    print("Identity result:", result[0].get("identity"))
    print("Name:", result[0].get("name"))