import React, { useEffect, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CircleDot,
  Layers3,
  ShieldCheck,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PoseLandmark } from '../vision3-utils';
import type { AssessmentType } from '../store/usePostureAssessmentStore';
import {
  VIEW_TEXTS,
  CAPTURE_STATUS_TEXTS,
  BUTTON_TEXTS,
  PANEL_TEXTS,
  POSITION_TEXTS,
  DATA_CAPTURE_TEXTS,
  RECORDING_TEXTS,
} from '../constants/uiText';

interface SteppedAssessmentOverlayProps {
  view: 'front' | 'side' | 'back';
  captureStatus: 'idle' | 'scanning' | 'countdown' | 'recording' | 'analyzing' | 'completed' | 'error';
  countdown: number;
  recordingProgress: number;
  isInPosition: boolean;
  steppedResults: Record<string, { timeSeriesLandmarks: PoseLandmark[][]; width: number; height: number; timestamp: number }>;
  assessmentType: AssessmentType;
  onStartCapture: () => void;
  onNextView: (assessmentType?: AssessmentType) => void;
  onRetake: () => void;
  onFinish: (assessmentType?: AssessmentType) => void;
  onReset: () => void;
}

export const SteppedAssessmentOverlay: React.FC<SteppedAssessmentOverlayProps> = ({
  view,
  captureStatus,
  countdown,
  recordingProgress,
  isInPosition,
  steppedResults,
  assessmentType,
  onStartCapture,
  onNextView,
  onRetake,
  onFinish,
  onReset,
}) => {
  const capturedCount = Object.keys(steppedResults).length;
  const currentCaptured = steppedResults[view];
  const isQuickAssessment = assessmentType === 'quick';
  const requiredViews = isQuickAssessment ? [view] : ['front', 'side', 'back'];
  const currentViewIndex = requiredViews.indexOf(view);
  const isLastView = currentViewIndex === requiredViews.length - 1;

  const [showSuccessCard, setShowSuccessCard] = useState(true);

  useEffect(() => {
    if (captureStatus === 'completed') {
      setShowSuccessCard(true);
      const timer = setTimeout(() => setShowSuccessCard(false), 2400);
      return () => clearTimeout(timer);
    }
    setShowSuccessCard(true);
  }, [captureStatus, view]);

  const renderStatusTitle = () => {
    if (captureStatus === 'idle') return `准备采集${VIEW_TEXTS[view].label}`;
    if (captureStatus === 'scanning') return isInPosition ? CAPTURE_STATUS_TEXTS.scanning.ready : CAPTURE_STATUS_TEXTS.scanning.notInPosition;
    if (captureStatus === 'countdown') return CAPTURE_STATUS_TEXTS.countdown(countdown);
    if (captureStatus === 'recording') return CAPTURE_STATUS_TEXTS.recording;
    if (captureStatus === 'completed') return CAPTURE_STATUS_TEXTS.completed(VIEW_TEXTS[view].label);
    if (captureStatus === 'analyzing') return CAPTURE_STATUS_TEXTS.analyzing;
    return '请重新检查采集环境';
  };

  const renderStatusHint = () => {
    if (captureStatus === 'idle') return '先确认站位和取景，再启动证据采集。';
    if (captureStatus === 'scanning') return isInPosition ? '人体已进入有效取景范围，可立即开始采集。' : '请保持全身可见并正对摄像头，便于完成初筛定位。';
    if (captureStatus === 'countdown') return '保持站姿稳定，系统即将开始采集时序数据。';
    if (captureStatus === 'recording') return '系统正在记录关键点轨迹，请保持姿态稳定直到进度完成。';
    if (captureStatus === 'completed') return '当前视角证据已保存，可继续下一视角或直接进入结果整理。';
    if (captureStatus === 'analyzing') return '系统正在整理本次体态证据，请稍候。';
    return '建议重置当前步骤后重新进行采集。';
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex flex-col justify-between p-4 md:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="pointer-events-auto max-w-2xl rounded-[24px] border border-slate-200/90 bg-white/92 px-4 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">
                {isQuickAssessment ? PANEL_TEXTS.progress.quick : PANEL_TEXTS.progress.standard}
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900">体态与脊柱证据采集</div>
              <div className="mt-1 text-sm text-slate-500">当前视角：{VIEW_TEXTS[view].label} · {VIEW_TEXTS[view].description}</div>
            </div>
            <div className="rounded-2xl border border-brand-primary/15 bg-brand-soft px-3 py-2 text-right">
              <div className="text-[11px] font-medium text-slate-500">当前进度</div>
              <div className="mt-1 text-xl font-semibold text-slate-900">{capturedCount}/{requiredViews.length}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {requiredViews.map((item) => {
              const isCaptured = Boolean(steppedResults[item]);
              const isActive = item === view;
              return (
                <div
                  key={item}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border px-3 py-2 transition-colors',
                    isActive
                      ? 'border-brand-primary bg-brand-soft'
                      : isCaptured
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-slate-200 bg-slate-50/90',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl',
                      isActive
                        ? 'bg-brand-primary text-white'
                        : isCaptured
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-500',
                    )}
                  >
                    {isCaptured ? <CheckCircle2 size={16} /> : <User size={16} />}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{item}</div>
                    <div className="text-sm font-semibold text-slate-900">{VIEW_TEXTS[item].label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-auto inline-flex items-center gap-2 self-start rounded-full border border-slate-200/90 bg-white/92 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <CircleDot size={14} className={isInPosition ? 'text-emerald-600' : 'text-amber-500'} />
          {isInPosition ? POSITION_TEXTS.locked : POSITION_TEXTS.scanning}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="pointer-events-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-4 py-2 text-sm text-slate-600 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <CircleAlert size={16} className="text-brand-primary" />
            {renderStatusHint()}
          </div>

          <h2 className={cn(
            'mt-6 font-light tracking-tight text-white drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]',
            captureStatus === 'countdown' ? 'text-7xl font-semibold tabular-nums md:text-8xl' : 'text-4xl md:text-6xl',
          )}>
            {renderStatusTitle()}
          </h2>

          {captureStatus === 'recording' ? (
            <div className="mx-auto mt-8 max-w-[440px] rounded-[28px] border border-slate-200/90 bg-white/92 px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold uppercase tracking-[0.16em] text-brand-primary">{RECORDING_TEXTS.label}</span>
                <span className="font-semibold text-slate-700">{Math.round(recordingProgress)}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-primary transition-[width] duration-100 ease-linear"
                  style={{ width: `${recordingProgress}%` }}
                />
              </div>
            </div>
          ) : null}

          {captureStatus === 'completed' && currentCaptured && showSuccessCard ? (
            <div className="mx-auto mt-8 max-w-[420px] rounded-[28px] border border-emerald-200 bg-white/94 px-5 py-5 shadow-[0_20px_44px_rgba(15,23,42,0.12)] backdrop-blur-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ShieldCheck size={28} />
              </div>
              <div className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{DATA_CAPTURE_TEXTS.captured}</div>
              <div className="mt-2 text-base font-semibold text-slate-900">{VIEW_TEXTS[view].label}证据已保存</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{DATA_CAPTURE_TEXTS.description}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-auto rounded-[32px] border border-slate-200/90 bg-white/92 px-4 py-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-sm md:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onReset} className="btn-secondary">
              {BUTTON_TEXTS.backToEntry}
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 md:inline-flex">
              <Layers3 size={14} className="text-brand-primary" />
              当前模式：{isQuickAssessment ? '快速复测' : '标准筛查'}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {captureStatus === 'completed' ? (
              <>
                <button onClick={onRetake} className="btn-secondary">
                  {BUTTON_TEXTS.retake}
                </button>
                <button onClick={() => onFinish(assessmentType)} className="btn-primary">
                  {isQuickAssessment ? BUTTON_TEXTS.generateReport : BUTTON_TEXTS.generateReportNow}
                </button>
                {!isQuickAssessment && !isLastView ? (
                  <button onClick={() => onNextView(assessmentType)} className="btn-secondary">
                    {BUTTON_TEXTS.nextStep(VIEW_TEXTS[requiredViews[currentViewIndex + 1]].label)}
                    <ChevronRight size={15} />
                  </button>
                ) : null}
              </>
            ) : (
              <button
                onClick={onStartCapture}
                disabled={captureStatus !== 'idle'}
                className={cn('btn-primary min-w-[180px] justify-center', captureStatus !== 'idle' && 'opacity-50')}
              >
                <Camera size={16} />
                {captureStatus === 'idle' ? BUTTON_TEXTS.startAutoCapture : BUTTON_TEXTS.capturing}
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">进度</span>
            <div className="flex gap-1.5">
              {requiredViews.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1.5 w-9 rounded-full transition-colors',
                    index < capturedCount ? 'bg-brand-primary' : 'bg-slate-200',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
