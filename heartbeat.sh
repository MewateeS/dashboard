#!/bin/bash

OPENCLAW_HOST="${OPENCLAW_HOST:-localhost}"
OPENCLAW_PORT="${OPENCLAW_PORT:-18789}"
APP_URL="${APP_URL:-https://owa-mission.vercel.app}"
INTERVAL=30

OPENCLAW_URL="http://$OPENCLAW_HOST:$OPENCLAW_PORT"

echo "Heartbeat monitor started"
echo "  Openclaw: $OPENCLAW_URL"
echo "  App: $APP_URL"
echo ""

while true; do
    found=0

    # Try to reach openclaw
    if curl -s --max-time 3 "$OPENCLAW_URL/health" > /dev/null 2>&1; then
        found=1
    fi

    # POST heartbeat to app
    response=$(curl -s -X POST "$APP_URL/api/heartbeat" \
        -H "Content-Type: application/json" \
        -H "x-bot-secret: ${BOT_SECRET}" \
        -d "{}")

    if [ $found -eq 1 ]; then
        echo "$(date '+%H:%M:%S')  ✓ Online - $response"
    else
        echo "$(date '+%H:%M:%S')  ✓ Posted - $response"
    fi

    sleep $INTERVAL
done
