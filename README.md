# RehabHub

DeepRehab视频分析项目 - 基于React + TypeScript + Capacitor的移动端康复评估应用

## 项目简介

RehabHub是一个专业的康复评估移动应用，基于功能性动作筛查(FMS)标准，通过视频分析技术对用户的运动功能进行评估。项目采用现代化前端技术栈，支持7大核心FMS动作评估，并提供量表评估、问卷调查等多种评估方式。

## 功能特性

- **7大核心FMS动作评估**：深蹲、跨栏步、直线弓步、肩部灵活性、主动直腿抬高、躯干稳定性俯卧撑、旋转稳定性
- **多样化评估方式**：支持视频分析、量表评估、问卷调查、亚当斯测试等多种评估方法
- **实时视频分析**：基于TensorFlow.js的姿势检测技术
- **跨平台支持**：使用Capacitor构建iOS和Android应用
- **现代化技术栈**：React 18 + TypeScript + Vite + Tailwind CSS
- **数据管理**：支持患者管理、历史记录、报告生成等功能
- **导航系统**：完整的模块化导航系统，支持面包屑导航

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **移动端框架**：Capacitor
- **姿势检测**：TensorFlow.js PoseNet
- **状态管理**：React Hooks + 自定义Context
- **UI组件**：自定义组件库

## 项目结构

```
src/
├── components/         # UI组件和页面组件
│   ├── layout/       # 布局组件
│   ├── pages/        # 页面组件
│   └── ui/           # 基础UI组件
├── contexts/         # React Contexts (如导航上下文)
├── hooks/            # 自定义React Hooks
├── movements/        # 7大FMS动作分析模块
├── services/         # API和数据处理服务
├── shared/           # 共享组件和服务
├── theme/            # 主题配置
├── types/            # TypeScript类型定义
└── utils/            # 工具函数
```

## 核心模块

- **Dashboard** - 仪表盘
- **Assessment Hub** - 评估中心（包含视频分析、量表评估、问卷等）
- **FMS动作模块** - 7大核心FMS动作评估
- **Patient Management** - 患者管理
- **History** - 历史记录
- **Reports** - 报告生成与管理
- **Settings** - 设置

## 导航系统

项目采用基于Context的模块化导航系统，支持：
- URL哈希路由
- 面包屑导航
- 历史记录管理
- 参数传递

## 开发环境设置

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器（前端+后端）：
```bash
npm run dev:all
```

3. 单独启动前端：
```bash
npm run dev
```

4. 单独启动后端服务：
```bash
npm run server
```

5. 构建生产版本：
```bash
npm run build
```

6. 同步到移动端：
```bash
npx cap sync android
npx cap sync ios
```

## 构建APK

项目支持Android APK构建：

```bash
cd android
./gradlew assembleDebug
```

## 许可证

本项目仅供学习和研究使用。