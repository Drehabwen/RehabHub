import React, { useMemo, useState, useRef } from 'react';
import { AlertTriangle, BellRing, ClipboardList, FileText, Plus, Search, ShieldAlert, Users, RefreshCw } from 'lucide-react';
import type { Patient } from '@/types/patient';
import type { VisitTaskSummary } from '../workflow';
import { PageHeader, VisitCard } from '@/components/workflow';
import { Button, Card } from '@/components/ui';
import { StatePanel } from '@/components/layout';

interface DashboardStats {
  totalPatients: number;
  pending: number;
  inProgress: number;
  readyForReport: number;
}

interface DashboardViewProps {
  patients: Patient[];
  visitTasks: VisitTaskSummary[];
  stats: DashboardStats;
  onSelectPatient: (patient: Patient) => void;
  onOpenHistory: (patient: Patient) => void;
  onStartEvaluation: (patient: Patient) => void;
  canOpenHistory: boolean;
  onNewPatient: () => void;
  onSearchPatient: () => void;
}

const topicStateCards = [
  { key: '待初筛', label: '待初筛', tone: 'bg-slate-900 text-white' },
  { key: '待标准筛查', label: '待标准筛查', tone: 'bg-blue-50 text-blue-700' },
  { key: '待补采集', label: '待补采集', tone: 'bg-amber-50 text-amber-700' },
  { key: '待报告', label: '待报告', tone: 'bg-emerald-50 text-emerald-700' },
] as const;

