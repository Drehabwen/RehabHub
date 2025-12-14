## 目标
- 优化角度计算与评分逻辑：更贴近临床、按动作类型配置阈值、显示更清晰。
- 调整首页（仪表盘）布局：新增“便当”板块（Bento 风格）、将“添加患者”置于中央、把来自患者对治疗师的招呼文案与字号调小、整体去除“AI味”。

## 涉及文件
- 角度与评估：
  - `src/services/poseDetection.ts`
  - `src/components/pages/VideoAnalysis.tsx`
  - `src/types/assessment.ts` 或 `src/moduleConfig.ts`（新增动作角度区间配置）
- 首页与公共UI：
  - `src/components/pages/Dashboard.tsx`
  - `src/components/ui/Card.tsx`、`src/components/ui/StatusIndicator.tsx`
  - `src/theme/MedicalTheme.ts`、`src/theme/index.ts`

## 角度逻辑优化
1. 在 `moduleConfig.ts` 增加动作角度区间配置 `movementAngleRanges`：
   - 示例：`deep-squat: { knee: [85, 130], hip: [90, 140] }`，`shoulder-mobility: { shoulder: [140, 180] }`。
   - 支持最小/最大合格区间与警戒区间（soft/hard）以便评分更细腻。
2. 在 `poseDetection.ts`：
   - 保留 `calculateAngle` 的数值稳定与夹角钳制，增加结果 `Math.round` 到整数度并做去抖（如 3 帧滑动平均）。
   - `evaluateMovement(keypoints, movementType)` 按 `movementAngleRanges[movementType]` 计算各关节是否达标，生成：
     - `angles: Record<string, number>`、`score: 0–100`（百分制）、`feedback`（中文、无AI语气）。
   - 评分建议：达标角度比例 × 权重；不达标扣分，软/硬阈值区别对待。
3. 在 `VideoAnalysis.tsx`：
   - 展示角度时统一显示“°”，在文案段落补充区间说明（例如“膝关节目标 85–130°”）。
   - 保持已统一的状态优先级（error > poseError > modelLoading > poseProcessing > analyzing）。

## 首页UI调整（Bento板块 + 去AI化）
1. 在 `Dashboard.tsx` 构建 Bento 栅格：
   - 栅格布局：2×2（或 2×3）自适应卡片。
   - 卡片项建议：
     - 中央主卡：`添加患者`（主CTA，居中对齐，显著但不夸张）。
     - 其他卡：`今日评估`、`快速入口（视频分析/动作选择）`、`近期报告`、`常用工具`。
2. 将“患者给治疗师的招呼”区域字号与行高调小，语气中性：
   - 示例：“今日有 6 位患者预约评估，请按流程完成。”
   - 位置放在 Bento 上方或左上卡片中；避免拟人化或AI术语。
3. 去AI味：
   - 移除强烈霓虹/渐变；使用 `MedicalTheme` 的中性配色（浅蓝/灰/中绿），降低阴影强度与动画过渡。
   - `StatusIndicator.tsx` 采用扁平化图标与细线；减少过度动效。
   - 所有提示文案改为中性专业中文（不使用“智能/AI/魔法”等措辞）。

## 主题与样式微调
- 在 `MedicalTheme.ts`：
  - 调低主色饱和度与阴影强度（如 `shadows.default`、`primary[500]`）。
  - 为 Bento 卡片提供统一间距与圆角（如 `borderRadius.md`）。
- 在卡片组件与状态指示组件中应用主题变量，减少内联高对比样式。

## 验证
- 运行开发环境查看：
  - 角度显示与评分是否按动作区间更新；文案是否清晰。
  - 首页 Bento 布局是否自适应；“添加患者”位于中央；招呼区字号更小且语气中性。
- 单元测试（可选）：
  - 在 `src/services/assessment/fmsProcessor.test.ts` 追加边界角度与评分映射测试。
- 手动用键盘导航验证无障碍：焦点可见、Tab 顺序合理，状态块只显示单一优先级。

## 交付内容
- 角度区间配置与评估逻辑更新。
- 首页 Bento 板块与文案/样式调整。
- 主题调优与组件样式微调。

请确认上述方案，我将按此修改代码并提交变更，随后启动本地进行可视化验证。