import { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { extractKeypointsFromFrame, evaluateMovement } from '../services/poseDetection';

// 导入标准关键点接口
import { Keypoint } from '../types/keypoints';

// 动作评估结果类型
export interface MovementEvaluation {
  score: number;
  feedback: string;
  angles?: Record<string, number>;
};

// 姿态估计Hook
export const usePoseEstimation = () => {
  // 修改: 添加状态变量类型定义
  const [keypoints, setKeypoints] = useState<Keypoint[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [movementEvaluation, setMovementEvaluation] = useState<MovementEvaluation | null>(null);
  
  // 性能优化：添加FPS和性能监控状态
  const [fps, setFps] = useState<number>(0);
  
  // 跟踪初始化状态
  const modelInitializedRef = useRef<boolean>(false);
  const processingRef = useRef<boolean>(false);
  const lastProcessTimeRef = useRef<number>(0);
  const updateInterval = useRef<number>(80); // 进一步降低更新间隔
  const fpsCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);
  const keypointsCacheRef = useRef<Keypoint[]>([]); // 缓存上一帧关键点

  // 初始化TensorFlow.js和姿态检测模型
  useEffect(() => {
    const initializeModel = async () => {
      try {
        setIsModelLoading(true);
        console.log('正在初始化TensorFlow.js...');
        
        // 确保TensorFlow.js后端就绪
        await tf.ready();
        console.log('TensorFlow.js后端已就绪');
        
        // 导入并初始化姿态检测模型
        await import('../services/poseDetection')
          .then(module => module.initializePoseDetection())
          .then(() => {
            modelInitializedRef.current = true;
            console.log('姿态检测模型初始化成功');
          });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '姿态检测模型初始化失败';
        console.error('初始化模型时出错:', errorMessage);
        setError(errorMessage);
        
        // 移除模拟数据逻辑，强制使用真实数据
        console.error('无法初始化姿态检测模型，请检查网络连接和设备兼容性');
      } finally {
        setIsModelLoading(false);
      }
    };

    initializeModel();

    // 组件卸载时清理资源
    return () => {
      if (modelInitializedRef.current) {
        tf.dispose();
      }
    };
  }, []);

  // 处理视频帧，提取关键点 - 优化版
  const processFrame = async (videoElement: HTMLVideoElement, movementType?: string) => {
    // 更新FPS计数
    const now = Date.now();
    fpsCountRef.current++;
    
    // 每秒更新一次FPS显示
    if (now - lastFpsUpdateRef.current >= 1000) {
      setFps(fpsCountRef.current);
      fpsCountRef.current = 0;
      lastFpsUpdateRef.current = now;
      
      // 动态调整更新间隔以保持性能
      if (fps < 15) {
        updateInterval.current = Math.min(updateInterval.current + 10, 200);
      } else if (fps > 30) {
        updateInterval.current = Math.max(updateInterval.current - 10, 50);
      }
    }
    
    // 移除模拟数据处理逻辑，强制使用真实数据
    // 如果模型未初始化，直接返回
    if (!modelInitializedRef.current) {
      return;
    }

    // 避免并发处理
    if (processingRef.current) {
      return;
    }

    // 控制处理频率
    if (now - lastProcessTimeRef.current < updateInterval.current) {
      // 如果不处理当前帧，使用缓存的关键点进行平滑过渡渲染
      if (keypointsCacheRef.current.length > 0) {
        setKeypoints([...keypointsCacheRef.current]);
      }
      return;
    }
    lastProcessTimeRef.current = now;

    processingRef.current = true;
    setIsProcessing(true);
    
    try {
      // 提取关键点 - 移除不必要的日志以提高性能
      const extractedKeypoints = await extractKeypointsFromFrame(videoElement);
      
      // 缓存当前关键点数据
      if (extractedKeypoints.length > 0) {
        keypointsCacheRef.current = extractedKeypoints;
      }
      
      // 仅在关键点有显著变化时更新状态，减少不必要的重渲染
      if (hasKeypointsChanged(keypoints, extractedKeypoints)) {
        setKeypoints(extractedKeypoints);
      }

      // 降低评估频率，每3帧评估一次，减少计算负担
      if (movementType && extractedKeypoints.length > 0 && fpsCountRef.current % 3 === 0) {
        // 使用requestIdleCallback在下一个空闲时间执行评估，避免阻塞主线程
        requestIdleCallback(() => {
          const evaluation = evaluateMovement(extractedKeypoints, movementType);
          setMovementEvaluation(evaluation);
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '处理视频帧时出错';
      console.error('处理帧时出错:', errorMessage);
      setError(errorMessage);
      
      // 移除模拟数据后备逻辑
      console.error('视频帧处理失败，请确保摄像头正常工作且光线充足');
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  };
  
  // 辅助函数：检查关键点是否有显著变化
  const hasKeypointsChanged = (prevKeypoints: Keypoint[], newKeypoints: Keypoint[]): boolean => {
    if (prevKeypoints.length !== newKeypoints.length) return true;
    
    // 检查每个关键点的位置是否有足够大的变化
    for (let i = 0; i < prevKeypoints.length; i++) {
      const prevKp = prevKeypoints[i];
      const newKp = newKeypoints[i];
      
      if (prevKp.name !== newKp.name) return true;
      
      // 只有当位置变化超过0.02时才认为有显著变化
      const dx = Math.abs(prevKp.x - newKp.x);
      const dy = Math.abs(prevKp.y - newKp.y);
      
      if (dx > 0.02 || dy > 0.02) return true;
    }
    
    return false;
  };

  // 返回Hook提供的功能和状态
  return {
    keypoints,
    isProcessing,
    error,
    isModelLoading,
    processFrame,
    movementEvaluation,
    fps // 返回FPS供UI显示
  };
};