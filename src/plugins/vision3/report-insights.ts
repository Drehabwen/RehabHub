import { PostureIssue, PostureMetrics } from '@/types/posture';
import { getShoulderDirectionText } from './vision3-utils';

export interface ReportInsightCard {
  id: string;
  tone: 'violet' | 'amber' | 'blue';
  eyebrow: string;
  title: string;
  summary: string;
  action: string;
  evidence: string[];
}

interface BuildReportInsightCardsOptions {
  metrics?: PostureMetrics | null;
  issues?: PostureIssue[] | null;
  auxiliaryDiagnosis?: string | null;
  markdownReport?: string | null;
}

interface BuildImmediateBasicReportOptions {
  metrics?: PostureMetrics | null;
  issues?: PostureIssue[] | null;
}

const severityRank: Record<PostureIssue['severity'], number> = {
  severe: 3,
  moderate: 2,
  mild: 1,
};

const metricSignalDefinitions = [
  {
    key: 'headForward' as const,
    label: '头颈前引',
    threshold: 3,
    evidence: (value: number) => `头颈前引 ${value.toFixed(1)}°`,
    action: '优先调整屏幕高度和久坐姿势，再配合颈胸段伸展。',
  },
  {
    key: 'shoulderAngle' as const,
    label: '肩部高度差',
    threshold: 2,
    evidence: (value: number, metrics?: PostureMetrics | null) => `肩部高度差 ${Math.abs(value).toFixed(1)}°，${getShoulderDirectionText(metrics)}`,
    action: '注意双侧负重均衡，减少单侧背包或侧身支撑。',
  },
  {
    key: 'hipAngle' as const,
    label: '骨盆代偿',
    threshold: 2,
    evidence: (value: number) => `骨盆倾斜 ${Math.abs(value).toFixed(1)}°`,
    action: '关注站立承重平衡，可先补充髋周稳定与髂腹控制训练。',
  },
  {
    key: 'headRoll' as const,
    label: '头部侧倾',
    threshold: 2,
    evidence: (value: number) => `头部侧倾 ${Math.abs(value).toFixed(1)}°`,
    action: '复测时先校正头颈中立位，关注是否与肩带或骨盆代偿同时出现。',
  },
  {
    key: 'headYaw' as const,
    label: '头颈旋转',
    threshold: 2,
    evidence: (value: number) => `头颈旋转 ${Math.abs(value).toFixed(1)}°`,
    action: '检查工作位视线和操作位置，减少长时间偏头代偿。',
  },
];

