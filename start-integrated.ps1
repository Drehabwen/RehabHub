# 集成环境启动脚本
# 用于启动前后端集成开发环境

param(
    [string]$BackendPath = "C:\Users\23849\Desktop\DEV\RN＋P FMS\backend",
    [string]$FrontendPath = "C:\Users\23849\Desktop\DEV\RN＋P FMS\frontend"
)

Write-Host "🚀 启动RN+P FMS集成开发环境..." -ForegroundColor Green
Write-Host ""

# 检查后端目录
if (-not (Test-Path $BackendPath)) {
    Write-Host "❌ 后端目录不存在: $BackendPath" -ForegroundColor Red
    Write-Host "💡 请先确保Python后端项目已放置在正确位置" -ForegroundColor Yellow
    exit 1
}

# 检查前端目录
if (-not (Test-Path $FrontendPath)) {
    Write-Host "❌ 前端目录不存在: $FrontendPath" -ForegroundColor Red
    Write-Host "💡 请先运行 copy-frontend.ps1 复制前端项目" -ForegroundColor Yellow
    exit 1
}

# 检查Python是否安装
$pythonVersion = python --version 2>$null
if (-not $pythonVersion) {
    Write-Host "❌ 未检测到Python，请先安装Python 3.8+" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Python版本: $pythonVersion" -ForegroundColor Green

# 检查Node.js是否安装
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ 未检测到Node.js，请先安装Node.js 16+" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js版本: $nodeVersion" -ForegroundColor Green

# 函数：检查端口是否被占用
function Test-Port {
    param([int]$Port)
    
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
        $listener.Start()
        $listener.Stop()
        return $true
    } catch {
        return $false
    }
}

# 检查端口占用
Write-Host "🔍 检查端口占用情况..." -ForegroundColor Cyan

$backendPort = 8000
$frontendPort = 3000

if (-not (Test-Port -Port $backendPort)) {
    Write-Host "⚠️  端口 $backendPort 可能被占用，后端服务可能无法启动" -ForegroundColor Yellow
}

if (-not (Test-Port -Port $frontendPort)) {
    Write-Host "⚠️  端口 $frontendPort 可能被占用，前端服务可能无法启动" -ForegroundColor Yellow
}

# 启动后端服务
Write-Host ""
Write-Host "🐍 启动Python后端服务..." -ForegroundColor Yellow

$backendProcess = $null
try {
    # 切换到后端目录
    Set-Location $BackendPath
    
    # 检查是否有requirements.txt，如果有则安装依赖
    if (Test-Path "requirements.txt") {
        Write-Host "📦 安装Python依赖..." -ForegroundColor Cyan
        pip install -r requirements.txt
    }
    
    # 启动后端服务
    Write-Host "🚀 启动后端服务 (端口: $backendPort)..." -ForegroundColor Cyan
    $backendProcess = Start-Process -FilePath "python" -ArgumentList "app.py" -PassThru -NoNewWindow
    
    # 等待后端启动
    Write-Host "⏳ 等待后端服务启动..." -ForegroundColor Cyan
    Start-Sleep -Seconds 5
    
    # 测试后端连接
    try {
        $healthResponse = Invoke-RestMethod -Uri "http://localhost:$backendPort/health" -Method Get -TimeoutSec 10
        Write-Host "✅ 后端服务启动成功: $($healthResponse.status)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  后端服务可能未完全启动，请检查日志" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ 后端服务启动失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 启动前端服务
Write-Host ""
Write-Host "⚛️  启动React前端服务..." -ForegroundColor Yellow

$frontendProcess = $null
try {
    # 切换到前端目录
    Set-Location $FrontendPath
    
    # 检查并安装前端依赖
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 安装前端依赖..." -ForegroundColor Cyan
        npm install
    }
    
    # 启动前端开发服务器
    Write-Host "🚀 启动前端服务 (端口: $frontendPort)..." -ForegroundColor Cyan
    $frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -NoNewWindow
    
    # 等待前端启动
    Write-Host "⏳ 等待前端服务启动..." -ForegroundColor Cyan
    Start-Sleep -Seconds 10
    
    # 测试前端连接
    try {
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:$frontendPort" -Method Get -TimeoutSec 10
        Write-Host "✅ 前端服务启动成功" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  前端服务可能未完全启动，请检查日志" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ 前端服务启动失败: $($_.Exception.Message)" -ForegroundColor Red
    if ($backendProcess) { $backendProcess.Kill() }
    exit 1
}

# 显示成功信息
Write-Host ""
Write-Host "🎉 RN+P FMS集成环境启动完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📊 服务状态:" -ForegroundColor Cyan
Write-Host "   🔗 前端地址: http://localhost:$frontendPort" -ForegroundColor White
Write-Host "   🐍 后端地址: http://localhost:$backendPort" -ForegroundColor White
Write-Host "   📡 API地址: http://localhost:$backendPort/api/v1" -ForegroundColor White
Write-Host ""
Write-Host "🔧 管理命令:" -ForegroundColor Cyan
Write-Host "   • 停止服务: 按 Ctrl+C" -ForegroundColor White
Write-Host "   • 查看日志: 查看终端输出" -ForegroundColor White
Write-Host "   • 重新启动: 重新运行此脚本" -ForegroundColor White
Write-Host ""
Write-Host "💡 下一步操作:" -ForegroundColor Cyan
Write-Host "   1. 打开浏览器访问 http://localhost:$frontendPort" -ForegroundColor White
Write-Host "   2. 测试视频分析功能" -ForegroundColor White
Write-Host "   3. 验证前后端通信" -ForegroundColor White
Write-Host ""

# 等待用户中断
try {
    Write-Host "⏳ 服务运行中... (按 Ctrl+C 停止)" -ForegroundColor Yellow
    Wait-Process -Id $backendProcess.Id, $frontendProcess.Id -ErrorAction SilentlyContinue
} catch {
    Write-Host "👋 服务已停止" -ForegroundColor Green
}

# 清理进程
if ($backendProcess -and !$backendProcess.HasExited) {
    $backendProcess.Kill()
}
if ($frontendProcess -and !$frontendProcess.HasExited) {
    $frontendProcess.Kill()
}

Write-Host "✅ 所有服务已停止" -ForegroundColor Green