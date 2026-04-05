import React, { useState, useEffect } from 'react';

import Card from '../ui/Card';
import Button from '../ui/Button';
import { colors, typography } from '../../theme';
import { useNavigation, useNavigationParams } from '../../contexts/NavigationContext';
import { FmsProcessor } from '../../services/assessment/fmsProcessor';
import { animations, animationKeyframes } from '../../utils/animations';
import { LLMService, type AIReport, type RehabilitationData } from '../../services/LLMService';
import { listReports, createReport, deleteReportRecord, exportReport, type CreateReportInput } from '../../api/reports';

// 定义报告类型
interface Report {
  id: string;
  patientId: string;
  patientName: string;
  testId: string;
  testName: string;
  date: string;
  score: number;
  status: 'completed' | 'in-progress' | 'draft';
  summary: string;
  details?: string;
}

interface AssessmentHistoryItem {
  id: string;
  timestamp: string;
  movementType: string;
  movementName: string;
  overallScore?: { value: number; maxValue: number };
  mobilityScore?: { value: number; maxValue: number };
  stabilityScore?: { value: number; maxValue: number };
  recommendations?: string[];
}

interface AssessmentSummary {
  count: number;
  avgOverallScore: number;
  avgMobilityScore: number | null;
  avgStabilityScore: number | null;
  latestTimestamp: string | null;
  byMovement: Array<{ movementType: string; movementName: string; count: number; avgScore: number }>;
}

