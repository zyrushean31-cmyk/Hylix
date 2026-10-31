$ErrorActionPreference = 'Stop'
$hylixDesktopRoot = Split-Path -Parent $PSScriptRoot
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Install Node.js LTS first, then reopen this project.' }
Push-Location -LiteralPath $hylixDesktopRoot
try {
  if (-not (Test-Path -LiteralPath 'node_modules/electron/dist/electron.exe')) {
    & npm.cmd ci
    if ($LASTEXITCODE -ne 0) { throw 'Windows app dependencies could not be installed.' }
  }
  & npm.cmd run prepare:server
  if ($LASTEXITCODE -ne 0) { throw 'The bundled Hylix server could not be built.' }
  & npm.cmd start
  if ($LASTEXITCODE -ne 0) { throw 'Hylix desktop could not start.' }
} finally { Pop-Location }
