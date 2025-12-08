import React, { useState, useRef } from 'react';

import { colors, typography } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import Button from '../ui/Button';

const VideoAnalysisPage: React.FC = () => {
  const { navigateTo, goBack } = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const videoURL = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = videoURL;
      }
    }
  };

  const handleAnalyzeVideo = () => {
    if (!videoFile) return;
    
    setIsAnalyzing(true);
    
    // 模拟视频分析过程
    setTimeout(() => {
      setAnalysisResult({
        score: 3,
        feedback: '动作完成度良好，但需要注意保持核心稳定性',
        recommendations: ['加强核心训练', '注意动作节奏', '保持呼吸均匀']
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleReset = () => {
    setVideoFile(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (videoRef.current) {
      videoRef.current.src = '';
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
          }}>视频分析</h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
            上传或录制视频，系统将自动分析动作质量和规范性
          </p>
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
            </div>
          ) : (
            <div className="space-y-4">
              {/* 视频预览 */}
              <video
                ref={videoRef}
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
              <div className="flex items-center mb-2">
                <span className="text-lg font-medium mr-2" style={{ color: colors.primary[700] }}>评分:</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${star <= analysisResult.score ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-lg font-medium" style={{ color: colors.primary[700] }}>反馈:</span>
                <p className="mt-1" style={{ color: colors.text.secondary }}>{analysisResult.feedback}</p>
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
                onClick={() => navigateTo('reports')}
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