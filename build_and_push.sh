#!/bin/bash
set -e  # зупиняє скрипт при помилці

cd TransferTsVite
docker build -t transfer-react --platform linux/amd64,linux/arm64 --build-arg VITE_API_BASE_URL=https://transferapi.itstep.click .
docker tag transfer-react:latest utereskovi/transfer-react:latest
docker push utereskovi/transfer-react:latest
echo "Done ---client---!"

cd ../WebApiTransfer
docker build -t transfer-api --platform linux/amd64,linux/arm64 .
docker tag transfer-api:latest utereskovi/transfer-api:latest
docker push utereskovi/transfer-api:latest

echo "Done ---api---!"

read -p "Press any key to exit..."
 