# Checks if the bot is alive at localhost:18789 and pushes status to Vercel.
# Edit VERCEL_URL before running.

$VERCEL_URL = "https://owa-mission.vercel.app"
$BOT_URL    = "http://localhost:18789/"
$INTERVAL   = 30   # seconds
# Set this to match HEARTBEAT_SECRET in your Vercel env vars
$SECRET     = $env:HEARTBEAT_SECRET

Write-Host "Heartbeat watcher started — polling $BOT_URL every ${INTERVAL}s"

while ($true) {
    try {
        $null = Invoke-WebRequest -Uri $BOT_URL -TimeoutSec 3 -ErrorAction Stop
        $headers = @{}
        if ($SECRET) { $headers["x-heartbeat-secret"] = $SECRET }
        Invoke-RestMethod -Uri "$VERCEL_URL/api/heartbeat" -Method POST -Headers $headers | Out-Null
        Write-Host "$(Get-Date -Format 'HH:mm:ss')  bot ONLINE — heartbeat sent"
    } catch {
        Write-Host "$(Get-Date -Format 'HH:mm:ss')  bot OFFLINE — no heartbeat sent"
    }
    Start-Sleep -Seconds $INTERVAL
}
