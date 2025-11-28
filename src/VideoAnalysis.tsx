import React, { useState, useCallback, useEffect, useRef } from 'react';
import { animations, animationKeyframes } from './utils/animations';
import FileDropzone from './FileDropzone.tsx';
import CameraCapture from './CameraCapture.tsx';
import LoadingSpinner from './LoadingSpinner.tsx';
import { colors, typography, borderRadius, shadows } from './theme';
import HelpGuide from './components/HelpGuide';
import { useAnalysis } from './hooks/useAnalysis.ts';
import { type AnalysisResponse } from './services/api';
import ExampleAnalysis from './components/ExampleAnalysis';
import { usePoseEstimation } from './hooks/usePoseEstimation.ts';
import './styles/VideoAnalysis.css';

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
  const [patientInfo, setPatientInfo] = useState<string>('');
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
    isModelLoading
  } = usePoseEstimation();

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
                backgroundColor: activeTab === 'upload' ? '#ffffff' : 'transparent',
                color: activeTab === 'upload' ? colors.primary[700] : colors.secondary[600],
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
                backgroundColor: activeTab === 'camera' ? '#ffffff' : 'transparent',
                color: activeTab === 'camera' ? colors.primary[700] : colors.secondary[600],
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
          <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-800 mb-2">拍摄建议</h4>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                  {getAssessmentTips().map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 文件信息和分析按钮区域 */}
      {selectedFile && !isAnalyzing && (
        <div className="mb-8 p-5 bg-white rounded-xl shadow-md border border-green-100 transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center text-green-700 mb-1">
                  <span className="text-sm font-medium">已选择文件</span>
                </div>
                <p className="text-gray-800 text-sm sm:text-base font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
            </div>
            
            {/* 患者信息输入 */}
            <div className="w-full md:w-auto md:ml-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="输入患者信息" 
                  value={patientInfo}
                  onChange={(e) => setPatientInfo(e.target.value)}
                  className="px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`analyze-button ${isAnalyzing ? 'disabled' : ''}`}
              style={{ 
                backgroundColor: isAnalyzing ? colors.primary[300] : colors.primary[700],
                ...animations.buttonHover,
                ...(mounted && animations.fadeInUp('0.6s', '0.3s'))
              }}
              >
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    开始分析
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 分析中加载状态 */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center my-12 py-8 border" style={{ backgroundColor: '#ffffff', borderRadius: borderRadius.lg, boxShadow: shadows.default, borderColor: colors.primary[400] }}>
          <div className="mb-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.background.secondary }}>
            <LoadingSpinner size="large" message={``} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary[700], fontWeight: typography.fontWeight.semibold }}>正在分析 {movementName} 动作...</h3>
        <p className="text-sm max-w-md text-center" style={{ color: colors.secondary[600] }}>
            系统正在进行精确的动作识别和姿态评估，请稍候...
          </p>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">分析失败</h4>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="mt-3 text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
              >
                关闭错误
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 姿态处理中状态 */}
      {isPoseProcessing && (
        <div className="flex flex-col items-center justify-center my-12 py-8 bg-white rounded-xl shadow-sm border border-green-100">
          <div className="mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <LoadingSpinner size="large" message={``} />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">正在进行姿态估计...</h3>
          <p className="text-sm text-gray-600 max-w-md text-center">
            系统正在实时检测您的动作姿态，请保持标准姿势...
          </p>
        </div>
      )}

      {/* 模型加载中状态 */}
      {isModelLoading && (
        <div className="flex flex-col items-center justify-center my-12 py-8 bg-white rounded-xl shadow-sm border border-green-100">
          <div className="mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <LoadingSpinner size="large" message={``} />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">正在加载姿态估计模型...</h3>
          <p className="text-sm text-gray-600 max-w-md text-center">
            首次使用需要加载模型资源，请稍候...
          </p>
        </div>
      )}

      {/* 姿态评估结果 */}
      {movementEvaluation && activeTab === 'camera' && (
        <div className="mt-8 p-4 sm:p-6 bg-white rounded-xl shadow-md border border-green-100 overflow-auto transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-green-800">实时姿态评估结果</h3>
          </div>
          
          {/* 评分卡 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">综合评分</span>
                <span className="text-2xl font-bold" style={{ color: getScoreColor(movementEvaluation.score).color }}>
                  {movementEvaluation.score}/100
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${getScoreColor(movementEvaluation.score).color === colors.primary[700] ? 'bg-green-100 text-green-800' : getScoreColor(movementEvaluation.score).color === colors.secondary[600] ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}
                  aria-label={`评分等级: ${getScoreColor(movementEvaluation.score).level}`}
                >
                  {getScoreColor(movementEvaluation.score).level}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ 
                    width: `${movementEvaluation.score}%`,
                    backgroundColor: getScoreColor(movementEvaluation.score).color
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* 评估反馈 */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 mb-4">
            <p className="text-sm font-medium text-green-800 mb-2">评估反馈</p>
            <p className="text-sm text-gray-700">{movementEvaluation.feedback}</p>
          </div>
          
          {/* 关节角度 */}
          {movementEvaluation.angles && Object.keys(movementEvaluation.angles).length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-3">关键关节角度</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(movementEvaluation.angles).map(([joint, angle]) => {
                  // 简单的角度评估逻辑
                  const isGoodAngle = angle >= 80 && angle <= 110; // 示例范围，具体根据关节类型调整
                  
                  return (
                    <div 
                      key={joint} 
                      className={`p-3 rounded-lg ${isGoodAngle ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}`}
                    >
                      <div className="text-xs text-gray-500 mb-1">{joint}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold" style={{ color: isGoodAngle ? colors.primary[700] : colors.secondary[600] }}>
                          {angle}°
                        </span>
                        {isGoodAngle && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={handleAnalyze}
              className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 shadow-md"
            >
              保存评估结果
            </button>
            <button 
              onClick={() => setSelectedFile(null)}
              className="px-5 py-2 bg-white border border-green-300 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50"
            >
              重新评估
            </button>
          </div>
        </div>
      )}

      {/* 分析结果显示 */}
      {analysisResult && (
        <div ref={resultsRef} className="mt-8 overflow-auto" style={{ 
          ...animations.fadeInUp('0.7s'),
          ...animations.cardHover
        }}>
          <ExampleAnalysis 
            movementType={movementType}
            movementName={movementName}
          />
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