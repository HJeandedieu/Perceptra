# core/detector.py
import logging
from ultralytics import YOLO
from config import MODEL_PATH, CONFIDENCE_THRESHOLD, TARGET_CLASSES

log = logging.getLogger("perceptra")

_model: YOLO | None = None


def load_model() -> YOLO:
    """
    Load YOLOv8 model once at startup and cache it.
    Call from FastAPI lifespan — never call per request.
    """
    global _model

    if _model is not None:
        return _model

    log.info(f"[detector] Loading model from: {MODEL_PATH}")

    try:
        _model = YOLO(MODEL_PATH)
        params = _count_params(_model)
        log.info(f"[detector] Model loaded — {params} parameters")
        return _model
    except Exception as e:
        raise RuntimeError(f"[detector] Failed to load model: {e}") from e


def get_model() -> YOLO:
    if _model is None:
        raise RuntimeError("[detector] Model not loaded. Call load_model() first.")
    return _model


def detect(frame) -> list[dict]:
    """
    Run YOLOv8 inference on a single frame.

    Args:
        frame: BGR numpy array

    Returns:
        List of detection dicts:
        [{ "label": str, "confidence": float, "bbox": [x1, y1, x2, y2] }]
    """
    model = get_model()

    results = model(
        frame,
        conf=CONFIDENCE_THRESHOLD,
        classes=TARGET_CLASSES,
        verbose=False,
    )[0]

    detections = []
    for box in results.boxes:
        label      = model.names[int(box.cls)]
        confidence = float(box.conf)
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())

        detections.append({
            "label":      label,
            "confidence": round(confidence, 3),
            "bbox":       [x1, y1, x2, y2],
        })

    return detections


def _count_params(model: YOLO) -> str:
    try:
        total = sum(p.numel() for p in model.model.parameters())
        return f"{total / 1_000_000:.1f}M" if total >= 1_000_000 else f"{total:,}"
    except Exception:
        return "unknown"