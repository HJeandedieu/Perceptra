# capture_face.py
import cv2

cap = cv2.VideoCapture(1)
print("Press SPACE to capture, Q to quit")

while True:
    ret, frame = cap.read()
    cv2.imshow("Capture", frame)
    key = cv2.waitKey(1)
    if key == ord(' '):
        cv2.imwrite("face_webcam.jpg", frame)
        print("Saved face_webcam.jpg")
        break
    if key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()