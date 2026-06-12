# models/loader.py
import os
from ultralytics import YOLO
from config import MODEL_PATH
from utils.logger import log

# ---------------------------------------------------------------------------
# Loads the YOLOv8 model once at startup and holds it in memory.
# All other modules import `get_model()` — never instantiate YOLO directly.
# ---------------------------------------------------------------------------

_model = None


def load_model() -> YOLO:
    """
    Load the YOLOv8 model from disk and cache it in memory.
    Call once from main.py before starting the inference loop.

    Returns:
        Loaded YOLO model instance.

    Raises:
        FileNotFoundError: if the weights file does not exist at MODEL_PATH.
        RuntimeError:      if the model fails to load for any other reason.
    """
    global _model

    if _model is not None:
        log.warning("[loader] Model already loaded — returning cached instance.")
        return _model

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"[loader] Model weights not found at: {MODEL_PATH}\n"
            f"Download with: yolo download model=yolov8n.pt"
        )

    log.info(f"[loader] Loading YOLOv8 model from: {MODEL_PATH}")

    try:
        _model = YOLO(MODEL_PATH)
        log.info(f"[loader] Model loaded successfully — {_count_params(_model)} parameters")
        return _model

    except Exception as e:
        raise RuntimeError(f"[loader] Failed to load model: {e}") from e


def get_model() -> YOLO:
    """
    Return the cached model. Raises if load_model() was never called.

    Returns:
        Loaded YOLO model instance.
    """
    if _model is None:
        raise RuntimeError(
            "[loader] Model not loaded. Call load_model() from main.py first."
        )
    return _model


def _count_params(model: YOLO) -> str:
    """Return a human-readable parameter count string."""
    try:
        total = sum(p.numel() for p in model.model.parameters())
        if total >= 1_000_000:
            return f"{total / 1_000_000:.1f}M"
        return f"{total:,}"
    except Exception:
        return "unknown"