$APP_URL = "https://owa-mission.vercel.app/api/heartbeat"
$INTERVAL = 30

Write-Host "Heartbeat monitor started at $APP_URL"
Write-Host "Ctrl+C to stop`n"

while ($true) {
    try {
        $res = Invoke-RestMethod -Uri $APP_URL -Method POST -Headers @{ "Content-Type" = "application/json" }
        Write-Host "$(Get-Date -Format 'HH:mm:ss')  OK  ts=$($res.ts)"
    }
    catch {
        Write-Host "$(Get-Date -Format 'HH:mm:ss')  FAIL  $($_.Exception.Message)"
    }
    Start-Sleep -Seconds $INTERVAL
}
