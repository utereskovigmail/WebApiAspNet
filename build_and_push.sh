#!/bin/bash
set -e  # зупиняє скрипт при помилці

cd TransferTsVite
docker build -t transfer-react --build-arg VITE_API_BASE_URL=http://192.168.64.5:5898 .
docker tag transfer-react:latest utereskovi/transfer-react:latest
docker push utereskovi/transfer-react:latest
echo "Done ---client---!"

cd ../WebApiTransfer
docker build -t transfer-api .
docker tag transfer-api:latest utereskovi/transfer-api:latest
docker push utereskovi/transfer-api:latest

echo "Done ---api---!"

read -p "Press any key to exit..."
 