import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import type { Keypoint } from '../types/keypoints';
import { movementAngleRanges } from '../moduleConfig';

// 姿态检测器配置 - 优化版
const POSE_DETECTION_CONFIG = {
  modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  enableSmoothing: false, // 禁用平滑以提高实时性
  minPoseScore: 0.2
};

// 姿态检测器实例
let detector: poseDetection.PoseDetector | null = null;
let isModelLoading = false;
let modelLoadPromise: Promise<poseDetection.PoseDetector> | null = null;

/**
 * 初始化姿态检测模型（带重试机制）
 */
export const initializePoseDetection = async (): Promise<poseDetection.PoseDetector> => {
  if (detector) {
    return detector;
  }

  if (isModelLoading && modelLoadPromise) {
    return modelLoadPromise;
  }

  isModelLoading = true;
  modelLoadPromise = (async () => {
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        console.log(`正在加载姿态检测模型 (尝试 ${retries + 1}/${maxRetries})...`);
        
        // 确保TensorFlow.js后端已初始化
        await tf.ready();
        console.log('TensorFlow.js后端已准备就绪');
        
        // 创建检测器
        const detectorConfig = {
          modelType: POSE_DETECTION_CONFIG.modelType,
          enableSmoothing: POSE_DETECTION_CONFIG.enableSmoothing
        };
        
        // 性能优化：强制使用WebGL后端并配置内存
        try {
          // 配置TensorFlow.js内存限制，避免内存泄漏
          await tf.setBackend('webgl');
          await tf.ENV.set('WEBGL_FORCE_F16_TEXTURES', true);
          await tf.ENV.set('WEBGL_CPU_FORWARD', false);
          await tf.ENV.set('WEBGL_SIZE_UPLOAD_UNIFORM', 0);
          
          detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            {
              ...detectorConfig,
              modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER // 使用更轻量的模型
            }
          );
        } catch (webglError) {
          console.warn('WebGL后端加载失败，尝试切换到CPU后端:', webglError);
          await tf.setBackend('cpu');
          detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            {
              ...detectorConfig,
              modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING // CPU模式下使用最轻量模型
            }
          );
        }
        
        console.log('姿态检测模型加载成功');
        return detector;
      } catch (error) {
        retries++;
        console.error(`姿态检测模型加载失败 (尝试 ${retries}/${maxRetries}):`, error);
        
        if (retries >= maxRetries) {
          console.error('所有尝试都失败了，使用模拟数据作为后备');
          // 抛出一个特定类型的错误，以便上层可以捕获并使用模拟数据
          const errorWithType = new Error('MODEL_LOAD_FAILED');
          (errorWithType as any).originalError = error;
          throw errorWithType;
        }
        
        // 重试前等待一段时间
        await new Promise(resolve => setTimeout(resolve, 2000 * retries));
      }
    }
    
    throw new Error('无法加载姿态检测模型');
  })();

  return modelLoadPromise;
};

/**
 * 检测图像中的姿态
 */
export const detectPose = async (
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<poseDetection.Pose[]> => {
  // 检查imageElement的有效性
  if (!imageElement) {
    console.warn('无效的图像元素');
    return [];
  }

  // 检查图像元素是否有有效的尺寸
  const isVideo = imageElement instanceof HTMLVideoElement;
  const isImage = imageElement instanceof HTMLImageElement;
  const isCanvas = imageElement instanceof HTMLCanvasElement;
  
  if (isVideo && (!imageElement.videoWidth || !imageElement.videoHeight)) {
    console.warn('视频元素尺寸无效');
    return [];
  }
  
  if (isImage && (!imageElement.naturalWidth || !imageElement.naturalHeight)) {
    console.warn('图像元素尺寸无效');
    return [];
  }
  
  if (isCanvas && (!imageElement.width || !imageElement.height)) {
    console.warn('画布元素尺寸无效');
    return [];
  }

  if (!detector) {
    await initializePoseDetection();
  }

  if (!detector) {
    throw new Error('姿态检测器未初始化');
  }

  try {
    // 添加超时保护
    const timeoutPromise = new Promise<poseDetection.Pose[]>((resolve) => {
      setTimeout(() => {
        console.warn('姿态检测超时，返回空结果');
        resolve([]);
      }, 5000); // 5秒超时
    });

    const detectionPromise = detector.estimatePoses(imageElement, {
      flipHorizontal: false
    });

    const poses = await Promise.race([detectionPromise, timeoutPromise]);
    
    // 确保返回的是数组且不为null，并对每个姿态对象进行验证
    if (!poses || !Array.isArray(poses)) {
      return [];
    }
    
    // 过滤掉无效的姿态数据，特别是那些边界框为null的对象
    const validPoses = poses.filter(pose => {
      // 检查姿态对象本身是否有效
      if (!pose) return false;
      
      // 检查关键点数据是否有效
      if (!pose.keypoints || !Array.isArray(pose.keypoints)) return false;
      
      // 检查边界框数据是否有效（如果有）
      if (pose.box && typeof pose.box === 'object') {
        // 检查边界框的各个属性是否存在且不是null
        if (pose.box.xMin == null || pose.box.yMin == null || 
            pose.box.xMax == null || pose.box.yMax == null ||
            pose.box.width == null || pose.box.height == null) {
          console.warn('姿态边界框数据不完整，跳过该姿态');
          return false;
        }
      }
      
      return true;
    });
    
    return validPoses;
  } catch (error) {
    console.error('姿态检测失败:', error);
    // 捕获并处理特定的yMin错误和其他边界框错误
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('ymin') || errorMessage.includes('bbox') || errorMessage.includes('box')) {
        console.warn('检测到姿态边界框错误，返回空姿态数组');
        return [];
      }
    }
    // 对于其他错误，也返回空数组而不是抛出异常
    console.warn('姿态检测发生错误，返回空结果');
    return [];
  }
};

