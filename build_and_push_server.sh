#!/bin/bash
set -e  # stop script on any error

# --- Client build ---
cd TransferTsVite

# Build only amd64 images (compatible with your Linux server)
docker build -t transfer-react --platform linux/amd64 --build-arg VITE_API_BASE_URL=https://transferapi.itstep.click .
docker tag transfer-react:latest utereskovi/transfer-react:latest
docker push utereskovi/transfer-react:latest

echo "Done ---client---!"

# --- API build ---
cd ../WebApiTransfer

# Build only amd64 images
docker build -t transfer-api --platform linux/amd64 .
docker tag transfer-api:latest utereskovi/transfer-api:latest
docker push utereskovi/transfer-api:latest

echo "Done ---api---!"

# Optional: remove read prompt for Jenkins (non-interactive)
# read -p "Press any key to exit..."