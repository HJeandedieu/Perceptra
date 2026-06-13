# identity/embeddings.py
import httpx
import numpy as np
from config import BACKEND_REST_URL
from utils.logger import log

# Local cache: { "Jean de Dieu": embedding_vector, ... }
_known_faces = {}


def load_registered_faces():
    """
    Fetch registered persons from backend and cache their face embeddings.
    Call once at startup from main.py.

    Expects backend to expose:
    GET /api/persons  →  [{ "name": str, "face_image_b64": str }, ...]
    """
    global _known_faces

    try:
        response = httpx.get(f"{BACKEND_REST_URL}/api/persons", timeout=10)
        response.raise_for_status()
        persons = response.json()

        for person in persons:
            try:
                name       = person["name"]
                image_b64  = person["face_image_b64"]
                embedding  = _compute_embedding_from_b64(image_b64)
                if embedding is not None:
                    _known_faces[name] = embedding
                    log.info(f"[embeddings] Registered face loaded: {name}")
            except Exception as e:
                log.warning(f"[embeddings] Skipping person '{person.get('name', '?')}': {e}")

        log.info(f"[embeddings] {len(_known_faces)} registered faces loaded.")

    except Exception as e:
        log.warning(f"[embeddings] Could not load registered faces: {e}")
        log.warning("[embeddings] Engine will treat all persons as unknown.")


def get_known_faces() -> dict:
    """Return the cached { name: embedding } dict."""
    return _known_faces


def _compute_embedding_from_b64(image_b64: str):
    """Decode base64 image and compute face embedding."""
    import base64
    import cv2
    from deepface import DeepFace

    try:
        img_bytes = base64.b64decode(image_b64)
        img_array = np.frombuffer(img_bytes, dtype=np.uint8)
        img       = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            log.warning("[embeddings] Image decode returned None — skipping.")
            return None

        result = DeepFace.represent(
            img,
            model_name="Facenet",
            enforce_detection=False
        )
        return np.array(result[0]["embedding"])

    except Exception as e:
        log.warning(f"[embeddings] Failed to compute embedding: {e}")
        return None