/**
 * 将TensorFlow.js的Pose结果转换为我们的Keypoint格式
 */
export const convertPoseToKeypoints = (
  poses: poseDetection.Pose[],
  inputWidth?: number,
  inputHeight?: number
): Keypoint[] => {
  // 更严格的输入验证
  if (!poses || !Array.isArray(poses) || poses.length === 0) {
    console.warn('姿态数据为空或无效');
    return [];
  }

  const pose = poses[0];
  // 添加pose对象的有效性检查
  if (!pose || !pose.keypoints || !Array.isArray(pose.keypoints)) {
    console.warn('姿态数据无效或缺少关键点信息');
    return [];
  }
  
  const keypoints: Keypoint[] = [];

  // TensorFlow.js的MoveNet模型使用COCO格式的关键点
  const keypointNames = [
    'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
    'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
    'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
  ];

  // 对关键点数组进行更详细的验证
  pose.keypoints.forEach((keypoint, index) => {
    try {
      if (!keypoint) {
        console.warn(`关键点${index}为空`);
        return;
      }
      if (typeof keypoint.x !== 'number' || typeof keypoint.y !== 'number') {
        console.warn(`关键点${index}坐标无效: x=${keypoint.x}, y=${keypoint.y}`);
        return;
      }
      if (typeof keypoint.score !== 'number') {
        console.warn(`关键点${index}分数无效: score=${keypoint.score}`);
        return;
      }
      if (isNaN(keypoint.x) || isNaN(keypoint.y)) {
        console.warn(`关键点${index}坐标NaN`);
        return;
      }
      if (keypoint.score <= POSE_DETECTION_CONFIG.minPoseScore) {
        console.debug(`关键点${index}分数低于阈值: ${keypoint.score}`);
        return;
      }
      let xNorm = keypoint.x as number;
      let yNorm = keypoint.y as number;
      if (
        typeof inputWidth === 'number' && inputWidth > 0 &&
        typeof inputHeight === 'number' && inputHeight > 0
      ) {
        if (xNorm > 1 || yNorm > 1) {
          xNorm = xNorm / inputWidth;
          yNorm = yNorm / inputHeight;
        }
      }
      if (xNorm < 0 || xNorm > 1 || yNorm < 0 || yNorm > 1) {
        console.debug(`关键点${index}归一化后坐标超出范围: x=${xNorm}, y=${yNorm}`);
        return;
      }
      keypoints.push({
        name: keypointNames[index] || `keypoint_${index}`,
        x: xNorm,
        y: yNorm,
        score: keypoint.score
      });
    } catch (error) {
      console.warn(`处理关键点${index}时出错:`, error);
      // 继续处理下一个关键点而不是中断整个过程
    }
  });

  return keypoints;
};

/**
 * 从视频帧中提取关键点
 */
export const extractKeypointsFromFrame = async (
  videoElement: HTMLVideoElement
): Promise<Keypoint[]> => {
  try {
    // 添加视频元素有效性检查
    if (!videoElement) {
      console.warn('视频元素为空');
      return [];
    }

    // 检查视频元素是否有有效的尺寸
    if (!videoElement.videoWidth || !videoElement.videoHeight) {
      console.warn('视频元素尺寸无效');
      return [];
    }

    // 检查视频是否已加载完成
    if (videoElement.readyState < 2) {
      console.warn('视频元素尚未准备好');
      return [];
    }

    // 检查视频尺寸是否合理
    if (videoElement.videoWidth < 50 || videoElement.videoHeight < 50) {
      console.warn('视频尺寸过小');
      return [];
    }
    
    // 检查视频元素是否在文档中且可见
    if (document && !document.contains(videoElement) && videoElement.parentElement === null) {
      console.warn('视频元素不在文档中');
      return [];
    }
    
    const poses = await detectPose(videoElement);
    const keypoints = convertPoseToKeypoints(
      poses,
      videoElement.videoWidth,
      videoElement.videoHeight
    );
    
    // 验证返回的关键点数据
    if (!Array.isArray(keypoints)) {
      console.warn('转换后的关键点数据不是数组');
      return [];
    }
    
    return keypoints;
  } catch (error) {
    console.error('从视频帧提取关键点失败:', error);
    // 捕获并处理特定的yMin错误和其他边界框错误
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('ymin') || errorMessage.includes('bbox') || errorMessage.includes('box')) {
        console.warn('检测到姿态边界框错误，返回空关键点数组');
        return [];
      }
    }
    // 对于其他错误，也返回空数组而不是抛出异常
    console.warn('从视频帧提取关键点时发生错误，返回空结果');
    return [];
  }
};

