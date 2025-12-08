import React, { useState, useCallback, useEffect, useRef } from 'react';
import { animations, animationKeyframes } from './utils/animations';
import FileDropzone from './FileDropzone';
import CameraCapture from './CameraCapture';
import LoadingSpinner from './LoadingSpinner.tsx';
import { colors, typography, borderRadius, shadows } from './theme';
import HelpGuide from './components/HelpGuide';
import { useAnalysis } from './hooks/useAnalysis';
import { type AnalysisResponse } from './services/api';

import { usePoseEstimation } from './hooks/usePoseEstimation';
import './styles/VideoAnalysis.css';

// 移除未使用的导航工具函数导入

// 移除未使用的MedicalTheme接口定义

interface VideoAnalysisProps {
  movementType?: string;
  movementName?: string;
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({ movementType = 'general', movementName = '通用' }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [patientInfo] = useState<string>('');
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  
  // 操作指引引用
  const videoSourceRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  // const analyzeButtonRef = useRef<HTMLButtonElement>(null); // 暂时注释，未使用
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // 操作指引步骤
  const helpSteps: Array<{ id: string; title: string; content: React.ReactNode; placement: 'top' | 'bottom' | 'left' | 'right' }> = [
    {
      id: 'video-source',
      title: '选择视频来源',
      content: (
        <div>
          <p>您可以通过两种方式提供分析素材：</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>上传视频 - 从您的设备上传预先录制的视频</li>
            <li>拍摄视频 - 使用您的摄像头实时录制动作</li>
          </ul>
          <p className="mt-2">确保视频清晰，光线充足，且被评估者全身可见。</p>
        </div>
      ),
      placement: 'bottom' as const
    },
    {
      id: 'analyze',
      title: '开始分析',
      content: (
        <div>
          <p>视频加载完成后，点击"开始分析"按钮：</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>系统将自动检测人体姿态关键点</li>
            <li>分析动作完成的质量和规范性</li>
            <li>生成详细的评分和改进建议</li>
          </ul>
          <p className="mt-2">分析过程可能需要几秒钟，请耐心等待。</p>
        </div>
      ),
      placement: 'top' as const
    },
    {
      id: 'results',
      title: '查看分析结果',
      content: (
        <div>
          <p>分析完成后，您将看到：</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>总体评分 - 基于动作标准的0-100分评分</li>
            <li>动作细节评估 - 各个关键部位的表现评分</li>
            <li>改进建议 - 针对性的康复训练建议</li>
          </ul>
          <p className="mt-2">您可以保存这些结果用于后续的康复跟踪。</p>
        </div>
      ),
      placement: 'top'
    }
  ];
  const { mutate: analyzeVideo } = useAnalysis();
  
  // 首次加载时显示操作指引
  useEffect(() => {
    setMounted(true);
    // 检查是否是首次使用视频分析功能
    const hasUsedAnalysis = localStorage.getItem('hasUsedAnalysisFeature');
    if (!hasUsedAnalysis) {
      // 延迟显示操作指引，让页面完全加载
      setTimeout(() => {
        setShowHelpGuide(true);
        // 标记为已使用
        localStorage.setItem('hasUsedAnalysisFeature', 'true');
      }, 1000);
    }
  }, []);
  
  // 添加一个样式元素用于定义动画关键帧
  useEffect(() => {
    // 创建样式元素
    const styleElement = document.createElement('style');
    styleElement.textContent = animationKeyframes;
    document.head.appendChild(styleElement);
    
    // 清理函数
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // 添加姿态估计相关的状态
  const { 
    keypoints: poseKeypoints, 
    isProcessing: isPoseProcessing, 
    movementEvaluation, 
    processFrame,
    isModelLoading,
    error: poseError
  } = usePoseEstimation();

  // 监听姿态估计错误
  useEffect(() => {
    if (poseError) {
      console.error('姿态估计错误:', poseError);
    }
  }, [poseError]);

  // 处理视频帧
  const processVideoFrame = useCallback((videoElement: HTMLVideoElement) => {
    if (videoElement && !isPoseProcessing) {
      // 调用姿态估计处理帧，传递movementType参数
      processFrame(videoElement, movementType);
    }
  }, [isPoseProcessing, processFrame, movementType]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setAnalysisResult(null);
  };

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const uploadVideoRef = useRef<HTMLVideoElement>(null);
  const uploadCanvasRef = useRef<HTMLCanvasElement>(null);

  // 当 selectedFile 变化时生成 URL
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoUrl(null);
    }
  }, [selectedFile]);

