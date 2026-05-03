#!/bin/bash

OPENCLAW_HOST="${OPENCLAW_HOST:-localhost}"
OPENCLAW_PORT="${OPENCLAW_PORT:-18789}"
APP_URL="${APP_URL:-https://owa-mission.vercel.app}"
INTERVAL=30

OPENCLAW_URL="http://$OPENCLAW_HOST:$OPENCLAW_PORT"
HEARTBEAT_FILE="public/heartbeat.json"

echo "Heartbeat monitor started"
echo "  Openclaw: $OPENCLAW_URL"
echo "  Heartbeat file: $HEARTBEAT_FILE"
echo ""

while true; do
    found=0

    # Try to reach openclaw
    if curl -s --max-time 3 "$OPENCLAW_URL/health" > /dev/null 2>&1; then
        found=1
    fi

    # Write heartbeat timestamp to file
    ts=$(date +%s)000
    echo "{\"ts\":$ts,\"online\":true}" > "$HEARTBEAT_FILE"

    if [ $found -eq 1 ]; then
        echo "$(date '+%H:%M:%S')  ✓ Online"
    else
        echo "$(date '+%H:%M:%S')  ✓ Heartbeat sent (openclaw offline)"
    fi

    sleep $INTERVAL
done
