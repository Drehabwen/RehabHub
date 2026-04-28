import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Clock, Search, Activity, X } from 'lucide-react';
import { usePatientStore } from '@/store/usePatientStore';
import { useSessionStore } from '@/store/useSessionStore';
import { getRelativeTime } from '@/lib/session-utils';
import { cn } from '@/lib/utils';
import type { Patient } from '@/types/patient';
import {
  getPatientAvatar,
  getPatientColor,
  getPatientDisplayName,
} from '@/lib/patient-utils';

interface PatientSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPatient: (patient: Patient) => void;
}

export const PatientSearchModal: React.FC<PatientSearchModalProps> = ({ isOpen, onClose, onSelectPatient }) => {
  const [query, setQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const { searchPatients, loadPatients } = usePatientStore();
  const { loadSessions, startSession, getPatientSessions } = useSessionStore();

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setSelectedPatient(null);
    loadPatients();
    loadSessions();
  }, [isOpen, loadPatients, loadSessions]);

  const filteredPatients = searchPatients(query);

  const selectedSessions = useMemo(() => {
    if (!selectedPatient) return [];
    return getPatientSessions(selectedPatient.id).sort((a, b) => b.createdAt - a.createdAt);
  }, [selectedPatient, getPatientSessions]);

  const handleContinueSession = async () => {
    if (!selectedPatient) return;
    setIsCreatingSession(true);
    try {
      await startSession(selectedPatient.id);
      onSelectPatient(selectedPatient);
      onClose();
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="dialog-backdrop" onClick={onClose} />

      <div className="dialog-shell flex max-h-[90vh] w-full max-w-md sm:max-w-3xl flex-col">
        <div className="dialog-header">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-antey-primary/10 text-antey-primary">
              <Search size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">查找学生</h2>
              <p className="mt-1 text-xs text-slate-500">按姓名或编号搜索，并快速进入本次筛查流程。</p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon min-h-[44px] min-w-[44px]" aria-label="close" type="button">
            <X size={16} />
          </button>
        </div>

        <div className="border-b border-slate-200 p-3 sm:p-4">
          <label className="relative block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入学生姓名或编号"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm"
              autoFocus
            />
          </label>
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
          {!selectedPatient ? (
            <div className="space-y-2">
              {filteredPatients.length === 0 ? (
                <div className="state-panel">
                  <h3 className="text-base sm:text-lg">未找到匹配学生</h3>
                  <p className="text-sm">请检查搜索内容，或先新增学生筛查对象。</p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left hover:bg-slate-50"
                    type="button"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-white', getPatientColor(patient))}>
                        {getPatientAvatar(patient)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{getPatientDisplayName(patient)}</div>
                        <div className="truncate text-xs text-slate-500">{patient.id}</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{getRelativeTime(patient.createdAt)}</span>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <button onClick={() => setSelectedPatient(null)} className="btn-tertiary min-h-[44px] h-10 px-4 text-sm" type="button">
                <ChevronLeft size={16} />
                返回搜索结果
              </button>

              <section className="bento-card p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl font-semibold text-white', getPatientColor(selectedPatient))}>
                    {getPatientAvatar(selectedPatient)}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-slate-900">{getPatientDisplayName(selectedPatient)}</div>
                    <div className="text-sm text-slate-500">{selectedPatient.id}</div>
                  </div>
                </div>
              </section>

              <section className="bento-card p-3 sm:p-4">
                <div className="mb-2 text-sm font-semibold text-slate-900">历史筛查记录</div>
                {selectedSessions.length === 0 ? (
                  <p className="text-sm text-slate-500">暂无历史筛查记录。</p>
                ) : (
                  <div className="space-y-2">
                    {selectedSessions.slice(0, 6).map((session) => (
                      <div key={session.id} className="flex min-h-[44px] items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-slate-900">{session.id}</div>
                          <div className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Clock size={12} />
                            第 {session.sequence} 次筛查 · {getRelativeTime(session.createdAt)}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            onSelectPatient(selectedPatient);
                            onClose();
                          }}
                          className="btn-secondary min-h-[44px] h-10 px-4 text-sm"
                          type="button"
                        >
                          进入
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        {selectedPatient ? (
          <div className="dialog-footer flex-col sm:flex-row gap-3">
            <button onClick={onClose} className="btn-secondary min-h-[44px] flex-1" type="button">取消</button>
            <button onClick={handleContinueSession} disabled={isCreatingSession} className={cn('btn-primary min-h-[44px] flex-1', isCreatingSession && 'cursor-not-allowed opacity-50')} type="button">
              <Activity size={16} />
              {isCreatingSession ? '创建中...' : '开始本次筛查'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
