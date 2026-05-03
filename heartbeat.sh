#!/bin/bash

OPENCLAW_HOST="${OPENCLAW_HOST:-localhost}"
OPENCLAW_PORT="${OPENCLAW_PORT:-18789}"
APP_URL="${APP_URL:-https://owa-mission.vercel.app}"
INTERVAL=30
TIMEOUT=5

OPENCLAW_URL="http://$OPENCLAW_HOST:$OPENCLAW_PORT"
HEARTBEAT_URL="$APP_URL/api/heartbeat"

echo "Heartbeat monitor started"
echo "  Openclaw: $OPENCLAW_URL"
echo "  App: $HEARTBEAT_URL"
echo "  Interval: ${INTERVAL}s"
echo ""

while true; do
    found=0

    # Try to reach openclaw
    if curl -s --max-time $TIMEOUT "$OPENCLAW_URL/health" > /dev/null 2>&1; then
        found=1
    elif curl -s --max-time $TIMEOUT "$OPENCLAW_URL/api/status" > /dev/null 2>&1; then
        found=1
    elif curl -s --max-time $TIMEOUT "$OPENCLAW_URL/healthz" > /dev/null 2>&1; then
        found=1
    fi

    # Send heartbeat
    if [ $found -eq 1 ]; then
        response=$(curl -s -X POST "$HEARTBEAT_URL" -H "Content-Type: application/json")
        echo "$(date '+%H:%M:%S')  ✓ Online - $response"
    else
        response=$(curl -s -X POST "$HEARTBEAT_URL" -H "Content-Type: application/json")
        echo "$(date '+%H:%M:%S')  ✗ Openclaw offline - Posted anyway"
    fi

    sleep $INTERVAL
done
