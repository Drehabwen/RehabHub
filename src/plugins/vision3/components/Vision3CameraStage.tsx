import React from 'react';
import { Maximize2, Video, VideoOff, Scan, RotateCcw, ArrowLeft, Square, Play, RefreshCw, CheckCircle2, Layers, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import BaseWebcamView from '@/components/shared/BaseWebcamView';
import { PostureWorkbench } from './PostureWorkbench';
import { ROMWorkbench } from './ROMWorkbench';
import { AssessmentOverlay } from './AssessmentOverlay';
import { SteppedAssessmentOverlay } from './SteppedAssessmentOverlay';
import { VisualAnnotation, HeadAxes, PoseLandmark } from '../vision3-utils';
import { ActiveMeasurement } from '@/store/useMeasurementStore';
import { AssessmentType } from '../store/usePostureAssessmentStore';
import { BUTTON_TEXTS, CAPTURE_STATUS_TEXTS, CAMERA_TEXTS, MEASUREMENT_TEXTS } from '../constants/uiText';
import { COLORS, SIZES, ANIMATIONS, TRANSITIONS, SHADOWS, BACKDROP } from '@/constants/uiStyles';

export type ViewType = 'front' | 'side' | 'back';
export type CaptureStatus = 'idle' | 'scanning' | 'countdown' | 'recording' | 'analyzing' | 'completed' | 'error';
export type StepStatus = 'idle' | 'capturing' | 'analyzing' | 'completed';
export type AssessmentMode = 'stepped' | 'realtime';

export interface SteppedResults {
  [key: string]: {
    timeSeriesLandmarks: PoseLandmark[][];
    width: number;
    height: number;
    timestamp: number;
  };
}

interface Vision3CameraStageProps {
  videoContainerRef: React.RefObject<HTMLDivElement>;
  isFullscreen: boolean;
  isCameraOn: boolean;
  isMirrored: boolean;
  showHeadAxes: boolean;
  annotations: VisualAnnotation[];
  headAxes: HeadAxes | null;
  onResults?: (results: unknown, videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) => void;
  activeTab: 'posture' | 'rom';
  assessmentMode: AssessmentMode;
  assessmentType: AssessmentType;
  captureStatus: CaptureStatus;
  step: string;
  countdown: number;
  isInPosition: boolean;
  recordingProgress: number;
  view: ViewType;
  steppedResults: SteppedResults;
  setSteppedResults: React.Dispatch<React.SetStateAction<SteppedResults>>;
  setCaptureStatus: React.Dispatch<React.SetStateAction<CaptureStatus>>;
  toggleFullscreen: () => void;
  handleStartCapture: () => void;
  handleNextView: (assessmentType?: AssessmentType) => void;
  handleFinishStepped: (assessmentType?: AssessmentType) => void;
  handleResetToEntry: () => void;
  activeMeasurements: ActiveMeasurement[];
  isMeasuring: boolean;
  startMeasurement: () => void;
  stopMeasurement: () => void;
  resetMeasurement: () => void;
  setIsCameraOn: (enabled: boolean) => void;
  setView: (view: ViewType) => void;
  simulateMockCapture?: () => void;
  compact?: boolean;
}

export const Vision3CameraStage: React.FC<Vision3CameraStageProps> = ({
  videoContainerRef,
  isFullscreen,
  isCameraOn,
  isMirrored,
  showHeadAxes,
  annotations,
  headAxes,
  onResults,
  activeTab,
  assessmentMode,
  assessmentType,
  captureStatus,
  step,
  countdown,
  isInPosition,
  recordingProgress,
  view,
  steppedResults,
  setSteppedResults,
  setCaptureStatus,
  toggleFullscreen,
  handleStartCapture,
  handleNextView,
  handleFinishStepped,
  handleResetToEntry,
  activeMeasurements,
  isMeasuring,
  startMeasurement,
  stopMeasurement,
  resetMeasurement,
  setIsCameraOn,
  setView,
  simulateMockCapture,
  compact = false
}) => {
  const viewLabelMap: Record<ViewType, string> = {
    front: '\u6b63\u9762',
    side: '\u4fa7\u9762',
    back: '\u80cc\u9762',
  };
  const iconControlClass = 'flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-2xl transition-all hover:scale-[1.03]';
  const whiteGlassChipClass = 'inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600';
  const overlayControlBaseClass = cn(
    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  );
  const primaryIconControlClass = `${iconControlClass} ${overlayControlBaseClass}`;
  const fullscreenButtonClass = 'absolute right-4 top-4 z-40 rounded-2xl border border-slate-200 bg-white/92 p-2.5 text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all hover:bg-white hover:text-slate-700';
  const statusPanelClass = 'flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white/92 px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur-sm';
  const completedSummaryClass = 'rounded-[1.5rem] border border-slate-200 bg-white/94 p-4 text-slate-900 shadow-[0_18px_42px_rgba(15,23,42,0.12)] backdrop-blur-sm';
  const cameraToggleClass = (enabled: boolean) =>
    enabled
      ? `${primaryIconControlClass}`
      : 'flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600';
  const posturePrimaryActionClass = (enabled: boolean) =>
    enabled
      ? 'flex h-12 items-center gap-2 rounded-2xl bg-brand-primary px-5 text-sm font-semibold text-white transition-all hover:bg-brand-primary/90'
      : 'flex h-12 cursor-not-allowed items-center gap-2 rounded-2xl bg-slate-200 px-5 text-sm font-semibold text-slate-400';
  const measureActionClass = (active: boolean) =>
    cn(
      'flex h-12 items-center gap-2 rounded-2xl px-5 text-sm font-semibold transition-all',
      active ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-brand-primary text-white hover:bg-brand-primary/90',
    );
  const isCompactCompleted = compact && captureStatus === 'completed';

  return (
    <div ref={videoContainerRef} className={cn(
      'bento-card group relative overflow-hidden border border-slate-200 bg-slate-100 transition-all duration-500',
      compact ? "!rounded-[2rem] min-h-[260px] md:min-h-[320px]" : "!rounded-[3.5rem] min-h-[300px] xs:min-h-[400px] md:min-h-[500px]",
      isFullscreen ? "fixed inset-0 z-50 !rounded-none" : "col-span-12 lg:col-span-8 row-span-4 lg:row-span-6"
    )}>
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
        backgroundImage: 'radial-gradient(circle, rgba(61,122,92,0.35) 1px, transparent 1px)', 
        backgroundSize: '36px 36px' 
      }} />
      
      <BaseWebcamView 
        onResults={onResults} 
        isCameraOn={isCameraOn}
        isMirrored={isMirrored}
        showSkeleton={isCameraOn}
        annotations={annotations}
        headAxes={showHeadAxes ? headAxes : null}
        className={cn(
          'w-full h-full object-cover',
          compact ? 'transition-none' : 'transition-opacity duration-700'
        )}
      />

      {/* Phase 4: 评估交互层 */}
      {(captureStatus === 'analyzing' || assessmentMode === 'realtime') ? (
        <AssessmentOverlay />
      ) : !isCompactCompleted ? (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <SteppedAssessmentOverlay 
            view={view}
            captureStatus={captureStatus}
            countdown={countdown}
            recordingProgress={recordingProgress}
            isInPosition={isInPosition}
            steppedResults={steppedResults}
            assessmentType={assessmentType}
            onStartCapture={handleStartCapture}
            onNextView={handleNextView}
            onRetake={() => {
              const newResults = { ...steppedResults };
              delete newResults[view];
              setSteppedResults(newResults);
              setCaptureStatus('idle');
            }}
            onFinish={handleFinishStepped}
            onReset={handleResetToEntry}
          />
        </div>
      ) : null}

      {/* Fullscreen Toggle Button */}
      {!isCompactCompleted ? (
        <button 
          onClick={toggleFullscreen}
          className={cn(
            fullscreenButtonClass,
            compact ? 'top-4 right-4 p-2.5' : 'top-6 right-6 p-3'
          )}
        >
          {isFullscreen ? <Maximize2 size={20} className="rotate-180" /> : <Maximize2 size={20} />}
        </button>
      ) : null}
      
      {/* AI Scanning Effect */}
      {isCameraOn && !compact && captureStatus !== 'completed' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 h-[1px] w-full animate-scan bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(61,122,92,0.08)_0%,transparent_72%)]" />
          
          {/* Corner Accents */}
          <div className="absolute left-8 top-8 h-10 w-10 rounded-tl-2xl border-l-2 border-t-2 border-brand-primary/30" />
          <div className="absolute right-8 top-8 h-10 w-10 rounded-tr-2xl border-r-2 border-t-2 border-brand-primary/30" />
          <div className="absolute bottom-8 left-8 h-10 w-10 rounded-bl-2xl border-b-2 border-l-2 border-brand-primary/30" />
          <div className="absolute bottom-8 right-8 h-10 w-10 rounded-br-2xl border-b-2 border-r-2 border-brand-primary/30" />
        </div>
      )}
      
      {/* Bento Overlay: Status Indicator */}
      {!isCompactCompleted ? (
        <div className={cn(`absolute flex items-center ${SIZES.gap.lg}`, compact ? 'top-4 left-4' : 'top-10 left-10')}>
          <div className={cn(
            statusPanelClass,
            compact ? 'px-3 py-2' : SIZES.padding.lg
          )}>
            <div className="relative">
              <div className={cn('h-3 w-3 rounded-full', isCameraOn ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.55)]' : 'bg-rose-500')} />
              {isCameraOn && <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping" />}
            </div>
            <div className="flex flex-col">
              <span className={`${compact ? 'text-[8px]' : SIZES.font.sm} mb-1 font-semibold uppercase tracking-[0.22em] leading-none text-brand-primary/80`}>
                采集状态
              </span>
              <span className={`${compact ? 'text-[10px]' : SIZES.font.lg} font-semibold leading-none tracking-[0.08em] text-slate-900`}>
                {activeTab === 'posture' ? (compact ? '体态采集核心' : '体态与脊柱采集引擎') : '关节活动采集引擎'} v3.2
              </span>
            </div>
            {simulateMockCapture && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  simulateMockCapture();
                }}
                className="ml-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase text-amber-700 transition-colors hover:bg-amber-100"
                title={CAMERA_TEXTS.mockTest}
              >
                模拟
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Floating Controls: Workbench Components */}
      {activeTab === 'posture' ? (
        step === 'idle' && !compact && (
          <PostureWorkbench 
            captureStatus={assessmentMode === 'realtime' ? captureStatus : 'idle'} 
            countdown={countdown} 
            isInPosition={isInPosition} 
          />
        )
      ) : (
        !compact && <ROMWorkbench 
          activeMeasurements={activeMeasurements} 
          isMeasuring={isMeasuring} 
        />
      )}

      {captureStatus === 'completed' ? (
        <div className={cn(
          'absolute left-4 right-4 bottom-4 z-30',
          compact ? '' : 'md:left-6 md:right-6 md:bottom-6'
        )}>
          <div className={cn(
            completedSummaryClass,
            isCompactCompleted ? 'rounded-[1.35rem] bg-black/62 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)]' : null,
          )}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  <CheckCircle2 size={12} />
                  {'\u5df2\u5b8c\u6210'}
                </div>
                <h3 className={cn('font-semibold text-slate-900', isCompactCompleted ? 'mt-2 text-base' : 'mt-3 text-lg')}>
                  {'\u62cd\u6444\u4e0e\u5206\u6790\u5df2\u7ed3\u675f'}
                </h3>
                <p className={cn('mt-1 text-sm text-slate-500', isCompactCompleted ? 'text-xs leading-5' : null)}>
                  {isCompactCompleted
                    ? '\u5df2\u4fdd\u7559\u5f53\u524d\u89c6\u56fe\u9884\u89c8\uff0c\u53f3\u4fa7\u76f4\u63a5\u9605\u8bfb\u672c\u6b21\u7ed3\u679c\u3002'
                    : '\u5de6\u4fa7\u4fdd\u7559\u5f53\u524d\u89c6\u56fe\u9884\u89c8\uff0c\u53f3\u4fa7\u53ef\u7ee7\u7eed\u9605\u8bfb\u62a5\u544a\u3002'}
                </p>
              </div>

              <div className={cn('flex flex-wrap items-center justify-end gap-2', isCompactCompleted ? 'max-w-[44%]' : null)}>
                <span className={`${whiteGlassChipClass} gap-1.5`}>
                  {assessmentType === 'quick' ? <Zap size={12} /> : <Layers size={12} />}
                  {assessmentType === 'quick' ? '\u5feb\u901f\u8bc4\u4f30' : '\u6807\u51c6\u8bc4\u4f30'}
                </span>
                <span className={whiteGlassChipClass}>
                  {viewLabelMap[view]}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Floating Controls: Ultra Premium Glassmorphism (Only in Real-time mode) */}
      {assessmentMode === 'realtime' && (
        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-6 rounded-[28px] border border-slate-200 bg-white/94 px-4 py-4 opacity-0 shadow-[0_18px_42px_rgba(15,23,42,0.12)] ring-1 ring-slate-100 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className={`flex items-center ${SIZES.gap.lg}`}>
            <button 
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={cn(
                `w-16 h-16 rounded-[1.5rem] flex flex-col items-center justify-center gap-1.5 ${TRANSITIONS.medium} relative group/btn`,
                cameraToggleClass(isCameraOn)
              )}
            >
              {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
                <span className="text-[11px] font-medium text-slate-500">{isCameraOn ? CAMERA_TEXTS.close : CAMERA_TEXTS.open}</span>
                {isCameraOn && <span className={`absolute top-2 right-2 ${SIZES.size.sm} ${COLORS.success.emeraldLight} ${SIZES.radius.full} animate-pulse`} />}
              </button>
          </div>
          
          <div className="h-12 w-px bg-slate-200" />
          
          {activeTab === 'posture' ? (
            <div className={`flex items-center ${SIZES.gap.xl}`}>
              <button 
                onClick={() => setCaptureStatus('countdown')}
                disabled={captureStatus !== 'idle'}
                className={posturePrimaryActionClass(captureStatus === 'idle')}
              >
                <Scan size={24} className={cn(captureStatus === 'scanning' && "animate-spin")} />
                {captureStatus === 'idle' ? BUTTON_TEXTS.startScan : captureStatus === 'countdown' ? BUTTON_TEXTS.preparing : CAPTURE_STATUS_TEXTS.analyzing}
              </button>
              
              <button 
                onClick={() => setView(view === 'front' ? 'side' : view === 'side' ? 'back' : 'front')}
                className={primaryIconControlClass}
              >
                <RotateCcw size={20} className="rotate-180" />
                <span className="text-[11px] font-medium text-slate-500">{MEASUREMENT_TEXTS.switchView}</span>
              </button>

              <button 
                onClick={handleResetToEntry}
                className={`${iconControlClass} border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700`}
              >
                <ArrowLeft size={20} />
                <span className="text-[11px] font-medium">{MEASUREMENT_TEXTS.back}</span>
              </button>
            </div>
          ) : (
            <div className={`flex items-center ${SIZES.gap.xl}`}>
              <button 
                onClick={() => isMeasuring ? stopMeasurement() : startMeasurement()}
                className={measureActionClass(isMeasuring)}
              >
                {isMeasuring ? <Square size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                {isMeasuring ? MEASUREMENT_TEXTS.stop : MEASUREMENT_TEXTS.start}
              </button>

              <button 
                onClick={() => resetMeasurement()}
                className={primaryIconControlClass}
              >
                <RefreshCw size={20} />
                <span className="text-[11px] font-medium text-slate-500">{MEASUREMENT_TEXTS.reset}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
