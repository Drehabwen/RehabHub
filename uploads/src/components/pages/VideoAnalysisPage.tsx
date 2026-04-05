import React, { useState, useRef, useEffect } from 'react';

import { colors, typography } from '../../theme';
import { useNavigation, useNavigationParams } from '../../contexts/NavigationContext';
import { FmsProcessor } from '../../services/assessment/fmsProcessor';
import Button from '../ui/Button';
import { useCamera } from '../../hooks/useCamera';
import SkeletonVisualizer from '../../shared/components/SkeletonVisualizer';
import { postPoseTelemetry } from '../../services/api';
import { usePoseEstimation } from '../../hooks/usePoseEstimation';

const VideoAnalysisPage: React.FC = () => {
  const { navigateTo, goBack } = useNavigation();
  const { getParams, clearParams } = useNavigationParams<{ movement?: { id: string; name: string } }>();
  const [selectedMovement, setSelectedMovement] = useState<{ id: string; name: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { videoRef, status } = useCamera();
  const { keypoints, movementEvaluation, processFrame, fps } = usePoseEstimation();
  const [currentView, setCurrentView] = useState<'front' | 'side' | 'oblique45'>('side');
  const uploadedVideoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [overlaySize, setOverlaySize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const videoURL = URL.createObjectURL(file);
      if (uploadedVideoRef.current) {
        uploadedVideoRef.current.src = videoURL;
      }
    }
  };

  useEffect(() => {
    const params = getParams();
    if (params && params.movement) {
      setSelectedMovement(params.movement);
      // Clear params to prevent reuse on refresh/navigation
      clearParams();
    }
  }, [getParams, clearParams]);

  // 同步骨骼叠加层尺寸与视频预览尺寸
  useEffect(() => {
    const updateSize = () => {
      const el = (videoRef.current as HTMLVideoElement) || null;
      if (el) {
        const rect = el.getBoundingClientRect();
        setOverlaySize({ w: Math.floor(rect.width), h: Math.floor(rect.height) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [videoRef, status]);

  // 实时处理视频帧并上报到后端（定时器节流）
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && status === 'active') {
        processFrame(videoRef.current as HTMLVideoElement, `${selectedMovement?.id || 'unknown'}:${currentView}`);
        (window as any).__poseTick__ = ((window as any).__poseTick__ || 0) + 1;
        if ((window as any).__poseTick__ % 10 === 0 && movementEvaluation && keypoints && keypoints.length) {
          postPoseTelemetry({
            movementType: selectedMovement?.id || 'unknown',
            movementName: selectedMovement?.name,
            timestamp: new Date().toISOString(),
            angles: movementEvaluation.angles || {},
            keypoints
          }).catch(() => {});
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [videoRef, status, selectedMovement, movementEvaluation, keypoints, processFrame]);

  const analyzeWithMockResult = (delayMs: number) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const mockRaw = {
        movementType: selectedMovement?.id || 'unknown',
        movementName: selectedMovement?.name || '未知动作',
        hipMobilityScore: 2,
        kneeStabilityScore: 2,
        shoulderMobilityScore: 3,
        coreActivationScore: 2,
        posturalAlignmentScore: 3,
        leftSideScores: { hip: 2, knee: 2 },
        rightSideScores: { hip: 3, knee: 2 },
        compensationPatterns: ['膝内扣', '躯干前倾']
      };
      const processor = new FmsProcessor();
      processor.process(mockRaw).then(assessment => {
        setAnalysisResult(assessment);
        try {
          sessionStorage.setItem('completed_video_analysis', 'true');
          sessionStorage.setItem('completed_video_analysis_at', new Date().toISOString());
        } catch {}

        localStorage.setItem('lastAssessment', JSON.stringify(assessment));

        try {
          const historyKey = 'analysis_history';
          const existingHistory = localStorage.getItem(historyKey);
          const history = existingHistory ? JSON.parse(existingHistory) : [];

          const newResult = {
            id: `analysis_${Date.now()}`,
            timestamp: new Date().toISOString(),
            movementName: selectedMovement?.name || '未知动作',
            movementType: selectedMovement?.id || 'unknown',
            overallScore: assessment.overallScore,
            mobilityScore: assessment.mobilityScore,
            stabilityScore: assessment.stabilityScore,
            recommendations: assessment.recommendations
          };

          history.unshift(newResult);
          localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 20)));
        } catch (e) {
          console.error('Failed to save history', e);
        }
      }).finally(() => {
        setIsAnalyzing(false);
      });
    }, delayMs);
  };

  const handleAnalyzeVideo = () => {
    if (!videoFile) return;
    analyzeWithMockResult(3000);
  };

  const handleUseDemoResult = () => {
    analyzeWithMockResult(600);
  };

  const handleReset = () => {
    setVideoFile(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (uploadedVideoRef.current) {
      uploadedVideoRef.current.src = '';
    }
  };

  return (
    <>
      <div className="mx-auto max-w-4xl p-4 w-full">
        {/* 返回按钮 */}
        <div className="mb-6 flex justify-start">
          <Button
            variant="secondary"
            size="medium"
            onClick={goBack}
            className="transition-colors duration-300"
            style={{ backgroundColor: colors.primary[100], color: colors.primary[700] }}
            aria-label="返回"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </Button>
        </div>
        
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full mb-4" style={{ backgroundColor: colors.primary[100] }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ 
            color: colors.primary[800], 
            fontWeight: typography.fontWeight.bold
          }}>{selectedMovement ? `${selectedMovement.name} · 视频分析` : '视频分析'}</h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
            上传或录制视频，系统将自动分析动作质量和规范性
          </p>
          {selectedMovement && (
            <div className="mt-2 text-sm" style={{ color: colors.text.secondary }}>
              当前动作：{selectedMovement.name}
            </div>
          )}
        </div>

        {/* 视角选择与状态栏 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {(['front','side','oblique45'] as const).map(v => (
              <button
                key={v}
                onClick={() => setCurrentView(v)}
                className={`px-3 py-2 rounded-md text-sm ${currentView === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {v === 'front' ? '正面' : v === 'side' ? '侧面' : '45°'}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-600">
            FPS: <span className="font-semibold" style={{ color: colors.primary[700] }}>{fps}</span> · 摄像头状态: <span className="font-semibold">{status}</span>
          </div>
        </div>

        {/* 实时摄像与骨骼可视化 */}
        <div className="relative rounded-lg overflow-hidden shadow-md mb-8">
          <video
            ref={videoRef as any}
            className={`w-full h-auto object-contain ${status === 'active' ? 'block' : 'hidden'}`}
            autoPlay
            playsInline
            muted
          />
          {/* 叠加骨骼层 */}
          <div className="absolute inset-0 pointer-events-none">
            {overlaySize.w > 0 && overlaySize.h > 0 && (
              <SkeletonVisualizer keypoints={keypoints || []} width={overlaySize.w} height={overlaySize.h} />
            )}
          </div>
          {/* 角度HUD */}
          {movementEvaluation && (
            <div className="absolute top-2 left-2 bg-white/80 rounded-md p-2 text-xs shadow">
              {Object.entries(movementEvaluation.angles || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-semibold" style={{ color: colors.primary[700] }}>{Math.round(v)}°</span>
                </div>
              ))}
            </div>
          )}
          {/* 质量提示HUD */}
          {movementEvaluation && (
            (() => {
              const kpCount = (keypoints && keypoints.length) || 0;
              const avg = kpCount > 0 ? keypoints.reduce((s: number, kp: any) => s + (kp.score || 0), 0) / kpCount : 0;
              if (avg < 0.5 || kpCount < 10) {
                return (
                  <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 rounded-md p-2 text-xs shadow">
                    检测质量较低，请靠近摄像头、保证全身入镜并改善光线
                  </div>
                );
              }
              return null;
            })()
          )}
        </div>
        
        {/* 视频上传/录制区域 */}
        <div className="mb-8 p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.background.paper }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary[700] }}>
            {videoFile ? '视频预览' : '上传或录制视频'}
          </h2>
          
          {!videoFile ? (
            <div className="space-y-4">
              {/* 文件上传 */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer"
                  style={{ 
                    borderColor: colors.primary[300], 
                    backgroundColor: colors.primary[50] 
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[500] }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm" style={{ color: colors.primary[700] }}>点击上传视频文件</p>
                  <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>支持 MP4, MOV, AVI 格式</p>
                </label>
              </div>
              
              {/* 录制视频按钮 */}
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => setIsRecording(!isRecording)}
                  className="transition-colors duration-300"
                  style={{ 
                    backgroundColor: isRecording ? colors.error[500] : colors.primary[500],
                    color: 'white'
                  }}
                  aria-label={isRecording ? "停止录制" : "开始录制"}
                >
                  {isRecording ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      停止录制
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      开始录制
                    </>
                  )}
                </Button>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="medium"
                  onClick={handleUseDemoResult}
                  disabled={isAnalyzing}
                  className="transition-colors duration-300"
                  style={{ borderColor: colors.primary[300], color: colors.primary[700] }}
                >
                  使用示例数据分析
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 视频预览 */}
              <video
                ref={uploadedVideoRef as any}
                controls
                className="w-full h-auto rounded-lg"
                style={{ maxHeight: '400px' }}
              />
              
              {/* 操作按钮 */}
              <div className="flex justify-center space-x-4">
                <Button
                  variant="primary"
                  size="medium"
                  onClick={handleAnalyzeVideo}
                  disabled={isAnalyzing}
                  className="transition-colors duration-300"
                  style={{ backgroundColor: colors.primary[500], color: 'white' }}
                  aria-label="分析视频"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      分析中...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      分析视频
                    </>
                  )}
                </Button>
                
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={handleReset}
                  className="transition-colors duration-300"
                  style={{ backgroundColor: colors.neutral[200], color: colors.neutral[700] }}
                  aria-label="重新选择"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新选择
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* 分析结果 */}
        {analysisResult && (
          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.background.paper }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary[700] }}>分析结果</h2>
            
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.primary[50] }}>
                  <div className="text-sm" style={{ color: colors.text.secondary }}>总分</div>
                  <div className="text-2xl font-bold" style={{ color: colors.primary[700] }}>{analysisResult.overallScore.value}/{analysisResult.overallScore.maxValue}</div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.primary[50] }}>
                  <div className="text-sm" style={{ color: colors.text.secondary }}>灵活性</div>
                  <div className="text-2xl font-bold" style={{ color: colors.primary[700] }}>{analysisResult.mobilityScore.value}/{analysisResult.mobilityScore.maxValue}</div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.primary[50] }}>
                  <div className="text-sm" style={{ color: colors.text.secondary }}>稳定性</div>
                  <div className="text-2xl font-bold" style={{ color: colors.primary[700] }}>{analysisResult.stabilityScore.value}/{analysisResult.stabilityScore.maxValue}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-lg font-medium" style={{ color: colors.primary[700] }}>反馈:</span>
                <p className="mt-1" style={{ color: colors.text.secondary }}>{analysisResult.overallScore.feedback}</p>
              </div>
              
              <div>
                <span className="text-lg font-medium" style={{ color: colors.primary[700] }}>建议:</span>
                <ul className="mt-1 list-disc list-inside" style={{ color: colors.text.secondary }}>
                  {analysisResult.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button
                variant="primary"
                size="medium"
                onClick={() => {
                  let pid = '';
                  try { pid = sessionStorage.getItem('currentPatientId') || ''; } catch {}
                  navigateTo('reports', { patientId: pid, autoGenerate: true, openLatest: true });
                }}
                className="transition-colors duration-300"
                style={{ backgroundColor: colors.primary[500], color: 'white' }}
                aria-label="生成报告"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                生成报告
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoAnalysisPage;
