# 文档导出脚本
# 使用方法: 在PowerShell中运行 .\export_documents.ps1

# 设置源目录和目标目录
$sourceDir = $PSScriptRoot
$targetDir = "$env:USERPROFILE\Desktop\deeprehab_documents"

# 创建目标目录
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force
    Write-Host "创建导出目录: $targetDir"
}

# 复制所有Markdown文档
Write-Host "正在导出所有Markdown文档..."
$files = Get-ChildItem -Path $sourceDir -Filter "*.md" -Recurse
$copiedCount = 0

foreach ($file in $files) {
    try {
        Copy-Item -Path $file.FullName -Destination $targetDir -Force
        $copiedCount++
        Write-Host "已复制: $($file.Name)"
    } catch {
        Write-Host "复制失败: $($file.Name) - $_"
    }
}

# 可选：创建一个ZIP压缩包
Write-Host "\n正在创建压缩包..."
$zipPath = "$env:USERPROFILE\Desktop\deeprehab_documents.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($targetDir, $zipPath)

Write-Host "\n导出完成!"
Write-Host "复制了 $copiedCount 个文档到: $targetDir"
Write-Host "压缩包已创建: $zipPath"
Write-Host "\n您可以通过以下方式访问导出的文档:"
Write-Host "1. 直接打开桌面的 deeprehab_documents 文件夹"
Write-Host "2. 使用压缩包 deeprehab_documents.zip 进行分享"
Write-Host "3. 通过文件资源管理器手动复制任意文档"