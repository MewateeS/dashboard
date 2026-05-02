$VERCEL_URL = "https://owa-mission.vercel.app"
$INTERVAL   = 30
$SECRET     = $env:HEARTBEAT_SECRET

Write-Host "Heartbeat started -> $VERCEL_URL/api/heartbeat"
Write-Host "Press Ctrl+C to stop (bot will show offline after 90s)"
Write-Host ""

while ($true) {
    try {
        $headers = @{ "Content-Type" = "application/json" }
        if ($SECRET) { $headers["x-heartbeat-secret"] = $SECRET }
        $res = Invoke-RestMethod -Uri "$VERCEL_URL/api/heartbeat" -Method POST -Headers $headers
        Write-Host "$(Get-Date -Format 'HH:mm:ss')  OK  ts=$($res.ts)"
    } catch {
        Write-Host "$(Get-Date -Format 'HH:mm:ss')  FAILED: $($_.Exception.Message)"
    }
    Start-Sleep -Seconds $INTERVAL
}