const normalizeText = (line: string) =>
  line
    .replace(/^#{1,6}\s*/, '')
    .replace(/^[-*+]\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/^>\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .trim();

const collectReportSnippets = (text?: string | null) => {
  if (!text) {
    return [];
  }

  return text
    .split(/\r?\n/)
    .map(normalizeText)
    .filter((line) => line.length >= 10)
    .filter((line) => !line.includes('深度分析') && !line.includes('辅助诊断'))
    .slice(0, 3);
};

const buildMetricSignals = (metrics?: PostureMetrics | null) => {
  if (!metrics) {
    return [];
  }

  return metricSignalDefinitions
    .map((definition) => {
      const rawValue = metrics[definition.key];
      if (typeof rawValue !== 'number' || !Number.isFinite(rawValue) || Math.abs(rawValue) < definition.threshold) {
        return null;
      }

      return {
        key: definition.key,
        label: definition.label,
        threshold: definition.threshold,
        evidence: definition.evidence(rawValue, metrics),
        action: definition.action,
        magnitude: Math.abs(rawValue),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.magnitude - a.magnitude);
};

const chooseDominantIssue = (issues: PostureIssue[]) =>
  [...issues].sort((a, b) => severityRank[b.severity] - severityRank[a.severity])[0];

const getSignalSeverity = (magnitude: number, threshold: number): PostureIssue['severity'] => {
  if (magnitude >= threshold * 2.2) {
    return 'severe';
  }

  if (magnitude >= threshold * 1.45) {
    return 'moderate';
  }

  return 'mild';
};

const buildImmediateIssueTitle = (label: string, severity: PostureIssue['severity']) => {
  if (severity === 'severe') {
    return `${label}偏移明显`;
  }

  if (severity === 'moderate') {
    return `${label}需要优先关注`;
  }

  return `${label}存在轻度偏移`;
};

export const inferImmediateIssues = (metrics?: PostureMetrics | null): PostureIssue[] => {
  return buildMetricSignals(metrics)
    .slice(0, 3)
    .map((signal) => {
      const severity = getSignalSeverity(signal.magnitude, signal.threshold);
      return {
        id: `immediate-${signal.key}`,
        type: signal.key,
        severity,
        title: buildImmediateIssueTitle(signal.label, severity),
        description: `当前量化结果提示 ${signal.evidence}，可作为本次快评的优先关注点。`,
        recommendation: signal.action,
      };
    });
};

export const buildImmediateBasicReport = ({
  metrics,
  issues,
}: BuildImmediateBasicReportOptions): string | null => {
  const safeIssues = issues && issues.length > 0 ? issues : inferImmediateIssues(metrics);
  const metricSignals = buildMetricSignals(metrics);
  const dominantIssue = safeIssues.length > 0 ? chooseDominantIssue(safeIssues) : null;
  const hasMetricPayload = Boolean(
    metrics && Object.values(metrics).some((value) => typeof value === 'number' && Number.isFinite(value)),
  );

  if (!dominantIssue && metricSignals.length === 0 && !hasMetricPayload) {
    return null;
  }

  const lines = [
    '### 即时基础结论',
    '',
  ];

  if (dominantIssue) {
    lines.push(`- 当前最需要优先关注的问题：${dominantIssue.title}`);
    lines.push(`- 表现：${dominantIssue.description}`);
  } else if (metricSignals[0]) {
    lines.push(`- 当前最突出的姿势偏移：${metricSignals[0].label}`);
    lines.push(`- 量化表现：${metricSignals[0].evidence}`);
  }

  if (metricSignals.length > 1) {
    lines.push(`- 联动信号：${metricSignals.slice(0, 3).map((signal) => signal.evidence).join('；')}`);
  }

  if (!dominantIssue && metricSignals.length === 0) {
    lines.push('- 当前未见需要优先警示的高风险姿态异常。');
    lines.push('- 本次评估已完成基础量化采集，可结合现场症状和复测需求继续随访。');
  }

  lines.push('');
  lines.push('### 建议动作');
  lines.push(
    dominantIssue?.recommendation
      || metricSignals[0]?.action
      || '建议保持当前训练与日常姿势管理；如后续症状变化，可前往报告中心继续查看汇总报告或安排复测。',
  );

  return lines.join('\n');
};

const issueMatchesSignal = (
  issue: PostureIssue,
  signal: ReturnType<typeof buildMetricSignals>[number],
) => {
  const normalizedText = `${issue.id} ${issue.type} ${issue.title} ${issue.description}`.toLowerCase();

  if (signal.key === 'headForward') {
    return normalizedText.includes('forward_head') || normalizedText.includes('前引');
  }

  if (signal.key === 'shoulderAngle') {
    return normalizedText.includes('shoulder') || normalizedText.includes('肩');
  }

  if (signal.key === 'hipAngle') {
    return normalizedText.includes('hip') || normalizedText.includes('骨盆');
  }

  if (signal.key === 'headRoll') {
    return normalizedText.includes('侧倾') || normalizedText.includes('roll');
  }

  if (signal.key === 'headYaw') {
    return normalizedText.includes('旋转') || normalizedText.includes('yaw');
  }

  return false;
};

export const buildReportInsightCards = ({
  metrics,
  issues,
  auxiliaryDiagnosis,
  markdownReport,
}: BuildReportInsightCardsOptions): ReportInsightCard[] => {
  const safeIssues = issues || [];
  const reportSnippets = [
    ...collectReportSnippets(markdownReport),
    ...collectReportSnippets(auxiliaryDiagnosis),
  ];
  const metricSignals = buildMetricSignals(metrics);
  const cards: ReportInsightCard[] = [];

  const dominantIssue = safeIssues.length > 0 ? chooseDominantIssue(safeIssues) : null;
  if (dominantIssue) {
    const matchedSignal = metricSignals.find((signal) => issueMatchesSignal(dominantIssue, signal));

    cards.push({
      id: 'priority-focus',
      tone: dominantIssue.severity === 'severe' ? 'amber' : 'violet',
      eyebrow: '优先干预',
      title: `${dominantIssue.title}需要优先处理`,
      summary: reportSnippets[0]
        ? '报告中已出现与该问题相关的结论，目前要先锁定这个风险点。'
        : '当前风险项里，这个问题对姿势负荷和后续代偿影响最直接。',
      action: dominantIssue.recommendation,
      evidence: [
        dominantIssue.description,
        matchedSignal?.evidence,
        reportSnippets[0],
      ].filter((item): item is string => Boolean(item)),
    });
  }

  if (metricSignals.length >= 2) {
    const primarySignals = metricSignals.slice(0, 3);
    cards.push({
      id: 'compensation-chain',
      tone: 'amber',
      eyebrow: '联动洞察',
      title: '异常可能已经形成代偿链',
      summary: `当前异常主要集中在${primarySignals.map((signal) => signal.label).join('、')}，说明不像是单一局部问题，更像是姿势链路的联动代偿。`,
      action: primarySignals[0].action,
      evidence: [
        ...primarySignals.map((signal) => signal.evidence),
        reportSnippets[1],
      ].filter((item): item is string => Boolean(item)),
    });
  }

  if (safeIssues.length > 0 || reportSnippets.length > 0 || metricSignals.length > 0) {
    cards.push({
      id: 'follow-up',
      tone: 'blue',
      eyebrow: '复测节奏',
      title: '建议按“干预后复测”的方式跟进',
      summary: markdownReport
        ? '深度报告已经回传，可将当前关键风险作为后续复评的对照点。'
        : '虽然还没有可用的深度 LLM 报告，但已有基础报告、问题列表和指标可以用来定义复测重点。',
      action: '优先围绕最突出的 1-2 个风险点安排短期干预，干预后用同一视角重新拍摄，对比指标和问题变化。',
      evidence: [
        safeIssues.length > 0 ? `已接收 ${safeIssues.length} 条风险项` : null,
        metricSignals.length > 0 ? `已接收 ${metricSignals.length} 个可用异常指标` : null,
        reportSnippets[2] || reportSnippets[0],
      ].filter((item): item is string => Boolean(item)),
    });
  }

  if (cards.length === 0) {
    cards.push({
      id: 'maintenance',
      tone: 'blue',
      eyebrow: '维持建议',
      title: '当前未见明显高风险，但仍建议定期复测',
      summary: '目前回传数据没有显示集中的高风险姿势问题，适合以维持和预防为主。',
      action: '保持规律活动，如果工作姿势或症状发生变化，再进行复测。',
      evidence: ['当前报告中未见明显的高风险指向。'],
    });
  }

  return cards.slice(0, 3);
};
