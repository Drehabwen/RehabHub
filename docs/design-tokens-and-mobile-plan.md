# 设计 Token 提炼与移动端功能规划

## 0. 文档目的

本文档解决两个问题：

1. 从当前项目中提炼已经落地的设计 token，形成可复用的设计系统基线。
2. 基于当前产品方向，为移动端规划一条清晰、可执行的功能路线。

适用范围：

- `Rehab-V3.1` 当前 Web 端 UI
- 后续移动端 App / H5 / Pad 端设计与开发
- 后续设计系统收敛与组件库演进

---

## 1. 结论先行

### 1.1 当前项目已经存在的设计语言

当前项目并不是没有 token，而是存在 **三套并行来源**：

- `src/index.css`
  负责 CSS 变量、按钮、表单、卡片、对话框、状态面板等全局基础样式。
- `tailwind.config.js`
  负责品牌色、断点、字体大小、圆角、动画等 Tailwind 扩展。
- `src/constants/design-tokens.ts` 与 `src/constants/uiStyles.ts`
  负责 TypeScript 常量化的颜色、间距、半径、动画与语义类名。

### 1.2 当前最大问题

问题不是“没有设计 token”，而是：

- token 定义有重复
- 命名体系并不统一
- 一部分是原始值，一部分是 Tailwind class，一部分是 CSS 变量
- 组件层已经开始稳定，但系统层还没有单一可信源

### 1.3 建议方向

建议后续把设计系统统一成三层：

1. `Foundation Token`
   纯值：颜色、字号、间距、圆角、阴影、动效、断点
2. `Semantic Token`
   语义：页面背景、主按钮、危险状态、专题标签、卡片边框、工作台工具色
3. `Component Token`
   组件级：按钮、输入框、卡片、Badge、Dialog、Page Shell、Sidebar

---

## 2. 设计 Token 来源盘点

## 2.1 核心来源文件

- [design-tokens.ts](/C:/Users/DORAT/Desktop/sport%20rehab/Rehab-V3.1/src/constants/design-tokens.ts)
- [uiStyles.ts](/C:/Users/DORAT/Desktop/sport%20rehab/Rehab-V3.1/src/constants/uiStyles.ts)
- [index.css](/C:/Users/DORAT/Desktop/sport%20rehab/Rehab-V3.1/src/index.css)
- [tailwind.config.js](/C:/Users/DORAT/Desktop/sport%20rehab/Rehab-V3.1/tailwind.config.js)
- [Card.tsx](/C:/Users/DORAT/Desktop/sport%20rehab/Rehab-V3.1/src/components/ui/Card.tsx)
- [Button.tsx](/C:/Users/DORAT/Desktop/sport%20rehab/Rehab-V3.1/src/components/ui/Button.tsx)
- [Badge.tsx](/C:/Users/DORAT/Desktop/sport%20rehab/Rehab-V3.1/src/components/ui/Badge.tsx)

## 2.2 当前实际视觉风格

当前项目的视觉风格已经比较明确：

- 整体基调：浅暖中性色 + 绿色品牌色
- 结构感：卡片式后台、浅边框、低噪音层级
- 情绪：医疗/教育/机构后台，而不是消费级炫技产品
- 形状：中到大圆角，按钮与卡片都偏柔和
- 动效：克制，主要用于加载、切换、进度、扫描态

---

## 3. 已实现 Foundation Token

## 3.1 色彩 Token

### 中性色

来源：`index.css` 与 `design-tokens.ts`

| Token | 值 | 用途 |
|---|---|---|
| `n900` | `#1A1A18` | 主标题、深色正文 |
| `n700` | `#5A5A50` | 常规正文 |
| `n500` | `#77776D` | 次级描述 |
| `n400` | `#999999` | 弱提示、占位 |
| `n300` | `rgba(0,0,0,0.15)` | 常规边框 |
| `n200` | `rgba(0,0,0,0.08)` | 轻边框 |
| `n100` | `#EFECE4` | 次级浅背景 |
| `n50` | `#F5F2EC` | 页面主背景 |

### 品牌色

来源：`design-tokens.ts`、`tailwind.config.js`、`index.css`

| Token | 值 | 用途 |
|---|---|---|
| `brand.primary` | `#3D7A5C` | 主按钮、主高亮、品牌识别 |
| `brand.strong` | `#2F6148` | 主按钮 hover |
| `brand.soft` | `#E4F0EA` | 主品牌浅底 |
| `brand.mid` | `#6AAA8C` | 渐变第二色、强调辅色 |
| `brand.light` | `#9FCFB8` | 更轻的品牌辅助色 |

### 状态色

