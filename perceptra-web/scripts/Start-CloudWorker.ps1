$ErrorActionPreference = 'Stop'
$webRoot = Split-Path $PSScriptRoot -Parent
$aiRoot = Join-Path (Split-Path $webRoot -Parent) 'perceptra-ai-service'
$runtimeRoot = Join-Path $webRoot '.runtime'
$record = Join-Path $runtimeRoot 'cloud-process.json'
if (Test-Path -LiteralPath $record) { throw 'Cloud worker record exists. Run Stop-CloudWorker.ps1 first.' }
if (-not (Test-Path -LiteralPath (Join-Path $aiRoot '.env.worker'))) { throw 'Cloud worker configuration is missing.' }
if (Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue) { throw 'Port 8080 is occupied. Stop the existing camera service first.' }
New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
$workerProcess = Start-Process -FilePath (Join-Path $aiRoot '.venv/Scripts/python.exe') -ArgumentList @('worker.py') -WorkingDirectory $aiRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runtimeRoot 'cloud-worker.log') -RedirectStandardError (Join-Path $runtimeRoot 'cloud-worker-error.log')
@{ id=$workerProcess.Id; started=$workerProcess.StartTime.ToUniversalTime().ToString('o') } | ConvertTo-Json | Set-Content -LiteralPath $record
Write-Output 'Cloud camera station launched. Keep this PC awake. Open https://perceptra-phi.vercel.app to view monitoring.'
