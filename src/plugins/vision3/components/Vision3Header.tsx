import React from 'react';
import { Camera, RotateCcw, Settings2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewType = 'front' | 'side' | 'back';

interface Vision3HeaderProps {
  isEntryMode: boolean;
  setIsEntryMode: (mode: boolean) => void;
  view: ViewType;
  setView: (view: ViewType) => void;
}

const viewLabels: Record<ViewType, string> = {
  front: '正面',
  side: '侧面',
  back: '背面',
};

export const Vision3Header: React.FC<Vision3HeaderProps> = ({
  isEntryMode,
  setIsEntryMode,
  view,
  setView,
}) => {
  return (
    <div className="bento-card flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white/95 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-primary">
          <Camera size={18} />
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-primary">Posture Screening</div>
          <div className="mt-1 text-base font-semibold text-slate-900">体态证据采集</div>
          <div className="text-xs text-slate-500">
            {isEntryMode ? '选择采集模式后进入体态与脊柱筛查流程。' : '当前页面用于体态证据采集与快速结果查看。'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-brand-primary/15 bg-brand-soft px-3 py-2 text-xs font-semibold text-brand-primary md:inline-flex">
          <ShieldCheck size={14} />
          筛查采集
        </div>

        {!isEntryMode ? (
          <>
            <div className="segmented-control">
              {(Object.keys(viewLabels) as ViewType[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setView(item)}
                  className={cn('segmented-control-tab', view === item ? 'segmented-control-tab-subtle' : 'segmented-control-tab-inactive')}
                >
                  {viewLabels[item]}
                </button>
              ))}
            </div>

            <button onClick={() => setIsEntryMode(true)} className="btn-secondary">
              <RotateCcw size={14} />
              返回模式选择
            </button>
          </>
        ) : null}

        <button className="btn-icon" aria-label="settings">
          <Settings2 size={16} />
        </button>
      </div>
    </div>
  );
};