export const DashboardView: React.FC<DashboardViewProps>= ({
  patients,
  visitTasks,
  stats,
  onSelectPatient,
  onOpenHistory,
  onStartEvaluation,
  canOpenHistory,
  onNewPatient,
  onSearchPatient,
}) => {
  const [keyword, setKeyword] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const filteredTasks = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      return visitTasks;
    }

    return visitTasks.filter((task) => (
      task.patient.id.toLowerCase().includes(q)
      || task.patientName.toLowerCase().includes(q)
      || task.visitId.toLowerCase().includes(q)
    ));
  }, [keyword, visitTasks]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop<= 0) {
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) =>{
    if (!isDragging.current) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY.current;
    
    if (deltaY >0) {
      e.preventDefault();
      setPullY(Math.min(deltaY, 80));
    }
  };

  const handleTouchEnd = () => {
    if (pullY > 50 && !isRefreshing) {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
        setPullY(0);
      }, 1500);
    } else {
      setPullY(0);
    }
    isDragging.current = false;
  };

  const processCounts = useMemo(() => {
    const initial = {
      待初筛: 0,
      初筛中: 0,
      待标准筛查: 0,
      待补采集: 0,
      待复核: 0,
      待报告: 0,
      待复测: 0,
      已归档: 0,
    } as Record<VisitTaskSummary['processStatus'], number>;

    for (const task of visitTasks) {
      initial[task.processStatus] += 1;
    }

    return initial;
  }, [visitTasks]);

  const highRiskCount = useMemo(
    () => visitTasks.filter((task) => task.riskLevel === '高风险').length,
    [visitTasks],
  );

  const featuredTask = filteredTasks[0] ?? visitTasks[0] ?? null;

  return (
    <div 
      className="rehab-page custom-scrollbar"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(isRefreshing || pullY > 0) && (
        <div className="flex justify-center py-4">
          <div className={`flex items-center gap-2 ${isRefreshing ? 'animate-spin' : ''}`}>
            <RefreshCw size={16} className="text-brand-primary" />
            <span className="text-xs text-slate-600">
              {isRefreshing ? '刷新中...' : '下拉刷新'}
            </span>
          </div>
        </div>
      )}
      <div className="rehab-page-inner space-y-5">
        <PageHeader
          eyebrow="专题 / 筛查"
          title="筛查"
          description=""
          summary={( 
            <>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                筛查
              </span>
              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                高风险 {highRiskCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                待办 {processCounts['待补采集'] + processCounts['待复核'] + processCounts['待报告']}
              </span>
            </>
          )}
          actions={( 
            <>
              <Button variant="secondary" icon={<Search size={16} />} onClick={onSearchPatient}>搜索</Button>
              <Button variant="primary" icon={<Plus size={16} />} onClick={onNewPatient}>新增</Button>
            </>
          )}
        />

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Card
            variant="default"
            padding="lg"
            className="border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
                  专题
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                  筛查
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  流程：进入→初筛→采集→判断→报告→复测
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">高低肩</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">骨盆</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">中轴</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">复测</span>
                </div>
              </div>

              <div className="grid min-w-[250px] grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">总人数</div>
                  <div className="mt-2 text-3xl font-semibold text-slate-900 tabular-nums">{stats.totalPatients || patients.length}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">复测</div>
                  <div className="mt-2 text-3xl font-semibold text-violet-600 tabular-nums">{processCounts['待复测']}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">复核</div>
                  <div className="mt-2 text-3xl font-semibold text-rose-600 tabular-nums">{processCounts['待复核']}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">归档</div>
                  <div className="mt-2 text-3xl font-semibold text-emerald-600 tabular-nums">{processCounts['已归档']}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card
            variant="default"
            padding="lg"
            className="border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <ShieldAlert size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900">筛查流程</div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  分流→补证→报告→复测
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">①</div>
                <div className="mt-1 text-sm font-medium text-slate-800">先补采</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">②</div>
                <div className="mt-1 text-sm font-medium text-slate-800">达标出报告</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">③</div>
                <div className="mt-1 text-sm font-medium text-slate-800">报告后复测</div>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topicStateCards.map((card) => (
            <Card
              key={card.key}
              variant="default"
              padding="md"
              className="border-slate-200 bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[30px] font-semibold leading-none text-slate-900 tabular-nums">{processCounts[card.key]}</div>
                  <div className="mt-2 text-sm text-slate-500">{card.label.split('待')[1] || card.label}</div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${card.tone}`}>
                  {card.key === '待初筛' ? <Users size={18} /> : null}
                  {card.key === '待标准筛查' ? <ClipboardList size={18} /> : null}
                  {card.key === '待补采集' ? <BellRing size={18} /> : null}
                  {card.key === '待报告' ? <FileText size={18} /> : null}
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Card
            variant="default"
            padding="md"
            className="border-slate-200 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">任务</div>
                <p className="mt-1 text-sm text-slate-500">搜索定位，优先处理</p>
              </div>
              <label className="relative w-full lg:max-w-[380px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="搜索姓名"
                  className="field-input pl-10"
                />
              </label>
            </div>
          </Card>

          <Card
            variant="default"
            padding="md"
            className="border-slate-200 bg-[linear-gradient(180deg,rgba(255,251,235,0.92),rgba(255,255,255,1))] shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <AlertTriangle size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">风险</div>
                <p className="mt-1 text-sm text-slate-600">
                  高风险 {highRiskCount} 人
                </p>
                <div className="mt-3 text-xs font-medium text-rose-700">
                  规则：高风险优先复核
                </div>
              </div>
            </div>
          </Card>
        </section>

        {featuredTask ? (
          <Card
            variant="default"
            padding="md"
            className="border-slate-200 bg-[linear-gradient(135deg,rgba(15,118,110,0.05),rgba(255,255,255,0.98))] shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">优先处理</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">
                  {featuredTask.patientName}
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {featuredTask.currentFocus}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" onClick={() => onStartEvaluation(featuredTask.patient)}>{featuredTask.primaryAction}</Button>
                <Button variant="secondary" onClick={() => onSelectPatient(featuredTask.patient)}>{featuredTask.secondaryAction}</Button>
                {canOpenHistory ? (
                  <Button variant="ghost" onClick={() => onOpenHistory(featuredTask.patient)}>历史</Button>
                ) : null}
              </div>
            </div>
          </Card>
        ) : null}

        {filteredTasks.length === 0 ? (
          <StatePanel
            title="无任务"
            description="新增或清空搜索"
            actions={(
              <>
                <button onClick={onNewPatient} className="btn-primary">新增</button>
                <button onClick={() => setKeyword('')} className="btn-secondary">清空</button>
              </>
            )}
          />
        ) : (
          <section className="space-y-3">
            {filteredTasks.map((task) => (
              <VisitCard
                key={`${task.patient.id}-${task.visitId}`}
                task={task}
                layout="row"
                onOpen={() => onSelectPatient(task.patient)}
                onViewHistory={() => onOpenHistory(task.patient)}
                onStartEvaluation={() => onStartEvaluation(task.patient)}
                canViewHistory={canOpenHistory}
              />
            ))}
          </section>
        )}

        {patients.length === 0 ? (
          <Card variant="default" padding="md" className="border-slate-200 bg-slate-50/80">
            <div className="text-sm text-slate-500">当前还没有学生档案。建议先创建学生，再进入专题筛查流程。</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
};