const Reports: React.FC = () => {
  const { navigateTo, goBack } = useNavigation();
  const { getParams, clearParams } = useNavigationParams<{ patientId?: string; autoGenerate?: boolean; openLatest?: boolean }>();
  const [mounted, setMounted] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'draft'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReport, setNewReport] = useState<Partial<Report>>({
    patientId: '',
    testId: '',
    summary: '',
    details: ''
  });
  const [voiceIntake, setVoiceIntake] = useState<{ audioUrl?: string; transcript?: string; ts?: number } | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<string>('');
  const [currentPatientName, setCurrentPatientName] = useState<string>('');
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistoryItem[]>([]);
  const [assessmentSummary, setAssessmentSummary] = useState<AssessmentSummary | null>(null);
  const [llmApiKey, setLlmApiKey] = useState<string>('');
  const [llmPatientName, setLlmPatientName] = useState<string>('');
  const [llmAge, setLlmAge] = useState<number | ''>('');
  const [llmPainLevel, setLlmPainLevel] = useState<number>(0);
  const [llmComplaints, setLlmComplaints] = useState<string>('');
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [aiReportError, setAiReportError] = useState<string | null>(null);
  const [isGeneratingAiReport, setIsGeneratingAiReport] = useState<boolean>(false);
  
  // 组件挂载后设置动画并获取数据
  useEffect(() => {
    setMounted(true);
    (async () => {
      await fetchReports();
      let params: { patientId?: string; autoGenerate?: boolean; openLatest?: boolean } | null = null;
      try {
        params = getParams();
        clearParams();
      } catch {}

      let pid = '';
      let pname = '';
      try {
        const pidParam = params?.patientId || '';
        pid = pidParam || sessionStorage.getItem('currentPatientId') || '';
        pname = sessionStorage.getItem('currentPatientName') || '';
      } catch {}
      setCurrentPatientId(pid);
      setCurrentPatientName(pname);
      setLlmPatientName(pname);
      if (pid) {
        setNewReport(prev => ({ ...prev, patientId: pid }));
      }

      try {
        const raw = sessionStorage.getItem('voice_intake_latest');
        if (raw) {
          const parsed = JSON.parse(raw);
          setVoiceIntake(parsed);
          if (parsed?.transcript) {
            setLlmComplaints(String(parsed.transcript));
          }
        }
      } catch {}

      refreshAssessmentSummary();

      try {
        const storedKey = sessionStorage.getItem('llm_api_key') || '';
        if (storedKey) {
          setLlmApiKey(storedKey);
          LLMService.setApiKey(storedKey);
        }
      } catch {}

      if (params?.autoGenerate) {
        generateReportFromLatest(pid, pname, params?.openLatest !== false);
      }
    })();
  }, []);

  const loadAssessmentHistoryFromLocal = (): AssessmentHistoryItem[] => {
    const items: AssessmentHistoryItem[] = [];

    try {
      const rawHistory = localStorage.getItem('analysis_history');
      if (rawHistory) {
        const parsed = JSON.parse(rawHistory);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: any) => {
            if (item && item.id && item.timestamp) {
              items.push({
                id: String(item.id),
                timestamp: String(item.timestamp),
                movementType: String(item.movementType || 'unknown'),
                movementName: String(item.movementName || item.movementType || '未知动作'),
                overallScore: item.overallScore,
                mobilityScore: item.mobilityScore,
                stabilityScore: item.stabilityScore,
                recommendations: Array.isArray(item.recommendations) ? item.recommendations.map(String) : undefined,
              });
            }
          });
        }
      }
    } catch {}

    try {
      const rawLast = localStorage.getItem('lastAssessment');
      if (rawLast) {
        const parsed = JSON.parse(rawLast);
        if (parsed && parsed.timestamp && parsed.movementType) {
          const last: AssessmentHistoryItem = {
            id: String(parsed.id || `last_${Date.now()}`),
            timestamp: String(parsed.timestamp || new Date().toISOString()),
            movementType: String(parsed.movementType || 'unknown'),
            movementName: String(parsed.movementName || parsed.movementType || '未知动作'),
            overallScore: parsed.overallScore,
            mobilityScore: parsed.mobilityScore,
            stabilityScore: parsed.stabilityScore,
            recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.map(String) : undefined,
          };
          if (!items.some(i => i.id === last.id)) {
            items.unshift(last);
          }
        }
      }
    } catch {}

    const deduped = new Map<string, AssessmentHistoryItem>();
    for (const item of items) {
      deduped.set(item.id, item);
    }
    return Array.from(deduped.values()).sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
  };

  const computeAssessmentSummary = (items: AssessmentHistoryItem[]): AssessmentSummary | null => {
    if (!items.length) return null;

    const count = items.length;
    const scores = items
      .map(i => i.overallScore?.value)
      .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
    const mobility = items
      .map(i => i.mobilityScore?.value)
      .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
    const stability = items
      .map(i => i.stabilityScore?.value)
      .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));

    const avgOverallScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const avgMobilityScore = mobility.length ? mobility.reduce((a, b) => a + b, 0) / mobility.length : null;
    const avgStabilityScore = stability.length ? stability.reduce((a, b) => a + b, 0) / stability.length : null;

    const latestTimestamp = items.reduce<string | null>((latest, item) => {
      if (!item.timestamp) return latest;
      if (!latest) return item.timestamp;
      return item.timestamp > latest ? item.timestamp : latest;
    }, null);

    const grouped = new Map<string, { movementType: string; movementName: string; scores: number[] }>();
    for (const item of items) {
      const key = String(item.movementType || 'unknown');
      if (!grouped.has(key)) {
        grouped.set(key, { movementType: key, movementName: item.movementName || key, scores: [] });
      }
      if (typeof item.overallScore?.value === 'number') {
        grouped.get(key)!.scores.push(item.overallScore.value);
      }
    }

    const byMovement = Array.from(grouped.values())
      .map(g => ({
        movementType: g.movementType,
        movementName: g.movementName,
        count: g.scores.length,
        avgScore: g.scores.length ? g.scores.reduce((a, b) => a + b, 0) / g.scores.length : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      count,
      avgOverallScore,
      avgMobilityScore,
      avgStabilityScore,
      latestTimestamp,
      byMovement,
    };
  };

  const refreshAssessmentSummary = () => {
    const history = loadAssessmentHistoryFromLocal();
    setAssessmentHistory(history);
    setAssessmentSummary(computeAssessmentSummary(history));
  };

  const buildRehabilitationDataFromSummary = (summary: AssessmentSummary, history: AssessmentHistoryItem[]): RehabilitationData => {
    const angles: Record<string, number> = {
      avg_overall_score: Math.round(summary.avgOverallScore * 10) / 10,
      assessment_count: summary.count,
    };

    if (typeof summary.avgMobilityScore === 'number') {
      angles.avg_mobility_score = Math.round(summary.avgMobilityScore * 10) / 10;
    }
    if (typeof summary.avgStabilityScore === 'number') {
      angles.avg_stability_score = Math.round(summary.avgStabilityScore * 10) / 10;
    }

    summary.byMovement.slice(0, 10).forEach(item => {
      const key = `movement_${item.movementType.replace(/[^a-zA-Z0-9_\-]/g, '_')}_avg`;
      angles[key] = Math.round(item.avgScore * 10) / 10;
    });

    const timeline = history.slice(0, 8).map(h => {
      const date = (h.timestamp || '').replace('T', ' ').slice(0, 16);
      const score = typeof h.overallScore?.value === 'number' ? h.overallScore.value : 0;
      return `- ${date} ${h.movementName} 得分 ${score}`;
    }).join('\n');

    const complaints = [
      llmComplaints ? `主诉/备注：${llmComplaints}` : '',
      '历史记录：',
      timeline,
    ].filter(Boolean).join('\n');

    return {
      patientName: llmPatientName || currentPatientName || undefined,
      age: typeof llmAge === 'number' ? llmAge : undefined,
      movementType: '多次评估汇总',
      score: Math.round(summary.avgOverallScore),
      angles,
      painLevel: llmPainLevel,
      complaints,
    };
  };

  const handleGenerateAiReport = async () => {
    if (!assessmentSummary) return;

    setIsGeneratingAiReport(true);
    setAiReportError(null);
    setAiReport(null);

    try {
      const key = (llmApiKey || '').trim();
      if (key) {
        try {
          sessionStorage.setItem('llm_api_key', key);
        } catch {}
        LLMService.setApiKey(key);
      }

      const data = buildRehabilitationDataFromSummary(assessmentSummary, assessmentHistory);
      const report = await LLMService.generateReport(data);
      setAiReport(report);
    } catch (e) {
      const message = e instanceof Error ? e.message : '生成失败';
      setAiReportError(message);
    } finally {
      setIsGeneratingAiReport(false);
    }
  };

  const generateReportFromLatest = async (patientId: string, patientName: string, openLatest: boolean) => {
    try {
      const processor = new FmsProcessor();

      let assessment: any | null = null;
      try {
        const raw = localStorage.getItem('lastAssessment');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.metrics) && parsed.overallScore) {
            assessment = parsed;
          }
        }
      } catch {}

      if (!assessment) {
        assessment = await processor.process({
          movementType: 'deep-squat',
          movementName: '深蹲',
          hipMobilityScore: 2,
          kneeStabilityScore: 2,
          shoulderMobilityScore: 3,
          coreActivationScore: 2,
          posturalAlignmentScore: 3,
          leftSideScores: { hip: 2, knee: 2 },
          rightSideScores: { hip: 3, knee: 2 },
          compensationPatterns: ['膝内扣', '躯干前倾']
        });
        try {
          localStorage.setItem('lastAssessment', JSON.stringify(assessment));
        } catch {}
      }

      let detailsText = processor.generateReport(assessment);

      try {
        const qAt = sessionStorage.getItem('completed_questionnaire_at') || '';
        const sAt = sessionStorage.getItem('completed_scales_at') || '';
        const vAt = sessionStorage.getItem('completed_video_analysis_at') || '';
        const lines: string[] = [];
        if (qAt) lines.push(`- 问诊: ${qAt.replace('T', ' ').slice(0, 16)}`);
        if (sAt) lines.push(`- 量表: ${sAt.replace('T', ' ').slice(0, 16)}`);
        if (vAt) lines.push(`- 动作: ${vAt.replace('T', ' ').slice(0, 16)}`);
        if (lines.length) {
          detailsText += `\n\n流程完成时间:\n${lines.join('\n')}\n`;
        }
      } catch {}

      try {
        const raw = sessionStorage.getItem('voice_intake_latest');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.transcript) {
            detailsText += `\n\n问诊转写:\n${String(parsed.transcript)}\n`;
          }
          if (parsed?.audioUrl) {
            detailsText += `\n录音链接: ${String(parsed.audioUrl)}\n`;
          }
        }
      } catch {}

      const report: Report = {
        id: `R${Date.now()}`,
        patientId: patientId || 'local',
        patientName: patientName || '患者',
        testId: assessment.movementType || 'unknown',
        testName: assessment.movementName || '未知测试',
        date: new Date().toISOString().split('T')[0],
        score: assessment.overallScore?.value || 0,
        status: 'completed',
        summary: (assessment.recommendations || []).join('；') || '完成评估',
        details: detailsText
      };

      setReports(prev => [report, ...prev]);
      if (openLatest) {
        setSelectedReport(report);
      }
    } catch {}
  };
  
  // 从API获取报告数据
  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 尝试从API获取报告数据
      const data = await listReports(1, 50);
      setReports(data.items || []);
    } catch (err) {
      console.error('获取报告数据失败:', err);
      // Fallback to local storage
      try {
        const localHistory = localStorage.getItem('analysis_history');
        if (localHistory) {
          const parsed = JSON.parse(localHistory);
          const adapted: Report[] = parsed.map((item: any) => ({
            id: item.id,
            patientId: 'local',
            patientName: 'Local User',
            testId: item.movementType,
            testName: item.movementName,
            date: new Date(item.timestamp).toISOString().split('T')[0],
            score: item.overallScore?.value || 0,
            status: 'completed',
            summary: item.recommendations ? item.recommendations.join('. ') : 'Completed assessment',
            details: JSON.stringify(item.overallScore)
          }));
          setReports(adapted);
          setError(null);
        } else {
          setError('无法加载报告数据，请稍后重试');
          setReports([]);
        }
      } catch (localErr) {
        setError('无法加载报告数据，请稍后重试');
        setReports([]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // 过滤报告
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // 查看报告详情
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };
  
  // 删除报告
  const handleDeleteReport = async (id: string) => {
    if (confirm('确定要删除此报告吗？')) {
      try {
        // 尝试从API删除报告
        await deleteReportRecord(id);
        
        // 如果API调用成功，更新本地状态
        setReports(reports.filter(report => report.id !== id));
        if (selectedReport && selectedReport.id === id) {
          setSelectedReport(null);
        }
      } catch (err) {
        console.error('删除报告失败:', err);
        alert('删除报告失败，请稍后重试');
      }
    }
  };
  
  // 创建新报告
  const handleCreateReport = async () => {
    if (newReport.patientId && newReport.testId) {
      try {
        // 这里应该从患者和测试数据中获取名称
        const patientName = '新患者'; // 实际应用中应该从患者数据获取
        const testName = '新测试'; // 实际应用中应该从测试数据获取
        
        const reportData: CreateReportInput = {
          patientId: newReport.patientId,
          patientName,
          testId: newReport.testId,
          testName,
          date: new Date().toISOString().split('T')[0],
          score: 0,
          status: 'draft',
          summary: newReport.summary || '',
          details: newReport.details || ''
        };
        
        // 尝试通过API创建报告
        const createdReport = await createReport(reportData);
        
        // 如果API调用成功，更新本地状态
        setReports([...reports, createdReport]);
        setNewReport({
          patientId: '',
          testId: '',
          summary: '',
          details: ''
        });
        setShowCreateForm(false);
      } catch (err) {
        console.error('创建报告失败:', err);
        alert('创建报告失败，请稍后重试');
      }
    }
  };
  
  // 导出报告
  const handleExportReport = async (report: Report, format: 'pdf' | 'excel') => {
    try {
      // 尝试通过API导出报告
        await exportReport(report.id, format);
      alert(`正在导出报告 ${report.id} 为 ${format} 格式`);
    } catch (err) {
      console.error('导出报告失败:', err);
      alert(`导出报告失败，请稍后重试`);
    }
  };
  
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success[500];
      case 'in-progress':
        return colors.warning[500];
      case 'draft':
        return colors.neutral[600];
      default:
        return colors.neutral[600];
    }
  };
  
  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in-progress':
        return '进行中';
      case 'draft':
        return '草稿';
      default:
        return '未知';
    }
  };
  
  // 获取分数颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return colors.success[700];
    if (score >= 80) return colors.success[500];
    if (score >= 70) return colors.warning[700];
    if (score >= 60) return colors.warning[500];
    return colors.error[500];
  };

  const AssessmentSummaryPanel: React.FC = () => (
    <Card className="p-6 border shadow-md">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>评估数据汇总</h2>
          <div className="text-sm mt-1" style={{ color: colors.text.secondary }}>基于本地历史（analysis_history / lastAssessment）</div>
        </div>
        <Button
          variant="outline"
          size="small"
          onClick={refreshAssessmentSummary}
          style={{ borderColor: colors.primary[300], color: colors.primary[700] }}
        >
          刷新
        </Button>
      </div>

      {assessmentSummary ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded" style={{ backgroundColor: colors.neutral[50], border: `1px solid ${colors.neutral[200]}` }}>
              <div className="text-xs" style={{ color: colors.text.secondary }}>评估次数</div>
              <div className="text-2xl font-bold" style={{ color: colors.text.primary }}>{assessmentSummary.count}</div>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: colors.neutral[50], border: `1px solid ${colors.neutral[200]}` }}>
              <div className="text-xs" style={{ color: colors.text.secondary }}>平均得分</div>
              <div className="text-2xl font-bold" style={{ color: getScoreColor(assessmentSummary.avgOverallScore) }}>{assessmentSummary.avgOverallScore.toFixed(1)}</div>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: colors.neutral[50], border: `1px solid ${colors.neutral[200]}` }}>
              <div className="text-xs" style={{ color: colors.text.secondary }}>平均灵活性</div>
              <div className="text-2xl font-bold" style={{ color: colors.text.primary }}>{assessmentSummary.avgMobilityScore === null ? '—' : assessmentSummary.avgMobilityScore.toFixed(1)}</div>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: colors.neutral[50], border: `1px solid ${colors.neutral[200]}` }}>
              <div className="text-xs" style={{ color: colors.text.secondary }}>平均稳定性</div>
              <div className="text-2xl font-bold" style={{ color: colors.text.primary }}>{assessmentSummary.avgStabilityScore === null ? '—' : assessmentSummary.avgStabilityScore.toFixed(1)}</div>
            </div>
          </div>

          <div className="text-sm" style={{ color: colors.text.secondary }}>
            最近一次：{assessmentSummary.latestTimestamp ? assessmentSummary.latestTimestamp.replace('T', ' ').slice(0, 16) : '—'}
          </div>

          <div>
            <div className="text-sm font-medium mb-2" style={{ color: colors.text.primary }}>按动作</div>
            <div className="space-y-2">
              {assessmentSummary.byMovement.slice(0, 6).map(item => (
                <div key={item.movementType} className="flex items-center justify-between">
                  <div className="text-sm" style={{ color: colors.text.primary }}>{item.movementName}</div>
                  <div className="text-sm" style={{ color: colors.text.secondary }}>{item.count} 次 · {item.avgScore.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm" style={{ color: colors.text.secondary }}>
          暂无本地评估数据。先完成一次“动作评估/量表/问诊”，再回来生成汇总与AI报告。
        </div>
      )}
    </Card>
  );

  const AiAnalysisPanel: React.FC = () => (
    <Card className="p-6 border shadow-md">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>AI 分析报告</h2>
          <div className="text-sm mt-1" style={{ color: colors.text.secondary }}>将汇总结果发送到 LLM 生成康复分析建议</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>患者姓名</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{ borderColor: colors.neutral[300] }}
            value={llmPatientName}
            onChange={(e) => setLlmPatientName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>年龄</label>
          <input
            type="number"
            min={0}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{ borderColor: colors.neutral[300] }}
            value={llmAge}
            onChange={(e) => setLlmAge(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>疼痛等级（0-10）</label>
          <input
            type="number"
            min={0}
            max={10}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{ borderColor: colors.neutral[300] }}
            value={llmPainLevel}
            onChange={(e) => setLlmPainLevel(Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>LLM API Key（可选）</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{ borderColor: colors.neutral[300] }}
            value={llmApiKey}
            onChange={(e) => setLlmApiKey(e.target.value)}
            placeholder="未填写则使用模拟报告"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>主诉/补充信息</label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{ borderColor: colors.neutral[300] }}
            value={llmComplaints}
            onChange={(e) => setLlmComplaints(e.target.value)}
            placeholder="可粘贴问诊要点、疼痛诱因、既往史等"
          />
        </div>
      </div>

      <div className="mt-3 text-xs" style={{ color: colors.text.secondary }}>
        仅供康复建议参考，不能替代线下诊疗与医生诊断。
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="primary"
          size="medium"
          onClick={handleGenerateAiReport}
          disabled={!assessmentSummary || isGeneratingAiReport}
          style={{ backgroundColor: colors.primary[500], color: '#fff' }}
        >
          {isGeneratingAiReport ? '生成中...' : '生成AI报告'}
        </Button>
      </div>

      {aiReportError && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {aiReportError}
        </div>
      )}

      {aiReport && (
        <div className="mt-5 space-y-4">
          <div>
            <div className="text-sm font-medium mb-1" style={{ color: colors.text.primary }}>总结</div>
            <div className="text-sm" style={{ color: colors.text.secondary, whiteSpace: 'pre-wrap' }}>{aiReport.summary}</div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1" style={{ color: colors.text.primary }}>临床印象</div>
            <div className="text-sm" style={{ color: colors.text.secondary, whiteSpace: 'pre-wrap' }}>{aiReport.clinicalImpression}</div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1" style={{ color: colors.text.primary }}>建议</div>
            <ul className="list-disc pl-5" style={{ color: colors.text.secondary }}>
              {aiReport.recommendations?.map((r, idx) => (
                <li key={idx} className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium mb-1" style={{ color: colors.text.primary }}>风险提示</div>
            {aiReport.riskFlags?.length ? (
              <ul className="list-disc pl-5" style={{ color: colors.text.secondary }}>
                {aiReport.riskFlags.map((r, idx) => (
                  <li key={idx} className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{r}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm" style={{ color: colors.text.secondary }}>—</div>
            )}
          </div>
          {aiReport.soapNote && (
            <div>
              <div className="text-sm font-medium mb-2" style={{ color: colors.text.primary }}>SOAP</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded" style={{ backgroundColor: colors.neutral[50], border: `1px solid ${colors.neutral[200]}` }}>
                  <div className="text-xs font-medium mb-1" style={{ color: colors.text.primary }}>S</div>
                  <div className="text-sm" style={{ color: colors.text.secondary, whiteSpace: 'pre-wrap' }}>{aiReport.soapNote.s}</div>
                </div>
                <div className="p-3 rounded" style={{ backgroundColor: colors.neutral[50], border: `1px solid ${colors.neutral[200]}` }}>
                  <div className="text-xs font-medium mb-1" style={{ color: colors.text.primary }}>O</div>
                  <div className="text-sm" style={{ color: colors.text.secondary, whiteSpace: 'pre-wrap' }}>{aiReport.soapNote.o}</div>
                </div>
                <div className="p-3 rounded" style={{ backgroundColor: colors.neutral[50], border: `1px solid ${colors.neutral[200]}` }}>
                  <div className="text-xs font-medium mb-1" style={{ color: colors.text.primary }}>A</div>
                  <div className="text-sm" style={{ color: colors.text.secondary, whiteSpace: 'pre-wrap' }}>{aiReport.soapNote.a}</div>
                </div>
                <div className="p-3 rounded" style={{ backgroundColor: colors.neutral[50], border: `1px solid ${colors.neutral[200]}` }}>
                  <div className="text-xs font-medium mb-1" style={{ color: colors.text.primary }}>P</div>
                  <div className="text-sm" style={{ color: colors.text.secondary, whiteSpace: 'pre-wrap' }}>{aiReport.soapNote.p}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
  
  return (
      <div className="mx-auto max-w-6xl p-4 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>评估报告</h1>
          <div className="flex items-center gap-2">
            {currentPatientId && (
              <div className="px-3 py-1 rounded-full text-xs bg-gray-100" style={{ color: colors.primary[700] }}>
                {currentPatientName ? `当前患者：${currentPatientName}` : `患者ID：${currentPatientId}`}
              </div>
            )}
            <Button variant="secondary" onClick={goBack}>返回</Button>
          </div>
        </div>
        {voiceIntake && (
          <Card className="p-4 mb-4 border" style={{ borderColor: colors.neutral[200] }}>
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-4">
                <div className="text-sm font-medium mb-2" style={{ color: colors.text.primary }}>最近问诊转写</div>
                <div className="text-sm" style={{ color: colors.text.secondary }}>{voiceIntake.transcript || ''}</div>
                {voiceIntake.audioUrl && (
                  <div className="mt-2">
                    <a href={voiceIntake.audioUrl} target="_blank" rel="noreferrer" className="text-sm underline" style={{ color: colors.primary[600] }}>试听录音</a>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(true)}
                  style={{ borderColor: colors.primary[300], color: colors.primary[700] }}
                >
                  新建报告
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setNewReport({
                    ...newReport,
                    summary: (newReport.summary || '') + (voiceIntake.transcript ? `\n问诊转写：${voiceIntake.transcript}` : ''),
                    details: (newReport.details || '') + (voiceIntake.audioUrl ? `\n录音链接：${voiceIntake.audioUrl}` : '')
                  })}
                  style={{ backgroundColor: colors.primary[500], color: '#fff' }}
                >
                  填充到新报告
                </Button>
              </div>
            </div>
          </Card>
        )}
      <style>{animationKeyframes}</style>
      {/* 返回按钮 */}
      <div className="mb-6 flex justify-start">
        <Button
          variant="secondary"
          size="medium"
          onClick={() => navigateTo('dashboard')}
          className="transition-colors duration-300"
          style={{ backgroundColor: colors.primary[100], color: colors.primary[700] }}
          aria-label="返回仪表盘"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回仪表盘
        </Button>
      </div>
        
        {/* 页面标题和操作 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ 
              color: colors.primary[800], 
              fontWeight: typography.fontWeight.bold
            }}>报告管理</h1>
            <p className="text-base md:text-lg" style={{ color: colors.text.secondary }}>
              查看和管理评估报告
            </p>
          </div>
          
          <Button
            variant="primary"
            size="medium"
            onClick={() => setShowCreateForm(true)}
            className="mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建报告
          </Button>
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <Button
              variant="outline"
              size="small"
              onClick={fetchReports}
              className="ml-4"
            >
              重试
            </Button>
          </div>
        )}
        
        {/* 加载状态 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* 搜索和过滤 */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="搜索患者姓名、测试名称或报告ID..."
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ borderColor: colors.neutral[300] }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ borderColor: colors.neutral[300] }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">全部状态</option>
                  <option value="completed">已完成</option>
                  <option value="in-progress">进行中</option>
                  <option value="draft">草稿</option>
                </select>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => {
                    generateReportFromLatest(currentPatientId, currentPatientName, true);
                  }}
                  className="ml-2"
                  style={{ backgroundColor: colors.primary[500], color: '#fff' }}
                >
                  从最近评估生成
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <AssessmentSummaryPanel />
              <AiAnalysisPanel />
            </div>
            
            {/* 创建报告表单 */}
            {showCreateForm && (
              <Card className="p-6 border shadow-md mb-6" style={{ 
                ...(mounted && animations.fadeInDown('0.3s', '0s'))
              }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>创建新报告</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      患者ID
                    </label>
                    <input
                      type="text"
                      placeholder="患者ID"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newReport.patientId}
                      onChange={(e) => setNewReport({...newReport, patientId: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      测试ID
                    </label>
                    <input
                      type="text"
                      placeholder="测试ID"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newReport.testId}
                      onChange={(e) => setNewReport({...newReport, testId: e.target.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      报告摘要
                    </label>
                    <textarea
                      placeholder="报告摘要"
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newReport.summary}
                      onChange={(e) => setNewReport({...newReport, summary: e.target.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      详细描述
                    </label>
                    <textarea
                      placeholder="详细描述"
                      rows={5}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newReport.details}
                      onChange={(e) => setNewReport({...newReport, details: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setShowCreateForm(false)}
                  >
                    取消
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCreateReport}
                  >
                    创建报告
                  </Button>
                </div>
              </Card>
            )}
            
            {/* 报告列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report, index) => (
                <Card 
                  key={report.id}
                  className="p-6 border shadow-md hover:shadow-lg transition-all duration-300"
                  style={{
                    ...(mounted && animations.fadeInUp('0.6s', `${0.1 + index * 0.1}s`))
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text.primary }}>
                        {report.testName}
                      </h3>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>
                        报告ID: {report.id}
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium" style={{
                      backgroundColor: `${getStatusColor(report.status)}20`,
                      color: getStatusColor(report.status)
                    }}>
                      {getStatusText(report.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm" style={{ color: colors.text.secondary }}>
                      <span className="font-medium">患者:</span> {report.patientName}
                    </div>
                    
                    <div className="text-sm" style={{ color: colors.text.secondary }}>
                      <span className="font-medium">日期:</span> {report.date}
                    </div>
                    
                    {report.status === 'completed' && report.score > 0 && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2" style={{ color: colors.text.secondary }}>得分:</span>
                        <span className="text-lg font-bold" style={{ color: getScoreColor(report.score) }}>
                          {report.score}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: colors.text.secondary }}>
                    {report.summary}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleViewReport(report)}
                      className="flex-1"
                    >
                      查看
                    </Button>
                    
                    {report.status === 'completed' && (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleExportReport(report, 'pdf')}
                          style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                          title="导出为PDF"
                        >
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleExportReport(report, 'excel')}
                          style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                          title="导出为Excel"
                        >
                          Excel
                        </Button>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleDeleteReport(report.id)}
                      style={{ backgroundColor: colors.error[100], color: colors.error[500] }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* 空状态 */}
            {filteredReports.length === 0 && (
              <Card className="p-12 text-center border shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.neutral[400] }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors.text.primary }}>
                  {searchTerm || filterStatus !== 'all' ? '未找到匹配的报告' : '暂无报告记录'}
                </h3>
                <p className="text-sm mb-6" style={{ color: colors.text.secondary }}>
                  {searchTerm || filterStatus !== 'all' ? '尝试调整搜索条件' : '创建第一个报告开始使用系统'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateForm(true)}
                  >
                    创建报告
                  </Button>
                )}
              </Card>
            )}
          </>
        )}
        
        {/* 报告详情模态框 */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
                    {selectedReport.testName}
                  </h2>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>报告ID</p>
                      <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>状态</p>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getStatusColor(selectedReport.status) }}></div>
                        <p className="text-base" style={{ color: getStatusColor(selectedReport.status) }}>
                          {getStatusText(selectedReport.status)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>患者ID</p>
                      <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>测试ID</p>
                      <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.testId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>患者姓名</p>
                      <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>日期</p>
                      <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.date}</p>
                    </div>
                    {selectedReport.status === 'completed' && (
                      <div>
                        <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>得分</p>
                        <p className="text-lg font-bold" style={{ color: getScoreColor(selectedReport.score) }}>
                          {selectedReport.score}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>摘要</p>
                    <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.summary}</p>
                  </div>
                  
                  {selectedReport.details && (
                    <div>
                      <p className="text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>详细描述</p>
                      <p className="text-base whitespace-pre-wrap" style={{ color: colors.text.primary }}>{selectedReport.details}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedReport(null)}
                  >
                    关闭
                  </Button>
                  {selectedReport.status === 'completed' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleExportReport(selectedReport, 'pdf')}
                      >
                        导出PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExportReport(selectedReport, 'excel')}
                      >
                        导出Excel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
  );
};

export default Reports;
