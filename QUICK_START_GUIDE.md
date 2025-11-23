# RN+P FMS 前端复制快速开始指南

## 🚀 快速开始

### 第一步：复制前端项目
运行复制脚本将前端项目复制到目标目录：

```powershell
# 在PowerShell中执行（以管理员身份运行）
.\copy-frontend.ps1
```

**默认目标目录**: `C:\Users\23849\Desktop\DEV\RN＋P FMS\frontend`

### 第二步：启动集成环境
运行集成启动脚本：

```powershell
# 在PowerShell中执行
.\start-integrated.ps1
```

### 第三步：验证服务
打开浏览器访问：
- 前端界面: http://localhost:3000
- 后端API: http://localhost:8000/api/v1

## 📋 完整迁移步骤

### 阶段一：准备阶段

1. **检查目标目录**
   ```powershell
   # 检查后端目录是否存在
   Test-Path "C:\Users\23849\Desktop\DEV\RN＋P FMS\backend"
   ```

2. **复制前端项目**
   ```powershell
   # 运行复制脚本
   .\copy-frontend.ps1
   ```

3. **验证复制结果**
   ```powershell
   # 检查复制后的文件
   dir "C:\Users\23849\Desktop\DEV\RN＋P FMS\frontend"
   ```

### 阶段二：配置阶段

1. **环境配置检查**
   - 确保 `frontend/.env.development` 文件已创建
   - 检查API地址配置是否正确

2. **依赖安装**
   ```powershell
   # 切换到前端目录
   cd "C:\Users\23849\Desktop\DEV\RN＋P FMS\frontend"
   
   # 安装依赖
   npm install
   ```

3. **Python后端准备**
   ```powershell
   # 切换到后端目录
   cd "C:\Users\23849\Desktop\DEV\RN＋P FMS\backend"
   
   # 安装Python依赖（如果有requirements.txt）
   pip install -r requirements.txt
   ```

### 阶段三：集成测试

1. **启动集成环境**
   ```powershell
   # 从任意目录运行
   .\start-integrated.ps1
   ```

2. **功能测试清单**
   - [ ] 前端界面正常加载
   - [ ] 后端API健康检查通过
   - [ ] 视频上传功能正常
   - [ ] 分析结果返回正常
   - [ ] 患者管理功能正常

## 🔧 配置文件说明

### 环境变量 (.env.development)
```bash
# 开发环境配置
VITE_API_URL=http://localhost:8000/api/v1
VITE_BACKEND_URL=http://localhost:8000
VITE_APP_NAME="RN+P FMS 开发版"
```

### 集成配置 (integration-config.json)
```json
{
  "frontend": {
    "port": 3000,
    "api_proxy": "/api"
  },
  "backend": {
    "port": 8000,
    "api_prefix": "/api/v1"
  }
}
```

## 🐛 故障排除

### 常见问题

1. **复制权限不足**
   ```powershell
   # 以管理员身份运行PowerShell
   Start-Process PowerShell -Verb RunAs
   ```

2. **端口被占用**
   ```powershell
   # 查看端口占用情况
   netstat -ano | findstr :3000
   netstat -ano | findstr :8000
   
   # 终止占用进程
   taskkill /PID <进程ID> /F
   ```

3. **依赖安装失败**
   ```powershell
   # 清除缓存重新安装
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

4. **后端连接失败**
   - 检查Python后端是否正常运行
   - 验证API地址配置
   - 检查防火墙设置

### 日志查看

**前端日志**:
```powershell
# 查看前端构建日志
npm run build

# 开发模式日志在浏览器控制台
```

**后端日志**:
```powershell
# Python后端控制台输出
```

## 📊 验证检查清单

### 基础验证
- [ ] 前端项目成功复制
- [ ] 环境配置文件正确
- [ ] 依赖安装完成
- [ ] 前后端服务正常启动

### 功能验证
- [ ] 前端界面可访问
- [ ] 后端API可调用
- [ ] 视频上传功能正常
- [ ] 分析流程完整
- [ ] 数据存储正常

### 集成验证
- [ ] 前后端通信正常
- [ ] 错误处理完善
- [ ] 性能表现良好
- [ ] 用户体验流畅

## 🚀 生产部署

### 构建生产版本
```powershell
# 切换到前端目录
cd "C:\Users\23849\Desktop\DEV\RN＋P FMS\frontend"

# 构建生产版本
npm run build

# 构建文件在 dist/ 目录
```

### 部署配置
1. 将构建文件复制到后端静态目录
2. 配置生产环境变量
3. 设置反向代理（如Nginx）
4. 配置SSL证书

## 📞 技术支持

### 文档资源
- [接口规范文档](API_INTERFACE_SPECIFICATION.md)
- [复制指南](COPY_FRONTEND_GUIDE.md)
- [组件开发规范](.github/COMPONENT_TEMPLATE.md)

### 问题反馈
如遇到问题，请检查：
1. 错误日志信息
2. 网络连接状态
3. 服务端口占用情况
4. 文件权限设置

---

**文档版本**: v1.0  
**最后更新**: 2024-12-19  
**适用环境**: Windows + PowerShell