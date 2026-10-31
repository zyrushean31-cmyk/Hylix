$ErrorActionPreference = 'Stop'
if (-not $IsWindows -and $PSVersionTable.PSEdition -eq 'Core') { throw 'Build this Windows project on Windows.' }
$hylixDesktopRoot = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $hylixDesktopRoot
try {
  & npm.cmd ci
  if ($LASTEXITCODE -ne 0) { throw 'Windows app dependencies could not be installed.' }
  & npm.cmd run check
  if ($LASTEXITCODE -ne 0) { throw 'Desktop checks failed.' }
  & npm.cmd run prepare:server
  if ($LASTEXITCODE -ne 0) { throw 'The bundled Hylix server could not be built.' }
  & npm.cmd run build:windows
  if ($LASTEXITCODE -ne 0) { throw 'The Windows installer could not be built.' }
  Write-Host 'Windows installer created in the dist-standalone folder.'
} finally { Pop-Location }
