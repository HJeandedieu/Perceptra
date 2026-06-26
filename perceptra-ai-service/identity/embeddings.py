# identity/embeddings.py
import httpx
import base64
import numpy as np
import logging
from config import BACKEND_REST_URL, FACE_RECOGNITION_ENABLED

log = logging.getLogger("perceptra")

_known_faces: dict[str, np.ndarray] = {}


async def load_registered_faces():
    """
    Fetch registered persons from backend and cache their face embeddings.
    Call once from FastAPI lifespan startup.
    Silently skips if face recognition is disabled or backend is unreachable.
    """
    if not FACE_RECOGNITION_ENABLED:
        log.info("[embeddings] Face recognition disabled — skipping face load.")
        return

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(f"{BACKEND_REST_URL}/api/persons")
            res.raise_for_status()
            persons = res.json()

        for person in persons:
            name        = person.get("name")
            image_b64   = person.get("face_image_b64")

            if not name or not image_b64:
                continue

            embedding = _compute_embedding(image_b64)
            if embedding is not None:
                _known_faces[name] = embedding
                log.info(f"[embeddings] Loaded face: {name}")

        log.info(f"[embeddings] {len(_known_faces)} registered face(s) loaded.")

    except httpx.RequestError as e:
        log.warning(f"[embeddings] Could not reach backend: {e}")
        log.warning("[embeddings] All persons will be treated as unknown.")
    except Exception as e:
        log.warning(f"[embeddings] Unexpected error: {e}")


def get_known_faces() -> dict[str, np.ndarray]:
    """Return the cached { name: embedding } dict."""
    return _known_faces


def _compute_embedding(image_b64: str) -> np.ndarray | None:
    """Decode base64 image and compute FaceNet embedding."""
    try:
        import cv2
        from deepface import DeepFace

        img_bytes = base64.b64decode(image_b64)
        img_array = np.frombuffer(img_bytes, dtype=np.uint8)
        img       = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        result = DeepFace.represent(
            img,
            model_name        = "Facenet",
            enforce_detection = False,
        )
        return np.array(result[0]["embedding"])

    except Exception as e:
        log.warning(f"[embeddings] Failed to compute embedding: {e}")
        return None