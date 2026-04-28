import React from 'react';
import { Calendar, ChevronRight, ClipboardList } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { ProgressBar } from './ProgressBar';
import { StatusTag } from './StatusTag';
import type { VisitTaskSummary } from '@/hub/workflow';
import {
  dataCompletenessMeta,
  processStatusMeta,
  reportStatusMeta,
  riskLevelMeta,
} from '@/hub/workflow';
import {
  getPatientAvatar,
  getPatientColor,
  getPatientDisplayName,
} from '@/lib/patient-utils';
import { formatDate } from '@/lib/session-utils';
import { cn } from '@/lib/utils';

interface VisitCardProps {
  task: VisitTaskSummary;
  onOpen: () => void;
  layout?: 'card' | 'row';
  onViewHistory?: () => void;
  onStartEvaluation?: () => void;
  canViewHistory?: boolean;
}

const moduleStatusClass = (status: VisitTaskSummary['modules'][number]['status']) => (
  status === 'completed'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-slate-200 bg-white text-slate-500'
);

const metaBadgeClassName = (className: string) => cn(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium',
  className,
);

const getMissingFieldText = (task: VisitTaskSummary) => (
  task.missingFields.length > 0 ? task.missingFields.join('、') : '无'
);

export const VisitCard: React.FC<VisitCardProps> = ({
  task,
  onOpen,
  layout = 'card',
  onViewHistory,
  onStartEvaluation,
  canViewHistory = true,
}) => {
  const handleViewHistory = onViewHistory ?? onOpen;
  const handleStartEvaluation = onStartEvaluation ?? onOpen;
  const processMeta = processStatusMeta[task.processStatus];
  const riskMeta = riskLevelMeta[task.riskLevel];
  const dataMeta = dataCompletenessMeta[task.dataCompleteness];
  const reportMeta = reportStatusMeta[task.reportStatus];

  if (layout === 'row') {
    return (
      <Card variant="default" padding="md" hover className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-5">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-start gap-3">
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm', getPatientColor(task.patient))}>
                {getPatientAvatar(task.patient)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="truncate text-sm font-semibold text-slate-900">{getPatientDisplayName(task.patient)}</div>
                  <span className={metaBadgeClassName(processMeta.className)}>{processMeta.label}</span>
                </div>
                <div className="mt-1 truncate text-xs text-slate-500">
                  学生编号 {task.patient.id} · 场次 {task.visitId} · 第 {task.sessionSequence} 次筛查
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={metaBadgeClassName(riskMeta.className)}>风险等级：{riskMeta.label}</span>
                  <span className={metaBadgeClassName(dataMeta.className)}>数据完备度：{dataMeta.label}</span>
                  <span className={metaBadgeClassName(reportMeta.className)}>报告状态：{reportMeta.label}</span>
                  <StatusTag status={task.status} className="h-6 px-2.5 text-[11px]" />
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">当前焦点</div>
              <div className="mt-2 text-sm font-medium leading-6 text-slate-900">{task.currentFocus}</div>
              <div className="mt-2 text-xs leading-5 text-slate-500">{task.reportConditionText}</div>
            </div>
          </div>

          <div className="xl:w-[360px]">
            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4 xl:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                <div className="text-slate-500">下一步动作</div>
                <div className="mt-1 font-semibold text-slate-900">{task.primaryAction}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                <div className="text-slate-500">缺失项</div>
                <div className="mt-1 font-semibold text-slate-900">{getMissingFieldText(task)}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                <div className="text-slate-500">模块完成</div>
                <div className="mt-1 font-semibold text-slate-900">{task.completedModules}/{task.totalModules}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                <div className="text-slate-500">最近更新</div>
                <div className="mt-1 font-semibold text-slate-900">{formatDate(task.updatedAt)}</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {task.modules.map((module) => (
                <span
                  key={module.toolId}
                  className={cn('inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-medium', moduleStatusClass(module.status))}
                >
                  {module.shortTitle}
                </span>
              ))}
            </div>

            <div className="mt-3">
              <ProgressBar value={task.completedModules} total={task.totalModules} />
            </div>
          </div>

          <div className="flex flex-col gap-2 xl:w-[220px]">
            <Button
              variant="primary"
              size="sm"
              icon={<ClipboardList size={15} />}
              iconPosition="left"
              onClick={handleStartEvaluation}
            >
              {task.primaryAction}
              <ChevronRight size={14} />
            </Button>
            <Button variant="secondary" size="sm" onClick={onOpen}>
              {task.secondaryAction}
            </Button>
            {canViewHistory ? (
              <Button variant="ghost" size="sm" onClick={handleViewHistory}>
                查看历史记录
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="lg" hover className="h-full border-slate-200 bg-white/95 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl text-base font-semibold text-white shadow-sm', getPatientColor(task.patient))}>
              {getPatientAvatar(task.patient)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-slate-900">{getPatientDisplayName(task.patient)}</div>
              <div className="mt-1 text-xs text-slate-500">学生编号 {task.patient.id}</div>
            </div>
          </div>
          <span className={metaBadgeClassName(processMeta.className)}>{processMeta.label}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={metaBadgeClassName(riskMeta.className)}>风险：{riskMeta.label}</span>
          <span className={metaBadgeClassName(dataMeta.className)}>数据：{dataMeta.label}</span>
          <span className={metaBadgeClassName(reportMeta.className)}>报告：{reportMeta.label}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">当前焦点</div>
          <div className="mt-2 text-sm font-medium leading-6 text-slate-900">{task.currentFocus}</div>
          <div className="mt-2 text-xs leading-5 text-slate-500">{task.reportConditionText}</div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:grid-cols-2">
          <div>
            <div className="text-xs text-slate-500">下一步动作</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{task.primaryAction}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">缺失项</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{getMissingFieldText(task)}</div>
          </div>
        </div>

        <ProgressBar value={task.completedModules} total={task.totalModules} />

        <div className="grid gap-2 sm:grid-cols-3">
          {task.modules.map((module) => (
            <div key={module.toolId} className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-900">{module.shortTitle}</span>
                <StatusTag status={module.status} className="h-6 px-2.5 text-[11px]" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={12} />
            最近更新 {formatDate(task.updatedAt)}
          </span>
          <Button variant="primary" size="md" icon={<ClipboardList size={15} />} iconPosition="left" onClick={handleStartEvaluation}>
            {task.primaryAction}
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
};
