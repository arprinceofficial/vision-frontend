#!/bin/bash

# Ensure we are in the script's directory
cd "$(dirname "$0")" || exit

echo "Pulling latest changes from git..."
git pull

echo "Installing npm dependencies..."
npm install

echo "Building the frontend..."
npm run build

echo "Restarting pm2 process 'Vision'..."
pm2 restart Vision

echo "Deployment completed successfully!"
