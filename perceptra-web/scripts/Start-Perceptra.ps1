$ErrorActionPreference = 'Stop'
$webRoot = Split-Path $PSScriptRoot -Parent
$aiRoot = Join-Path (Split-Path $webRoot -Parent) 'perceptra-ai-service'
$runtimeRoot = Join-Path $webRoot '.runtime'
if (Test-Path -LiteralPath (Join-Path $aiRoot '.env.worker')) { throw 'Cloud camera configuration is active. Use Start-CloudWorker.ps1, or rename .env.worker before returning to local mode.' }
Push-Location $webRoot
try {
  if (Test-Path (Join-Path $runtimeRoot 'processes.json')) { throw 'A startup record exists. Run Stop-Perceptra.ps1 first.' }
  if (Test-Path '.runtime/postgres/PG_VERSION') {
    & node --env-file=.env.local scripts/local-db.mjs start
    if ($LASTEXITCODE -ne 0) { throw 'Could not start the isolated database.' }
  }
  & node --env-file=.env.local scripts/preflight.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Preflight failed. Resolve the listed prerequisites.' }
  & node --env-file=.env.local scripts/retention.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Database cleanup failed. Verify migrations and database credentials.' }
  New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
  $started = @()
  try {
    $webProcess = Start-Process -FilePath (Get-Command node).Source -ArgumentList @('node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','-p','5000') -WorkingDirectory $webRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runtimeRoot 'web.log') -RedirectStandardError (Join-Path $runtimeRoot 'web-error.log')
    $started += @{ id=$webProcess.Id; started=$webProcess.StartTime.ToUniversalTime().ToString('o'); name='web' }
    $aiProcess = Start-Process -FilePath (Join-Path $aiRoot '.venv/Scripts/python.exe') -ArgumentList @('worker.py') -WorkingDirectory $aiRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runtimeRoot 'worker.log') -RedirectStandardError (Join-Path $runtimeRoot 'worker-error.log')
    $started += @{ id=$aiProcess.Id; started=$aiProcess.StartTime.ToUniversalTime().ToString('o'); name='worker' }
    $started | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $runtimeRoot 'processes.json')
    Write-Output 'Processes launched. Open http://localhost:5000. Check Live monitoring for camera/inference health; logs are in .runtime.'
  } catch {
    foreach ($item in $started) { $proc = Get-Process -Id $item.id -ErrorAction SilentlyContinue; if ($proc -and $proc.StartTime.ToUniversalTime().ToString('o') -eq $item.started) { Stop-Process -Id $proc.Id } }
    throw
  }
} finally { Pop-Location }
