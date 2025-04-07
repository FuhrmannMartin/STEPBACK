#!/bin/bash

# Get local IP address
IP=$(hostname -I | awk '{print $1}')

echo "Starting WebSocket server on ws://$IP:8765"

# Find and kill any process using port 8765
PID=$(lsof -ti tcp:8765)

if [ -n "$PID" ]; then
  echo "Killing process on port 8765 (PID: $PID)"
  kill -9 $PID
fi

# Start the Node.js WebSocket server
sudo node server.js
