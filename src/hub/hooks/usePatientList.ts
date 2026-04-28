import { useMemo } from 'react';
import { getRelativeTime } from '@/lib/session-utils';
import type { Patient } from '@/types/patient';
import type { Session } from '@/types/session';
import type { Assessment } from '@/types/assessment';
import type { SessionReportOutput } from '@/types/report-center';
import type { PatientStatus } from '../types';
import { buildVisitTaskList, type VisitTaskSummary } from '../workflow';

export interface PatientWithStatus extends Patient {
  status: PatientStatus;
  lastSession?: Session;
  visitTask: VisitTaskSummary;
}

interface UsePatientListOptions {
  patients: Patient[];
  assessments: Assessment[];
  reports: SessionReportOutput[];
  getPatientSessions: (patientId: string) => Session[];
}

export function usePatientList({ patients, assessments, reports, getPatientSessions }: UsePatientListOptions) {
  const visitTasks = useMemo(
    () => buildVisitTaskList(patients, getPatientSessions, assessments, reports),
    [patients, getPatientSessions, assessments, reports],
  );

  const taskByPatientId = useMemo(() => {
    const map = new Map<string, VisitTaskSummary>();
    visitTasks.forEach((task) => map.set(task.patient.id, task));
    return map;
  }, [visitTasks]);

  const patientsWithStatus = useMemo<PatientWithStatus[]>(() => {
    return patients.map((patient) => {
      const patientSessions = getPatientSessions(patient.id);
      const lastSession = [...patientSessions].sort((left, right) => right.createdAt - left.createdAt)[0];
      const visitTask = taskByPatientId.get(patient.id) ?? buildVisitTaskList([patient], getPatientSessions, assessments, reports)[0];

      const status: PatientStatus = visitTask.processStatus === '已归档'
        ? 'completed'
        : visitTask.processStatus === '待报告'
          ? 'report'
        : visitTask.hasAnyAssessment
          ? 'assessing'
          : 'pending';

      return { ...patient, status, lastSession, visitTask };
    });
  }, [patients, getPatientSessions, taskByPatientId, assessments, reports]);

  const stats = useMemo(() => ({
    totalPatients: visitTasks.length,
    pending: visitTasks.filter((task) => ['待初筛', '初筛中', '待标准筛查'].includes(task.processStatus)).length,
    inProgress: visitTasks.filter((task) => ['待补采集', '待复核'].includes(task.processStatus)).length,
    readyForReport: visitTasks.filter((task) => task.processStatus === '待报告').length,
    retestPending: visitTasks.filter((task) => task.processStatus === '待复测').length,
    archived: visitTasks.filter((task) => task.processStatus === '已归档').length,
    highRisk: visitTasks.filter((task) => task.riskLevel === '高风险').length,
    completed: visitTasks.filter((task) => task.processStatus === '已归档').length,
  }), [visitTasks]);

  return {
    patientsWithStatus,
    visitTasks,
    stats,
    getVisitTaskByPatientId: (patientId: string) => taskByPatientId.get(patientId) ?? null,
    getPatientLabel: (patient: PatientWithStatus) =>
      patient.lastSession
        ? `最近监控：${getRelativeTime(patient.lastSession.createdAt)}`
        : '尚未开始监控',
  };
}

export function getStatusLabel(status: PatientStatus): string {
  const labels: Record<PatientStatus, string> = {
    pending: '待监控',
    assessing: '评估中',
    report: '待报告',
    completed: '已完成',
  };
  return labels[status];
}

export function getStatusColor(status: PatientStatus): string {
  const colors: Record<PatientStatus, string> = {
    pending: 'bg-slate-100 text-slate-600',
    assessing: 'bg-blue-50 text-blue-600',
    report: 'bg-amber-50 text-amber-600',
    completed: 'bg-emerald-50 text-emerald-600',
  };
  return colors[status];
}