来源：`design-tokens.ts`、`index.css`

| Token | 值 | 用途 |
|---|---|---|
| `status.success` | `#3D7A5C` | 成功、完成、正常 |
| `status.warning` | `#C5943B` | 待处理、关注 |
| `status.error` | `#C53B3B` | 风险、错误、高优先级 |
| `status.info` | `#2563EB` | 处理中、提示信息 |

### 工具与专题辅助色

来源：`index.css`

| Token | 值 | 用途 |
|---|---|---|
| `voice` | `#7C3AED` | 问询补充 / 语音相关 |
| `posture` | `#6AAA8C` | 体态筛查 / posture |
| `rom` | `#16A34A` | ROM 模块 |
| `comparison` | `#0891B2` | 趋势对比 |
| `reports` | `#475569` | 报告 / 归档 |

---

## 3.2 排版 Token

来源：`design-tokens.ts`、`index.css`、`tailwind.config.js`

### 字体族

| Token | 值 | 用途 |
|---|---|---|
| `font.title` | `Noto Serif SC / Songti SC / STSong` | 标题、专题头图 |
| `font.body` | `PingFang SC / Hiragino Sans GB / Microsoft YaHei` | 正文、表单、后台内容 |
| `font.eyebrow` | `DM Sans / Helvetica Neue` | 英文标签、眉标题、辅助标识 |

### 字重

| Token | 值 |
|---|---|
| `light` | `300` |
| `normal` | `400` |
| `medium` | `500` |
| `bold` | `700` |
| `black` | `900` |

### 字号

来源：`tailwind.config.js`

| Token | 值 |
|---|---|
| `2xs` | `9px / 1.4` |
| `xs` | `10px / 1.4` |
| `sm` | `11px / 1.5` |
| `base` | `14px / 1.5` |
| `lg` | `16px / 1.4` |
| `xl` | `20px / 1.3` |
| `2xl` | `24px / 1.3` |
| `3xl` | `30px / 1.2` |
| `4xl` | `40px / 1.1` |

### 当前排版特征

- 标题区倾向 `text-2xl / text-3xl + font-semibold`
- 说明文本以 `14px` 为主
- 标签和状态文案常落在 `10px - 12px`
- 英文风格的眉标题常用较大 `letter-spacing`

---

## 3.3 间距 Token

来源：`design-tokens.ts`、`tailwind.config.js`、`index.css`

| Token | 值 |
|---|---|
| `space-4` | `4px` |
| `space-8` | `8px` |
| `space-12` | `12px` |
| `space-16` | `16px` |
| `space-20` | `20px` |
| `space-24` | `24px` |
| `space-32` | `32px` |
| `space-40` | `40px` |
| `space-48` | `48px` |

建议语义映射：

- `xs = 4`
- `sm = 8`
- `md = 12`
- `lg = 16`
- `xl = 24`
- `2xl = 32`
- `3xl = 48`

页面级布局：

- `rehab-page` 顶部间距：`24px`
- 页面横向安全边距：`32px`
- 页面内容最大宽度：`1600px`

---

## 3.4 圆角 Token

来源：`design-tokens.ts`、`tailwind.config.js`、`Card.tsx`

| Token | 值 | 典型用途 |
|---|---|---|
| `radius.sm` | `2px` | 极少量细节元素 |
| `radius.md` | `4px` | 输入、小控件基础值 |
| `radius.lg` | `8px` | 小型模块 |
| `radius.xl` | `12px` | 常规输入与小卡片 |
| `radius.2xl` | `16px` | 常规按钮、工具按钮 |
| `radius.card` | `20px` | 主卡片 |
| `radius.full` | `9999px` | 胶囊标签与统计条 |

当前项目最稳定的视觉圆角不是 `4/8`，而是：

- 主卡片：`20px`
- 按钮/输入：`12px`
- Badge/小标签：`8px`

---

## 3.5 阴影 Token

来源：`index.css`、`uiStyles.ts`

| Token | 值 | 用途 |
|---|---|---|
| `shadow.card` | `none` | 常规卡片默认状态 |
| `shadow.layer` | `0 8px 20px rgba(0,0,0,0.08)` | 弹层、对话框 |
| `shadow.cardHover` | `0 6px 20px rgba(15,23,42,0.08)` | 卡片 hover |
| `shadow.buttonPrimaryHover` | `0 8px 16px rgba(15,155,142,0.22)` | 主按钮 hover |

结论：

- 这个项目不是重阴影体系
- 更接近“边框为主，阴影为辅”
- 默认卡片应轻，悬停和弹层再加深

---

## 3.6 动效 Token

