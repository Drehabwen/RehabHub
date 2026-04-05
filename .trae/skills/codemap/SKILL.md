---
name: codemap
description: 分析代码结构 依赖关系 代码文件交互
---

# Skill: CodeMap Generator（代码地图生成器）
## 1. 技能基本信息
### Name
CodeMap Generator

### Description
该技能用于生成、解析、可视化代码仓库/项目的结构化代码地图（CodeMap），支持输出目录树形结构、模块依赖关系、文件关联关系，帮助用户快速理解代码架构、定位文件位置、分析模块间的调用逻辑。
支持的核心能力：
- 遍历指定代码仓库路径，生成目录/文件的树形结构
- 解析指定语言（Python/JavaScript/Java等）的模块依赖关系
- 输出多种格式的代码地图（纯文本树、Markdown、Mermaid可视化流程图）
- 支持过滤指定目录/文件类型（如排除node_modules、venv等）

### Version
1.0.0

### Author
AI Code Assistant

### Supported Languages
Python, JavaScript/TypeScript, Java, Go, C/C++, HTML/CSS, Vue/React（前端框架）

## 2. 技能目标（Goals）
- 帮助用户快速掌握代码仓库的整体目录结构
- 清晰展示模块/文件之间的依赖调用关系
- 支持自定义过滤规则，聚焦核心代码逻辑
- 输出易读、可复用的代码地图（支持直接复制到文档/笔记）

## 3. 输入参数（Input Parameters）
| 参数名 | 类型 | 必选 | 描述 | 示例 |
|--------|------|------|------|------|
| repo_path | string | 是 | 代码仓库/项目的本地绝对路径/相对路径 | `/Users/xxx/projects/my-python-app` |
| include_patterns | list[string] | 否 | 要包含的文件/目录匹配规则（glob格式） | `["*.py", "src/*", "*.ts"]` |
| exclude_patterns | list[string] | 否 | 要排除的文件/目录匹配规则（优先级高于include） | `["node_modules", "venv", "*.log", "dist"]` |
| output_format | string | 否 | 输出格式，可选值：text（纯文本树）、markdown（MD列表）、mermaid（流程图） | "markdown" |
| show_summary | boolean | 否 | 是否展示文件内容摘要（仅前50字符） | false |
| analyze_deps | boolean | 否 | 是否分析模块依赖关系（仅支持指定语言） | true |

## 4. 执行流程（Execution Steps）
### 步骤1：参数校验
- 检查 `repo_path` 是否存在且为有效目录，若不存在则返回错误提示
- 校验 `output_format` 是否为合法值，默认值为 "text"
- 合并默认排除规则（如.git、.env）和用户指定的 `exclude_patterns`

### 步骤2：遍历目录结构
- 递归遍历 `repo_path` 下的所有文件/目录
- 根据 `include_patterns` 和 `exclude_patterns` 过滤内容
- 记录每个文件的路径、大小、修改时间（可选）

### 步骤3：依赖分析（可选）
- 若 `analyze_deps = true`，针对指定语言解析文件内的导入/引用语句
  - Python：解析 `import`/`from ... import` 语句
  - JavaScript/TS：解析 `import`/`require` 语句
  - Java：解析 `import` 语句
- 构建模块间的依赖关系表（源文件 → 依赖文件列表）

### 步骤4：生成代码地图
- 根据 `output_format` 生成对应格式的代码地图：
  1. text：纯文本树形结构（用├──/└── 标识层级）
  2. markdown：Markdown嵌套列表，标注文件类型/大小
  3. mermaid：Mermaid流程图（graph TD）展示目录结构/依赖关系

### 步骤5：输出结果
- 整理最终结果，若 `show_summary = true` 则追加文件内容摘要
- 返回格式化后的代码地图，附带关键说明（如过滤的目录、依赖分析范围）

## 5. 输出格式示例（Examples）
### 示例1：输入指令