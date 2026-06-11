# PERCEPTRA AI Engine - YOLOv8 Inference
import os
import cv2
import time
import requests
from dotenv import load_dotenv
from ultralytics import YOLO

load_dotenv()

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000/api/detections")
MODEL_PATH = os.getenv("MODEL_PATH", "yolov8n.pt")
VIDEO_SOURCE = os.getenv("VIDEO_SOURCE", "0")  # 0 for webcam, or path to video file

# Load model
print(f"Loading YOLOv8 model from {MODEL_PATH}...")
model = YOLO(MODEL_PATH)

# Severity mapping (from team guide)
def get_severity(label):
    severity_map = {
        "person": "Low",
        "car": "Low",
        # Add more mappings as needed
        # "weapon": "Critical",
    }
    return severity_map.get(label, "Low")

# Send detection to backend
def send_detection(timestamp, label, confidence, camera_id="cam-01"):
    payload = {
        "timestamp": timestamp,
        "label": label,
        "confidence": float(confidence),
        "severity": get_severity(label),
        "camera_id": camera_id
    }
    try:
        response = requests.post(BACKEND_URL, json=payload)
        if response.status_code == 201:
            print(f"✅ Detection sent: {label} ({confidence:.2f})")
    except Exception as e:
        print(f"❌ Failed to send detection: {e}")

# Main inference loop
def run_inference():
    print(f"Starting video capture from {VIDEO_SOURCE}...")
    cap = cv2.VideoCapture(VIDEO_SOURCE if VIDEO_SOURCE != "0" else 0)
    
    if not cap.isOpened():
        print("❌ Error: Could not open video source")
        return

    print("✅ AI Engine running! Press 'q' to quit.")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Run YOLO inference
        results = model(frame, verbose=False)
        
        # Process results
        for result in results:
            for box in result.boxes:
                label = result.names[int(box.cls[0])]
                confidence = box.conf[0]
                timestamp = time.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                
                # Send to backend
                send_detection(timestamp, label, confidence)

                # Optional: Draw on frame
                # annotated_frame = result.plot()
                # cv2.imshow("PERCEPTRA AI", annotated_frame)

        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run_inference()
