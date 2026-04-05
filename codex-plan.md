# Task Plan

## Objective
- 在已完成前端与 Node mock 收敛的基础上，继续把 FastAPI 对齐到统一资源契约，减少本地双源数据模型。

## Constraints
- 当前仓库同时存在 Web 主应用、插件模式、Node 本地模拟 API、Python FastAPI 原型，职责边界尚未收敛。
- 项目处于脏工作区，只对本次 API 收敛相关文件做增量改动，不回退用户已有修改。
- 现有测试主要覆盖局部逻辑，未覆盖关键通信契约与跨层集成。

## Current Architecture
- 前端主应用：React + Vite + TypeScript，自定义 `hash + Context` 导航，页面与流程状态大量保存在 `sessionStorage` / `localStorage`。
- 插件模式：通过 `src/plugin-entry.tsx` 暴露 `initRehabPlugin`，宿主可挂载组件并发送导航事件。
- 本地 Node 服务：`server.js` 提供视频分析 mock、结果列表、报告创建与导出 mock，数据持久化到 `data/results.json`。
- Python 后端：`backend/app/main.py` + `api/v1/assessment/analyze`，当前主要承接关键点和角度数据分析。

## Communication Snapshot
- 浏览器内通信：页面之间通过 `NavigationContext` + `sessionStorage` 传参和共享流程状态。
- Web -> Node：`src/services/api.ts` 默认请求 `http://localhost:8001`，用于 `/api/analyze`、`/api/results` 等。
- Web -> Python：`src/services/api.ts` 的 `postPoseTelemetry()` 默认请求 `http://localhost:8000/api/v1/assessment/analyze`。
- 插件宿主 -> Web：宿主通过 `window.RehabHub.init()` 初始化，并通过自定义事件驱动导航。

## Main Risks
- [completed] 前端把 Node 接口和本地缓存视为同一数据模型，但服务端返回结构与页面实际读取字段不一致。
- [completed] Node mock API 与 Python 后端同时承担“后端”角色，前端调用目标分散，形成双源真相。
- [completed] 插件模式暴露了 `apiUrl` 配置，但应用 API 客户端没有真正消费该配置。
- [completed] 前端业务流程严重依赖浏览器存储，患者、评估进度、报告生成状态缺少统一数据层。
- [completed] `results.json` 混合承载姿态流记录与报告记录，且采用整文件读改写，扩展性和一致性都较弱。

## Recommended Phases
- [completed] Phase 1: 新增统一前端 API 数据层，拆分 `analysis/results/reports/system/runtime` 模块并补齐标准分页与领域类型。
- [completed] Phase 2: 插件模式通过 runtime config 注入 `apiBaseUrl/backendBaseUrl`，前端调用统一消费运行时配置。
- [completed] Phase 3: Node mock API 按 `assessment-results / reports / pose-telemetry` 分库存储，接口按资源化路径拆分并保留必要兼容入口。
- [completed] Phase 4: 结果页、详情页、报告页切换到新 API client，修复结果/报告接口结构不一致导致的运行时风险。
- [completed] Phase 5: 完成构建与测试回归，确认当前改动可编译、可打包、现有单测通过。
- [completed] Phase 6: 为 FastAPI 补齐 `assessment-results / reports / system` 资源接口，并复用根目录 `data/*.json` 作为共享开发数据源。
- [completed] Phase 7: 完成 FastAPI 语法编译与关键接口返回形状验证。

## Verification
- 代码依据：`src/App.tsx`、`src/contexts/NavigationContext.tsx`、`src/services/api.ts`、`src/plugin-entry.tsx`、`server.js`、`backend/app/main.py`。
- 已完成验证：`npm run build`、`npm test` 均通过。
- 已确认前端残留的 `getModuleApi()` 与直接 `import.meta.env.VITE_BACKEND_URL` 业务调用已收敛到 runtime config。
- 已完成后端验证：`python -m compileall backend/app` 通过；使用 `fastapi.testclient.TestClient` 验证了 `/health`、`/api/v1/assessment-results`、`/api/v1/reports`、`/api/v1/system/stats`、`/api/v1/reports/:id/export` 的返回结构。

## Outcome
- 已完成当前架构与通信链路盘点，并补充目标架构与接口草案文档：`ARCHITECTURE_API_TARGET_DRAFT.md`。
- 已新增 `src/api/*` 统一前端数据访问层，并让 `src/services/api.ts` 退化为兼容导出层。
- 已实现插件运行时 API 配置闭环，`plugin-entry.tsx`、`PluginContext.tsx`、后端客户端与健康检查组件均改为读取统一 runtime config。
- 已重构 `server.js` 的 mock 数据组织方式，避免评估结果、报告和姿态流继续混存于同一个 `results.json`。
- 已修复报告页、历史页、详情页对结果/报告接口结构的错误假设，降低 `filter is not a function` 与空字段显示风险。
- 已为 FastAPI 新增资源化端点与共享 JSON 存储：`assessment-results`、`reports`、`system`，并让 `assessment/analyze` 自动落库为评估结果。
- 已让前端 `results / reports / system` 数据层在 Node API 不可用时自动回退到 FastAPI 资源接口。

## Remaining Risks
- Python FastAPI 已对齐核心资源契约，但 `patients / cases / assessment-sessions` 仍未纳入统一实现；前端当前也仍是“Node 优先、FastAPI 回退”，尚未切到单一正式后端。
- 浏览器存储仍承载部分患者上下文、语音问诊草稿与流程状态，尚未迁移为后端持久化。
- LLM 调用仍在浏览器侧直连，密钥与供应商耦合问题未在本轮处理。
- 姿态检测大包与动态导入失效问题仍存在，主 chunk 体积告警未在本轮解决。
