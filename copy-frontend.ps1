# 前端项目复制脚本 - 极简版
param(
    [string]$TargetPath = "C:\Users\23849\Desktop\DEV\RN＋P FMS\frontend"
)

Write-Host "开始复制前端项目到目标目录..."

# 检查源目录
$SourcePath = "C:\Users\23849\Desktop\deeprehab-video"
if (-not (Test-Path $SourcePath)) {
    Write-Host "源目录不存在: $SourcePath"
    exit 1
}

Write-Host "源目录: $SourcePath"
Write-Host "目标目录: $TargetPath"

# 检查目标目录是否存在，如果不存在则创建
if (-not (Test-Path $TargetPath)) {
    Write-Host "创建目标目录..."
    New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
}

# 复制主要文件
Write-Host "复制项目文件..."

# 复制根目录文件
$filesToCopy = @(
    "package.json",
    "package-lock.json", 
    "vite.config.ts",
    "tsconfig.json",
    "index.html",
    "README.md"
)

foreach ($file in $filesToCopy) {
    $sourceFile = Join-Path $SourcePath $file
    if (Test-Path $sourceFile) {
        Copy-Item $sourceFile $TargetPath -Force
        Write-Host "复制: $file"
    }
}

# 复制src目录
if (Test-Path "$SourcePath\src") {
    Write-Host "复制src目录..."
    Copy-Item "$SourcePath\src" "$TargetPath\src" -Recurse -Force
    Write-Host "src目录复制完成"
}

# 复制public目录（如果存在）
if (Test-Path "$SourcePath\public") {
    Write-Host "复制public目录..."
    Copy-Item "$SourcePath\public" "$TargetPath\public" -Recurse -Force
    Write-Host "public目录复制完成"
}

# 创建环境配置文件
Write-Host "创建环境配置文件..."

$devEnvContent = "# 开发环境配置`nVITE_API_URL=http://localhost:8000/api/v1`nVITE_BACKEND_URL=http://localhost:8000`nVITE_APP_NAME=RN+P FMS 开发版`nVITE_APP_VERSION=1.0.0"
Set-Content -Path "$TargetPath\.env.development" -Value $devEnvContent
Write-Host "创建 .env.development"

$prodEnvContent = "# 生产环境配置`nVITE_API_URL=/api/v1`nVITE_BACKEND_URL=`nVITE_APP_NAME=RN+P FMS`nVITE_APP_VERSION=1.0.0"
Set-Content -Path "$TargetPath\.env.production" -Value $prodEnvContent
Write-Host "创建 .env.production"

Write-Host ""
Write-Host "前端项目复制完成！"
Write-Host "目标位置: $TargetPath"
Write-Host ""
Write-Host "下一步操作:"
Write-Host "1. 切换到目标目录: cd '$TargetPath'"
Write-Host "2. 安装依赖: npm install"
Write-Host "3. 启动开发服务器: npm run dev"
Write-Host "4. 测试后端连接"