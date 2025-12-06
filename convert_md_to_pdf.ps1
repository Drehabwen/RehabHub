# Markdown转PDF转换工具
# 使用方法: 在PowerShell中运行 .\convert_md_to_pdf.ps1

Write-Host "=== Markdown转PDF转换工具 ==="
Write-Host "此工具将帮助您将Markdown文档转换为PDF或PPT格式"
Write-Host ""

# 检查Node.js是否安装
Write-Host "检查Node.js环境..."
try {
    $nodeVersion = node -v
    Write-Host "已安装Node.js版本: $nodeVersion"
} catch {
    Write-Host "错误: 未找到Node.js。请先安装Node.js再运行此脚本。"
    Write-Host "您可以从 https://nodejs.org/ 下载并安装Node.js"
    exit 1
}

# 安装必要的npm包
Write-Host "\n安装必要的转换工具..."
try {
    # 安装markdown-pdf用于MD到PDF转换
    npm install -g markdown-pdf
    # 安装marp-cli用于MD到PPT转换
    npm install -g @marp-team/marp-cli
    Write-Host "转换工具安装成功!"
} catch {
    Write-Host "警告: 工具安装过程中出现问题，请以管理员身份运行PowerShell重试。"
    Write-Host "不过，我们仍将尝试其他转换方法..."
}

# 创建输出目录
$outputDir = "$env:USERPROFILE\Desktop\deeprehab_converted"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
    Write-Host "\n创建输出目录: $outputDir"
}

# 获取所有Markdown文档列表
Write-Host "\n扫描项目中的Markdown文档..."
$mdFiles = Get-ChildItem -Path $PSScriptRoot -Filter "*.md" | Select-Object FullName, Name
$mdCount = $mdFiles.Count

if ($mdCount -eq 0) {
    Write-Host "未找到Markdown文档!"
    exit 1
}

Write-Host "找到 $mdCount 个Markdown文档"

# 显示转换选项菜单
Write-Host "\n请选择转换格式:"
Write-Host "1. 转换为PDF格式"
Write-Host "2. 转换为PPT格式"
Write-Host "3. 同时转换为PDF和PPT格式"

$choice = Read-Host "请输入选项编号 (1-3)"

# 根据选择执行转换
$convertedCount = 0
foreach ($file in $mdFiles) {
    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    
    try {
        # 转换为PDF
        if ($choice -eq "1" -or $choice -eq "3") {
            Write-Host "\n转换 $($file.Name) 到 PDF..."
            # 使用markdown-pdf转换
            markdown-pdf -o "$outputDir\$fileName.pdf" "$($file.FullName)"
            Write-Host "✅ PDF转换成功: $fileName.pdf"
        }
        
        # 转换为PPT
        if ($choice -eq "2" -or $choice -eq "3") {
            Write-Host "\n转换 $($file.Name) 到 PPT..."
            # 使用marp-cli转换为HTML (可以作为PPT使用)
            marp --html -o "$outputDir\$fileName.html" "$($file.FullName)"
            # 也转换为PDF格式作为幻灯片
            marp --pdf -o "$outputDir\${fileName}_slides.pdf" "$($file.FullName)"
            Write-Host "✅ PPT转换成功: $fileName.html 和 ${fileName}_slides.pdf"
        }
        
        $convertedCount++
    } catch {
        Write-Host "❌ 转换失败: $($file.Name) - $_"
        Write-Host "您可以尝试使用以下替代方法:"
        Write-Host "1. 使用VSCode安装Markdown Preview Enhanced扩展导出PDF"
        Write-Host "2. 使用Typora等Markdown编辑器导出PDF/HTML"
        Write-Host "3. 在线转换工具: https://markdown-to-pdf.com/"
    }
}

Write-Host "\n=== 转换完成 ==="
Write-Host "成功转换了 $convertedCount 个文档"
Write-Host "输出目录: $outputDir"
Write-Host "\n替代转换方法推荐:"
Write-Host "1. 使用VSCode: 安装'Markdown Preview Enhanced'或'Paste Image'扩展"
Write-Host "2. 使用Typora: 直接导出为PDF/HTML/Word"
Write-Host "3. 使用在线工具: Markdown-to-PDF.com, SmallPDF等"
Write-Host "4. PowerPoint导入: 将Markdown内容复制到PPT中格式化"