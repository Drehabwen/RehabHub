import React, { useMemo } from 'react';
import { AlertTriangle, BellRing, CheckCircle2, Clock3 } from 'lucide-react';
import type { Patient } from '@/types/patient';
import type { VisitTaskSummary } from '../workflow';
import { PageHeader, VisitCard } from '@/components/workflow';
import { Card } from '@/components/ui';
import { StatePanel } from '@/components/layout';

interface AlertsViewProps {
  visitTasks: VisitTaskSummary[];
  onSelectPatient: (patient: Patient) => void;
  onOpenHistory: (patient: Patient) => void;
  onStartEvaluation: (patient: Patient) => void;
  canOpenHistory: boolean;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  visitTasks,
  onSelectPatient,
  onOpenHistory,
  onStartEvaluation,
  canOpenHistory,
}) => {
  const buckets = useMemo(() => {
    const pendingRetest = visitTasks.filter((task) => task.processStatus === '待复测');
    const highAttention = visitTasks.filter((task) => ['待补采集', '待复核'].includes(task.processStatus) || task.riskLevel === '高风险');
    const archived = visitTasks.filter((task) => task.processStatus === '已归档');

    return { pendingRetest, highAttention, archived };
  }, [visitTasks]);

  const highlightedTasks = useMemo(
    () => [
      ...buckets.highAttention,
      ...buckets.pendingRetest.filter((task) => !buckets.highAttention.some((item) => item.patient.id === task.patient.id)),
    ],
    [buckets.highAttention, buckets.pendingRetest],
  );

  return (
    <div className="rehab-page custom-scrollbar">
      <div className="rehab-page-inner space-y-5">
        <PageHeader
          eyebrow="预警与复测 / 高风险提醒 / 持续追踪"
          title="预警与复测"
          description="这页只关心两件事：哪些对象会阻塞闭环，哪些对象需要进入持续复测。高风险、待补采集、待复核与待复测对象会优先暴露在这里。"
          summary={(
            <>
              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                重点关注 {buckets.highAttention.length}
              </span>
              <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                待复测 {buckets.pendingRetest.length}
              </span>
            </>
          )}
        />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card variant="default" padding="md" className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <BellRing className="text-violet-600" size={18} />
            <div className="mt-4 text-3xl font-semibold text-slate-900 tabular-nums">{buckets.pendingRetest.length}</div>
            <div className="mt-2 text-sm text-slate-500">待复测对象</div>
          </Card>
          <Card variant="default" padding="md" className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <AlertTriangle className="text-rose-600" size={18} />
            <div className="mt-4 text-3xl font-semibold text-slate-900 tabular-nums">{buckets.highAttention.length}</div>
            <div className="mt-2 text-sm text-slate-500">高风险 / 卡点任务</div>
          </Card>
          <Card variant="default" padding="md" className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <CheckCircle2 className="text-emerald-600" size={18} />
            <div className="mt-4 text-3xl font-semibold text-slate-900 tabular-nums">{buckets.archived.length}</div>
            <div className="mt-2 text-sm text-slate-500">已归档对象</div>
          </Card>
        </section>

        <Card variant="default" padding="lg" className="border-slate-200 bg-[linear-gradient(180deg,rgba(255,251,235,0.8),rgba(255,255,255,1))] shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">当前预警规则</div>
              <p className="mt-1 text-sm text-slate-600">
                预警不是一次性提示，而是闭环状态暴露。只要对象还处于待补采集、待复核或待复测，就会继续留在预警页，直到任务真正推进完成。
              </p>
            </div>
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              <Clock3 size={14} className="mr-2 text-slate-400" />
              预警口径：状态驱动而非一次提醒
            </div>
          </div>
        </Card>

        {highlightedTasks.length === 0 ? (
          <StatePanel
            title="当前没有需要处理的预警对象"
            description="当存在高风险、待补采集、待复核或待复测对象时，这里会自动形成重点清单。"
          />
        ) : (
          <section className="space-y-3">
            {highlightedTasks.map((task) => (
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
