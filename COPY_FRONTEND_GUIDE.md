# 前端项目复制指南

## 概述
本指南详细说明如何将当前前端项目复制到 `C:\Users\23849\Desktop\DEV\RN＋P FMS` 目录，并与Python后端集成。

## 复制步骤

### 1. 检查目标目录结构
首先检查目标目录是否已有文件：
```bash
# 在PowerShell中执行
dir "C:\Users\23849\Desktop\DEV\RN＋P FMS"
```

### 2. 复制前端文件
使用以下命令复制前端项目：
```bash
# 复制所有前端文件到目标目录
xcopy "C:\Users\23849\Desktop\deeprehab-video\*" "C:\Users\23849\Desktop\DEV\RN＋P FMS\frontend" /E /I /Y
```

### 3. 创建项目结构
建议的目标目录结构：
```
RN＋P FMS/
├── backend/          # Python后端代码
├── frontend/         # React前端代码
├── docs/            # 项目文档
└── README.md        # 项目说明
```

## 前端配置调整

### 1. 环境变量配置
创建前端环境配置文件：
```bash
# 在 frontend/.env.development 中添加
VITE_API_URL=http://localhost:8000/api/v1
VITE_BACKEND_URL=http://localhost:8000
```

### 2. 修改API配置
更新 `src/services/api.ts` 文件，适配Python后端：
```typescript
// 修改API基础配置
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  timeout: 30000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
```

### 3. 添加Python后端API客户端
创建新的API客户端文件 `src/services/python-backend-api.ts`：
```typescript
import { AnalysisRequest, AnalysisResponse } from './api';

class PythonBackendApi {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  }
  
  // 视频分析接口
  async analyzeVideo(request: AnalysisRequest): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('video', request.video);
    
    const response = await fetch(`${this.baseUrl}/api/v1/video/analyze`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`分析失败: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // 患者管理接口
  async getPatients() {
    const response = await fetch(`${this.baseUrl}/api/v1/patients`);
    return response.json();
  }
}

export const pythonBackendApi = new PythonBackendApi();
```

## 集成配置

### 1. 创建前后端集成配置
在项目根目录创建 `integration-config.json`：
```json
{
  "frontend": {
    "port": 3000,
    "api_proxy": "/api",
    "build_output": "dist"
  },
  "backend": {
    "port": 8000,
    "api_prefix": "/api/v1",
    "static_files": "frontend/dist"
  }
}
```

### 2. 开发环境代理配置
在 `vite.config.ts` 中添加代理配置：
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  }
});
```

## 部署脚本

### 1. 开发环境启动脚本
创建 `start-dev.ps1`：
```powershell
# 启动开发环境
Write-Host "启动RN+P FMS开发环境..." -ForegroundColor Green

# 启动Python后端
Write-Host "启动Python后端服务..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "backend/app.py" -WorkingDirectory "C:\Users\23849\Desktop\DEV\RN＋P FMS"

# 等待后端启动
Start-Sleep -Seconds 3

# 启动前端开发服务器
Write-Host "启动前端开发服务器..." -ForegroundColor Yellow
Set-Location "frontend"
npm run dev
```

### 2. 生产环境构建脚本
创建 `build-prod.ps1`：
```powershell
# 生产环境构建脚本
Write-Host "构建RN+P FMS生产版本..." -ForegroundColor Green

# 构建前端
Write-Host "构建前端代码..." -ForegroundColor Yellow
Set-Location "frontend"
npm run build

# 复制构建文件到后端静态目录
Write-Host "复制静态文件到后端..." -ForegroundColor Yellow
Copy-Item "dist/*" "../backend/static" -Recurse -Force

Write-Host "构建完成！" -ForegroundColor Green
```

## 测试验证

### 1. 连接测试
创建测试脚本 `test-connection.ps1`：
```powershell
# 测试前后端连接
Write-Host "测试前后端连接..." -ForegroundColor Green

# 测试后端API
$backendUrl = "http://localhost:8000/api/v1/health"
try {
    $response = Invoke-RestMethod -Uri $backendUrl -Method Get
    Write-Host "✅ 后端服务正常" -ForegroundColor Green
} catch {
    Write-Host "❌ 后端服务异常: $($_.Exception.Message)" -ForegroundColor Red
}

# 测试前端开发服务器
$frontendUrl = "http://localhost:3000"
try {
    $response = Invoke-WebRequest -Uri $frontendUrl -Method Get
    Write-Host "✅ 前端服务正常" -ForegroundColor Green
} catch {
    Write-Host "❌ 前端服务异常: $($_.Exception.Message)" -ForegroundColor Red
}
```

## 注意事项

### 1. 文件权限
确保有足够的权限复制文件到目标目录。

### 2. 依赖安装
复制后需要在目标目录运行：
```bash
cd "C:\Users\23849\Desktop\DEV\RN＋P FMS\frontend"
npm install
```

### 3. 环境配置
根据实际后端地址调整环境变量。

### 4. 版本控制
建议初始化Git仓库管理代码版本。

## 故障排除

### 常见问题
1. **复制权限不足**：以管理员身份运行PowerShell
2. **端口冲突**：检查3000和8000端口是否被占用
3. **依赖安装失败**：清除node_modules后重新安装

### 日志查看
- 前端日志：浏览器开发者工具
- 后端日志：Python控制台输出
- 网络请求：浏览器Network面板

---

完成以上步骤后，你的前端项目将成功复制并与Python后端集成。