# Configuration
$OPENCLAW_HOST  = $env:OPENCLAW_HOST -or "192.168.223.115"
$OPENCLAW_PORT  = $env:OPENCLAW_PORT -or "18789"
$APP_URL        = $env:APP_URL -or "http://localhost:3001"
$INTERVAL       = 30
$TIMEOUT        = 5

$OPENCLAW_URL   = "http://$OPENCLAW_HOST`:$OPENCLAW_PORT"
$HEARTBEAT_URL  = "$APP_URL/api/heartbeat"

Write-Host "Openclaw Monitor started"
Write-Host "  Openclaw: $OPENCLAW_URL"
Write-Host "  App: $APP_URL/api/heartbeat"
Write-Host "  Check interval: ${INTERVAL}s"
Write-Host "Press Ctrl+C to stop (bot will show offline after 90s)"
Write-Host ""

$endpoints = @(
    "$OPENCLAW_URL/healthz",
    "$OPENCLAW_URL/api/status",
    "$OPENCLAW_URL/health"
)

while ($true) {
    $found = $false

    foreach ($endpoint in $endpoints) {
        try {
            $response = Invoke-WebRequest -Uri $endpoint -Method GET -TimeoutSec $TIMEOUT -ErrorAction Stop

            if ($response.StatusCode -eq 200) {
                # Send heartbeat to app with openclaw status
                $headers = @{ "Content-Type" = "application/json" }
                $body = @{ openclaw = "online"; ts = [Math]::Floor([datetime]::UtcNow.Subtract([datetime]"1970-01-01").TotalSeconds) } | ConvertTo-Json
                $res = Invoke-RestMethod -Uri $HEARTBEAT_URL -Method POST -Headers $headers -Body $body
                Write-Host "$(Get-Date -Format 'HH:mm:ss')  ✓ Online [$($endpoint.Replace($OPENCLAW_URL, ''))]  ts=$($res.ts)"
                $found = $true
                break
            }
        } catch {
            # Continue to next endpoint
        }
    }

    if (-not $found) {
        Write-Host "$(Get-Date -Format 'HH:mm:ss')  ✗ Openclaw Unreachable - trying POST anyway..."
        try {
            $headers = @{ "Content-Type" = "application/json" }
            $body = @{ source = "local" } | ConvertTo-Json
            $res = Invoke-RestMethod -Uri $HEARTBEAT_URL -Method POST -Headers $headers -Body $body
            Write-Host "$(Get-Date -Format 'HH:mm:ss')  ✓ Posted locally  ts=$($res.ts)"
        } catch {
            Write-Host "$(Get-Date -Format 'HH:mm:ss')  ✗ POST Failed: $($_.Exception.Message)"
        }
    }

    Start-Sleep -Seconds $INTERVAL
}
