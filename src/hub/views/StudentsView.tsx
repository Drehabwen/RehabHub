import React, { useMemo, useState } from 'react';
import { ArrowRight, Clock3, FileText, Search, ShieldAlert, UserSquare2 } from 'lucide-react';
import type { Patient } from '@/types/patient';
import type { VisitTaskSummary } from '../workflow';
import {
  dataCompletenessMeta,
  processStatusMeta,
  reportStatusMeta,
  riskLevelMeta,
} from '../workflow';
import { PageHeader } from '@/components/workflow';
import { Button, Card } from '@/components/ui';
import { formatDate } from '@/lib/session-utils';
import { cn } from '@/lib/utils';

interface StudentsViewProps {
  patients: Patient[];
  visitTasks: VisitTaskSummary[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
  onOpenScreening: (patient: Patient) => void;
  onOpenReports: (patient: Patient) => void;
}

const metaBadgeClassName = (className: string) => cn(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium',
  className,
);

export const StudentsView: React.FC<StudentsViewProps> = ({
  patients,
  visitTasks,
  selectedPatient,
  onSelectPatient,
  onOpenScreening,
  onOpenReports,
}) => {
  const [keyword, setKeyword] = useState('');

  const taskMap = useMemo(
    () => new Map(visitTasks.map((task) => [task.patient.id, task])),
    [visitTasks],
  );

  const filteredPatients = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter((patient) => (
      patient.id.toLowerCase().includes(query)
      || (patient.name ?? '').toLowerCase().includes(query)
    ));
  }, [keyword, patients]);

  const activeTask = selectedPatient ? taskMap.get(selectedPatient.id) ?? null : null;
  const processMeta = activeTask ? processStatusMeta[activeTask.processStatus] : null;
  const riskMeta = activeTask ? riskLevelMeta[activeTask.riskLevel] : null;
  const dataMeta = activeTask ? dataCompletenessMeta[activeTask.dataCompleteness] : null;
  const reportMeta = activeTask ? reportStatusMeta[activeTask.reportStatus] : null;

  return (
    <div className="rehab-page custom-scrollbar">
      <div className="rehab-page-inner space-y-5">
        <PageHeader
          eyebrow="学生中心 / 单对象处理中枢 / 历史追踪"
          title="学生中心"
          description=""
          summary={( 
            <>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                总人数 {patients.length}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                筛查中 {visitTasks.filter((task) => task.hasAnyAssessment).length}
              </span>
            </>
          )}
        />

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <Card variant="default" padding="md" className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3">
              <label className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="搜索学生姓名或编号"
                  className="field-input pl-10"
                />
              </label>
            </div>

            <div className="mt-4 space-y-3">
              {filteredPatients.map((patient) => {
                const task = taskMap.get(patient.id);
                const process = task ? processStatusMeta[task.processStatus] : null;
                const risk = task ? riskLevelMeta[task.riskLevel] : null;
                const active = selectedPatient?.id === patient.id;

                return (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => onSelectPatient(patient)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                      active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className={`truncate text-sm font-semibold ${active ? 'text-white' : 'text-slate-900'}`}>{patient.name || patient.id}</div>
                        <div className={`mt-1 text-xs ${active ? 'text-slate-300' : 'text-slate-500'}`}>编号 {patient.id}</div>
                      </div>
                      {process ? (
                        <span className={cn(
                          'inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium',
                          active ? 'border-white/15 bg-white/10 text-white' : process.className,
                        )}
                        >
                          {process.label}
                        </span>
                      ) : (
                        <span className={cn(
                          'inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium',
                          active ? 'border-white/15 bg-white/10 text-white' : 'border-slate-200 bg-white text-slate-500',
                        )}
                        >
                          未进入筛查
                        </span>
                      )}
                    </div>

                    <div className={`mt-3 flex flex-wrap gap-2 text-xs ${active ? 'text-slate-200' : 'text-slate-500'}`}>
                      <span>场次 {task?.sessionSequence ?? 0}</span>
                      <span>模块 {task?.completedModules ?? 0}/{task?.totalModules ?? 4}</span>
                      {risk ? (
                        <span className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium',
                          active ? 'border-white/15 bg-white/10 text-white' : risk.className,
                        )}
                        >
                          {risk.label}
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card variant="default" padding="lg" className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            {!selectedPatient ? (
              <div className="flex min-h-[420px] items-center justify-center">
                <div className="text-center">
                  <UserSquare2 className="mx-auto text-slate-300" size={36} />
                  <div className="mt-4 text-lg font-semibold text-slate-900">选择一个学生</div>
                  <p className="mt-2 text-sm text-slate-500">左侧选择学生后，这里会显示当前风险、数据完备度、正式报告条件和下一步动作。</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Student Workspace</div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{selectedPatient.name || selectedPatient.id}</h2>
                    <p className="mt-2 text-sm text-slate-500">编号 {selectedPatient.id} · 最近更新 {formatDate(selectedPatient.updatedAt)}</p>
                  </div>
                  {processMeta ? <span className={metaBadgeClassName(processMeta.className)}>{processMeta.label}</span> : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {riskMeta ? <span className={metaBadgeClassName(riskMeta.className)}>风险等级：{riskMeta.label}</span> : null}
                  {dataMeta ? <span className={metaBadgeClassName(dataMeta.className)}>数据完备度：{dataMeta.label}</span> : null}
                  {reportMeta ? <span className={metaBadgeClassName(reportMeta.className)}>报告状态：{reportMeta.label}</span> : null}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Clock3 size={16} className="text-slate-500" />
                    <div className="mt-3 text-xs text-slate-500">最近场次</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">第 {activeTask?.sessionSequence ?? 0} 次</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <ShieldAlert size={16} className="text-slate-500" />
                    <div className="mt-3 text-xs text-slate-500">模块完成</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{activeTask?.completedModules ?? 0}/{activeTask?.totalModules ?? 4}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <FileText size={16} className="text-slate-500" />
                    <div className="mt-3 text-xs text-slate-500">正式报告条件</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{activeTask?.reportEligible ? '已满足' : '未满足'}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <ArrowRight size={16} className="text-slate-500" />
                    <div className="mt-3 text-xs text-slate-500">下一步动作</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{activeTask?.primaryAction ?? '待进入流程'}</div>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1fr_0.92fr]">
                  <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,1))] p-5">
                    <div className="text-sm font-semibold text-slate-900">当前焦点</div>
                    <div className="mt-3 text-sm leading-6 text-slate-700">
                      {activeTask?.currentFocus ?? '当前尚未进入专题筛查流程。'}
                    </div>

                    <div className="mt-5 text-sm font-semibold text-slate-900">报告条件判断</div>
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                      {activeTask?.reportConditionText ?? '尚未形成正式报告条件判断。'}
                    </div>

                    <div className="mt-5 text-sm font-semibold text-slate-900">缺失项</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(activeTask?.missingFields.length ? activeTask.missingFields : ['无']).map((item) => (
                        <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <div className="text-sm font-semibold text-slate-900">处理中枢</div>
                    <div className="mt-3 space-y-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">当前动作</div>
                        <div className="mt-2 text-sm font-medium text-slate-900">{activeTask?.primaryAction ?? '进入筛查流程'}</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">辅助动作</div>
                        <div className="mt-2 text-sm font-medium text-slate-900">{activeTask?.secondaryAction ?? '查看学生详情'}</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">更新时间</div>
                        <div className="mt-2 text-sm font-medium text-slate-900">{activeTask ? formatDate(activeTask.updatedAt) : formatDate(selectedPatient.updatedAt)}</div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Button variant="primary" onClick={() => onOpenScreening(selectedPatient)}>
                        {activeTask?.primaryAction ?? '进入筛查任务'}
                        <ArrowRight size={14} />
                      </Button>
                      <Button variant="secondary" onClick={() => onOpenReports(selectedPatient)}>
                        {activeTask?.secondaryAction ?? '查看报告与归档'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
};
