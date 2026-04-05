# Code Map Skill

## 技能信息
- **技能名称**: code_map
- **版本**: 1.0.0
- **描述**: 分析和可视化项目代码结构、模块关系和依赖
- **分类**: 代码分析

## 功能特性

### 1. 项目结构分析
- 扫描项目目录结构
- 识别源代码文件、配置文件、文档等
- 生成文件类型统计

### 2. 模块识别
- 识别前端模块（React组件、服务、钩子等）
- 识别后端模块（API端点、服务、数据模型等）
- 识别共享模块和工具函数

### 3. 依赖分析
- 分析模块间导入关系
- 识别循环依赖
- 生成依赖图

### 4. 功能定位
- 根据关键词搜索相关代码
- 定位功能实现位置
- 识别代码入口点

## 使用方法

### 基本用法
scan_code_map(project_path='.')

### 扫描特定模块
scan_code_map(
    project_path='.',
    module_type='frontend',
    focus_modules=['components', 'hooks']
)

### 搜索功能实现
scan_code_map(
    project_path='.',
    search_keyword='语音转写',
    search_type='content'
)

## 输入参数

| 参数名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| project_path | string | 否 | '.' | 项目根目录路径 |
| module_type | string | 否 | 'all' | 模块类型: all/frontend/backend/shared |
| focus_modules | array | 否 | null | 需要重点关注的模块列表 |
| search_keyword | string | 否 | null | 搜索关键词 |
| search_type | string | 否 | 'filename' | 搜索类型: filename/content/function |
| max_depth | number | 否 | 5 | 目录扫描最大深度 |

## 输出格式

### 项目结构摘要
{
  "project_name": "RehabHub",
  "total_files": 150,
  "file_type_distribution": {
    "tsx": 45,
    "ts": 30,
    "py": 20,
    "json": 15
  },
  "module_structure": {
    "frontend": {
      "components": { "count": 25, "path": "src/components" },
      "pages": { "count": 15, "path": "src/pages" }
    },
    "backend": {
      "api": { "count": 5, "path": "backend/app/api" }
    }
  }
}

### 模块依赖图
{
  "dependencies": [
    {
      "source": "src/components/pages/Questionnaire.tsx",
      "target": "src/components/ui/AudioRecorder.tsx",
      "type": "import"
    }
  ]
}

### 功能搜索结果
{
  "results": [
    {
      "file": "src/components/ui/AudioRecorder.tsx",
      "function": "startTranscription",
      "line": 48,
      "description": "语音转写功能实现"
    }
  ]
}

## 示例场景

### 场景1: 理解项目结构
我想要了解这个项目的整体结构

### 场景2: 找到特定功能
语音转写功能在哪个文件？

### 场景3: 分析模块依赖
组件间是如何依赖的？

## 高级功能

### 1. 代码复杂度分析
- 计算圈复杂度
- 识别长函数
- 检测代码重复

### 2. 架构合规性检查
- 检查目录结构是否符合规范
- 验证命名约定
- 检查循环依赖

### 3. 变更影响分析
- 识别修改文件的影响范围
- 生成变更报告
- 建议测试范围
