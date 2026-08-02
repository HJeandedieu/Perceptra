# test_cam_index.py
import cv2

for i in range(4):
    cap = cv2.VideoCapture(i)
    ret, frame = cap.read()
    if ret:
        h, w = frame.shape[:2]
        backend = cap.getBackendName()
        name = cap.get(cv2.CAP_PROP_BACKEND)
        print(f"CAM {i} -> {w}x{h} -> Backend: {backend}")
        
        # Show each camera for 3 seconds so you can see which is which
        cv2.imshow(f"CAM {i} - Press any key", frame)
        cv2.waitKey(3000)
        cv2.destroyAllWindows()
    else:
        print(f"CAM {i} -> no feed")
    cap.release()