/**
 * 计算两个关键点之间的角度
 */
export const calculateAngle = (
  pointA: Keypoint,
  pointB: Keypoint,
  pointC: Keypoint
): number => {
  if (!pointA || !pointB || !pointC) return 0;

  // 计算向量BA和BC
  const vectorBA = {
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y
  };

  const vectorBC = {
    x: pointC.x - pointB.x,
    y: pointC.y - pointB.y
  };

  // 计算向量的点积和模长
  const dotProduct = vectorBA.x * vectorBC.x + vectorBA.y * vectorBC.y;
  const magnitudeBA = Math.sqrt(vectorBA.x * vectorBA.x + vectorBA.y * vectorBA.y);
  const magnitudeBC = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y);

  if (magnitudeBA === 0 || magnitudeBC === 0) return 0;

  // 计算角度（弧度）
  let cosTheta = dotProduct / (magnitudeBA * magnitudeBC);
  // Clamp cosTheta to [-1, 1] to avoid NaN
  if (cosTheta > 1) cosTheta = 1;
  if (cosTheta < -1) cosTheta = -1;
  
  const angleRad = Math.acos(cosTheta);

  // 转换为角度
  const deg = angleRad * (180 / Math.PI);
  return Math.round(deg);
};

/**
 * 评估动作质量
 */
export const evaluateMovement = (
  keypoints: Keypoint[],
  movementType: string
): {
  score: number;
  feedback: string;
  angles: Record<string, number>;
  details: Record<string, any>;
} => {
  // 默认评估结果
  const result = {
    score: 0.5,
    feedback: '无法评估动作，请确保全身在摄像头视野内',
    angles: {} as Record<string, number>,
    details: {} as Record<string, any>
  };

  if (!keypoints || keypoints.length < 10) {
    return result;
  }

  // 获取关键点的辅助函数
  const getKeypoint = (name: string): Keypoint | undefined => {
    return keypoints.find(kp => kp.name === name);
  };

  try {
    // 根据不同动作类型进行评估
    switch (movementType) {
      case 'deep-squat':
        result.angles.left_knee = calculateAngle(
          getKeypoint('left_hip')!,
          getKeypoint('left_knee')!,
          getKeypoint('left_ankle')!
        );
        result.angles.right_knee = calculateAngle(
          getKeypoint('right_hip')!,
          getKeypoint('right_knee')!,
          getKeypoint('right_ankle')!
        );
        {
          const ranges = movementAngleRanges['deep-squat'];
          const left = result.angles.left_knee;
          const right = result.angles.right_knee;
          const avg = (left + right) / 2;
          const [min, max] = ranges.knee;
          const within = avg >= min && avg <= max;
          const near = avg >= min - 10 && avg <= max + 10;
          result.score = within ? 90 : near ? 70 : 50;
          result.feedback = within ? '深蹲角度达标，继续保持' : near ? '深蹲基本达标，可适当调整幅度' : '深蹲深度不足，请尝试降低重心';
        }
        break;

      case 'shoulder-mobility':
        const leftShoulder = getKeypoint('left_shoulder');
        const rightShoulder = getKeypoint('right_shoulder');
        const leftWrist = getKeypoint('left_wrist');
        const rightWrist = getKeypoint('right_wrist');
        
        if (leftShoulder && rightShoulder && leftWrist && rightWrist) {
          const leftArmRaise = leftShoulder.y - leftWrist.y;
          const rightArmRaise = rightShoulder.y - rightWrist.y;
          const avgArmRaise = (leftArmRaise + rightArmRaise) / 2;
          const ranges = movementAngleRanges['shoulder-mobility'];
          const shoulderTarget = ranges.shoulder;
          const reachScore = Math.min(100, Math.max(0, Math.round((avgArmRaise * 100))));
          const within = shoulderTarget ? avgArmRaise >= 0.0 : false;
          result.score = within ? Math.max(80, reachScore) : Math.min(70, reachScore);
          result.feedback = within ? '肩部抬举良好' : '肩部抬举需提高，尝试超过肩线';
        }
        break;

      default:
        const avgConfidence = keypoints.reduce((sum, kp) => sum + (kp.score || 0), 0) / keypoints.length;
        result.score = Math.round(Math.min(1.0, avgConfidence) * 100);
        result.feedback = '动作检测完成';
        break;
    }

    // 添加通用细节
    result.details.keypointCount = keypoints.length;
    result.details.avgConfidence = keypoints.reduce((sum, kp) => sum + (kp.score || 0), 0) / keypoints.length;
    result.details.movementType = movementType;
    if (movementAngleRanges[movementType]) {
      result.details.targetRanges = movementAngleRanges[movementType];
    }
  } catch (error) {
    console.error('动作评估失败:', error);
    result.feedback = '动作评估过程中出现错误';
  }

  return result;
};
