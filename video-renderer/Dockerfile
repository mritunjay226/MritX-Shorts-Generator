FROM ubuntu:22.04

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libavcodec-extra \
    curl \
    python3 \
    python3-pip \
    fonts-dejavu-core \
    fonts-liberation \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application code
COPY server.py .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Expose port
EXPOSE 8080

# Use gunicorn for production (better than Flask dev server)
CMD exec gunicorn --bind :$PORT --workers 2 --threads 4 --timeout 300 --worker-class sync --access-logfile - --error-logfile - server:app