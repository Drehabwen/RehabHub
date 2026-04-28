import React, { useMemo } from 'react';
import { Building2, School, Settings2, ShieldCheck, Users } from 'lucide-react';
import type { Assessment } from '@/types/assessment';
import type { Session } from '@/types/session';
import type { VisitTaskSummary } from '../workflow';
import { PageHeader } from '@/components/workflow';
import { Button, Card } from '@/components/ui';

interface OrganizationViewProps {
  sessions: Session[];
  assessments: Assessment[];
  visitTasks: VisitTaskSummary[];
  onOpenSettings: () => void;
}

export const OrganizationView: React.FC<OrganizationViewProps> = ({
  sessions,
  assessments,
  visitTasks,
  onOpenSettings,
}) => {
  const metrics = useMemo(() => ({
    studentCount: visitTasks.length,
    sessionCount: sessions.length,
    assessmentCount: assessments.length,
    archivedCount: visitTasks.filter((task) => task.processStatus === '已归档').length,
    blockedCount: visitTasks.filter((task) => ['待补采集', '待复核'].includes(task.processStatus)).length,
  }), [assessments.length, sessions.length, visitTasks]);

  return (
    <div className="rehab-page custom-scrollbar">
      <div className="rehab-page-inner space-y-5">
        <PageHeader
          eyebrow="机构管理 / 组织结构 / 阈值与规则"
          title="机构管理"
          description="机构管理不是数据堆积页，而是给学校、机构和执行团队提供组织入口、规则配置和治理视角，确保筛查闭环可持续运转。"
          actions={(
            <Button variant="secondary" onClick={onOpenSettings}>
              <Settings2 size={15} />
              打开系统设置
            </Button>
          )}
        />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: '学生对象', value: metrics.studentCount, icon: Users, accent: 'bg-slate-900 text-white' },
            { label: '筛查会话', value: metrics.sessionCount, icon: Building2, accent: 'bg-blue-50 text-blue-700' },
            { label: '证据记录', value: metrics.assessmentCount, icon: School, accent: 'bg-emerald-50 text-emerald-700' },
            { label: '已归档', value: metrics.archivedCount, icon: ShieldCheck, accent: 'bg-violet-50 text-violet-700' },
            { label: '流程阻塞', value: metrics.blockedCount, icon: Settings2, accent: 'bg-amber-50 text-amber-700' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label} variant="default" padding="md" className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[30px] font-semibold leading-none text-slate-900 tabular-nums">{card.value}</div>
                    <div className="mt-2 text-sm text-slate-500">{card.label}</div>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${card.accent}`}>
                    <Icon size={18} />
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Card variant="default" padding="lg" className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="text-sm font-semibold text-slate-900">当前机构能力</div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>机构页负责承载学校、班级、角色、筛查规则和导出规范，不再把这类能力散落在弹窗或历史设置页里。</p>
              <p>这一页的价值不是展示总数，而是帮助机构判断筛查流程是否顺畅、哪里在卡住、哪些规则需要调整。</p>
            </div>
          </Card>

          <Card variant="default" padding="lg" className="border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="text-sm font-semibold text-slate-900">下一步机构化建设</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>组织与班级结构建模</li>
              <li>机构角色与访问控制</li>
              <li>正式报告阈值与规则配置</li>
              <li>导出、审计和家校授权链路</li>
            </ul>
          </Card>

          <Card variant="default" padding="lg" className="border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,1))] shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="text-sm font-semibold text-slate-900">当前治理重点</div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>优先保证流程状态、数据完备度、报告门槛和复测追踪四套规则全系统一致。</p>
              <p>真正的机构化价值在于让不同角色都知道“哪些对象卡住了，谁该继续推进”。</p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};
