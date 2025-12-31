import React, { useEffect, useState } from 'react';
import { colors } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import Button from '../ui/Button';

const AssessmentHub: React.FC = () => {
  const { navigateTo } = useNavigation();

  const fmsMovements: Array<{ id: string; name: string }> = [
    { id: 'deep-squat', name: '深蹲' },
    { id: 'hurdle-step', name: '跨栏步' },
    { id: 'inline-lunge', name: '直线弓步' },
    { id: 'shoulder-mobility', name: '肩部灵活性' },
    { id: 'active-straight-leg-raise', name: '主动直腿抬高' },
    { id: 'trunk-stability-pushup', name: '躯干稳定俯卧撑' },
    { id: 'rotary-stability', name: '旋转稳定性' }
  ];

  const startMovement = (m: { id: string; name: string }) => {
    navigateTo('video-analysis', { movement: m });
  };

  const [todayCount, setTodayCount] = useState<number>(0);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [currentPatientName, setCurrentPatientName] = useState<string | null>(null);
  const [currentPatientAge, setCurrentPatientAge] = useState<string | null>(null);
  const [currentPatientGender, setCurrentPatientGender] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ questionnaire: boolean; scales: boolean; video: boolean }>({ questionnaire: false, scales: false, video: false });
  const [hasLastAssessment, setHasLastAssessment] = useState<boolean>(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('analysis_history');
      if (raw) {
        const list = JSON.parse(raw) || [];
        const today = new Date().toISOString().slice(0, 10);
        const count = list.filter((r: any) => (r.timestamp || '').slice(0, 10) === today).length;
        setTodayCount(count);
      }
    } catch {}
    try {
      const pid = sessionStorage.getItem('currentPatientId');
      const pname = sessionStorage.getItem('currentPatientName');
      const page = sessionStorage.getItem('currentPatientAge');
      const pgender = sessionStorage.getItem('currentPatientGender');
      setCurrentPatientId(pid);
      setCurrentPatientName(pname);
      setCurrentPatientAge(page);
      setCurrentPatientGender(pgender);
    } catch {}
    try {
      setProgress({
        questionnaire: sessionStorage.getItem('completed_questionnaire') === 'true',
        scales: sessionStorage.getItem('completed_scales') === 'true',
        video: sessionStorage.getItem('completed_video_analysis') === 'true'
      });
    } catch {}
    try {
      setHasLastAssessment(Boolean(localStorage.getItem('lastAssessment')));
    } catch {}
  }, []);

  const canGenerateReport = (progress.questionnaire && progress.scales && progress.video) || hasLastAssessment;

  return (
    <div className="mx-auto max-w-6xl p-4 w-full">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl md:text-2xl font-bold" style={{ color: colors.primary[800] }}>评估中心</h1>
        <div className="hidden md:flex items-center gap-2">
          <div className="px-3 py-1 rounded-full text-xs bg-gray-100" style={{ color: colors.primary[700] }}>
            {currentPatientName ? `当前患者：${currentPatientName}${currentPatientAge ? `（${currentPatientAge}岁${currentPatientGender === 'male' ? '·男' : currentPatientGender === 'female' ? '·女' : ''}）` : ''}` : (currentPatientId ? `当前患者ID：${currentPatientId}` : '未选择患者')}
          </div>
          <div className="px-3 py-1 rounded-full text-xs bg-gray-100" style={{ color: colors.primary[700] }}>
            今日评估：{todayCount}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2">
        <div className={`px-2 py-1 rounded-full border text-xs ${progress.questionnaire ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
          问诊 {progress.questionnaire ? '已完成' : '未完成'}
          {progress.questionnaire && (
            <span className="ml-1 text-[10px] opacity-70">{(sessionStorage.getItem('completed_questionnaire_at') || '').slice(11,16)}</span>
          )}
        </div>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[500] }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        <div className={`px-2 py-1 rounded-full border text-xs ${progress.scales ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
          量表评估 {progress.scales ? '已完成' : '未完成'}
          {progress.scales && (
            <span className="ml-1 text-[10px] opacity-70">{(sessionStorage.getItem('completed_scales_at') || '').slice(11,16)}</span>
          )}
        </div>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[500] }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        <div className={`px-2 py-1 rounded-full border text-xs ${progress.video ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
          动作评估 {progress.video ? '已完成' : '未完成'}
          {progress.video && (
            <span className="ml-1 text-[10px] opacity-70">{(sessionStorage.getItem('completed_video_analysis_at') || '').slice(11,16)}</span>
          )}
        </div>
        </div>
        {canGenerateReport && (
          <div className="mt-2 flex justify-center">
            <Button
              variant="primary"
              onClick={() => navigateTo('reports', { patientId: currentPatientId || '', autoGenerate: true, openLatest: true })}
              style={{ backgroundColor: colors.primary[500], color: '#fff' }}
            >
              {(progress.questionnaire && progress.scales && progress.video) ? '一键生成报告' : '一键生成报告（最近评估）'}
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div
          className="md:col-start-2 relative overflow-hidden rounded-2xl shadow-sm cursor-pointer bg-white md:h-[340px]"
          onClick={() => navigateTo('questionnaire')}
        >
          <div className="p-5 h-full flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-3 text-purple-600">
              <span className="text-3xl">🗣️</span>
            </div>
            <h2 className="text-2xl font-bold mb-1 text-gray-800">问诊</h2>
            <p className="text-xs text-gray-500 mb-3">病史与主诉采集，含录音与转写</p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              <div className="bg-gray-50 rounded-lg p-2 text-center text-xs text-gray-600">基础信息</div>
              <div className="bg-gray-50 rounded-lg p-2 text-center text-xs text-gray-600">症状时间轴</div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-sm bg-white md:h-[340px]">
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <span className="text-xl">🏃</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">动作评估</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-xl border p-3">
                <div className="text-xs font-semibold mb-2 text-gray-800">FMS</div>
                <div className="grid grid-cols-2 gap-1">
                  {fmsMovements.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => startMovement(m)}
                      className="px-2 py-1 rounded-md text-xs bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800"
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs font-semibold mb-2 text-gray-800">其他动作评估</div>
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => navigateTo('tests')}
                    style={{ backgroundColor: colors.primary[500], color: '#fff' }}
                  >
                    进入
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl shadow-sm bg-white md:h-[340px]"
          onClick={() => navigateTo('scales')}
        >
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <span className="text-xl">📋</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">量表评估</h3>
            </div>
            <p className="text-xs text-gray-500">疼痛、功能障碍、风险筛查</p>
            <div className="mt-auto flex justify-end">
              <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentHub;
