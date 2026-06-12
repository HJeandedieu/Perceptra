FROM python:3.11-slim

# System deps for OpenCV headless + PyTorch CPU
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Download YOLOv8n weights at build time so the container starts instantly
RUN python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')" \
    && mkdir -p models \
    && cp /root/.config/Ultralytics/yolov8n.pt models/ 2>/dev/null || true

ENV SHOW_PREVIEW=false

CMD ["python", "main.py"]