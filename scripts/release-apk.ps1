param(
  [string]$Tag,
  [string]$SdkRoot
)
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
if ($Tag -ne "") { $name = "RehabHub-" + $Tag + "-debug.apk" } else { $name = "RehabHub-" + $version + "-" + $date + "-debug.apk" }
$src = Join-Path $repoRoot "android/app/build/outputs/apk/debug/app-debug.apk"
$destDir = Join-Path $repoRoot "DEV"
if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
Copy-Item $src (Join-Path $destDir $name) -Force
Write-Output (Join-Path $destDir $name)
