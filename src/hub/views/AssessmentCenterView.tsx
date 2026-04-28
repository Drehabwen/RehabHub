import React, { useMemo, useState } from 'react';
import { Activity, ArrowRight, ClipboardList, FileText, Layers, Mic, ShieldAlert } from 'lucide-react';
import type { Patient } from '@/types/patient';
import type { VisitTaskSummary } from '../workflow';
import { PageHeader, VisitCard } from '@/components/workflow';
import { Button, Card } from '@/components/ui';
import { StatePanel } from '@/components/layout';

type ScreeningFilter = 'all' | 'triage' | 'supplement' | 'report';

interface AssessmentCenterViewProps {
  visitTasks: VisitTaskSummary[];
  onSelectPatient: (patient: Patient) => void;
  onOpenHistory: (patient: Patient) => void;
  onStartEvaluation: (patient: Patient) => void;
  canOpenHistory: boolean;
}

const filterLabels: Record<ScreeningFilter, string> = {
  all: '全部任务',
  triage: '初筛与分流',
  supplement: '补采集与复核',
  report: '报告与复测',
};

const topicHighlights = [
  '先看待补采集，再处理待复核',
  '不满足正式报告条件的对象不直接出报告',
  '已出正式报告的对象转入复测追踪',
];

export const AssessmentCenterView: React.FC<AssessmentCenterViewProps> = ({
  visitTasks,
  onSelectPatient,
  onOpenHistory,
  onStartEvaluation,
  canOpenHistory,
}) => {
  const [filter, setFilter] = useState<ScreeningFilter>('supplement');

  const taskBuckets = useMemo(() => ({
    triage: visitTasks.filter((task) => ['待初筛', '初筛中', '待标准筛查'].includes(task.processStatus)),
    supplement: visitTasks.filter((task) => ['待补采集', '待复核'].includes(task.processStatus)),
    report: visitTasks.filter((task) => ['待报告', '待复测'].includes(task.processStatus)),
  }), [visitTasks]);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') {
      return visitTasks;
    }
    return taskBuckets[filter];
  }, [filter, taskBuckets, visitTasks]);

  const highRiskCount = useMemo(
    () => visitTasks.filter((task) => task.riskLevel === '高风险').length,
    [visitTasks],
  );

  const reportBlockedCount = useMemo(
    () => visitTasks.filter((task) => !task.reportEligible).length,
    [visitTasks],
  );

  return (
    <div className="rehab-page custom-scrollbar">
      <div className="rehab-page-inner space-y-5">
        <PageHeader
          eyebrow="筛查任务 / 对象分流 / 证据补齐 / 报告推进"
          title="筛查任务"
          description=""
          summary={( 
            <>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                当前任务 {visitTasks.length}
              </span>
              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                高风险 {highRiskCount} 人
              </span>
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                报告受阻 {reportBlockedCount} 人
              </span>
            </>
          )}
        />

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Card
            variant="default"
            padding="lg"
            className="border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
                  任务推进逻辑
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                  筛查流程
                </h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    先补采
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    达标出报告
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    报告后复测
                  </div>
                </div>
              </div>

              <div className="grid min-w-[250px] gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">补采集 / 复核</div>
                  <div className="mt-2 text-3xl font-semibold text-rose-600 tabular-nums">{taskBuckets.supplement.length}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">报告 / 复测</div>
                  <div className="mt-2 text-3xl font-semibold text-emerald-600 tabular-nums">{taskBuckets.report.length}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card
            variant="default"
            padding="lg"
            className="border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
          >
            <div className="text-sm font-semibold text-slate-900">工具</div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {
                [
                  { label: '体态', icon: Activity, accent: 'text-blue-600' },
                  { label: 'ROM', icon: Layers, accent: 'text-emerald-600' },
                  { label: '问询', icon: Mic, accent: 'text-violet-600' },
                ].map((module) => (
                  <div key={module.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center">
                    <module.icon size={16} className={`mx-auto ${module.accent}`} />
                    <div className="mt-2 text-xs font-medium text-slate-600">{module.label}</div>
                  </div>
                ))
              }
            </div>
            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              高风险优先筛查
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card variant="default" padding="md" className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[28px] font-semibold leading-none text-slate-900 tabular-nums">{taskBuckets.triage.length}</div>
                  <div className="mt-2 text-sm text-slate-500">初筛与分流</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <ClipboardList size={18} />
                </div>
              </div>
            </Card>

            <Card variant="default" padding="md" className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[28px] font-semibold leading-none text-slate-900 tabular-nums">{taskBuckets.supplement.length}</div>
                  <div className="mt-2 text-sm text-slate-500">补采集与复核</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                  <Activity size={18} />
                </div>
              </div>
            </Card>

            <Card variant="default" padding="md" className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[28px] font-semibold leading-none text-slate-900 tabular-nums">{taskBuckets.report.length}</div>
                  <div className="mt-2 text-sm text-slate-500">报告与复测</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <FileText size={18} />
                </div>
              </div>
            </Card>
          </div>

          <Card
            variant="default"
            padding="md"
            className="border-slate-200 bg-[linear-gradient(180deg,rgba(255,251,235,0.95),rgba(255,255,255,1))] shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <ShieldAlert size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">处理原则</div>
                <p className="mt-1 text-sm text-slate-600">
                  同一学生只要证据不全，就先补齐再谈正式报告；只要风险高，就先复核再谈归档。
                </p>
                <div className="mt-3 text-xs font-medium text-slate-600">
                  当前专题路径：初筛分流
                  <ArrowRight size={12} className="mx-1 inline" />
                  补采集 / 复核
                  <ArrowRight size={12} className="mx-1 inline" />
                  正式报告
                  <ArrowRight size={12} className="mx-1 inline" />
                  复测追踪
                </div>
              </div>
            </div>
          </Card>
        </section>

        <Card
          variant="default"
          padding="md"
          className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">任务队列</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'triage', 'supplement', 'report'] as ScreeningFilter[]).map((item) => (
                <Button
                  key={item}
                  variant={filter === item ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setFilter(item)}
                >
                  {filterLabels[item]}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {filteredTasks.length === 0 ? (
          <StatePanel
            title="当前筛选范围内没有任务"
            description=""
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
      </div>
    </div>
  );
};
