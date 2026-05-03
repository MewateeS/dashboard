#!/bin/bash

OPENCLAW_HOST="${OPENCLAW_HOST:-192.168.223.115}"
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

    for endpoint in "$OPENCLAW_URL/healthz" "$OPENCLAW_URL/api/status" "$OPENCLAW_URL/health"; do
        if timeout $TIMEOUT curl -s "$endpoint" > /dev/null 2>&1; then
            curl -s -X POST "$HEARTBEAT_URL" -H "Content-Type: application/json" > /dev/null 2>&1
            echo "$(date '+%H:%M:%S')  ✓ Online"
            found=1
            break
        fi
    done

    if [ $found -eq 0 ]; then
        echo "$(date '+%H:%M:%S')  ✗ Openclaw unreachable"
    fi

    sleep $INTERVAL
done
