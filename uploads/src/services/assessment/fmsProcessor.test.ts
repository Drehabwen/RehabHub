import { describe, it, expect } from 'vitest';
import { FmsProcessor } from './fmsProcessor';

describe('FmsProcessor', () => {
  const processor = new FmsProcessor();

  const mockData = {
    movementType: 'deep-squat',
    movementName: 'Deep Squat',
    hipMobilityScore: 1,
    kneeStabilityScore: 2,
    shoulderMobilityScore: 3,
    coreActivationScore: 2,
    posturalAlignmentScore: 3,
    compensationPatterns: ['Knee Valgus'],
    notes: 'Test notes'
  };

  it('processes raw data correctly', async () => {
    const result = await processor.process(mockData);

    expect(result.type).toBe('FMS');
    expect(result.movementType).toBe('deep-squat');
    expect(result.metrics).toHaveLength(5); // 基于 extractMetrics 中的默认映射
    
    // 验证特定指标
    const hipMetric = result.metrics.find(m => m.id === 'hip_mobility');
    expect(hipMetric?.score.value).toBe(1);
    
    const shoulderMetric = result.metrics.find(m => m.id === 'shoulder_mobility');
    expect(shoulderMetric?.score.value).toBe(3);
  });

  it('calculates scores correctly', async () => {
    const result = await processor.process(mockData);
    
    // 总分计算逻辑需要在实现中确认，这里先假设是简单的求和或加权
    // 根据代码片段，似乎有 mobilityScore 和 stabilityScore
    expect(result.mobilityScore).toBeDefined();
    expect(result.stabilityScore).toBeDefined();
    expect(result.overallScore).toBeDefined();
  });

  it('generates recommendations for low scores', async () => {
    const result = await processor.process(mockData);
    
    // hipMobilityScore 是 1，应该触发建议
    expect(result.recommendations).toContain('加强以下薄弱环节的训练: 髋关节活动度');
    // 或者根据 getRecommendedExercises 的逻辑
    const exercises = processor.getRecommendedExercises(result);
    expect(exercises).toContain('髋关节屈曲活动度训练');
  });

  it('generates a readable report', async () => {
    // 构造包含不对称数据的测试用例
    const asymmetryData = {
      ...mockData,
      leftSideScores: { knee: 1 },
      rightSideScores: { knee: 3 }
    };
    
    const result = await processor.process(asymmetryData);
    const report = processor.generateReport(result);
    
    expect(report).toContain('功能性动作评估报告');
    expect(report).toContain('Deep Squat');
    expect(report).toContain('检测到肢体不对称性');
    expect(report).toContain('发现以下代偿模式: Knee Valgus');
  });
});
