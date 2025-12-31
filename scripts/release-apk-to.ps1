param(
  [string]$DestRoot,
  [string]$Tag,
  [string]$SdkRoot
)
if (-not $DestRoot -or $DestRoot -eq "") { $DestRoot = "C:\Users\23849\Desktop\DEV\REBAC" }
if (-not $SdkRoot -or $SdkRoot -eq "") { $SdkRoot = "C:\Users\23849\android-sdk" }
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path $PSScriptRoot -Parent
Set-Location $repoRoot

$env:ANDROID_HOME = $SdkRoot
$env:ANDROID_SDK_ROOT = $SdkRoot

npm run build
npx cap sync android

Push-Location (Join-Path $repoRoot "android")
./gradlew clean assembleDebug
Pop-Location

$pkg = Get-Content (Join-Path $repoRoot "package.json") -Raw | ConvertFrom-Json
$version = $pkg.version
$date = Get-Date -Format "yyyyMMdd"
try {
  $gitTag = (git describe --tags --abbrev=0 2>$null).Trim()
} catch { $gitTag = "" }
if (-not $gitTag -or $gitTag -eq "") {
  try { $gitTag = (git tag --points-at HEAD 2>$null).Trim() } catch { $gitTag = "" }
}
$effectiveTag = if ($Tag -and $Tag -ne "") { $Tag } elseif ($gitTag -and $gitTag -ne "") { $gitTag } else { "" }
if ($effectiveTag -ne "") { $name = "RehabHub-" + $effectiveTag + "-debug.apk" } else { $name = "RehabHub-" + $version + "-" + $date + "-debug.apk" }
$src = Join-Path $repoRoot "android/app/build/outputs/apk/debug/app-debug.apk"
if (!(Test-Path $DestRoot)) { New-Item -ItemType Directory -Path $DestRoot -Force | Out-Null }
Copy-Item $src (Join-Path $DestRoot $name) -Force
Write-Output (Join-Path $DestRoot $name)
