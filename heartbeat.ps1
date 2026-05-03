$URL        = $env:HEARTBEAT_URL -or "http://localhost:3000"
$INTERVAL   = 30
$SECRET     = $env:HEARTBEAT_SECRET

Write-Host "Heartbeat started -> $URL/api/heartbeat"
Write-Host "Press Ctrl+C to stop (bot will show offline after 90s)"
Write-Host ""

while ($true) {
    try {
        $headers = @{ "Content-Type" = "application/json" }
        if ($SECRET) { $headers["x-heartbeat-secret"] = $SECRET }
        $res = Invoke-RestMethod -Uri "$URL/api/heartbeat" -Method POST -Headers $headers
        Write-Host "$(Get-Date -Format 'HH:mm:ss')  OK  ts=$($res.ts)"
    } catch {
        Write-Host "$(Get-Date -Format 'HH:mm:ss')  FAILED: $($_.Exception.Message)"
    }
    Start-Sleep -Seconds $INTERVAL
}
