# RehabHub 项目全面梳理报告

> 生成日期：2026-01-07  
> 项目版本：v0.3.0-stable  
> 报告类型：技术架构与功能梳理

---

## 📋 目录

1. [项目概述](#项目概述)
2. [技术架构](#技术架构)
3. [核心功能模块](#核心功能模块)
4. [项目结构详解](#项目结构详解)
5. [技术栈分析](#技术栈分析)
6. [API接口体系](#api接口体系)
7. [开发工作流](#开发工作流)
8. [已发布版本](#已发布版本)
9. [开发路线图](#开发路线图)
10. [快速上手指南](#快速上手指南)

---

## 项目概述

### 基本信息
- **项目名称**：RehabHub (DeepRehab视频分析项目)
- **项目定位**：专业的康复评估移动应用
- **核心技术**：React + TypeScript + Capacitor
- **主要功能**：基于功能性动作筛查(FMS)标准的视频分析与康复评估
- **目标平台**：iOS、Android 移动端
- **仓库地址**：https://github.com/Drehabwen/RehabHub.git

### 项目愿景
通过现代化的前端技术栈和AI视频分析能力，为康复评估提供专业、便捷、智能的移动端解决方案。

---

## 技术架构

### 整体架构图
```
┌─────────────────────────────────────────────────────────┐
│                    移动端应用层                          │
│              (iOS / Android - Capacitor)                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    前端应用层                            │
│            React 18 + TypeScript + Vite                 │
│  ┌───────────────┬───────────────┬────────────────┐    │
│  │  UI组件层     │  业务逻辑层    │  状态管理层    │    │
│  │ (Components)  │  (Services)   │  (Contexts)    │    │
│  └───────────────┴───────────────┴────────────────┘    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   AI分析层                               │
│         TensorFlow.js + PoseNet (姿态检测)              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  后端服务层                              │
│        FastAPI (Python) + Node.js (Express)             │
│  ┌─────────────────────┬──────────────────────┐        │
│  │  视频分析API        │  数据管理API         │        │
│  │  /api/v1/video/*    │  /api/v1/patients/*  │        │
│  └─────────────────────┴──────────────────────┘        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  数据存储层                              │
│         本地存储 (LocalStorage) + 文件系统              │
└─────────────────────────────────────────────────────────┘
```

### 技术选型理由

| 技术 | 选择原因 |
|------|---------|
| **React 18** | 成熟的组件化开发、强大的生态系统、虚拟DOM性能优化 |
| **TypeScript** | 类型安全、代码可维护性高、更好的IDE支持 |
| **Vite** | 极速的开发服务器、优化的构建性能、现代化的开发体验 |
| **Capacitor** | 跨平台支持、原生功能访问、相比Cordova更现代化 |
| **TensorFlow.js** | 浏览器端AI推理、姿态检测能力、无需服务器端处理 |
| **Tailwind CSS** | 原子化CSS、快速开发、高度可定制 |
| **FastAPI** | 高性能Python框架、自动API文档、异步支持 |

---

## 核心功能模块

### 1. 📊 仪表盘 (Dashboard)
- **路径**：`src/components/pages/Dashboard.tsx`
- **功能**：
  - 数据统计展示
  - 最近评估记录
  - 快速操作入口
  - 系统状态监控

### 2. 🎯 评估中心 (Assessment Hub)
- **路径**：`src/components/pages/AssessmentHub.tsx`
- **功能**：
  - 评估方式导航中心
  - 支持多种评估类型：
    - 视频分析评估
    - 量表评估
    - 问卷调查
    - 亚当斯测试

### 3. 🎥 视频分析模块
- **路径**：`src/components/pages/VideoAnalysisPage.tsx`
- **核心功能**：
  - 视频上传与预处理
  - 实时/离线姿态分析
  - 关键点检测
  - 动作评分与反馈
  - 结果可视化

#### 支持的7大FMS动作评估

| 动作名称 | 模块路径 | 评估重点 |
|---------|---------|---------|
| **深蹲 (Deep Squat)** | `src/movements/deep-squat/` | 下肢对称性、躯干稳定性、活动度 |
| **跨栏步 (Hurdle Step)** | `src/movements/hurdle-step/` | 单腿平衡、髋关节灵活性 |
| **直线弓步 (Inline Lunge)** | `src/movements/inline-lunge/` | 动态平衡、核心稳定性 |
| **肩部灵活性 (Shoulder Mobility)** | `src/movements/shoulder-mobility/` | 肩关节活动度、对称性 |
| **主动直腿抬高 (ASLR)** | `src/movements/active-straight-leg-raise/` | 髋关节灵活性、核心稳定性 |
| **躯干稳定性俯卧撑** | `src/movements/trunk-stability-pushup/` | 核心力量、稳定性 |
| **旋转稳定性 (Rotary Stability)** | `src/movements/rotary-stability/` | 复合动作协调性 |

### 4. 📋 量表评估模块
- **路径**：`src/components/pages/Scales.tsx`
- **支持的量表**：
  - VAS (视觉模拟评分)
  - Oswestry (下腰痛功能障碍指数)
  - SF-36 (生活质量量表)
  - TUG (计时起立行走测试)

### 5. 📝 问卷调查模块
- **路径**：`src/components/pages/Questionnaire.tsx`
- **功能**：
  - 自定义问卷创建
  - 多题型支持
  - 数据收集与分析

### 6. 👥 患者管理模块
- **路径**：`src/components/pages/Patients.tsx`
- **功能**：
  - 患者档案管理 (CRUD)
  - 患者信息检索
  - 评估记录关联
  - 患者历史追踪

### 7. 📈 历史记录模块
- **路径**：`src/components/pages/History.tsx`
- **功能**：
  - 评估历史查看
  - 时间轴展示
  - 结果对比分析
  - 数据导出

### 8. 📄 报告生成模块
- **路径**：`src/components/pages/Reports.tsx`
- **功能**：
  - 评估报告生成
  - 多格式导出
  - 报告模板管理
  - 报告分享

### 9. ⚙️ 设置模块
- **路径**：`src/components/pages/Settings.tsx`
- **功能**：
  - 系统配置
  - 用户偏好设置
  - 数据管理
  - 关于信息

### 10. 🔧 管理员模块
- **路径**：`src/components/pages/Admin.tsx`
- **功能**：
  - 系统管理
  - 用户管理
  - 数据统计
  - 系统监控

---

## 项目结构详解

```
RehabHub/
├── 📁 android/                        # Android原生项目
│   ├── app/                           # 应用模块
│   ├── build.gradle                   # Gradle构建配置
│   └── gradle/                        # Gradle wrapper
│
├── 📁 backend/                        # Python后端服务
│   ├── requirements.txt               # Python依赖
│   └── app/
│       ├── main.py                    # FastAPI主入口
│       ├── api/                       # API路由
│       ├── core/                      # 核心配置
│       └── schemas/                   # 数据模型
│
├── 📁 src/                            # 前端源代码
│   ├── App.tsx                        # 应用主组件
│   ├── main.tsx                       # 应用入口
│   ├── index.css                      # 全局样式
│   │
│   ├── 📁 components/                 # 组件目录
│   │   ├── layout/                    # 布局组件
│   │   │   └── Layout.tsx             # 主布局
│   │   ├── pages/                     # 页面组件
│   │   │   ├── Dashboard.tsx          # 仪表盘
│   │   │   ├── AssessmentHub.tsx      # 评估中心
│   │   │   ├── VideoAnalysisPage.tsx  # 视频分析
│   │   │   ├── Scales.tsx             # 量表评估
│   │   │   ├── Patients.tsx           # 患者管理
│   │   │   ├── History.tsx            # 历史记录
│   │   │   ├── Reports.tsx            # 报告
│   │   │   └── Settings.tsx           # 设置
│   │   └── ui/                        # UI基础组件
│   │       ├── Button.tsx             # 按钮
│   │       ├── Card.tsx               # 卡片
│   │       ├── Input.tsx              # 输入框
│   │       ├── Breadcrumbs.tsx        # 面包屑导航
│   │       ├── SplashScreen.tsx       # 启动屏
│   │       └── StatusIndicator.tsx    # 状态指示器
│   │
│   ├── 📁 movements/                  # FMS动作模块
│   │   ├── deep-squat/                # 深蹲分析
│   │   ├── hurdle-step/               # 跨栏步分析
│   │   ├── inline-lunge/              # 直线弓步分析
│   │   ├── shoulder-mobility/         # 肩部灵活性分析
│   │   ├── active-straight-leg-raise/ # 主动直腿抬高分析
│   │   ├── trunk-stability-pushup/    # 躯干稳定性俯卧撑分析
│   │   └── rotary-stability/          # 旋转稳定性分析
│   │
│   ├── 📁 contexts/                   # React上下文
│   │   └── NavigationContext.tsx      # 导航上下文
│   │
│   ├── 📁 hooks/                      # 自定义Hooks
│   │   ├── useAnalysis.ts             # 分析Hook
│   │   ├── useCamera.ts               # 相机Hook
│   │   ├── useDashboardData.ts        # 仪表盘数据Hook
│   │   ├── useHealthCheck.ts          # 健康检查Hook
│   │   ├── usePermissions.ts          # 权限Hook
│   │   └── usePoseEstimation.ts       # 姿态估计Hook
│   │
│   ├── 📁 services/                   # 服务层
│   │   ├── api.ts                     # API服务
│   │   ├── fms-backend-api.ts         # FMS后端API
│   │   ├── python-backend-api.ts      # Python后端API
│   │   ├── mobile-api.ts              # 移动端API
│   │   ├── poseDetection.ts           # 姿态检测服务
│   │   └── LLMService.ts              # LLM服务
│   │
│   ├── 📁 types/                      # TypeScript类型定义
│   │   ├── index.ts                   # 通用类型
│   │   ├── assessment.ts              # 评估类型
│   │   └── keypoints.ts               # 关键点类型
│   │
│   ├── 📁 theme/                      # 主题配置
│   │   ├── index.ts                   # 主题导出
│   │   ├── theme.ts                   # 主题定义
│   │   └── MedicalTheme.ts            # 医疗主题
│   │
│   └── 📁 utils/                      # 工具函数
│       ├── helpers.ts                 # 辅助函数
│       ├── navigation.ts              # 导航工具
│       └── animations.ts              # 动画工具
│
├── 📁 public/                         # 静态资源
│   ├── manifest.json                  # PWA配置
│   └── sw.js                          # Service Worker
│
├── 📁 scripts/                        # 构建脚本
│   ├── release-apk.ps1                # APK发布脚本
│   └── release-apk-to.ps1             # APK发布到指定位置
│
├── 📄 package.json                    # 项目依赖配置
├── 📄 tsconfig.json                   # TypeScript配置
├── 📄 vite.config.ts                  # Vite配置
├── 📄 tailwind.config.cjs             # Tailwind配置
├── 📄 capacitor.config.ts             # Capacitor配置
│
└── 📚 文档
    ├── README.md                      # 项目说明
    ├── QUICK_START_GUIDE.md           # 快速开始指南
    ├── DEVELOPMENT_ROADMAP.md         # 开发路线图
    ├── API_INTERFACE_SPECIFICATION.md # API接口规范
    ├── AI_CODING_GUIDE.md             # AI编码指南
    ├── CODE_REVIEW_GUIDE.md           # 代码审查指南
    └── MENTORING_GUIDE.md             # 导师指导手册
```

---

## 技术栈分析

### 前端技术栈

#### 核心框架
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.9.3"
}
```

#### 构建工具
```json
{
  "vite": "^7.2.6",
  "@vitejs/plugin-react": "^4.0.4"
}
```

#### 样式方案
```json
{
  "tailwindcss": "^3.3.3",
  "autoprefixer": "^10.4.15",
  "postcss": "^8.4.28"
}
```

#### 移动端支持
```json
{
  "@capacitor/core": "^5.4.0",
  "@capacitor/cli": "^5.4.0",
  "@capacitor/android": "^5.4.0"
}
```

#### AI与机器学习
```json
{
  "@tensorflow/tfjs": "^4.10.0",
  "@tensorflow-models/pose-detection": "^2.1.0"
}
```

#### 状态管理与数据请求
```json
{
  "@tanstack/react-query": "^4.32.6"
}
```

#### UI组件库
```json
{
  "@radix-ui/react-icons": "^1.3.0",
  "lucide-react": "^0.263.1"
}
```

#### 文件处理
```json
{
  "react-dropzone": "^14.2.3"
}
```

### 后端技术栈

#### Python后端
```python
# backend/requirements.txt
fastapi
uvicorn
python-multipart
tensorflow
opencv-python
numpy
```

#### Node.js后端
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "multer": "^1.4.5-lts.1"
}
```

### 开发工具

#### 测试框架
```json
{
  "vitest": "^4.0.14",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.9.1",
  "jsdom": "^27.2.0"
}
```

#### 并发运行
```json
{
  "concurrently": "^8.2.0"
}
```

---

## API接口体系

### API基础信息
- **API版本**：v1
- **数据格式**：JSON
- **字符编码**：UTF-8
- **Python后端端口**：8000
- **Node.js后端端口**：3001

### 核心API端点

#### 1. 健康检查
```
GET /health
响应：{ code: 200, message: "ok", data: { status: "ok" }}
```

#### 2. 视频分析API
```
POST /api/v1/video/analyze
参数：
  - video: File (视频文件)
  - movement_type: string (动作类型)
  - patient_id?: string (患者ID)
  
响应：
  - analysis_id: string
  - score: number
  - feedback: string
  - angles: Record<string, number>
  - keypoints: Keypoint[]
```

```
GET /api/v1/video/history
查询参数：
  - page?: number
  - pageSize?: number
  - patient_id?: string
  - movement_type?: string
```

#### 3. 患者管理API
```
GET /api/v1/patients
POST /api/v1/patients
GET /api/v1/patients/{patient_id}
PUT /api/v1/patients/{patient_id}
DELETE /api/v1/patients/{patient_id}
```

#### 4. 评估记录API
```
GET /api/v1/scale-assessments
POST /api/v1/scale-assessments
GET /api/v1/scale-assessments/{assessment_id}
PUT /api/v1/scale-assessments/{assessment_id}
DELETE /api/v1/scale-assessments/{assessment_id}
```

#### 5. 量表API
```
GET /api/v1/scales
GET /api/v1/scales/{scale_id}
GET /api/v1/scales/{scale_id}/questions
```

### 统一响应格式
```typescript
interface BaseResponse<T> {
  code: number;        // 业务状态码
  message: string;     // 消息描述
  data: T;            // 业务数据
  timestamp: string;   // 响应时间戳
}
```

### 错误码规范
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 1001 | 视频文件格式不支持 | 请上传MP4、MOV或AVI格式 |
| 1002 | 视频文件过大 | 文件大小不能超过100MB |
| 2001 | 患者不存在 | 检查患者ID是否正确 |
| 3001 | 动作类型不支持 | 检查动作类型参数 |
| 5001 | 量表不存在 | 检查量表ID是否正确 |

---

## 开发工作流

### NPM脚本命令

#### 开发环境
```bash
# 启动前端开发服务器 (端口3000)
npm run dev

# 启动后端服务 (端口3001)
npm run server

# 同时启动前端+后端
npm run dev:all

# 运行测试
npm test
```

#### 构建与打包
```bash
# 构建生产版本
npm run build

# 构建并打包为APK
npm run apk:release

# 构建并发布APK到指定位置
npm run apk:release:to
```

#### Capacitor命令
```bash
# 同步Web资源到Android
npx cap sync android

# 在Android Studio中打开
npx cap open android

# 构建Android APK
cd android
./gradlew assembleDebug
```

### Git工作流
```bash
# 克隆项目
git clone https://github.com/Drehabwen/RehabHub.git

# 切换到稳定版本分支
git checkout v0.3.0-stable

# 创建功能分支
git checkout -b feature/your-feature-name

# 提交更改
git add .
git commit -m "feat: your feature description"

# 推送到远程
git push origin feature/your-feature-name
```

### 开发流程
1. **需求分析** → 确定功能需求和技术方案
2. **创建分支** → 从主分支创建功能分支
3. **编码实现** → 按照编码规范实现功能
4. **自测** → 本地测试功能是否正常
5. **代码审查** → 提交PR请求代码审查
6. **合并代码** → 审查通过后合并到主分支
7. **部署测试** → 在测试环境验证
8. **发布上线** → 构建APK并发布

---

## 已发布版本

项目根目录包含多个已发布的APK版本：

```
├── RehabHub-v0.2.0.apk
├── RehabHub-v0.2.1.apk
├── RehabHub-v0.2.2.apk
├── RehabHub-v0.2.3.apk
├── RehabHub-v0.2.4.apk
├── Rehabhub-v0.2.5.apk
├── Rehabhub-v0.2.6.apk
├── Rehabhub-v0.2.7.apk
└── Rehabhub-v0.2.8.apk
```

**当前稳定版本**：v0.3.0-stable

---

## 开发路线图

### 学习阶段划分

#### 阶段一：基础入门（1-2周）
- ✅ 开发环境配置
- ✅ Git基础操作
- ✅ 前端基础概念
- 📝 任务：文档完善、样式修改

#### 阶段二：技能构建（3-4周）
- 📚 React核心概念
- 📚 TypeScript基础
- 📚 Tailwind CSS
- 📝 任务：组件开发、样式优化

#### 阶段三：能力提升（5-8周）
- 🎯 高级React (Hooks、Context)
- 🎯 API调用与数据处理
- 🎯 项目业务逻辑
- 📝 任务：功能模块开发

#### 阶段四：创新应用（9周以后）
- 🚀 高级前端技术
- 🚀 机器学习基础
- 🚀 架构设计
- 📝 任务：复杂功能、性能优化

### 功能开发优先级

#### P0 - 核心功能（必须）
- [x] 视频分析基础功能
- [x] 7大FMS动作评估
- [x] 患者管理
- [x] 历史记录

#### P1 - 重要功能（高优先级）
- [x] 量表评估系统
- [x] 报告生成
- [ ] 数据导出
- [ ] 离线模式支持

#### P2 - 增强功能（中优先级）
- [ ] 多语言支持
- [ ] 主题切换
- [ ] 数据可视化增强
- [ ] 性能优化

#### P3 - 扩展功能（低优先级）
- [ ] 社交分享
- [ ] 云端同步
- [ ] AI辅助建议
- [ ] 远程协作

---

## 快速上手指南

### 环境要求
- **Node.js**：v16+ 
- **npm**：v8+
- **Python**：v3.8+
- **Java**：JDK 17 或 21 (Android开发)
- **Android Studio**：最新版本

### 安装步骤

#### 1. 克隆项目
```bash
git clone https://github.com/Drehabwen/RehabHub.git
cd RehabHub
git checkout v0.3.0-stable
```

#### 2. 安装前端依赖
```bash
npm install
```

#### 3. 安装后端依赖
```bash
cd backend
pip install -r requirements.txt
cd ..
```

#### 4. 启动开发服务器
```bash
# 方式1: 同时启动前后端
npm run dev:all

# 方式2: 分别启动
npm run dev      # 终端1: 前端 (http://localhost:3000)
npm run server   # 终端2: 后端 (http://localhost:3001)
```

#### 5. 访问应用
打开浏览器访问：http://localhost:3000

### 开发建议

#### 推荐的VS Code扩展
- **ESLint** - 代码规范检查
- **Prettier** - 代码格式化
- **Tailwind CSS IntelliSense** - Tailwind类名提示
- **TypeScript Vue Plugin (Volar)** - TypeScript支持
- **GitLens** - Git增强工具

#### 代码规范
- 使用TypeScript编写所有代码
- 遵循ESLint规则
- 使用Prettier格式化代码
- 组件采用函数式编程
- 使用React Hooks而非Class组件

#### 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建配置等
```

### 常见问题

#### Q1: 端口被占用
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

#### Q2: 依赖安装失败
```bash
# 清除缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Q3: TensorFlow.js加载失败
- 检查网络连接
- 使用国内镜像：`npm config set registry https://registry.npmmirror.com`

#### Q4: Android构建失败
- 确保Java版本正确 (JDK 17/21)
- 检查环境变量配置
- 清理Gradle缓存：`cd android && ./gradlew clean`

---

## 项目亮点

### ✨ 技术亮点
1. **现代化技术栈**：React 18 + TypeScript + Vite
2. **跨平台能力**：一套代码，iOS和Android双端部署
3. **AI赋能**：集成TensorFlow.js实现端侧AI推理
4. **模块化架构**：清晰的代码组织，易于维护和扩展
5. **类型安全**：全面的TypeScript类型定义
6. **性能优化**：懒加载、代码分割、虚拟化列表

### 🎯 功能亮点
1. **专业评估体系**：基于FMS标准的7大动作评估
2. **多维度评估**：视频、量表、问卷多种评估方式
3. **智能分析**：AI驱动的姿态检测和动作评分
4. **可视化报告**：专业的评估报告生成
5. **患者管理**：完整的患者档案管理系统
6. **历史追踪**：详细的评估历史记录

### 📚 文档完善
1. 详细的README和快速开始指南
2. 完整的API接口规范文档
3. 清晰的开发路线图
4. AI编码指南和代码审查指南
5. 导师指导手册和任务分解文档

---

## 联系方式

- **GitHub仓库**：https://github.com/Drehabwen/RehabHub
- **问题反馈**：在GitHub Issues中提交
- **技术讨论**：通过PR评论或Discussion

---

## 许可证

本项目仅供学习和研究使用。

---

**报告生成者**：Cline AI Assistant  
**报告版本**：v1.0  
**最后更新**：2026-01-07
