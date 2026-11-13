$ErrorActionPreference = 'Stop'
$record = Join-Path (Split-Path $PSScriptRoot -Parent) '.runtime/processes.json'
if (-not (Test-Path -LiteralPath $record)) { Write-Output 'No recorded Perceptra processes.'; exit 0 }
$items = Get-Content -LiteralPath $record -Raw | ConvertFrom-Json
foreach ($item in $items) {
  $proc = Get-Process -Id $item.id -ErrorAction SilentlyContinue
  if ($proc) {
    if ($proc.StartTime.ToUniversalTime().Ticks -ne ([datetime]$item.started).ToUniversalTime().Ticks) { throw 'Process identity changed; refusing to stop a reused PID.' }
    $children = Get-CimInstance Win32_Process -Filter ("ParentProcessId = " + $proc.Id)
    foreach ($child in $children) {
      $childProcess = Get-Process -Id $child.ProcessId -ErrorAction SilentlyContinue
      if ($childProcess -and $childProcess.StartTime.ToUniversalTime() -ge $proc.StartTime.ToUniversalTime()) { Stop-Process -Id $childProcess.Id }
    }
    Stop-Process -Id $proc.Id
    Write-Output ('Stopped '+$item.name)
  }
}
Remove-Item -LiteralPath $record
