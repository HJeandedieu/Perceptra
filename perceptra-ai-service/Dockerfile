# Dockerfile — Perceptra AI Engine
# Optimized for Hugging Face Spaces (CPU inference)

FROM python:3.11-slim

# ---------------------------------------------------------------
# System dependencies
# libgl1 replaces libgl1-mesa-glx on Debian Trixie
# ---------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1 \
    libgstreamer1.0-0 \
    libgstreamer-plugins-base1.0-0 \
    ffmpeg \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------------------
# Working directory
# ---------------------------------------------------------------
WORKDIR /app

# ---------------------------------------------------------------
# Install Python dependencies
# ---------------------------------------------------------------
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ---------------------------------------------------------------
# Download YOLOv8n weights at build time
# Avoids slow cold starts in production
# ---------------------------------------------------------------
RUN mkdir -p models && \
    python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')" && \
    mv yolov8n.pt models/yolov8n.pt || true

# ---------------------------------------------------------------
# Copy application code
# ---------------------------------------------------------------
COPY . .

# ---------------------------------------------------------------
# Create required directories
# ---------------------------------------------------------------
RUN mkdir -p logs

# ---------------------------------------------------------------
# Non-root user for security
# ---------------------------------------------------------------
RUN useradd -m -u 1000 perceptra && chown -R perceptra:perceptra /app
USER perceptra

# ---------------------------------------------------------------
# Expose port
# ---------------------------------------------------------------
EXPOSE 7860

# ---------------------------------------------------------------
# Environment defaults
# These are overridden by Hugging Face Spaces secrets
# ---------------------------------------------------------------
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    MODEL_PATH=models/yolov8n.pt \
    CONFIDENCE_THRESHOLD=0.45 \
    MJPEG_QUALITY=80 \
    MJPEG_MAX_FPS=25 \
    STREAM_WIDTH=640 \
    STREAM_HEIGHT=480 \
    FACE_RECOGNITION_ENABLED=false \
    LOITER_THRESHOLD_SECONDS=30

# ---------------------------------------------------------------
# Start server
# ---------------------------------------------------------------
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "1"]