import { nanoid } from 'nanoid';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import type { ROMAssessment, ROMData } from '../types';
import {
  calculateROMScore,
  calculateROMStatus,
  directionNameMap,
  getROMReferenceAngle,
  jointNameMap,
} from '../utils/rom-utils';
import { ROM_TEXTS } from '../constants/uiText';

const getSideLabel = (side: 'left' | 'right' | 'midline') => {
  if (side === 'midline') return '中线';
  return side === 'left' ? '左' : '右';
};

export const ROMService = {
  async saveAssessment(assessment: Omit<ROMAssessment, 'id' | 'createdAt'>): Promise<ROMAssessment> {
    const newAssessment: ROMAssessment = {
      ...assessment,
      id: nanoid(12),
      createdAt: Date.now(),
    };

    try {
      const { addAssessment } = useAssessmentStore.getState();
      await addAssessment({
        sessionId: newAssessment.sessionId,
        patientId: newAssessment.patientId,
        type: 'rom',
        mode: 'realtime',
        data: {
          rom: {
            items: newAssessment.data,
            summary: ROMService.generateReport(newAssessment),
            recommendations: ROMService.generateRecommendations(newAssessment.data),
          },
        },
        notes: newAssessment.notes,
      });

      return newAssessment;
    } catch (error) {
      console.error('[ROMService] 保存评估失败:', error);
      throw new Error('保存评估失败');
    }
  },

  async loadAssessmentsByPatient(patientId: string): Promise<ROMAssessment[]> {
    try {
      const { assessments } = useAssessmentStore.getState();
      return assessments
        .filter((assessment) => assessment.type === 'rom' && assessment.patientId === patientId)
        .map((assessment) => ({
          id: assessment.id,
          patientId: assessment.patientId,
          sessionId: assessment.sessionId,
          createdAt: assessment.createdAt,
          data: assessment.data.rom?.items || [],
          notes: assessment.notes,
          status: assessment.status,
        }));
    } catch (error) {
      console.error('[ROMService] 加载评估失败:', error);
      return [];
    }
  },

  generateReport(assessment: ROMAssessment): string {
    const score = calculateROMScore(assessment.data);
    const sections = [
      '# 关节活动度评估报告',
      `## 总体评分: ${score}/100`,
      '## 详细数据',
    ];

    assessment.data.forEach((item) => {
      const referenceAngle = getROMReferenceAngle(item);
      const status = calculateROMStatus(item.joint, item.direction, referenceAngle);
      sections.push(
        `- ${jointNameMap[item.joint]} ${directionNameMap[item.direction]}: ${referenceAngle.toFixed(1)}° (${ROM_TEXTS.status[status]})`,
      );
    });

    return sections.join('\n');
  },

  generateRecommendations(data: ROMData[]): string[] {
    const recommendationSet = new Set<string>();

    data.forEach((item) => {
      const status = calculateROMStatus(item.joint, item.direction, getROMReferenceAngle(item));
      const sideLabel = getSideLabel(item.side);

      if (status === 'limited') {
        recommendationSet.add(
          `${jointNameMap[item.joint]}${sideLabel}位${directionNameMap[item.direction]}活动受限，建议进行针对性活动度训练与复测。`,
        );
      }

      if (status === 'excessive') {
        recommendationSet.add(
          `${jointNameMap[item.joint]}${sideLabel}位${directionNameMap[item.direction]}活动过度，建议补充稳定性训练并控制动作边界。`,
        );
      }

      if (item.confidence < 0.6) {
        recommendationSet.add(
          `${jointNameMap[item.joint]}${sideLabel}位${directionNameMap[item.direction]}数据置信度偏低，建议在完整入镜和稳定动作条件下复测。`,
        );
      }
    });

    return recommendationSet.size > 0
      ? Array.from(recommendationSet)
      : ['本次关节活动度结果整体稳定，建议继续保持常规运动与周期复测。'];
  },

  exportAssessment(assessment: ROMAssessment): string {
    return JSON.stringify(assessment, null, 2);
  },

  importAssessment(data: string): ROMAssessment {
    try {
      return JSON.parse(data);
    } catch {
      throw new Error('无效的评估数据');
    }
  },
};
