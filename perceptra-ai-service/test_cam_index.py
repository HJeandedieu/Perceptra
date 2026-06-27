# test_cam_index.py
import cv2
for i in range(3):
    cap = cv2.VideoCapture(i)
    ok, frame = cap.read()
    print(f"CAM {i} ->", "OK" if ok else "no feed")
    cap.release()