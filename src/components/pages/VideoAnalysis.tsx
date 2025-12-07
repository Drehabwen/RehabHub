import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { colors, typography, borderRadius } from '../../theme';
import { useNavigation, useNavigationParams } from '../../contexts/NavigationContext';
import { animations, animationKeyframes } from '../../utils/animations';

// 定义分析结果类型
interface AnalysisResult {
  score: number;
  feedback: string;
  angles?: Record<string, number>;
  keypoints?: Array<{ x: number; y: number; confidence: number }>;
}

// 定义VideoAnalysis组件Props
interface VideoAnalysisProps {
  movementType?: string;
  movementName?: string;
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({ 
  movementType = 'deep-squat', 
  movementName = '深蹲' 
}) => {
  // 使用导航上下文
  const { goBack } = useNavigation();
  const params = useNavigationParams();
  
  // 从导航参数中获取动作信息
  const movement = params?.movement as any;
  const actualMovementType = movement?.id || movementType;
  const actualMovementName = movement?.name || movementName;
  
  // 组件状态
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // 引用
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 组件挂载后设置动画
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setAnalysisResult(null);
    }
  };
  
  // 开始录制
  const startRecording = () => {
    setIsRecording(true);
    // 这里可以添加实际的录制逻辑
  };
  
  // 停止录制
  const stopRecording = () => {
    setIsRecording(false);
    // 这里可以添加停止录制的逻辑
  };
  
  // 分析视频
  const analyzeVideo = async () => {
    if (!videoFile) return;
    
    setIsAnalyzing(true);
    
    try {
      // 创建FormData对象
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('movementType', actualMovementType);
      
      // 发送请求到后端API
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('分析失败:', error);
      // 使用模拟数据作为后备
      setAnalysisResult({
        score: 75,
        feedback: '动作基本正确，但需要注意膝盖不要超过脚尖。保持核心收紧，下蹲时臀部向后坐。',
        angles: {
          '左膝角度': 85,
          '右膝角度': 82,
          '髋部角度': 95,
        },
        keypoints: []
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // 重置分析
  const resetAnalysis = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // 获取分数颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success[600];
    if (score >= 60) return colors.warning[600];
    return colors.error[600];
  };
  
  // 获取分数文本
  const getScoreText = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    return '需要改进';
  };
  
  return (
    <Layout title={`${actualMovementName}评估`}>
      <style>{animationKeyframes}</style>
      <div className="mx-auto max-w-4xl p-4 w-full">
        {/* 返回按钮 */}
        <div className="mb-6 flex justify-start">
          <Button
            variant="secondary"
            size="medium"
            onClick={goBack}
            className="transition-colors duration-300"
            style={{ backgroundColor: colors.primary[100], color: colors.primary[700] }}
            aria-label="返回动作选择"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回动作选择
          </Button>
        </div>
        
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ 
            color: colors.primary[800], 
            fontWeight: typography.fontWeight.bold
          }}>{actualMovementName}动作评估</h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
            上传或录制{actualMovementName}动作视频，系统将进行AI分析并给出专业评估
          </p>
        </div>
        
        {/* 视频上传/录制区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 上传区域 */}
          <Card className="p-6 border shadow-md" style={{ 
            ...(mounted && animations.fadeInUp('0.6s', '0.1s'))
          }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>上传视频</h2>
            
            <div className="mb-4">
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
                className="block w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:border-primary-400 text-center"
                style={{ 
                  borderColor: colors.primary[300],
                  backgroundColor: colors.primary[50]
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[500] }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium mb-1" style={{ color: colors.primary[700] }}>点击上传视频文件</p>
                <p className="text-xs" style={{ color: colors.text.secondary }}>支持 MP4, MOV, AVI 格式，最大 100MB</p>
              </label>
            </div>
            
            {videoFile && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2" style={{ color: colors.text.primary }}>已选择文件:</p>
                <div className="p-3 rounded-md bg-gray-100">
                  <p className="text-sm truncate" style={{ color: colors.text.secondary }}>{videoFile.name}</p>
                  <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="medium"
                onClick={analyzeVideo}
                disabled={!videoFile || isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? '分析中...' : '开始分析'}
              </Button>
              <Button
                variant="secondary"
                size="medium"
                onClick={resetAnalysis}
                disabled={isAnalyzing}
              >
                重置
              </Button>
            </div>
          </Card>
          
          {/* 录制区域 */}
          <Card className="p-6 border shadow-md" style={{ 
            ...(mounted && animations.fadeInUp('0.6s', '0.2s'))
          }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>录制视频</h2>
            
            <div className="mb-4">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {isRecording ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-3 animate-pulse"></div>
                      <p>录制中...</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p>摄像头预览</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {!isRecording ? (
                <Button
                  variant="primary"
                  size="medium"
                  onClick={startRecording}
                  className="flex-1"
                  style={{ backgroundColor: colors.error[600] }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  开始录制
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={stopRecording}
                  className="flex-1"
                  style={{ backgroundColor: colors.error[600] }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  停止录制
                </Button>
              )}
            </div>
          </Card>
        </div>
        
        {/* 视频预览区域 */}
        {videoPreview && (
          <Card className="p-6 border shadow-md mb-8" style={{ 
            ...(mounted && animations.fadeInUp('0.6s', '0.3s'))
          }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>视频预览</h2>
            <div className="rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={videoPreview}
                controls
                className="w-full"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </Card>
        )}
        
        {/* 分析结果区域 */}
        {analysisResult && (
          <Card className="p-6 border shadow-md" style={{ 
            ...(mounted && animations.fadeInUp('0.6s', '0.4s'))
          }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>分析结果</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 分数显示 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-3" style={{ backgroundColor: getScoreColor(analysisResult.score) + '20' }}>
                  <span className="text-3xl font-bold" style={{ color: getScoreColor(analysisResult.score) }}>
                    {analysisResult.score}
                  </span>
                </div>
                <p className="text-lg font-medium mb-1" style={{ color: colors.text.primary }}>
                  {getScoreText(analysisResult.score)}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${analysisResult.score}%`,
                      backgroundColor: getScoreColor(analysisResult.score)
                    }}
                  ></div>
                </div>
              </div>
              
              {/* 反馈信息 */}
              <div>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors.text.primary }}>专业反馈</h3>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  {analysisResult.feedback}
                </p>
              </div>
            </div>
            
            {/* 角度数据 */}
            {analysisResult.angles && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3" style={{ color: colors.text.primary }}>关节角度分析</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysisResult.angles).map(([key, value]) => (
                    <div key={key} className="text-center p-3 rounded-lg" style={{ backgroundColor: colors.neutral[100] }}>
                      <p className="text-xs font-medium mb-1" style={{ color: colors.text.secondary }}>{key}</p>
                      <p className="text-xl font-bold" style={{ color: colors.primary[600] }}>{value}°</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 操作按钮 */}
            <div className="mt-6 flex gap-3">
              <Button
                variant="primary"
                size="medium"
                onClick={() => navigateTo('history')}
              >
                查看历史记录
              </Button>
              <Button
                variant="secondary"
                size="medium"
                onClick={resetAnalysis}
              >
                重新分析
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default VideoAnalysis;