来源：`uiStyles.ts`、`tailwind.config.js`、`index.css`

### 时长

| Token | 值 |
|---|---|
| `motion.fast` | `200ms` |
| `motion.base` | `300ms` |
| `motion.slow` | `500ms` |

### 动效类型

| Token | 用途 |
|---|---|
| `fadeIn` | 内容进入 |
| `slideInTop/Right/Left/Bottom` | 面板滑入 |
| `zoomIn` | 对话框、弹层 |
| `scan` | 摄像头扫描引导 |
| `pulse / pulse-subtle / pulse-slow` | 提示、录制、状态闪烁 |
| `progress` | 进度条 |
| `spin / spin-slow` | 加载态 |

### 动效原则

- 优先服务状态变化，不做装饰性炫动
- 摄像头、录制、进度条允许更强提示
- 普通后台页只用轻动效

---

## 3.7 断点 Token

来源：`tailwind.config.js`

| Token | 值 |
|---|---|
| `xs` | `375px` |
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |
| `2xl` | `1536px` |

当前项目已经有移动友好的基础断点，但组件层尚未系统化为移动端布局规范。

---

## 4. 已实现 Semantic Token

## 4.1 页面语义

| 语义 Token | 当前实现 |
|---|---|
| `surface.page` | `var(--n50)` |
| `surface.card` | `bg-white border border-slate-200` |
| `surface.cardMuted` | `bg-slate-50` |
| `surface.dialog` | `bg-white border border-slate-200 shadow-layer` |
| `surface.sidebar` | 深色背景 + 半透明 hover |

## 4.2 文本语义

| 语义 Token | 当前实现 |
|---|---|
| `text.heading` | `text-slate-900` |
| `text.body` | `text-slate-700` / `var(--n700)` |
| `text.secondary` | `text-slate-500` / `var(--n500)` |
| `text.placeholder` | `text-slate-400` |
| `text.inverse` | `text-white` |

## 4.3 状态语义

| 语义 Token | 当前实现 |
|---|---|
| `status.normal` | 绿色 |
| `status.processing` | 蓝色 / 青色 |
| `status.warning` | 琥珀色 |
| `status.error` | 红色 |
| `status.disabled` | 灰色 |

## 4.4 模块语义

| 语义 Token | 颜色 |
|---|---|
| `module.posture` | 蓝绿 / 品牌绿系 |
| `module.rom` | 绿色 |
| `module.medvoice` | 紫色 |
| `module.intervention` | 橙色 |
| `module.comparison` | 青色 |
| `module.report` | 石板灰 |

---

## 5. 已实现 Component Token

## 5.1 Button

来源：`Button.tsx`、`index.css`

### 变体

- `primary`
- `secondary`
- `tertiary`
- `outline`
- `ghost`
- `danger`

### 尺寸

- `sm`: `h-8 px-3 rounded-lg text-xs`
- `md`: `h-10 px-4 rounded-xl text-sm`
- `lg`: `h-11 px-5 rounded-xl text-sm`

### 当前规范结论

- 默认主操作按钮应使用 `primary`
- 次要流程按钮使用 `secondary`
- 行内次级操作优先 `ghost / tertiary`
- 删除和风险性操作统一 `danger`

## 5.2 Card

来源：`Card.tsx`

### 变体

- `default`
- `elevated`
- `outlined`

### 尺寸

- `padding: none / sm / md / lg`

### 当前规范结论

- `default` 是最常用卡片
- 主卡片圆角固定在 `20px`
- 大多数业务区块应优先用 `default + md/lg`

## 5.3 Badge / Status

来源：`Badge.tsx`

### Badge 语义

- `default`
- `primary`
- `success`
- `warning`
- `danger`
- `info`
- `disabled`

### Status 语义

- `pending`
- `assessing`
- `report`
- `completed`

建议后续扩展成更贴近当前产品的状态枚举：

- `pending`
- `screening`
- `review`
- `follow_up`
- `archived`

## 5.4 Field

来源：`index.css`

已存在：

- `field-input`
- `field-select`
- `field-textarea`

共同特征：

- 高度 `40px`
- 圆角 `12px`
- 白底 + 灰边
- focus 使用品牌绿色 ring

## 5.5 Dialog

来源：`index.css`

已存在：

- `dialog-backdrop`
- `dialog-shell`
- `dialog-header`
- `dialog-footer`

说明：

- 对话框视觉已经足够稳定
- 后续移动端可以直接把这套 shell 迁移成 `Bottom Sheet / Full Screen Sheet`

---

## 6. 推荐的目标 Token 结构

建议后续统一为一个文件源，例如：

