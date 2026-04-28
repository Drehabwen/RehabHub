import React from 'react';
import { Activity, ArrowLeft, BarChart3, FileText, Layers, Mic, Dumbbell } from 'lucide-react';
import { AssessmentCard, PageHeader, ProgressBar } from '@/components/workflow';
import { Button, Card } from '@/components/ui';
import type { Patient } from '@/types/patient';
import type { VisitTaskSummary, WorkflowToolId } from '../workflow';
import {
  dataCompletenessMeta,
  processStatusMeta,
  reportStatusMeta,
  riskLevelMeta,
} from '../workflow';
import {
  getPatientAvatar,
  getPatientColor,
  getPatientDisplayName,
} from '@/lib/patient-utils';
import { formatDate } from '@/lib/session-utils';
import { cn } from '@/lib/utils';

interface PatientToolboxProps {
  patient: Patient;
  visitTask: VisitTaskSummary | null;
  onSelectTool: (toolId: WorkflowToolId | 'training_plan') => void;
  onOpenReports: () => void;
  onOpenComparison: () => void;
  onBack: () => void;
  sessionCount: number;
  allowedToolIds?: Array<WorkflowToolId | 'training_plan'>;
  showComparison?: boolean;
  showReports?: boolean;
}

const iconMap = {
  vision3: Activity,
  rom: Layers,
  medvoice: Mic,
  training_plan: Dumbbell,
} as const;

const accentMap = {
  vision3: 'bg-blue-600 text-white',
  rom: 'bg-emerald-600 text-white',
  medvoice: 'bg-violet-600 text-white',
  training_plan: 'bg-orange-600 text-white',
} as const;

const metaBadgeClassName = (className: string) => cn(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium',
  className,
);

export const PatientToolbox: React.FC<PatientToolboxProps> = ({
  patient,
  visitTask,
  onSelectTool,
  onOpenReports,
  onOpenComparison,
  onBack,
  sessionCount,
  allowedToolIds,
  showComparison = true,
  showReports = true,
}) => {
  const comparisonEnabled = sessionCount > 1;
  const followupEnabled = allowedToolIds?.includes('training_plan') ?? false;
  const visibleModules = allowedToolIds?.length
    ? visitTask?.modules.filter((module) => allowedToolIds.includes(module.toolId)) ?? []
    : visitTask?.modules ?? [];

  if (!visitTask) {
    return (
      <div className="rehab-page custom-scrollbar">
        <div className="rehab-page-inner">
          <Card variant="default" padding="lg">
            <div className="text-sm text-slate-500">未能加载当前对象的筛查任务，请返回任务页后重试。</div>
          </Card>
        </div>
      </div>
    );
  }

  const processMeta = processStatusMeta[visitTask.processStatus];
  const riskMeta = riskLevelMeta[visitTask.riskLevel];
  const dataMeta = dataCompletenessMeta[visitTask.dataCompleteness];
  const reportMeta = reportStatusMeta[visitTask.reportStatus];

  return (
    <div className="rehab-page custom-scrollbar">
      <div className="rehab-page-inner space-y-5">
        <PageHeader
          eyebrow="学生处理中枢 / 证据采集 / 报告推进"
          title="学生处理中枢"
          description="本页承接单个学生的采集、补证、报告与复测动作。这里不是工具展示页，而是明确这个学生现在缺什么、下一步做什么。"
          summary={(
            <>
              <span className={metaBadgeClassName(processMeta.className)}>{processMeta.label}</span>
              <span className={metaBadgeClassName(riskMeta.className)}>风险等级：{riskMeta.label}</span>
              <span className={metaBadgeClassName(dataMeta.className)}>数据完备度：{dataMeta.label}</span>
              <span className={metaBadgeClassName(reportMeta.className)}>报告状态：{reportMeta.label}</span>
            </>
          )}
          actions={(
            <>
              <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={onBack}>返回筛查任务</Button>
              {showComparison ? (
                <Button variant="secondary" icon={<BarChart3 size={16} />} onClick={onOpenComparison} disabled={!comparisonEnabled}>查看前后对比</Button>
              ) : null}
              {showReports ? (
                <Button variant="primary" icon={<FileText size={16} />} onClick={onOpenReports}>进入报告与归档</Button>
              ) : null}
            </>
          )}
        />

        <Card variant="default" padding="lg" className="border-slate-200 bg-white/95 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="flex min-w-0 items-start gap-4">
              <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-sm', getPatientColor(patient))}>
                {getPatientAvatar(patient)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-slate-900">{getPatientDisplayName(patient)}</h2>
                  <span className="text-sm text-slate-400">ID {patient.id}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  当前处理焦点：{visitTask.currentFocus}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>筛查编号 {visitTask.visitId}</span>
                  <span>筛查场次 {Math.max(sessionCount, 1)}</span>
                  <span>最近更新 {formatDate(visitTask.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">正式报告条件</div>
              <p className="mt-1 text-sm leading-6 text-slate-500">{visitTask.reportConditionText}</p>
              <ProgressBar value={visitTask.completedModules} total={visitTask.totalModules} className="mt-4" />
              <div className="mt-4 flex flex-wrap gap-2">
                {(visitTask.missingFields.length ? visitTask.missingFields : ['无']).map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {visibleModules.map((module) => {
            const Icon = iconMap[module.toolId];
            return (
              <AssessmentCard
                key={module.toolId}
                icon={Icon}
                title={module.title}
                description={module.description}
                status={module.status}
                summary={module.latestAssessment ? '当前对象已存在该模块记录，可继续补充或复核。' : '当前对象尚未完成该模块，建议按流程尽快补齐。'}
                meta={module.latestCreatedAt ? `最近记录 ${formatDate(module.latestCreatedAt)}` : '暂无记录'}
                actionLabel={module.actionLabel}
                onAction={() => onSelectTool(module.toolId)}
                accentClassName={accentMap[module.toolId]}
                footer={(
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>记录数 {module.assessmentCount}</span>
                    <span>{module.status === 'completed' ? '可进入报告判断' : '完成后进入下一步'}</span>
                  </div>
                )}
              />
            );
          })}

          {followupEnabled ? (
            <AssessmentCard
              icon={Dumbbell}
              title="复测建议与跟踪动作"
              description="当正式报告形成后，用于整理复测建议、跟踪动作和家校沟通要点。"
              status={visitTask.hasFormalReport ? 'completed' : 'pending'}
              summary={visitTask.hasFormalReport ? '当前对象已形成正式报告，可继续整理复测计划。' : '建议先完成正式报告，再进入复测建议整理。'}
              meta={visitTask.reportConditionText}
              actionLabel="进入复测建议"
              onAction={() => onSelectTool('training_plan')}
              accentClassName="bg-brand-primary text-white"
              footer={(
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{visitTask.reportStatus}</span>
                  <span>{visitTask.processStatus === '待复测' ? '当前适合进入复测追踪' : '闭环后可继续完善'}</span>
                </div>
              )}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
};
