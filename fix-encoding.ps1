# 修复后端应用编码问题
param(
    [string]$BackendPath = "C:\Users\23849\Desktop\DEV\RN＋P FMS\backend"
)

Write-Host "开始修复后端应用编码问题..."

# 修复app.py文件
$appPyPath = "$BackendPath\app.py"
if (Test-Path $appPyPath) {
    Write-Host "修复 app.py..."
    $content = Get-Content $appPyPath -Encoding UTF8
    # 替换编码错误的注释
    $content = $content -replace "鍚庣搴旂敤鍏ュ彛鏂囦欢", "后端应用入口文件"
    $content = $content -replace "鎻愪緵RESTful API鎺ュ彛渚涘墠绔皟鐢?", "提供RESTful API接口供前端调用"
    $content = $content -replace "閰嶇疆鏃ュ織", "配置日志"
    $content = $content -replace "灏哻ore鐩綍娣诲姞鍒癙ython璺緞涓?", "将core目录添加到Python路径中"
    $content = $content -replace "瀵煎叆鏍稿績妯″潡", "导入核心模块"
    Set-Content -Path $appPyPath -Value $content -Encoding UTF8
    Write-Host "✅ app.py修复完成"
}

Write-Host "编码修复完成！"
Write-Host "现在可以启动后端服务进行集成测试"