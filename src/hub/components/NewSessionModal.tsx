import React, { useEffect, useState } from 'react';
import { CheckCircle, RefreshCw, Stethoscope, User, X } from 'lucide-react';
import { usePatientStore } from '@/store/usePatientStore';
import { useSessionStore } from '@/store/useSessionStore';
import { generatePatientId } from '@/lib/session-utils';
import { cn } from '@/lib/utils';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (patientId: string) => void;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({ isOpen, onClose, onStartSession }) => {
  const [name, setName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const addPatient = usePatientStore((state) => state.addPatient);
  const startSession = useSessionStore((state) => state.startSession);

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    generateNewId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const generateNewId = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setPatientId(generatePatientId());
      setIsGenerating(false);
    }, 200);
  };

  const handleConfirm = async () => {
    if (!patientId) return;

    setIsCreating(true);
    try {
      const patient = await addPatient(name.trim() || undefined, patientId);
      await startSession(patient.id);
      onStartSession(patient.id);
      onClose();
    } catch (error) {
      console.error('Failed to create patient/session:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="dialog-backdrop" onClick={onClose} />

      <div className="dialog-shell w-full max-w-md sm:max-w-xl">
        <div className="dialog-header">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-antey-primary/10 text-antey-primary">
              <Stethoscope size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">新增学生筛查对象</h2>
              <p className="mt-1 text-xs text-slate-500">创建学生后将自动开启本次筛查流程。</p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon min-h-[44px] min-w-[44px]" aria-label="close" type="button">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 sm:space-y-5 p-4 sm:p-5">
          <label className="block">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <User size={16} />
              学生姓名（可选）
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：张三"
              className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-antey-primary"
            />
          </label>

          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-700">学生编号</span>
              <button onClick={generateNewId} disabled={isGenerating} className="btn-secondary min-h-[44px] h-10 px-4 text-sm" type="button">
                <RefreshCw size={16} className={cn(isGenerating && 'animate-spin')} />
                刷新编号
              </button>
            </div>

            <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900 p-4 text-white">
              <div className="text-xl sm:text-2xl font-semibold tracking-[0.18em]">{patientId || '--'}</div>
              <div className="mt-1 text-xs text-slate-400">该编号将用于后续搜索、筛查任务匹配和报告归档。</div>
            </div>
          </div>
        </div>

        <div className="dialog-footer flex-col sm:flex-row gap-3">
          <button onClick={onClose} className="btn-secondary min-h-[44px] flex-1" type="button">取消</button>
          <button onClick={handleConfirm} disabled={isCreating || isGenerating} className={cn('btn-primary min-h-[44px] flex-1', (isCreating || isGenerating) && 'cursor-not-allowed opacity-50')} type="button">
            {isCreating ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {isCreating ? '创建中...' : '开始本次筛查'}
          </button>
        </div>
      </div>
    </div>
  );
};
