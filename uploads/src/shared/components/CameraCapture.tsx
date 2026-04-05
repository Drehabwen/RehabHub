import React, { useRef } from 'react';
import { useCamera } from '../hooks/useCamera';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onError?: (error: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onError }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    videoRef, 
    status, 
    errorMessage, 
    requestPermission,
    reloadCamera 
  } = useCamera();

  // 拍照功能
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || status !== 'active') {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // 设置canvas尺寸
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // 绘制图像
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      onCapture(imageDataUrl);
    }
  };

  // 手动请求权限
  const handleRequestPermission = async () => {
    try {
      await requestPermission();
    } catch (error) {
      if (onError) {
        onError('请求摄像头权限时发生错误');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* 摄像头预览区域 */}
      <div className="relative bg-black rounded-xl overflow-hidden mb-6 shadow-lg border border-gray-200 transition-all hover:shadow-xl aspect-[16/9] max-h-[480px]">
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400 mx-auto"></div>
                <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 bg-green-500 opacity-20 mx-auto"></div>
              </div>
              <h3 className="text-xl font-medium tracking-wide">正在启动摄像头...</h3>
              <p className="text-gray-300 max-w-xs mx-auto">请确保您的设备已授予摄像头访问权限</p>
            </div>
          </div>
        )}
        
        {(status === 'error' || status === 'not_supported') && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-center p-8 rounded-xl bg-white shadow-lg max-w-md mx-4">
              <div className="text-red-500 text-5xl mb-5 animate-pulse">❌</div>
              <h3 className="text-xl font-bold text-red-700 mb-3">摄像头启动失败</h3>
              <p className="text-red-600 mb-5 text-gray-600">{errorMessage}</p>
              <button 
                onClick={reloadCamera}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 shadow-md"
              >
                🔄 重新加载
              </button>
            </div>
          </div>
        )}
        
        {status === 'permission_denied' && (
          <div className="absolute inset-0 flex items-center justify-center bg-yellow-50">
            <div className="text-center p-8 rounded-xl bg-white shadow-lg max-w-md mx-4">
              <div className="text-yellow-500 text-5xl mb-5 animate-bounce">⚠️</div>
              <h3 className="text-xl font-bold text-yellow-700 mb-3">摄像头权限被拒绝</h3>
              <p className="text-yellow-600 mb-6 text-gray-600">{errorMessage}</p>
              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <button 
                  onClick={handleRequestPermission}
                  className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 shadow-md"
                >
                  🔒 请求权限
                </button>
                <button 
                  onClick={reloadCamera}
                  className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 shadow-md"
                >
                  🔄 重新加载
                </button>
              </div>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          className={`w-full h-auto max-h-96 object-contain ${status === 'active' ? 'block' : 'hidden'}`}
          autoPlay
          playsInline
          muted
        />
      </div>

      {/* 拍照按钮 */}
      {status === 'active' && (
        <div className="text-center">
          <button
            onClick={takePhoto}
            className="px-10 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 shadow-md hover:shadow-lg min-w-[160px]"
          >
            <span className="flex items-center justify-center">
              📸 拍照
            </span>
          </button>
        </div>
      )}

      {/* 隐藏的画布用于拍照 */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;