- `src/design/tokens/foundation.ts`
- `src/design/tokens/semantic.ts`
- `src/design/tokens/components.ts`

推荐结构：

```ts
export const foundation = {
  color: {},
  typography: {},
  spacing: {},
  radius: {},
  shadow: {},
  motion: {},
  breakpoint: {},
};

export const semantic = {
  surface: {},
  text: {},
  status: {},
  topic: {},
  module: {},
};

export const component = {
  button: {},
  card: {},
  field: {},
  badge: {},
  dialog: {},
  sidebar: {},
  page: {},
};
```

### 统一原则

1. 原始值只在 `foundation` 出现
2. 语义值只引用 foundation，不再直接写 hex
3. 组件 token 只引用 semantic，不直接写品牌色
4. `uiStyles.ts` 最终应降级为兼容层或废弃层

---

## 7. 设计 Token 收敛建议

## 7.1 当前重复点

当前有这些重复：

- `design-tokens.ts` 有颜色值
- `tailwind.config.js` 又有一套颜色值
- `index.css` 又定义了 CSS 变量
- `uiStyles.ts` 再用 Tailwind class 拼语义

## 7.2 建议收敛顺序

### 第一阶段

- 保留现有实现
- 新建标准 token 文档
- 所有新页面优先按标准 token 写

### 第二阶段

- 把 `index.css` 变量与 `tailwind.config.js` 的品牌色统一到一个源
- `design-tokens.ts` 改为导出统一来源

### 第三阶段

- 清理 `uiStyles.ts` 中历史遗留的深色主题和旧语义命名
- 组件只依赖新的 token 层

---

## 8. 移动端产品定位

## 8.1 不建议的方向

当前阶段不建议做：

- 全量后台管理搬到手机
- 面向普通消费者的泛体态自测 App
- 一开始就做“家长端 + 医生端 + 学校端”三套完整 App

## 8.2 建议的方向

移动端应该优先服务 **现场执行与轻量查看**，不是替代桌面后台。

建议定位：

> 一个围绕现场筛查、复测执行、结果查看和消息处理的轻量移动端。

## 8.3 移动端优先用户

### 第一优先

- 筛查执行员

### 第二优先

- 复核人员 / 机构负责人

### 第三优先

- 家长 / 监护人只读端

---

## 9. 移动端核心场景

## 9.1 筛查执行员场景

手机上最核心的是现场工作流：

- 登录机构账号
- 查看今日待筛查任务
- 搜索或扫码找到学生
- 发起快速筛查
- 现场拍摄与补录
- 提交筛查结果
- 标记需复测或提交复核

## 9.2 复核人员场景

手机上适合做“轻量处理”，不适合做大规模配置：

- 查看高风险名单
- 查看待复测名单
- 打开单个学生档案
- 快速浏览报告
- 标记复核结论
- 触发复测提醒

## 9.3 家长场景

家长端只适合看结果和通知：

- 查看学生最近一次报告
- 查看风险等级
- 查看复测提醒
- 查看注意事项与后续建议

---

## 10. 移动端信息架构建议

## 10.1 执行员移动端

建议底部四栏：

- `任务`
- `筛查`
- `学生`
- `我的`

### 任务

- 今日待筛查
- 待补录
- 待提交
- 已完成

### 筛查

- 快速筛查
- 标准筛查
- 相机采集入口
- 本次会话进度

### 学生

- 学生搜索
- 最近访问学生
- 学生档案
- 最近报告

### 我的

- 当前机构
- 当前角色
- 设备检查
- 本地缓存与同步状态

## 10.2 复核人员移动端

建议底部四栏：

- `总览`
- `预警`
- `报告`
- `我的`

### 总览

- 今日高风险人数
- 待复测人数
- 新报告待复核

### 预警

- 高风险名单
- 待复测名单
- 超期未复测

### 报告

- 个人报告
- 班级汇总
- 机构周报入口

### 我的

- 机构切换
- 通知设置
- 账号设置

## 10.3 家长端

建议底部三栏：

- `首页`
- `报告`
- `提醒`

---

## 11. 移动端功能范围规划

## 11.1 P0：必须做

### 执行员端

- 账号登录
- 今日任务列表
- 学生搜索 / 扫码进入
- 快速筛查发起
- 标准筛查发起
- 拍摄与上传
- 筛查结果提交
- 异常标记
- 本地失败重试 / 草稿保存

### 复核端

- 高风险列表
- 待复测列表
- 学生详情
- 个人报告快速查看
- 标记复核状态

### 系统能力

- 相机权限检测
- 网络状态提示
- 上传进度
- 本地缓存
- 弱网重试

