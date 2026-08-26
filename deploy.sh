#!/bin/bash

set -e

echo "======================================"
echo "Deploying s3-folder-check"
echo "======================================"

cd /root/workspace/s3-folder-check

echo "Pulling latest code...============================>"
git pull --ff-only origin main

echo "Installing dependencies...========================>"

if [ -f package-lock.json ]; then
    npm ci
else
    npm install
fi

echo "Restarting PM2...=================================>"

pm2 restart s3-folder-check

echo "Saving PM2...=====================================>"
pm2 save

echo "======================================"
echo "Deployment completed successfully!"
echo "======================================"

pm2 status