  // 处理上传视频的播放和实时分析
  const handleVideoPlay = () => {
    const video = uploadVideoRef.current;
    if (!video) return;
    
    const processLoop = () => {
      if (video.paused || video.ended) return;
      
      // 直接调用 processFrame，hook 内部会处理并发和节流
      processFrame(video, movementType);
      
      requestAnimationFrame(processLoop);
    };
    
    processLoop();
  };

  // 绘制上传视频的骨骼点
  useEffect(() => {
    const canvas = uploadCanvasRef.current;
    const video = uploadVideoRef.current;
    
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 确保 canvas 尺寸匹配视频显示尺寸
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    }

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!poseKeypoints || poseKeypoints.length === 0) return;

    // 绘制逻辑 (增强版)
    const skeletonColor = '#8faa9d';
    const skeletonLineColor = '#a8c4b8';
    
    // 绘制连接线
    const connections = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
    ];

    const keypointMap = new Map(poseKeypoints.map(kp => [kp.name, kp]));

    ctx.strokeStyle = skeletonLineColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    connections.forEach(([start, end]) => {
      const p1 = keypointMap.get(start);
      const p2 = keypointMap.get(end);

      // 如果没有score属性，默认为1 (高置信度)
      const s1 = p1?.score ?? 1;
      const s2 = p2?.score ?? 1;

      if (p1 && p2 && s1 > 0.3 && s2 > 0.3) {
        ctx.beginPath();
        ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
        ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
        ctx.stroke();
      }
    });

    // 绘制关键点
    poseKeypoints.forEach(point => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;
      const score = point.score ?? 1;
      
      if (score > 0.3) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = skeletonColor;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

  }, [poseKeypoints]);

  const handleCapture = (image: string) => {
    // 将base64图像转换为File对象
    const convertBase64ToFile = (base64String: string, filename: string): File => {
      const arr = base64String.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      return new File([u8arr], filename, { type: mime });
    };
    
    // 转换并设置为选中的文件
    const fileName = `capture_${Date.now()}.jpg`;
    const file = convertBase64ToFile(image, fileName);
    setSelectedFile(file);
    setError(null);
    setAnalysisResult(null);
    
    // 自动开始分析
    handleAnalyze();
  };

  // 保存结果到本地存储
  const saveResultToLocal = (result: AnalysisResponse) => {
    try {
      // 获取现有分析历史
      const historyKey = 'analysis_history';
      const existingHistory = localStorage.getItem(historyKey);
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      // 添加新结果，包含时间戳
      const newResult = {
        ...result,
        id: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString(),
        patientInfo // 添加患者信息
      };
      
      // 添加到历史记录开头
      history.unshift(newResult);
      
      // 限制历史记录数量（保留最近10条）
      const limitedHistory = history.slice(0, 10);
      
      // 保存回本地存储
      localStorage.setItem(historyKey, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('保存分析结果到本地存储失败:', error);
    }
  };

  // 分析视频
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // 使用useAnalysis hook进行分析
      analyzeVideo(
        { video: selectedFile },
        {
          onSuccess: (result) => {
            setAnalysisResult(result);
            // 保存到本地存储
            saveResultToLocal(result);
          },
          onError: (error) => {
            setError(
              error instanceof Error ? error.message : '视频分析失败，请重试'
            );
        
            console.error('Video analysis error:', error);
          },
          onSettled: () => {
            setIsAnalyzing(false);
          }
        }
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : '视频分析失败，请重试'
      );
      console.error('Video analysis error:', error);
      setIsAnalyzing(false);
    }
  };

  // 格式化文件大小函数
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // 获取评分对应的颜色和级别
  const getScoreColor = (score: number): { color: string; level: string } => {
    if (score >= 80) {
      return { color: colors.primary[700], level: '良好' };
    } else if (score >= 60) {
      return { color: colors.secondary[600], level: '可接受' };
    } else {
      return { color: colors.primary[800], level: '需改进' };
    }
  };

  // 获取评估建议
  const getAssessmentTips = () => {
    return {
      upload: [
        '建议视频时长控制在10-30秒',
        '确保患者全身都在画面内',
        '拍摄环境光线充足',
        '使用稳定的拍摄设备'
      ],
      camera: [
        '请保持摄像头稳定',
        '确保全身都在画面内',
        '光线适中，避免过度曝光',
        '保持合适距离，确保清晰度'
      ]
    }[activeTab];
  };

  return (
    <div className="video-analysis-container" data-testid="video-analysis-container" style={{ 
      ...(mounted && animations.fadeIn('0.4s'))
    }}>
      {/* 操作指引按钮 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowHelpGuide(true)}
          className="help-button active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          使用帮助
        </button>
      </div>
      
      {/* 医疗风格的页面头部 */}
      <div className="header-section" style={{ 
          borderColor: colors.primary[200],
        ...(mounted && animations.fadeInDown('0.5s', '0.1s'))
      }}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.primary[800] }}>{movementName} 动作分析</h1>
            <p className="text-secondary-600">专业康复评估系统 - 精确测量动作表现和姿态控制</p>
          </div>
        </div>
      </div>
      
      {/* 主内容区域 */}
      <div className="mb-6 grow">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-green-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
          {/* 视频选择选项卡 */}
          <div ref={videoSourceRef} className="video-source-tabs" style={{ 
            backgroundColor: colors.primary[50], 
            borderRadius: borderRadius.lg,
            ...(mounted && animations.fadeInUp('0.6s', '0.2s'))
          }} role="tablist">
            <button
              className={`flex flex-1 items-center justify-center min-h-[48px] px-4 py-3 rounded-md text-sm font-medium transition-all sm:text-base`}
              style={{ 
                backgroundColor: activeTab === 'upload' ? '#f7f9f7' : 'transparent',
                color: activeTab === 'upload' ? '#6b8475' : '#5a6f61',
                fontWeight: activeTab === 'upload' ? typography.fontWeight.semibold : undefined,
                boxShadow: activeTab === 'upload' ? shadows.default : 'none'
              }}
              onClick={() => setActiveTab('upload')}
              role="tab"
              id="upload-tab"
              aria-selected={activeTab === 'upload' ? "true" : "false"}
              aria-controls="upload-tabpanel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 mr-2 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              上传视频
            </button>
            <button
              className={`flex-1 px-4 py-3 rounded-md transition-all text-sm sm:text-base font-medium min-h-[48px] flex items-center justify-center`}
              style={{ 
                backgroundColor: activeTab === 'camera' ? '#f7f9f7' : 'transparent',
                color: activeTab === 'camera' ? '#6b8475' : '#5a6f61',
                fontWeight: activeTab === 'camera' ? typography.fontWeight.semibold : undefined,
                boxShadow: activeTab === 'camera' ? shadows.default : 'none'
              }}
              onClick={() => setActiveTab('camera')}
              role="tab"
              id="camera-tab"
              aria-selected={activeTab === 'camera' ? "true" : "false"}
              aria-controls="camera-tabpanel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              拍摄视频
            </button>
          </div>
          
          {/* 视频显示区域 */}
          <div className="video-display-area">
            {activeTab === 'upload' && (
              <div id="upload-tabpanel" role="tabpanel" aria-labelledby="upload-tab" className="w-full h-full">
                <FileDropzone onFileSelect={handleFileSelect} />
              </div>
            )}
            {activeTab === 'camera' && (
              <div id="camera-tabpanel" role="tabpanel" aria-labelledby="camera-tab" className="w-full h-full">
                {/* CameraCapture组件现在会处理实时姿态估计 */}
                <CameraCapture 
                  onCapture={handleCapture} 
                  onError={(errorMsg) => {
                    console.error('Camera error:', errorMsg);
                    setError(`摄像头错误: ${errorMsg}`);
                  }}
                  keypoints={poseKeypoints}
                  onVideoFrame={processVideoFrame}
                  showSkeleton={true}
                />
              </div>
            )}
          </div>
          
          {/* 操作提示 */}
          <div className="mt-4 p-4 rounded-lg border" style={{ backgroundColor: '#f4f7f0', borderColor: '#d0ddd5' }}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e8f0ec' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" style={{ color: '#8faa9d' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2" style={{ color: '#6b8475' }}>拍摄建议</h4>
                <ul className="text-xs sm:text-sm space-y-1" style={{ color: '#5a6f61' }}>
                  {getAssessmentTips().map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span style={{ color: '#8faa9d' }}>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* 已选择文件信息 */}
          {selectedFile && (
            <div className="mt-4 p-4 rounded-lg border" style={{ backgroundColor: '#f4f7f0', borderColor: '#d0ddd5' }}>
              {/* 视频预览区域 */}
              {videoUrl && activeTab === 'upload' && (
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4 border border-gray-200 shadow-inner">
                  <video
                    ref={uploadVideoRef}
                    src={videoUrl}
                    className="absolute top-0 left-0 w-full h-full object-contain"
                    controls
                    onPlay={handleVideoPlay}
                    crossOrigin="anonymous"
                    playsInline
                  />
                  <canvas
                    ref={uploadCanvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 10 }}
                  />
                  {/* 提示信息 */}
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-20">
                    播放视频以查看实时骨骼点分析
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8f0ec' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: '#8faa9d' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6b8475' }}>{selectedFile.name}</p>
                    <p className="text-xs" style={{ color: '#5a6f61' }}>{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-sm p-2 rounded-full transition-colors"
                  style={{ color: '#5a6f61', backgroundColor: '#e8f0ec' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* 分析按钮 */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 shadow-md"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="small" message="" />
                      分析中...
                    </span>
                  ) : (
                    '开始分析'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 分析中加载状态 */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center my-12 py-8 border" style={{ backgroundColor: '#ffffff', borderRadius: borderRadius.lg, boxShadow: shadows.default, borderColor: '#8faa9d' }}>
          <div className="mb-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f4f7f0' }}>
            <LoadingSpinner size="large" message={``} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#6b8475', fontWeight: typography.fontWeight.semibold }}>正在分析 {movementName} 动作...</h3>
        <p className="text-sm max-w-md text-center" style={{ color: '#5a6f61' }}>
            系统正在进行精确的动作识别和姿态评估，请稍候...
          </p>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="mb-8 p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md" style={{ backgroundColor: '#f8f4f4', borderColor: '#e8d4d4' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#e8d4d4', color: '#d45454' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2" style={{ color: '#d45454' }}>分析失败</h4>
              <p className="text-sm" style={{ color: '#a04040' }}>{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="mt-3 text-sm px-3 py-1 rounded transition-colors"
                style={{ backgroundColor: '#d45454', color: '#ffffff' }}
              >
                关闭错误
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 姿态处理中状态 */}
      {isPoseProcessing && (
        <div className="flex flex-col items-center justify-center my-12 py-8 rounded-xl shadow-sm border" style={{ backgroundColor: '#ffffff', borderColor: '#d0ddd5' }}>
          <div className="mb-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8f0ec' }}>
            <LoadingSpinner size="large" message={``} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#6b8475' }}>正在进行姿态估计...</h3>
          <p className="text-sm max-w-md text-center" style={{ color: '#5a6f61' }}>
            系统正在实时检测您的动作姿态，请保持标准姿势...
          </p>
        </div>
      )}

      {/* 模型加载中状态 */}
      {isModelLoading && (
        <div className="flex flex-col items-center justify-center my-12 py-8 rounded-xl shadow-sm border" style={{ backgroundColor: '#ffffff', borderColor: '#d0ddd5' }}>
          <div className="mb-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8f0ec' }}>
            <LoadingSpinner size="large" message={``} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#6b8475' }}>正在加载姿态估计模型...</h3>
          <p className="text-sm max-w-md text-center" style={{ color: '#5a6f61' }}>
            首次使用需要加载模型资源，请稍候...
          </p>
        </div>
      )}

      {/* 姿态评估结果 */}
      {movementEvaluation && (activeTab === 'camera' || (activeTab === 'upload' && videoUrl)) && (
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-2xl ring-1 ring-black/5">
          {/* 头部标题区 */}
          <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/30 p-5 border-b border-green-100/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 ring-1 ring-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 tracking-tight">AI 姿态评估报告</h3>
                <p className="text-xs text-gray-500 font-medium">基于深度学习的实时动作分析</p>
              </div>
            </div>
            <div className="text-xs px-3 py-1 bg-white/80 rounded-full text-green-700 font-medium shadow-sm border border-green-100">
              实时生成
            </div>
          </div>
          
          <div className="p-6">
            {/* 核心评分展示区 */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* 左侧：分数大圆环 */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center relative w-full md:w-auto">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-gray-100"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * movementEvaluation.score) / 100}
                      className={`transition-all duration-1000 ease-out ${
                        getScoreColor(movementEvaluation.score).color === colors.primary[700] ? 'text-emerald-500' : 
                        getScoreColor(movementEvaluation.score).color === colors.secondary[600] ? 'text-amber-500' : 'text-rose-500'
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-800">{movementEvaluation.score}</span>
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Total Score</span>
                  </div>
                </div>
                <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                  getScoreColor(movementEvaluation.score).color === colors.primary[700] ? 'bg-emerald-100 text-emerald-800' : 
                  getScoreColor(movementEvaluation.score).color === colors.secondary[600] ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {getScoreColor(movementEvaluation.score).level}
                </div>
              </div>

              {/* 右侧：反馈与详情 */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 relative">
                  <div className="absolute -left-2 top-6 w-4 h-4 bg-slate-50 transform rotate-45 border-l border-b border-slate-100 hidden md:block"></div>
                  <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    智能评估反馈
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {movementEvaluation.feedback}
                  </p>
                </div>
                
                {/* 进度条展示 */}
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-gray-500">动作准确度</span>
                      <span className="text-gray-700">{movementEvaluation.score}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-emerald-400 to-green-500 shadow-sm"
                        style={{ width: `${movementEvaluation.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 关节角度数据网格 */}
            {movementEvaluation.angles && Object.keys(movementEvaluation.angles).length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-4 w-1 bg-green-500 rounded-full"></div>
                  <h4 className="font-bold text-gray-800">关键关节角度分析</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(movementEvaluation.angles).map(([joint, angle]) => {
                    const isGoodAngle = angle >= 80 && angle <= 110; 
                    return (
                      <div 
                        key={joint} 
                        className={`group p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${
                          isGoodAngle 
                            ? 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-200' 
                            : 'bg-amber-50/50 border-amber-100 hover:border-amber-200'
                        }`}
                      >
                        <div className="text-xs text-gray-500 mb-1.5 font-medium flex justify-between">
                          {joint}
                          {isGoodAngle ? (
                             <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                             </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-xl font-bold ${isGoodAngle ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {angle}°
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* 底部操作区 */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end">
              <button 
                onClick={() => setSelectedFile(null)}
                className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                重新评估
              </button>
              <button 
                onClick={handleAnalyze}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-100 active:scale-95 flex items-center gap-2 justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                保存详细报告
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 分析结果显示 */}
      {analysisResult && (
        <div ref={resultsRef} className="mt-8 overflow-auto" style={{ 
          ...animations.fadeInUp('0.7s'),
          ...animations.cardHover
        }}>
          {/* 示例分析组件已移除 */}
        </div>
      )}
      
      {/* 医疗风格页脚 */}
      <div className="mt-auto pt-6 pb-2 text-center text-xs text-gray-500">
        <p>© 2023 康复评估系统 - 专业医疗级动作分析平台</p>
      </div>
      
      {/* 操作指引 */}
      {showHelpGuide && (
        <HelpGuide
          steps={helpSteps}
          targetRef={videoSourceRef}
          isOpen={showHelpGuide}
          onClose={() => setShowHelpGuide(false)}
        />
      )}
    </div>
  );
};

export default VideoAnalysis;