## 11.2 P1：应该尽快做

### 执行员端

- 离线任务缓存
- 现场补录
- 批量连续筛查模式
- 最近学生快捷入口

### 复核端

- 报告筛选
- 复测提醒触发
- 轻量统计卡

### 家长端

- 最近报告查看
- 风险等级提示
- 复测通知

## 11.3 P2：第二阶段做

- 班级层汇总查看
- 复测时间轴
- 多次筛查趋势图
- 推送通知
- 家长反馈回执
- 转诊结果反馈

## 11.4 P3：后续扩展

- 多专题切换
- 机构管理轻量入口
- AI 解释卡片的移动端版本
- 可穿戴设备或外设接入

---

## 12. 脊柱侧弯专题在移动端的优先级

移动端不应该一开始就做“全专题均等支持”，而应明确：

- 默认专题：`脊柱侧弯`
- 首期重点数据：肩高差、躯干偏移、骨盆倾斜、风险等级、复测状态
- 首期重点动作：快速筛查、标准筛查、复测标记、报告查看

换句话说：

- 移动端先做“脊柱侧弯现场执行工具”
- Web 端继续承担完整的机构管理和汇总分析

---

## 13. 移动端不建议优先做的功能

以下功能不建议优先在手机上做：

- 复杂机构管理
- 权限与组织结构配置
- 大报表编辑
- 复杂训练建议编辑
- 多维汇总看板编辑
- 全量数据导出管理

原因：

- 交互复杂
- 信息密度过高
- 手机端效率低
- 容易把移动端做成低效率的桌面端复制品

---

## 14. 移动端 UI 设计建议

## 14.1 视觉方向

移动端应延续当前项目的视觉系统，但需要更明确地移动优先化：

- 更紧凑的间距体系
- 更强的状态标签
- 更少的并列按钮
- 更大的触控热区
- 更少的复杂 hover 依赖

## 14.2 移动端尺寸建议

### 触控规范

- 主按钮高度不低于 `44px`
- 列表项高度不低于 `56px`
- 关键操作区底部保留安全区

### 页面边距

- 移动端横向边距建议 `16px`
- 卡片间距建议 `12px`
- 模块间距建议 `16px - 20px`

### 移动端圆角

- 卡片：`16px`
- 按钮：`12px`
- Input：`12px`
- Bottom Sheet：`20px`

## 14.3 移动端组件优先级

应优先沉淀的移动端组件：

- 任务卡片
- 学生列表项
- 风险标签
- 进度条
- 上传状态条
- 扫码入口按钮
- 底部吸附操作栏
- 全屏拍摄页

---

## 15. 技术实现建议

## 15.1 形态建议

当前阶段建议优先顺序：

1. 先把现有 Web 做到真正响应式
2. 再评估 PWA 或混合壳
3. 再决定是否需要独立原生 App

原因：

- 当前项目主实现仍在 Web
- 设计系统尚在收敛
- 业务流程还在迭代
- 过早拆原生会拉高维护成本

## 15.2 适合移动端先抽象的能力

- 登录与身份上下文
- 任务列表接口
- 学生搜索接口
- 会话草稿接口
- 上传与断点续传
- 风险等级接口
- 报告摘要接口
- 消息提醒接口

---

## 16. 推荐路线图

## Phase 0：设计系统收口

- 统一 token 文档
- 统一颜色、间距、圆角、按钮、卡片规范
- 首页与工作台先按新 token 精修

## Phase 1：移动执行员 MVP

- 今日任务
- 学生搜索
- 快速筛查
- 标准筛查入口
- 上传与提交

## Phase 2：移动复核端

- 高风险列表
- 待复测列表
- 报告查看
- 轻量复核

## Phase 3：家长只读端

- 报告查看
- 风险提示
- 复测提醒

---

## 17. 明确建议

### 设计 Token

建议把当前项目的设计 token 统一为：

- 一套 Foundation Token
- 一套 Semantic Token
- 一套 Component Token

短期内不要再继续新增并行 token 文件。

### 移动端

建议先做：

- 机构执行员移动端
- 以脊柱侧弯专题为第一主场景
- 聚焦任务、筛查、提交、复测

不建议先做：

- 全量管理后台移动化
- 面向普通消费者的自测 App
- 多角色大而全的一次性移动端

---

## 18. 下一步可执行事项

如果要进入落地，建议下一步按顺序做：

1. 把本文档中的 token 映射成正式的 `foundation / semantic / component` 文件结构
2. 先把现有 Web 组件收敛到同一套 token
3. 输出一版移动端信息架构图
4. 输出一版移动端执行员 MVP 页面清单
