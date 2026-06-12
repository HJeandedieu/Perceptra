# encode_face.py  — run this in the perceptra-backend folder
import base64

with open("face.jpg", "rb") as f:
    encoded = base64.b64encode(f.read()).decode("utf-8")

with open("face_b64.txt", "w") as f:
    f.write(encoded)

print("Done — face_b64.txt created")