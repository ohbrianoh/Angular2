#!/bin/sh

# You can add any setup commands here.
echo "Starting services..."

# Replace environment variables in index.html
envsubst '${API_URL}' < /usr/share/nginx/html/config.json > /tmp/config.json
mv /tmp/config.json /usr/share/nginx/html/config.json

# Start json-server in the background
echo "Starting json-server on port 3000..."
json-server --watch /app/db.json --port 3000 &

# Start Nginx in the foreground
echo "Starting Nginx on port 80..."
exec nginx -g "daemon off;"