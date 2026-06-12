# utils/logger.py
import logging
import sys
from datetime import datetime

# ---------------------------------------------------------------------------
# Structured logger for the entire ai_engine.
# All modules import `log` from here — never call logging.getLogger() directly.
# Format: [LEVEL] YYYY-MM-DD HH:MM:SS | message
# ---------------------------------------------------------------------------

_LOG_FORMAT = "[%(levelname)s] %(asctime)s | %(message)s"
_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def _build_logger() -> logging.Logger:
    logger = logging.getLogger("perceptra")
    logger.setLevel(logging.DEBUG)

    # Avoid duplicate handlers if module is reloaded
    if logger.handlers:
        return logger

    # --- Console handler (stdout) ---
    console = logging.StreamHandler(sys.stdout)
    console.setLevel(logging.DEBUG)
    console.setFormatter(logging.Formatter(_LOG_FORMAT, datefmt=_DATE_FORMAT))
    logger.addHandler(console)

    # --- File handler (daily rotating log) ---
    log_filename = f"logs/perceptra_{datetime.now().strftime('%Y%m%d')}.log"

    try:
        import os
        os.makedirs("logs", exist_ok=True)
        file_handler = logging.FileHandler(log_filename, encoding="utf-8")
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(logging.Formatter(_LOG_FORMAT, datefmt=_DATE_FORMAT))
        logger.addHandler(file_handler)
    except OSError as e:
        logger.warning(f"[logger] Could not create log file: {e} — logging to console only")

    return logger


# Single shared instance — import this everywhere
log = _build_logger()