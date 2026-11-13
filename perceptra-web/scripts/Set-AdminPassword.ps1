param([string]$Email = 'hashimweyesujeandedie@gmail.com', [switch]$Cloud)
$ErrorActionPreference = 'Stop'
$webRoot = Split-Path $PSScriptRoot -Parent
$first = Read-Host 'Choose your Perceptra password (12-72 characters)' -AsSecureString
$second = Read-Host 'Confirm password' -AsSecureString
$firstPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($first)
$secondPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($second)
$previousEmail = $env:ADMIN_EMAIL
$previousPassword = $env:ADMIN_PASSWORD
try {
  $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($firstPtr)
  $confirm = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secondPtr)
  if ($plain -cne $confirm) { throw 'Passwords do not match.' }
  if ($plain.Length -lt 12 -or $plain.Length -gt 72) { throw 'Use 12-72 characters.' }
  $env:ADMIN_EMAIL = $Email
  $env:ADMIN_PASSWORD = $plain
  Push-Location $webRoot
  try {
    if ($Cloud) {
      & node --env-file=.env.cloud-database scripts/set-admin-password.mjs
    } else {
      & node --env-file=.env.local scripts/set-admin-password.mjs
    }
    if ($LASTEXITCODE -ne 0) { throw 'Password setup failed.' }
  } finally { Pop-Location }
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($firstPtr)
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secondPtr)
  $env:ADMIN_EMAIL = $previousEmail
  $env:ADMIN_PASSWORD = $previousPassword
  $plain = $null
  $confirm = $null
  $first.Dispose()
  $second.Dispose()
}
